import Image from "next/image";
import GetInTouchSection from "../_components/GetInTouchSection";
import SectionSeparator from "../_components/SectionSeparator";

export default function AboutPage() {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section className="py-10 px-4">
        <div className="container max-w-[700px] mx-auto px-4">
          <div className="w-full">
            <h1 className="hidden text-4xl md:text-5xl lg:text-6xl font-charm mb-6 text-[#1e293b]">
              About the Artist
            </h1>
            {/* <p className="font-charm text-center text-6xl text-[#475569] ml-auto">
              "My paintings serve as a diary of my life"
            </p> */}
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="pb-20 px-4 relative">
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
                <div className="prose prose-lg text-2xl text-[#475569] space-y-6">
                  <p>
                    <span className="float-start font-charm text-6xl leading-10">
                      G
                    </span>
                    ena Courtney is an award-winning painter and illustrator
                    based in Macon, Georgia. Working with pastels, oil, and
                    acrylic paints on a variety of surfaces including canvas,
                    wood panel, copper, and paper, Gena explores the beauty and
                    unique features of different subjects. Her work reflects a
                    deep connection to nature, atmosphere, and memory.
                  </p>
                  <p>
                    <span className="italic font-medium">
                      &quot;My paintings serve as a diary of my life,&quot;
                    </span>
                    Gena says. &quot;Re-imagining the people, places, and
                    experiences I have encountered and transcribing them through
                    eye, hand, and medium creates a cognitive and emotional
                    connection to meaningful moments. Dreams and spiritual
                    nuances also influence my creative process. Painting and
                    writing are ways I express emotion.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>

      {/* Plein Air & Creative Process */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto px-4 text-lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-charm text-center mb-16 text-[#1e293b]">
              Artistic Journey
            </h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-charm mb-6 text-[#1e293b]">
                  Plein Air Practice
                </h3>
                <div className="prose prose-lg text-[#475569] space-y-6">
                  <p>
                    Combining her love of art, nature, and travel, Gena often
                    paints plein air alongside her husband Bobby and often with
                    family and friends. Capturing the spirit, mood, and
                    environmental nuances of a location while responding to
                    quickly changing light and weather is central to her plein
                    air practice.
                  </p>
                  <p>
                    Beyond the local scene, Gena has organized and taught plein
                    air painting events on Georgia&apos;s Cumberland and Jekyll
                    Islands, and most recently on Monhegan Island in Maine,
                    sharing her passion for capturing nature&apos;s
                    ever-changing beauty.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-charm mb-6 text-[#1e293b]">
                  Studio Practice
                </h3>
                <div className="prose prose-lg text-[#475569]">
                  <p>
                    A lifelong resident of Macon, Gena continues to work from
                    her home studio, accepting commissions across a variety of
                    subjects and encouraging others to explore their own
                    creative journeys. Her studio practice allows her to deeply
                    explore subjects and develop complex compositions that
                    complement her plein air work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>

      {/* Teaching & Community */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto px-4 text-lg">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-charm text-center mb-16 text-[#1e293b]">
              Teaching & Community
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                {/* <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-charm text-neutral-800">
                    1
                  </span>
                </div> */}
                <h3 className="text-2xl font-charm mb-4 text-[#1e293b]">
                  Family Roots
                </h3>
                <p className="text-[#475569]">
                  Gena began teaching by first sharing her love of art with her
                  three sons, Joey, Kelley, and Donny. This foundation in
                  nurturing creativity within her family led to a broader
                  teaching career.
                </p>
              </div>
              <div className="text-center">
                {/* <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-charm text-neutral-800">
                    2
                  </span>
                </div> */}
                <h3 className="text-2xl font-charm mb-4 text-[#1e293b]">
                  Academic Impact
                </h3>
                <p className="text-[#475569]">
                  As art instructor for Macon State College (now Middle Georgia
                  State University) Continuing Education Department, she
                  developed the Young At Art programs for children and adults,
                  expanding access to art education.
                </p>
              </div>
              <div className="text-center">
                {/* <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-charm text-neutral-800">
                    3
                  </span>
                </div> */}
                <h3 className="text-2xl font-charm mb-4 text-[#1e293b]">
                  Community Engagement
                </h3>
                <p className="text-[#475569]">
                  Her work as an artist-in-residence for Bibb County Schools and
                  creation of the Paint Party program at South Bibb Recreation
                  Center has brought art education to diverse audiences
                  throughout the community.
                </p>
              </div>
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
