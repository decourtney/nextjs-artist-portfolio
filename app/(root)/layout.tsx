import Footer from "./_components/Footer";
import Header from "./_components/Header";
import PageFadein from "./_components/PageFadein";

const RootLayoutLarge = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <PageFadein>{children}</PageFadein>
      </main>

      <Footer />
    </div>
  );
};

export default RootLayoutLarge;

// min-h-[calc(100dvh-320px)]