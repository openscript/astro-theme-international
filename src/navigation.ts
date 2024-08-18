import { getContentEntryPath, makeMenu } from "./utils/i18n";

export const N = {
  'main': {
    'en': await makeMenu('en', [
      { title: 'Blog', path: 'blog' },
      { title: 'Projects', path: 'projects' },
      { title: 'Gallery', path: 'gallery' },
      { title: 'About us', path: (locale) => getContentEntryPath('pages', `${locale}/about`) },
    ]),
    'de': await makeMenu('de', [
      { title: 'Blog', path: 'blog' },
      { title: 'Projekte', path: 'projekte' },
      { title: 'Galerie', path: 'galerie' },
      { title: 'Über uns', path: (locale) => getContentEntryPath('pages', `${locale}/about`) },
    ]),
  },
  'footer': {
    'en': await makeMenu('en', [
      { title: 'License', path: (locale) => getContentEntryPath('pages', `${locale}/license`) },
      { title: 'Changelog', path: (locale) => getContentEntryPath('pages', `${locale}/changelog`) },
      { title: 'Data Protection', path: (locale) => getContentEntryPath('pages', `${locale}/data-protection`) },
      { title: 'Terms and Conditions', path: (locale) => getContentEntryPath('pages', `${locale}/terms`) },
      { title: 'Imprint', path: (locale) => getContentEntryPath('pages', `${locale}/imprint`) },
    ]),
    'de': await makeMenu('de', [
      { title: 'Lizenz', path: (locale) => getContentEntryPath('pages', `${locale}/license`) },
      { title: 'Änderungsverlauf', path: (locale) => getContentEntryPath('pages', `${locale}/changelog`) },
      { title: 'Datenschutz', path: (locale) => getContentEntryPath('pages', `${locale}/data-protection`) },
      { title: 'AGBs', path: (locale) => getContentEntryPath('pages', `${locale}/terms`) },
      { title: 'Impressum', path: (locale) => getContentEntryPath('pages', `${locale}/imprint`) },
    ]),
  }
}
