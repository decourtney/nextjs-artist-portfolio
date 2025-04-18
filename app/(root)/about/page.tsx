import Image from "next/image";
import GetInTouchSection from "../_components/GetInTouchSection";
import SectionSeparator from "../_components/SectionSeparator";

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">

      {/* Hero Section */}
      <section className="hidden relative py-20 px-4">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-charm mb-6 text-[#1e293b]">
              About the Artist
            </h1>
            <p className="text-xl text-[#475569] max-w-2xl mx-auto">
              Exploring the intersection of tradition and contemporary
              expression
            </p>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[3/4]">
                <Image
                  src="/images/artist.jpg"
                  alt="Gena Courtney in her studio"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="text-3xl font-charm mb-6 text-[#1e293b]">
                  My Journey
                </h2>
                <div className="prose prose-lg text-[#475569]">
                  <p>
                    Born and raised in the American South, I developed an early
                    fascination with art history and traditional techniques. My
                    journey as an artist began with classical training in
                    drawing and painting, which laid the foundation for my
                    current work.
                  </p>
                  <p>
                    After studying fine arts at the Savannah College of Art and
                    Design, I spent several years exploring various mediums and
                    techniques. It was during a trip to Italy that I discovered
                    the Renaissance technique of oil on copper, which would
                    become my signature medium.
                  </p>
                  <p>
                    The luminous quality of oil on copper, combined with its
                    historical significance, captivated me. I began
                    experimenting with this technique, adapting it to
                    contemporary themes and subjects.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>

      {/* Process Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-charm text-center mb-16 text-[#1e293b]">
              My Process
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-charm text-neutral-800">
                    1
                  </span>
                </div>
                <h3 className="text-xl font-charm mb-4 text-[#1e293b]">
                  Preparation
                </h3>
                <p className="text-[#475569]">
                  Each copper panel is carefully prepared with a traditional
                  ground, creating the perfect surface for oil paint. This
                  process can take several days to ensure optimal results.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-charm text-neutral-800">
                    2
                  </span>
                </div>
                <h3 className="text-xl font-charm mb-4 text-[#1e293b]">
                  Creation
                </h3>
                <p className="text-[#475569]">
                  Using traditional techniques adapted for contemporary
                  subjects, I build each painting in layers. The copper surface
                  adds a unique luminosity that changes with different lighting
                  conditions.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-charm text-neutral-800">
                    3
                  </span>
                </div>
                <h3 className="text-xl font-charm mb-4 text-[#1e293b]">
                  Finishing
                </h3>
                <p className="text-[#475569]">
                  Each piece undergoes a careful finishing process, including
                  varnishing and framing. The final result is a work that
                  bridges past and present, tradition and innovation.
                </p>
              </div>
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>

      {/* Inspiration Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-charm text-center mb-16 text-[#1e293b]">
              Inspiration & Influences
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-charm mb-6 text-[#1e293b]">
                  Historical Influences
                </h3>
                <div className="prose prose-lg text-[#475569]">
                  <p>
                    My work is deeply influenced by the Renaissance masters who
                    first perfected the technique of oil on copper. Artists like
                    Albrecht Dürer and Jan van Eyck have inspired my approach to
                    detail and luminosity.
                  </p>
                  <p>
                    I also draw inspiration from the Pre-Raphaelite
                    Brotherhood's attention to detail and their use of
                    mythological and literary themes.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-charm mb-6 text-[#1e293b]">
                  Contemporary Context
                </h3>
                <div className="prose prose-lg text-[#475569]">
                  <p>
                    While my technique is rooted in tradition, my subjects and
                    themes are contemporary. I explore modern mythology,
                    environmental concerns, and social issues through a
                    historical lens.
                  </p>
                  <p>
                    The contrast between traditional technique and contemporary
                    subject matter creates a dialogue between past and present,
                    inviting viewers to reconsider familiar narratives.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>

      {/* Studio Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-charm text-center mb-16 text-[#1e293b]">
              My Studio
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/viking-longship-rigging-oil-on-copper-10-x-12.webp"
                  alt="Studio workspace"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://general-purpose-chumbucket-001.s3.us-east-2.amazonaws.com/genacourtney/images/weary-travelers-oil-on-copper-11-x-10.webp"
                  alt="Art supplies and tools"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-[#475569] max-w-2xl mx-auto">
                Located in the heart of Nashville, my studio is a space where
                tradition meets innovation. It's here that I create each piece,
                surrounded by the tools and inspiration that fuel my artistic
                journey.
              </p>
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>

      <GetInTouchSection />
      {/* Add gradient separators to each section */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#94a3b8] to-transparent"></div>
    </div>
  );
}
