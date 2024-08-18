import type { Root } from 'mdast';
import type { VFile } from 'vfile';
import simpleGit, { type DefaultLogFields, type ListLogLine, type SimpleGitOptions } from 'simple-git';

const options: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
  trimmed: false,
};
const git = simpleGit(options);

export type GitInfoFrontmatter = {
  git: {
    lastCommit: DefaultLogFields & ListLogLine;
    remoteEditUrl: string;
    remoteViewUrl: string;
    remoteHistoryUrl: string;
  };
}

type Options = Readonly<{
  remoteUrlBase: string;
}>;

type AstroData = {
  frontmatter: Record<string, any>;
};

function isAstroData(obj: any): obj is AstroData {
  return obj && typeof obj === 'object' && 'frontmatter' in obj && typeof obj.frontmatter === 'object';
}

export function remarkGitInfo({ remoteUrlBase }: Options) {
  return async (_: Root, file: VFile) => {
    if (!isAstroData(file.data.astro)) return;
    file.data.astro.frontmatter.git = {};

    const filePath = file.path.replace(process.cwd(), '');
    file.data.astro.frontmatter.git.remoteEditUrl = `${remoteUrlBase}/edit/main${filePath}`;
    file.data.astro.frontmatter.git.remoteViewUrl = `${remoteUrlBase}/blob/main${filePath}`;
    file.data.astro.frontmatter.git.remoteHistoryUrl = `${remoteUrlBase}/commits/main${filePath}`;

    const log = await git.log({ file: file.path, n: 1 });
    if (!log.latest) return;
    file.data.astro.frontmatter.git.lastCommit = log.latest;
  };
}
