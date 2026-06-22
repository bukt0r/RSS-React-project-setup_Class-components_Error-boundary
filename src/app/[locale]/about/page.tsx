import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import AboutPageView from '@/components/about/AboutPageView';
import { routing } from '@/i18n/routing';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return {
    title: t('title'),
  };
}

export default async function AboutRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('about');

  return (
    <AboutPageView
      title={t('title')}
      logoAlt={t('logoAlt')}
      text={t('text')}
      author={t('author')}
      courseLink={t('courseLink')}
    />
  );
}
