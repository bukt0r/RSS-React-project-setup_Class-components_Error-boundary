import { fireEvent, render, screen } from '@testing-library/react';
import PersonImage from './PersonImage';
import { PERSON_IMAGE_FALLBACK } from '../services/personImageUrl';

describe('PersonImage', () => {
  it('renders a next/image-backed character portrait', () => {
    render(
      <PersonImage
        src="https://starwars-visualguide.com/assets/img/character/1.jpg"
        alt="Luke Skywalker"
        size={56}
      />,
    );

    const image = screen.getByRole('img', { name: 'Luke Skywalker' });
    expect(image).toHaveAttribute(
      'src',
      'https://starwars-visualguide.com/assets/img/character/1.jpg',
    );
    expect(image).toHaveAttribute('width', '56');
    expect(image).toHaveAttribute('height', '56');
  });

  it('falls back to a local placeholder when remote image fails', () => {
    render(
      <PersonImage
        src="https://starwars-visualguide.com/assets/img/character/999.jpg"
        alt="Unknown person"
        size={56}
      />,
    );

    const image = screen.getByRole('img', { name: 'Unknown person' });
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', PERSON_IMAGE_FALLBACK);
  });
});
