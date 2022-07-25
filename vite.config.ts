import { defineConfig, UserConfigExport } from "vitest/config";
import react from "@vitejs/plugin-react";
// @ts-ignore
import * as path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const baseConfig: UserConfigExport = {
    resolve: {
      alias: {
        src: path.resolve("src/"),
      },
    },
    plugins: [
      react({
        fastRefresh: process.env.NODE_ENV !== "test",
      }),
    ],
  };

  if (mode === "debug") {
    baseConfig.build = {
      sourcemap: true,
      minify: false,
    };
  }

  return baseConfig;
});
