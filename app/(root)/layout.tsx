import Footer from "./_components/Footer";
import Header from "./_components/Header";
import PageFadein from "./_components/PageFadein";

const RootLayoutLarge = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      <main className="max-w-[1200px] mx-auto">
        <PageFadein>{children}</PageFadein>
      </main>

      <Footer />
    </>
  );
};

export default RootLayoutLarge;
