import CategoryList from "./CategoryList";

const tempData = ["painting", "sculpture", "photography", "digital", "mixed", "all"];

const GalleryPage = () => {
  return (
    <main className="min-h-dvh">
      <div className="w-full items-center my-12 text-9xl text-center text-[hsl(var(--nextui-primary))]">
        <h1>GALLERY</h1>
      </div>
      {<CategoryList categories={tempData} />}
    </main>
  );
};

export default GalleryPage;
