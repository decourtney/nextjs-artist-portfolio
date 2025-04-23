import Footer from "./_components/Footer";
import Header from "./_components/Header";

const RootLayoutLarge = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {/* Header */}
      <Header />
      {/* Main */}
      <main className="max-w-[1200px] mx-auto">{children}</main>
      {/* Footer */}
      <Footer />
    </>
  );
};

export default RootLayoutLarge;
