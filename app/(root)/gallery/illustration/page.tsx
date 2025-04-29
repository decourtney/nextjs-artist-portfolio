import React from "react";

const IllustrationPage = () => {
  return (
    <div className="min-h-[calc(100dvh-196px)] flex flex-col items-center justify-center text-center p-8">
      <h1 className="font-charm text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
        Illustration Book
      </h1>
      <div className="relative w-24 h-32 mb-8">
        {/* Animated stacked papers effect */}
        <div className="absolute inset-0 bg-white border-2 border-black transform rotate-3 transition-transform hover:rotate-6"></div>
        <div className="absolute inset-0 bg-white border-2 border-black transform -rotate-3 transition-transform hover:-rotate-6"></div>
        <div className="absolute inset-0 bg-white border-2 border-black"></div>
      </div>
      <p className="text-xl md:text-2xl mb-4 text-gray-600">Coming Soon</p>
      <p className="max-w-md text-gray-500">
        A curated collection of illustrations will be available here soon. Stay
        tuned for an interactive experience.
      </p>
    </div>
  );
};

export default IllustrationPage;
