import Footer from "./_components/Footer";
import Header from "./_components/Header";
import PageFadein from "./_components/PageFadein";

const RootLayoutLarge = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      <main className=" min-h-[calc(100dvh-320px)] mx-auto">
        <PageFadein>{children}</PageFadein>
      </main>

      <Footer />
    </>
  );
};

export default RootLayoutLarge;
