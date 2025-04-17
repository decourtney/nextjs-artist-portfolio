import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events | Gena Courtney",
  description:
    "View upcoming and past exhibitions, shows, and events featuring Gena Courtney's artwork.",
};

// Sample events data
const upcomingEvents = [
  {
    id: 1,
    title: "Mythological Narratives",
    date: "June 15-30, 2024",
    location: "Nashville Art Gallery",
    description:
      "A solo exhibition exploring mythological themes through contemporary lens.",
    image: "/images/events/exhibition1.jpg",
    type: "Solo Exhibition",
  },
  {
    id: 2,
    title: "Art in the Park",
    date: "July 20, 2024",
    location: "Centennial Park, Nashville",
    description:
      "Annual outdoor art festival featuring local and international artists.",
    image: "/images/events/festival1.jpg",
    type: "Festival",
  },
  {
    id: 3,
    title: "Artist Talk: Process & Inspiration",
    date: "August 5, 2024",
    location: "Frist Art Museum",
    description:
      "Join Gena for an intimate discussion about her creative process and sources of inspiration.",
    image: "/images/events/talk1.jpg",
    type: "Artist Talk",
  },
];

const pastEvents = [
  {
    id: 4,
    title: "Nature's Whispers",
    date: "March 1-15, 2024",
    location: "Contemporary Arts Center",
    description:
      "A collection of works inspired by natural landscapes and organic forms.",
    image: "/images/events/exhibition2.jpg",
    type: "Solo Exhibition",
  },
  {
    id: 5,
    title: "Winter Art Fair",
    date: "December 10-12, 2023",
    location: "Music City Center",
    description:
      "Annual holiday art fair featuring works from Nashville's top artists.",
    image: "/images/events/fair1.jpg",
    type: "Art Fair",
  },
  {
    id: 6,
    title: "Collaborative Visions",
    date: "October 2023",
    location: "Various Locations",
    description:
      "A month-long collaborative project with local musicians and dancers.",
    image: "/images/events/collab1.jpg",
    type: "Collaboration",
  },
];

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-charm mb-6 text-neutral-800">
              Events
            </h1>
            <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
              Join me at upcoming exhibitions, shows, and events
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-charm text-center mb-12 text-neutral-800">
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:transform hover:scale-105"
                >
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-neutral-200"></div>
                    <div className="absolute top-4 right-4 bg-neutral-800 text-white px-3 py-1 rounded-full text-sm">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-charm mb-2 text-neutral-800">
                      {event.title}
                    </h3>
                    <p className="text-neutral-600 mb-2">{event.date}</p>
                    <p className="text-neutral-600 mb-4">{event.location}</p>
                    <p className="text-neutral-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-charm text-center mb-12 text-neutral-800">
              Past Events
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <div
                  key={event.id}
                  className="bg-neutral-50 rounded-lg overflow-hidden shadow-lg"
                >
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-neutral-200"></div>
                    <div className="absolute top-4 right-4 bg-neutral-600 text-white px-3 py-1 rounded-full text-sm">
                      {event.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-charm mb-2 text-neutral-800">
                      {event.title}
                    </h3>
                    <p className="text-neutral-600 mb-2">{event.date}</p>
                    <p className="text-neutral-600 mb-4">{event.location}</p>
                    <p className="text-neutral-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-charm mb-6 text-neutral-800">
              Stay Updated
            </h2>
            <p className="text-neutral-600 mb-8">
              Subscribe to my newsletter to receive updates about upcoming
              events and exhibitions
            </p>
            <form className="max-w-md mx-auto">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="group relative px-6 py-2 text-lg font-medium overflow-hidden"
                >
                  <span className="relative z-10 text-neutral-800 group-hover:text-white transition-colors duration-300">
                    Subscribe
                  </span>
                  <span className="absolute inset-0 bg-neutral-800 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></span>
                  <span className="absolute inset-0 border border-neutral-800 group-hover:border-transparent transition-colors duration-300"></span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
