import './test-utils/nextNavigationMock';
import '@testing-library/jest-dom/vitest';
import { createElement, type ImgHTMLAttributes } from 'react';
import { resetNavigation } from './test-utils/nextNavigationMock';

vi.mock('next/image', () => ({
  default: (props: ImgHTMLAttributes<HTMLImageElement>) => {
    const { fill, priority, ...imgProps } = props as ImgHTMLAttributes<HTMLImageElement> & {
      fill?: boolean;
      priority?: boolean;
    };

    void fill;
    void priority;

    return createElement('img', imgProps);
  },
}));

beforeEach(() => {
  resetNavigation();
});
