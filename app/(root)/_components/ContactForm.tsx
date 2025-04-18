"use client";

import React, { useRef, useState, FormEvent } from "react";
import emailjs from "@emailjs/browser";

const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleOnSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!formRef.current) return;
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "";
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "";
    const userId = process.env.NEXT_PUBLIC_EMAILJS_USER_ID || "";

    setStatus("sending");

    emailjs
      .sendForm(serviceId, templateId, formRef.current, { publicKey: userId })
      .then(
        () => {
          setStatus("success");
          formRef.current?.reset();
        },
        (error) => {
          setStatus("error");
          console.error("Email send failed:", error);
        }
      );
  };
  return (
    <div>
      <h2 className="text-3xl font-charm mb-8 text-[#1e293b]">
        Send a Message
      </h2>
      <form ref={formRef} className="space-y-6" onSubmit={handleOnSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-[#475569] mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className="w-full px-4 py-2 border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[#475569] mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="w-full px-4 py-2 border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-[#475569] mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            className="w-full px-4 py-2 border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
            required
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="group relative inline-block px-8 py-4 text-lg font-medium text-[#1e293b] hover:text-white transition-colors duration-300"
            disabled={status === "sending"}
          >
            <span className="relative z-10">
              {status === "sending" ? "Sending..." : "Send Message"}
            </span>
            <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
