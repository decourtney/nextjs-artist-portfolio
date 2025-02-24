"use client";

import emailjs from "@emailjs/browser";
import { Button, Form, Input, Textarea } from "@heroui/react";
import { useTheme } from "next-themes";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { FaLinkedin } from "react-icons/fa";

const ContactForm = () => {
  const { theme } = useTheme();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSending, setIsSending] = useState<boolean>(false); // To track email sending status
  const [successMessage, setSuccessMessage] = useState<string>(""); // To show success message

  const validateForm = (): { [key: string]: string } => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!message) newErrors.message = "Message is required";
    return newErrors;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationErrors = validateForm();

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID;

    if (!serviceId || !templateId || !userId) {
      // console.error("Missing EmailJS environment variables.");
      return;
    }

    if (Object.keys(validationErrors).length === 0) {
      setIsSending(true); // Start sending process
      try {
        await emailjs.send(
          serviceId,
          templateId,
          { user_name: name, user_email: email, user_message: message },
          userId
        );
        setSuccessMessage(
          `${
            theme === "dark"
              ? "Be vigilant and stick to the shadows!"
              : "Thank You! That really brightened my day!"
          }`
        );
        setName("");
        setEmail("");
        setMessage("");
      } catch (error) {
        if (error instanceof Error) {
          // The error is a known Error object
          console.error("Failed to send email: ", error.message);
        } else {
          // Handle any other unknown errors
          console.error("An error occurred while sending the email.");
        }
      } finally {
        setIsSending(false); // End sending process
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setter(e.target.value);
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    };

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full"
      >
        <div className="col-span-1">
          <Input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            variant="flat"
            size="lg"
            onChange={handleInputChange(setName)}
            className={`w-full ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>
        <div className="col-span-1">
          <Input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            variant="flat"
            size="lg"
            onChange={handleInputChange(setEmail)}
            className={`w-full ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>
        <div className="col-span-1 lg:col-span-2">
          <Textarea
            placeholder="Message"
            name="message"
            value={message}
            variant="flat"
            size="lg"
            onChange={handleInputChange(setMessage)}
            className={`w-full  ${errors.message ? "border-red-500" : ""}`}
            minRows={4}
            rows={4}
          />
          {errors.message && <p className="text-red-500">{errors.message}</p>}
        </div>
        <div className="col-span-1 lg:col-span-2 flex justify-center">
          <Button
            type="submit"
            className="w-full lg:w-1/2 bg-secondary-100"
            disabled={isSending} // Disable button while sending
          >
            {isSending ? "Sending..." : "Submit"}
          </Button>
        </div>
      </Form>

      {successMessage && (
        <p className="text-green-500 text-center pt-4">{successMessage}</p>
      )}

      <div className="flex justify-start  mx-auto my-2 gap-4">
        <Button
          size="lg"
          isIconOnly
          radius="full"
          variant="light"
          className=" text-[hsl(var(--nextui-primary-100))]"
          onPress={() => {
            if (typeof window !== "undefined") window.open("#");
          }}
        >
          <FaLinkedin size={30} />
        </Button>
      </div>
    </>
  );
};

export default ContactForm;
