import path from "path"
import { cosmiconfig } from "cosmiconfig"
import { loadConfig } from "tsconfig-paths"
import { resolveImport } from "./resolve-import"
import { z } from "zod"

export const DEFAULT_STYLE = "default"
export const DEFAULT_COMPONENTS = "@/components"
export const DEFAULT_UTILS = "@/lib/utils"
export const DEFAULT_CSS = "app/globals.css"
export const DEFAULT_INTEGRATION = "styled-components"
export const DEFAULT_BASE_COLOR = "slate"

const explorer = cosmiconfig("components", {
  searchPlaces: ["components.json"],
})

export const rawConfigSchema = z
  .object({
    $schema: z.string().optional(),
    style: z.string(),
    rsc: z.coerce.boolean().default(false),
    tsx: z.coerce.boolean().default(true),
    library: z.object({
      integration: z.string(),
      css: z.string(),
      baseColor: z.string(),
    }),
    aliases: z.object({
      components: z.string(),
      utils: z.string(),
      ui: z.string().optional(),
    }),
  })
  .strict()

export type RawConfig = z.infer<typeof rawConfigSchema>

export const configSchema = rawConfigSchema.extend({
  resolvedPaths: z.object({
    libraryCss: z.string(),
    utils: z.string(),
    components: z.string(),
    ui: z.string(),
  }),
})

export type Config = z.infer<typeof configSchema>

export async function getConfig(cwd: string) {
  const config = await getRawConfig(cwd)

  if (!config) {
    return null
  }

  return await resolveConfigPaths(cwd, config)
}

export async function resolveConfigPaths(cwd: string, config: RawConfig) {
  // Read tsconfig.json.
  const tsConfig = await loadConfig(cwd)

  if (tsConfig.resultType === "failed") {
    throw new Error(
      `Failed to load ${config.tsx ? "tsconfig" : "jsconfig"}.json. ${
        tsConfig.message ?? ""
      }`.trim()
    )
  }

  return configSchema.parse({
    ...config,
    resolvedPaths: {
      // this write folder -> libraryIntegration: path.resolve(cwd, config.library.integration),
      libraryCss: path.resolve(cwd, config.library.css),
      utils: await resolveImport(config.aliases["utils"], tsConfig),
      components: await resolveImport(config.aliases["components"], tsConfig),
      ui: config.aliases["ui"]
        ? await resolveImport(config.aliases["ui"], tsConfig)
        : await resolveImport(config.aliases["components"], tsConfig),
    },
  })
}

export async function getRawConfig(cwd: string): Promise<RawConfig | null> {
  try {
    const configResult = await explorer.search(cwd)

    if (!configResult) {
      return null
    }

    return rawConfigSchema.parse(configResult.config)
  } catch (error) {
    throw new Error(`Invalid configuration found in ${cwd}/components.json.`)
  }
}
