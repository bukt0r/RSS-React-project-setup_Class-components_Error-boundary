import { render, screen } from '@testing-library/react';
import AboutPageView from './AboutPageView';
import { getAboutPageContent } from '@/test-utils/aboutPageContent';

describe('AboutPageView', () => {
  it('renders localized English content', () => {
    render(<AboutPageView {...getAboutPageContent('en')} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'About' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Item Search is a training project for the Rolling Scopes School React course.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Item Search logo' })).toBeInTheDocument();
  });

  it('renders localized Russian content', () => {
    render(<AboutPageView {...getAboutPageContent('ru')} />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'О проекте' }),
    ).toBeInTheDocument();
  });

  it('keeps external links outside internal navigation', () => {
    render(<AboutPageView {...getAboutPageContent()} />);

    const authorLink = screen.getByRole('link', { name: 'vufimcev' });
    const courseLink = screen.getByRole('link', {
      name: 'RS School React course',
    });

    expect(authorLink).toHaveAttribute('href', 'https://github.com/bukt0r');
    expect(authorLink).toHaveAttribute('target', '_blank');
    expect(courseLink).toHaveAttribute(
      'href',
      'https://rs.school/courses/reactjs',
    );
    expect(courseLink).toHaveAttribute('target', '_blank');
  });
});
