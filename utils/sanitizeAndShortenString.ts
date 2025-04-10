export const SanitizeAndShortenString = (filename: string) => {
  const shortenedName = shortenName(filename);
  const sanitizedAndShortenedName: string = shortenedName
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

    return sanitizedAndShortenedName;
};

export const shortenName = (filename: string) => {
  const shortenedName =
    filename.length > 60 ? filename.substring(0, 60) : filename;

  return shortenedName;
};
