export function getRelativePath(path: string) {
  if (import.meta.env.DEV) return path;
  return path.replace(/^\/+/, './');
}

export function joinPath(...paths: Array<string | undefined>) {
  return paths.filter(Boolean).join('/');
}

export function resolvePath(...paths: Array<string | undefined>) {
  return getRelativePath(`/${joinPath(...paths)}`);
}

export function dirname(path: string) {
  return path.replace(/\/[^\/]*$/, '');
}

export function trimExtension(path: string) {
  return path.replace(/\.[^\/.]+$/, '');
}

export function addTrailingSlash(path: string) {
  return path.endsWith('/') ? path : `${path}/`;
}
