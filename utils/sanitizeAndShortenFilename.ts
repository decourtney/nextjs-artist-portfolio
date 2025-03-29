export const SanitizeAndShortenFilename = (filename: string) => {
  const sanitizedUpdatedName: string = filename
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  const shortenedName =
    sanitizedUpdatedName.length > 60
      ? sanitizedUpdatedName.substring(0, 60)
      : sanitizedUpdatedName;

  return shortenedName;
};
