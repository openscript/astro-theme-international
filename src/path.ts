export function getRelativePath(path: string) {
  if(import.meta.env.DEV) return path;
  return path.replace(/^\/+/, './');
}
