import Footer from "@/app/(root)/_components/Footer";
import Header from "@/app/(root)/_components/Header";
import PageFadein from "@/app/(root)/_components/PageFadein";

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
