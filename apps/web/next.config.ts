import { existsSync } from "node:fs"
import { fileURLToPath } from "node:url"

import type { NextConfig } from "next"

// Load the monorepo's root .env (shared with the API). Variables that are
// already set — in the shell or in apps/web/.env* — take precedence.
const rootEnv = fileURLToPath(new URL("../../.env", import.meta.url))
if (existsSync(rootEnv)) process.loadEnvFile(rootEnv)

const nextConfig: NextConfig = {}

export default nextConfig
