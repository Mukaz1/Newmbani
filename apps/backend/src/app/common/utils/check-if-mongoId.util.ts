import { isMongoId } from 'class-validator';

export function getSlugAndId(_id: string): {
  slug?: string | undefined;
  id?: string | undefined;
} {
  if (isMongoId(_id)) {
    return { slug: undefined, id: _id };
  } else {
    return { slug: _id, id: undefined };
  }
}
