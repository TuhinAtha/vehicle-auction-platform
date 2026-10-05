import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

import { UPLOADS_PATH } from "@repo/shared"
import type { NextConfig } from "next"

// Load the monorepo's root .env (shared with the API). Variables that are
// already set — in the shell or in apps/web/.env* — take precedence.
const rootEnv = fileURLToPath(new URL("../../.env", import.meta.url))
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv)

const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:3001"

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: `${UPLOADS_PATH}/**`, search: "" }],
  },
  // Proxy /uploads to the API, which stores and serves the vehicle photos.
  rewrites: async () => [
    {
      source: `${UPLOADS_PATH}/:path*`,
      destination: `${API_ORIGIN}${UPLOADS_PATH}/:path*`,
    },
  ],
}

export default nextConfig
