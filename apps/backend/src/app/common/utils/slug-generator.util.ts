export const generateSlug = (title: string, timestamp = true): string => {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric except spaces & hyphens
    .replace(/\s+/g, '-') // replace spaces with hyphen
    .replace(/-+/g, '-'); // collapse multiple hyphens

  return timestamp ? `${cleanTitle}-${Date.now().toString(36)}` : cleanTitle;
};
