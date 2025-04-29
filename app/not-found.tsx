import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#e2e8f0] text-[#333] p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl md:text-8xl font-bold mb-4 font-beasties">404</h1>
        <h2 className="text-2xl md:text-3xl mb-6">Page Not Found</h2>
        <p className="text-base md:text-lg mb-8">
          The page you are looking for could not be found.
        </p>
        <Link
          href="/"
          className="group relative inline-block px-8 py-4 text-lg font-medium text-[#1e293b] hover:text-white transition-colors duration-300"
        >
          <span className="relative z-10">Return to Home</span>
          <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
        </Link>
      </div>
    </div>
  )
}
