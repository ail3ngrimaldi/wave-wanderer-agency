export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD") // Split accents
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    + "-" + Math.random().toString(36).substring(2, 7); // Add random suffix for uniqueness
};
