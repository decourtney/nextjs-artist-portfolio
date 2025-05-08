import { Metadata } from "next";
import ContactForm from "@/app/(root)/_components/ContactForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact | Gena Courtney",
  description:
    "Get in touch with Gena Courtney for commissions, purchases, or collaborations.",
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100dvh-482px)] relative">
      {/* Hero Section */}
      <section className="hidden py-20 px-4 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-charm mb-6 text-[#1e293b]">
              Contact
            </h1>
            <p className="text-xl text-[#475569] max-w-2xl mx-auto">
              Get in touch for commissions, purchases, or collaborations
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-charm mb-8 text-[#1e293b]">
                  Get in Touch
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-charm mb-2 text-[#1e293b]">
                      Studio Location
                    </h3>
                    <p className="text-[#475569]">
                      Macon, Georgia
                      <br />
                      United States
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-charm mb-2 text-[#1e293b]">
                      Email
                    </h3>
                    <p className="text-[#475569]">
                      <Link
                        href="mailto:contact@genacourtney.com"
                        className="group relative inline-block text-[#475569] hover:text-[#3b82f6] transition-colors duration-300"
                      >
                        genacourtney@icloud.com
                      </Link>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-charm mb-2 text-[#1e293b]">
                      Social Media
                    </h3>
                    <div className="flex space-x-4">
                      <Link
                        href="https://www.instagram.com/genacourtney/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-block text-[#475569] hover:text-[#3b82f6] transition-colors duration-300"
                      >
                        <span className="relative z-10">Instagram</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
