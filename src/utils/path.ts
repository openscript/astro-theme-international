export function getRelativePath(path: string) {
  if (import.meta.env.DEV) return path;
  return path.replace(/^\/+/, './');
}

export function joinPath(...paths: Array<string | number | undefined>) {
  return paths.filter(Boolean).join("/");
}

export function resolvePath(...paths: Array<string | number | undefined>) {
  return `/${joinPath(...paths)}`;
}
