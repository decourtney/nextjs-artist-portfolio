import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Gena Courtney",
  description:
    "Get in touch with Gena Courtney for commissions, purchases, or collaborations.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen relative">
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

      {/* Contact Form Section */}
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
                      Nashville, Tennessee
                      <br />
                      United States
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-charm mb-2 text-[#1e293b]">
                      Email
                    </h3>
                    <p className="text-[#475569]">
                      <a
                        href="mailto:contact@genacourtney.com"
                        className="group relative inline-block text-[#475569] hover:text-white transition-colors duration-300"
                      >
                        contact@genacourtney.com
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-charm mb-2 text-[#1e293b]">
                      Social Media
                    </h3>
                    <div className="flex space-x-4">
                      <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-block text-[#475569] hover:text-white transition-colors duration-300"
                      >
                        <span className="relative z-10">Instagram</span>
                        <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                      <a
                        href="https://facebook.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-block text-[#475569] hover:text-white transition-colors duration-300"
                      >
                        <span className="relative z-10">Facebook</span>
                        <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative inline-block text-[#475569] hover:text-white transition-colors duration-300"
                      >
                        <span className="relative z-10">Twitter</span>
                        <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <h2 className="text-3xl font-charm mb-8 text-[#1e293b]">
                  Send a Message
                </h2>
                <form className="space-y-6">
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
                      htmlFor="subject"
                      className="block text-sm font-medium text-[#475569] mb-1"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      className="w-full px-4 py-2 border border-[#1e293b] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="commission">Commission Request</option>
                      <option value="purchase">Artwork Purchase</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="exhibition">Exhibition Inquiry</option>
                      <option value="other">Other</option>
                    </select>
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
                    >
                      <span className="relative z-10">Send Message</span>
                      <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-charm text-center mb-12 text-[#1e293b]">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="border-b border-neutral-200 pb-6">
                <h3 className="text-xl font-charm mb-3 text-[#1e293b]">
                  How do I commission a piece?
                </h3>
                <p className="text-[#475569]">
                  Commissioning a piece begins with a consultation to discuss
                  your vision, size, and timeline. I'll provide a detailed
                  proposal including sketches and pricing. A 50% deposit is
                  required to begin work.
                </p>
              </div>
              <div className="border-b border-neutral-200 pb-6">
                <h3 className="text-xl font-charm mb-3 text-[#1e293b]">
                  What is your typical turnaround time?
                </h3>
                <p className="text-[#475569]">
                  Most pieces take 4-8 weeks to complete, depending on
                  complexity and size. Commissions are scheduled in advance, so
                  please contact me as early as possible to discuss your
                  timeline.
                </p>
              </div>
              <div className="border-b border-neutral-200 pb-6">
                <h3 className="text-xl font-charm mb-3 text-[#1e293b]">
                  Do you ship internationally?
                </h3>
                <p className="text-[#475569]">
                  Yes, I ship worldwide. All pieces are carefully packaged and
                  insured for transit. Shipping costs vary by location and size
                  of the artwork.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-xl font-charm mb-3 text-[#1e293b]">
                  Do you offer payment plans?
                </h3>
                <p className="text-[#475569]">
                  For larger pieces, I offer payment plans with 50% deposit
                  required to begin work. The remaining balance can be divided
                  into monthly payments over the course of the creation process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Add gradient separators to each section */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent"></div>
    </main>
  );
}
