import Image from "next/image";
import Link from "next/link";

const featuredArtworks = [
  {
    title: "Viking Longship",
    medium: "Oil on copper",
    size: "12 x 12",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/viking-longship-oil-on-copper-12-x-12.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/viking-longship-oil-on-copper-12-x-12-thumb.webp",
  },
  {
    title: "Viking Longship Rigging",
    medium: "Oil on copper",
    size: "10 x 12",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/viking-longship-rigging-oil-on-copper-10-x-12.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/viking-longship-rigging-oil-on-copper-10-x-12-thumb.webp",
  },
  {
    title: "Weary Travelers",
    medium: "Oil on copper",
    size: "11 x 10",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/weary-travelers-oil-on-copper-11-x-10.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/weary-travelers-oil-on-copper-11-x-10-thumb.webp",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#e2e8f0]">
      {/* About Section */}
      <section className="py-20 px-4 bg-[#e2e8f0] relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-12">
            <div className="relative aspect-square max-w-2xl mx-auto w-full">
              <Image
                src={featuredArtworks[1].src}
                alt="Artist's work"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 border-2 border-[#3b82f6]" />
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-6 text-[#1e293b] font-charm">
                About the Artist
              </h2>
              <p className="text-[#475569] mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="text-[#475569]">
                Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent"></div>
      </section>

      {/* Featured Works */}
      <section className="py-20 px-4 bg-[#e2e8f0] relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1e293b] font-charm">
            Featured Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredArtworks.map((artwork) => (
              <div key={artwork.title} className="group">
                <div className="relative aspect-square mb-4">
                  <Image
                    src={artwork.thumbSrc}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
                  <div className="absolute inset-0 bg-[#1e293b] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-[#1e293b] font-charm">
                  {artwork.title}
                </h3>
                <p className="text-[#64748b]">
                  {artwork.medium}, {artwork.size}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="group relative inline-block px-8 py-4 text-lg font-medium text-[#1e293b] hover:text-white transition-colors duration-300"
            >
              <span className="relative z-10">View All Works</span>
              <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent"></div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-[#e2e8f0] relative">
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
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent"></div>
      </section>
    </div>
  );
}
