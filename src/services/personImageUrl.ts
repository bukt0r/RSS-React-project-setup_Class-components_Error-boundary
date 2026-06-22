const SW_VISUAL_GUIDE_BASE =
  'https://starwars-visualguide.com/assets/img/character';

export const PERSON_IMAGE_FALLBACK = '/images/person-fallback.svg';

export function getPersonImageUrl(id: string): string {
  const normalizedId = id.trim();

  if (!normalizedId) {
    return PERSON_IMAGE_FALLBACK;
  }

  return `${SW_VISUAL_GUIDE_BASE}/${normalizedId}.jpg`;
}
