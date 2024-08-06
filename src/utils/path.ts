export function getRelativePath(path: string) {
  if (import.meta.env.DEV) return path;
  return path.replace(/^\/+/, './');
}

export function joinPath(...paths: Array<string | number | undefined>) {
  return paths.filter(Boolean).join('/');
}

export function resolvePath(...paths: Array<string | number | undefined>) {
  return getRelativePath(`/${joinPath(...paths)}`);
}

export function dirname(path: string) {
  if (!path.includes('/')) return '';

  return path.replace(/\/[^\/]*$/, '');
}

export function trimExtension(path: string) {
  return path.replace(/\.[^\/.]+$/, '');
}

export function addTrailingSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}
