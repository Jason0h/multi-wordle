export default async function loadTranslations(locale: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const translations = await import(`../public/_gt/${locale}.json`);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
  return translations.default;
}
