import React from 'react'
import { ArtworkObj } from '../../utils/getIllustrationsForClient';
import SortableItem from './SortableItem';
import Image from 'next/image';

interface IllustrationItemProps {
  item: ArtworkObj
}

const IllustrationItem = ({ item }: IllustrationItemProps) => {
  if(!item) return null;
  
  return (
    <SortableItem id={item.id}>
      <div className="relative w-20 h-20 sm:w-24 sm:h-24  rounded-md overflow-hidden bg-gray-100 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow">
        <Image
          src={item.thumbSrc}
          alt={item.name}
          fill
          sizes="(max-width: 640px) 100vw, 160px"
          className="object-cover"
        />
      </div>
    </SortableItem>
  );
};

export default IllustrationItem
