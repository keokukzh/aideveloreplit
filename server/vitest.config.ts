import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    environment: "node",
    include: ["test/**/*.spec.ts"],
    exclude: ["**/node_modules/**", "**/dist/**"],
  },
  resolve: { alias: { "@shared": path.resolve(__dirname, "../shared") } },
});

