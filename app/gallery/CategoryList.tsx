'use client';

import useScreenSize from "@/lib/useScreenSize";
import { Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { use, useEffect } from "react";

const CategoryList = ({ categories }: { categories: string[] }) => {
  const router = useRouter();
  const screenSize = useScreenSize();

  /**
   * CURRENTLY NOT IN USE - leaving here as a reminder as an option for handling the number of artwork fetched per page
   * Adjusting the number of artworkPerPage based on screen size.
   */
  useEffect(() => {
    console.log("Screen size:", screenSize);
  }, [screenSize]);

  return (
    <div className="flex flex-wrap justify-around gap-4 w-3/4 h-full mx-auto">
      {categories.map((category, index) => (
        <Card
          key={index}
          className="w-[300px] h-[400px]"
          isPressable
          onPress={() => {
            router.push(`/gallery/${category}`);
          }}
        >
          <CardBody>
            <h2>{category}</h2>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default CategoryList;
