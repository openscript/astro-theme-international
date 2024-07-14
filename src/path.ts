export function getRelativePath(path: string) {
  return path.replace(/^\/+/, './');
}
