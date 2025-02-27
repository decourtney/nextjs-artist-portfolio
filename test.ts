// test-update.js

// If you're on Node.js < 18, uncomment the following line:
// const fetch = require('node-fetch');

const artworkId = "67bfdba98929c2007114a2cb"; // Replace with a valid artwork ID

const updatedData = {
  name: "New Artwork Name", // Change the artwork name to trigger S3 renaming
  description: "This is the updated description.",
  size: "Large", // New size value; if this is supposed to be a Tag, it should be a tag id
  medium: "60f72d07a0d6b3001ce12345", // Example tag id for medium; replace with a valid id
  categories: [
    "60f72d07a0d6b3001ce54321", // Example category tag id; replace with valid ids
    "60f72d07a0d6b3001ce67890",
  ],
};

async function testUpdate() {
  try {
    const response = await fetch(
      `http://localhost:3000/api/artwork/${artworkId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );
    const data = await response.json();
    console.log("Response from PATCH:", data);
  } catch (error) {
    console.error("Error updating artwork:", error);
  }
}

testUpdate();
