import Image from "next/image";
import Link from "next/link";
import GetInTouchSection from "./_components/GetInTouchSection";
import SectionSeparator from "./_components/SectionSeparator";
import dbConnect from "@/lib/dbConnect";
import { Artwork } from "@/models";
import { ArtworkDocument, PopulatedArtworkDocument } from "@/models/Artwork";

const Home = async () => {
  await dbConnect();
  const mainImageArtwork = (await Artwork.findOne({ isMainImage: true })
    .lean()
    .maxTimeMS(10000)
    .exec()) as unknown as ArtworkDocument;
  const featuredArtworks = (await Artwork.find({
    isFeatured: true,
  })
    .limit(3)
    .populate("substance")
    .populate("medium")
    .populate("size")
    .populate("category")
    .lean()
    .maxTimeMS(10000)
    .exec()) as unknown as PopulatedArtworkDocument[];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col gap-12">
            <div className="relative aspect-square max-w-2xl mx-auto w-full">
              {mainImageArtwork ? (
                <Image
                  src={mainImageArtwork.src}
                  alt="Artist's work"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  Image not found
                </div>
              )}

              <div className="absolute inset-0 border-2 border-[#1e293b]" />
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
        <SectionSeparator />
      </section>

      {/* Featured Works */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#1e293b] font-charm">
            Featured Works
          </h2>
          <div className="flex flex-col md:flex-row gap-1">
          {/* <div className="grid grid-cols-3"> */}
            {featuredArtworks &&
              featuredArtworks.map((artwork) => (
                <div key={artwork.name} className="group flex w-full">
                  <div className="relative aspect-square mb-4 w-full">
                    <Image
                      src={artwork.thumbSrc}
                      alt={artwork.name}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
                    <div className="absolute inset-0 bg-[#1e293b] opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                  </div>
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

        <SectionSeparator />
      </section>

      <GetInTouchSection />
    </div>
  );
};

export default Home;
