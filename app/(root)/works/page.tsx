import Image from "next/image";
import Link from "next/link";

// Sample artwork data - replace with your actual artwork
const artworks = [
  {
    id: 1,
    title: "Viking Longship",
    medium: "Oil on copper",
    size: "12 x 12",
    year: "2023",
    category: "Mythology",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/viking-longship-oil-on-copper-12-x-12.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/viking-longship-oil-on-copper-12-x-12-thumb.webp",
  },
  {
    id: 2,
    title: "Viking Longship Rigging",
    medium: "Oil on copper",
    size: "10 x 12",
    year: "2023",
    category: "Mythology",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/viking-longship-rigging-oil-on-copper-10-x-12.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/viking-longship-rigging-oil-on-copper-10-x-12-thumb.webp",
  },
  {
    id: 3,
    title: "Weary Travelers",
    medium: "Oil on copper",
    size: "11 x 10",
    year: "2023",
    category: "Narrative",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/weary-travelers-oil-on-copper-11-x-10.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/weary-travelers-oil-on-copper-11-x-10-thumb.webp",
  },
  {
    id: 4,
    title: "Forest Guardian",
    medium: "Oil on copper",
    size: "14 x 18",
    year: "2022",
    category: "Nature",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/viking-longship-oil-on-copper-12-x-12.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/viking-longship-oil-on-copper-12-x-12-thumb.webp",
  },
  {
    id: 5,
    title: "Ocean Depths",
    medium: "Oil on copper",
    size: "16 x 20",
    year: "2022",
    category: "Nature",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/viking-longship-rigging-oil-on-copper-10-x-12.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/viking-longship-rigging-oil-on-copper-10-x-12-thumb.webp",
  },
  {
    id: 6,
    title: "Urban Legends",
    medium: "Oil on copper",
    size: "12 x 16",
    year: "2022",
    category: "Contemporary",
    src: "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/weary-travelers-oil-on-copper-11-x-10.webp",
    thumbSrc:
      "https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/thumbnails/weary-travelers-oil-on-copper-11-x-10-thumb.webp",
  },
];

// Categories for filter
const categories = ["All", "Mythology", "Nature", "Narrative", "Contemporary"];

export default function WorksPage() {
  return (
    <main className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-charm mb-6 text-neutral-800">
              Works
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              A collection of oil on copper paintings exploring mythology,
              nature, and contemporary themes
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-neutral-100 border-y border-neutral-200">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors duration-300"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artworks.map((artwork) => (
                <div key={artwork.id} className="group">
                  <Link href={`/works/${artwork.id}`}>
                    <div className="relative aspect-[4/5] overflow-hidden mb-4">
                      <Image
                        src={artwork.thumbSrc}
                        alt={artwork.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    </div>
                    <h3 className="text-xl font-charm mb-1 text-neutral-800">
                      {artwork.title}
                    </h3>
                    <p className="text-neutral-600 text-sm">
                      {artwork.medium}, {artwork.size}
                    </p>
                    <p className="text-neutral-500 text-sm">
                      {artwork.year} • {artwork.category}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pagination */}
      <section className="py-8 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center gap-2">
              <button className="px-4 py-2 border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors duration-300">
                Previous
              </button>
              <button className="px-4 py-2 bg-neutral-800 text-white">1</button>
              <button className="px-4 py-2 border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors duration-300">
                2
              </button>
              <button className="px-4 py-2 border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors duration-300">
                3
              </button>
              <button className="px-4 py-2 border border-neutral-300 text-neutral-600 hover:bg-neutral-100 transition-colors duration-300">
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
