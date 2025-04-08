import dbConnect from '@/lib/dbConnect';
import { Artwork } from '@/models';
import React from 'react'

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const CategoryPage = async ({params}: CategoryPageProps) => {
  await dbConnect();
  const { category } = params;
  // const artworks = await Artwork.find({ category }).populate("category medium size").exec();

  // console.log(artworks);
  return (
    <div className='h-screen w-full flex items-center justify-center'>
      {category}
    </div>
  )
}

export default CategoryPage
