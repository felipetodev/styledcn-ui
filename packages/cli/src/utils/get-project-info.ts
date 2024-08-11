import path from "path"
import fg from "fast-glob"
import fs, { pathExists } from "fs-extra"
import {
  Config,
  getConfig,
  RawConfig,
  resolveConfigPaths
} from "@/src/utils/get-config"
import { loadConfig } from "tsconfig-paths"

const PROJECT_TYPES = [
  "next-app",
  "next-app-src",
  "next-pages",
  "next-pages-src",
] as const

type ProjectType = (typeof PROJECT_TYPES)[number]

const PROJECT_SHARED_IGNORE = [
  "**/node_modules/**",
  ".next",
  "public",
  "dist",
  "build",
]

const CSS_FILE_NAMES_MATCHER = [
  "App.css",
  "app.css",
  "global.css",
  "Global.css",
  "globals.css",
  "Globals.css",
  "styles.css",
  "Styles.css",
  "style.css",
  "Style.css",
  "index.css",
  "Index.css",
  "main.css",
  "Main.css",
]

export async function getProjectConfig(cwd: string): Promise<Config | null> {
  // Check for existing component config.
  const existingConfig = await getConfig(cwd)
  if (existingConfig) {
    return existingConfig
  }

  const projectType = await getProjectType(cwd)
  const tailwindCssFile = await getCssFile(cwd)
  const tsConfigAliasPrefix = await getTsConfigAliasPrefix(cwd)

  if (!projectType || !tailwindCssFile || !tsConfigAliasPrefix) {
    return null
  }

  const isTsx = await isTypeScriptProject(cwd)

  const config: RawConfig = {
    $schema: "https://ui.styledcn.com/schema.json",
    rsc: ["next-app", "next-app-src"].includes(projectType),
    tsx: isTsx,
    style: "default",
    library: {
      integration: "emotion",
      baseColor: "neutral",
      css: tailwindCssFile,
    },
    aliases: {
      utils: `${tsConfigAliasPrefix}/lib/utils`,
      components: `${tsConfigAliasPrefix}/components`,
    },
  }

  return await resolveConfigPaths(cwd, config)
}

export async function getProjectType(cwd: string): Promise<ProjectType | null> {
  const files = await fg.glob("**/*", {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  })

  const isNextProject = files.find((file) => file.startsWith("next.config."))
  if (!isNextProject) {
    return null
  }

  const isUsingSrcDir = await fs.pathExists(path.resolve(cwd, "src"))
  const isUsingAppDir = await fs.pathExists(
    path.resolve(cwd, `${isUsingSrcDir ? "src/" : ""}app`)
  )

  if (isUsingAppDir) {
    return isUsingSrcDir ? "next-app-src" : "next-app"
  }

  return isUsingSrcDir ? "next-pages-src" : "next-pages"
}

export async function getCssFile(cwd: string) { // ❌❌ FIX LATER FOR STYLED-COMPONENTS ❌❌
  const files = await fg.glob("**/*.css", {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  })

  if (!files.length) {
    return null
  }

  for (const file of files) {
    if (CSS_FILE_NAMES_MATCHER.includes(file)) {
      return file
    }
  }

  return null
}

export async function getTsConfigAliasPrefix(cwd: string) {
  const tsConfig = await loadConfig(cwd)

  if (tsConfig?.resultType === "failed" || !tsConfig?.paths) {
    return null
  }

  // This assume that the first alias is the prefix.
  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (paths.includes("./*") || paths.includes("./src/*")) {
      return alias.at(0)
    }
  }

  return null
}

export async function isTypeScriptProject(cwd: string) {
  // Check if cwd has a tsconfig.json file.
  return pathExists(path.resolve(cwd, "tsconfig.json"))
}
