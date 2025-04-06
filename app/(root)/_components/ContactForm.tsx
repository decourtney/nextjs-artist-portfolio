"use client";

import emailjs from "@emailjs/browser";
import { useTheme } from "next-themes";
import React, { ChangeEvent, FormEvent, useState } from "react";
import SocialMediaButtons from "./SocialMediaButtons";

const ContactForm = () => {
  const { theme } = useTheme();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSending, setIsSending] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

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
      return;
    }

    if (Object.keys(validationErrors).length === 0) {
      setIsSending(true);
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
          console.error("Failed to send email: ", error.message);
        } else {
          console.error("An error occurred while sending the email.");
        }
      } finally {
        setIsSending(false);
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
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full"
    >
      <div className="col-span-1">
        <input
          type="text"
          placeholder="Name"
          name="name"
          value={name}
          onChange={handleInputChange(setName)}
          className={`w-full p-3 rounded-medium bg-background-100 border border-divider-200 focus:border-primary-500 focus:outline-none transition-colors ${
            errors.name ? "border-red-500" : ""
          }`}
        />
        {errors.name && (
          <p className="text-red-500 text-small mt-1">{errors.name}</p>
        )}
      </div>

      <div className="col-span-1">
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleInputChange(setEmail)}
          className={`w-full p-3 rounded-medium bg-background-100 border border-divider-200 focus:border-primary-500 focus:outline-none transition-colors ${
            errors.email ? "border-red-500" : ""
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-small mt-1">{errors.email}</p>
        )}
      </div>

      <div className="col-span-2">
        <textarea
          placeholder="Message"
          name="message"
          value={message}
          onChange={handleInputChange(setMessage)}
          rows={4}
          className={`w-full p-3 rounded-medium bg-background-100 border border-divider-200 focus:border-primary-500 focus:outline-none transition-colors ${
            errors.message ? "border-red-500" : ""
          }`}
        />
        {errors.message && (
          <p className="text-red-500 text-small mt-1">{errors.message}</p>
        )}
      </div>

      <div className="col-span-2 flex justify-between items-center">
        <SocialMediaButtons />
        <button
          type="submit"
          disabled={isSending}
          className="px-6 py-3 rounded-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors disabled:opacity-50"
        >
          {isSending ? "Sending..." : "Send Message"}
        </button>
      </div>

      {successMessage && (
        <div className="col-span-2 text-center text-green-500">
          {successMessage}
        </div>
      )}
    </form>
  );
};

export default ContactForm;
