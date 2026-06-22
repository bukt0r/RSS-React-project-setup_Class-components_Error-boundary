import './test-utils/nextNavigationMock';
import '@testing-library/jest-dom/vitest';
import { resetNavigation } from './test-utils/nextNavigationMock';

beforeEach(() => {
  resetNavigation();
});
