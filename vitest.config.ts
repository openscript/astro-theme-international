/// <reference types="vitest" />
import { getViteConfig } from "astro/config";
import { coverageConfigDefaults } from "vitest/config";

// see https://docs.astro.build/en/guides/testing/
export default getViteConfig({
  test: {
    unstubEnvs: true,
    coverage: {
      exclude: [
        "astro.config.ts",
        "**/*.astro",
        ...coverageConfigDefaults.exclude,
      ],
    },
  },
});
