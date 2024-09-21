import CategoryList from "./CategoryList";


const GalleryPage = () => {
  return (
    <main className="min-h-dvh">
      <div className="w-full items-center my-12 text-9xl text-center text-[hsl(var(--nextui-primary))]">
        <h1>GALLERY</h1>
      </div>
      {<CategoryList/>}
    </main>
  );
};

export default GalleryPage;
