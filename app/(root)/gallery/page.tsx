import React from "react";
import Link from "next/link";
import Book3D from "@/app/components/Book3D";

const GalleryPage = () => {
  const categories = [
    {
      name: "Landscapes",
      description: "Explore the beauty of natural landscapes captured in art.",
      color: "bg-emerald-100",
      link: "/gallery/landscapes",
    },
    {
      name: "Seascapes",
      description: "Discover the serene and powerful scenes of the sea.",
      color: "bg-blue-100",
      link: "/gallery/seascapes",
    },
    {
      name: "Still Lifes",
      description:
        "Appreciate the intricate details of still life compositions.",
      color: "bg-amber-100",
      link: "/gallery/still-lifes",
    },
    {
      name: "Portraits",
      description:
        "See the expressive and detailed portraits of various subjects.",
      color: "bg-rose-100",
      link: "/gallery/portraits",
    },
  ];

  return (
    <>
      {/* Gallery Section */}
      <section className="py-20 px-4 relative">
        <h1 className="sr-only">Art Categories</h1>
        <div className="max-w-6xl mx-auto relative grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
          {categories.map((category) => (
            <div key={category.name} className="flex flex-col">
              <h2 className="text-2xl font-charm mb-4">{category.name}</h2>
              <a
                href={category.link}
                className="block border-2 border-black hover:border-blue-500 transition-colors duration-300"
              >
                <div
                  className={`w-full aspect-square ${category.color} flex items-center justify-center`}
                >
                  <span className="text-2xl font-charm text-gray-700">
                    {category.name}
                  </span>
                </div>
              </a>
              <p className="text-gray-500 text-sm italic text-center mt-3">
                {category.description}
              </p>
            </div>
          ))}

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent"></div>
        </div>
      </section>

      {/* Illustration Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto pb-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              <h2 className="text-4xl font-charm mb-4 text-[#1e293b]">
                Midnight at Kyrie Eleison Castle
              </h2>
              <p className="text-[#475569] mb-6">
                Journey through a mystical night at Kyrie Eleison Castle, where
                shadows dance and secrets whisper in the moonlit corridors.
              </p>
              <p className="text-gray-500 text-sm italic mb-6">
                Each illustration is paired with its story, creating an
                immersive experience.
              </p>
              <a
                href="/gallery/illustration"
                className="group relative inline-block px-8 py-4 text-lg font-medium text-[#1e293b] hover:text-white transition-colors duration-300"
              >
                <span className="relative z-10">Read the Story</span>
                <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
              </a>
            </div>
            <div className="w-full md:w-1/2">
              <Book3D title="Midnight at\nKyrie Eleison Castle" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent"></div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-[#1e293b] font-charm">
            Get in Touch
          </h2>
          <p className="text-[#475569] mb-8 max-w-2xl mx-auto">
            Interested in commissioning a piece or learning more about my work?
            I'd love to hear from you.
          </p>
          <Link
            href="/contact"
            className="group relative inline-block px-8 py-4 text-lg font-medium text-[#1e293b] hover:text-white transition-colors duration-300"
          >
            <span className="relative z-10">Contact Me</span>
            <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default GalleryPage;
