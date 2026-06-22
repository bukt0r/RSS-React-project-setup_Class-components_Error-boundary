import { getPersonImageUrl, PERSON_IMAGE_FALLBACK } from './personImageUrl';

describe('personImageUrl', () => {
  it('builds a visual guide URL from a person id', () => {
    expect(getPersonImageUrl('1')).toBe(
      'https://starwars-visualguide.com/assets/img/character/1.jpg',
    );
  });

  it('returns fallback image URL for empty ids', () => {
    expect(getPersonImageUrl('')).toBe(PERSON_IMAGE_FALLBACK);
    expect(getPersonImageUrl('   ')).toBe(PERSON_IMAGE_FALLBACK);
  });
});
