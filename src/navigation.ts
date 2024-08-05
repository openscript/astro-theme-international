import { getContentEntryPath, makeMenu } from "./utils/i18n";

export const N = {
  'main': {
    'en': await makeMenu('en', [
      { title: 'Blog', path: 'blog' },
      { title: 'Projects', path: 'projects' },
      { title: 'Gallery', path: 'gallery' },
      { title: 'About', path: 'about' },
    ]),
    'de': await makeMenu('de', [
      { title: 'Blog', path: 'blog' },
      { title: 'Projekte', path: 'projekte' },
      { title: 'Galerie', path: 'galerie' },
      { title: 'Über uns', path: 'ueber-uns' },
    ]),
  },
  'footer': {
    'en': await makeMenu('en', [
      { title: 'License', path: (locale) => getContentEntryPath('pages', `${locale}/license`) },
      { title: 'Changelog', path: (locale) => getContentEntryPath('pages', `${locale}/changelog`) },
      { title: 'Privacy', path: 'privacy' },
      { title: 'Terms', path: 'terms' },
      { title: 'Contact', path: 'contact' },
    ]),
    'de': await makeMenu('de', [
      { title: 'Lizenz', path: (locale) => getContentEntryPath('pages', `${locale}/license`) },
      { title: 'Änderungsverlauf', path: (locale) => getContentEntryPath('pages', `${locale}/changelog`) },
      { title: 'Datenschutz', path: 'datenschutz' },
      { title: 'AGB', path: 'agb' },
      { title: 'Kontakt', path: 'kontakt' },
    ]),
  }
}
