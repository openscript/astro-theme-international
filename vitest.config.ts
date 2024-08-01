/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// see https://docs.astro.build/en/guides/testing/
export default getViteConfig({
  test: {
    unstubEnvs: true,
  },
});
