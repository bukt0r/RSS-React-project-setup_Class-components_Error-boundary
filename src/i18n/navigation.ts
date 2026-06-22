import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export { appRoutes, type AppRoute } from './routes';
export {
  buildLocalizedAppDetailsUrl,
  buildLocalizedDetailsHref,
} from './appPaths';
