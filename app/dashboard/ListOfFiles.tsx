import Artwork, { ArtworkDocument } from "@/models/Artwork";
import dynamic from "next/dynamic";
import React from "react";

// Dynamically import the client component so the server doesn't access its internals
const ListOfFilesClient = dynamic(() => import("./ListItems"), {
  ssr: false,
});

export default async function ListOfFiles() {
  const response: ArtworkDocument[] = await Artwork.find({});
  // Convert to JSON-serializable objects
  const files = JSON.parse(JSON.stringify(response));

  return <ListOfFilesClient files={files} />;
}
