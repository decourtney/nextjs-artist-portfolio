'use client';

import { Card, CardBody } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

const CategoryList = ({ categories }: { categories: string[] }) => {
  const router = useRouter();

  return (
    <div className="flex flex-wrap justify-around gap-4 w-3/4 h-full mx-auto">
      {categories.map((category, index) => (
        <Card
        key={index}
          className="w-[300px] h-[400px]"
          isPressable
          onPress={() => {router.push(`/gallery/${category}`)}}
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
