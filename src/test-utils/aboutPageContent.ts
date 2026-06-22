import enMessages from '../../messages/en.json';
import ruMessages from '../../messages/ru.json';
import type { AboutPageContent } from '@/components/about/AboutPageView';
import type { AppLocale } from '@/i18n/routing';

const aboutContentByLocale: Record<AppLocale, AboutPageContent> = {
  en: enMessages.about,
  ru: ruMessages.about,
};

export function getAboutPageContent(locale: AppLocale = 'en'): AboutPageContent {
  return aboutContentByLocale[locale];
}
