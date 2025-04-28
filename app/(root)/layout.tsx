import Footer from "./_components/Footer";
import Header from "./_components/Header";
import PageWrapper from "./_components/PageWrapper";

const RootLayoutLarge = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      <main className="max-w-[1200px] mx-auto">
        <PageWrapper>{children}</PageWrapper>
      </main>

      <Footer />
    </>
  );
};

export default RootLayoutLarge;
