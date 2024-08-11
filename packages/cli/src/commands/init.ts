import { existsSync, promises as fs } from "fs"
import ora from "ora"
import path from "path"
import chalk from "chalk"
import prompts from "prompts"
import { Command } from "commander"
import { logger } from "@/src/utils/logger"
import { execa } from "execa"
import { getProjectConfig } from "@/src/utils/get-project-info"
import { Config, DEFAULT_COMPONENTS, DEFAULT_CSS, DEFAULT_UTILS, getConfig, rawConfigSchema, resolveConfigPaths } from "@/src/utils/get-config"
import { getRegistryBaseColor, getRegistryBaseColors, getRegistryFrameworks, getRegistryStyles } from "@/src/utils/registry"
import * as templates from "@/src/utils/templates"
import { getPackageManager } from "@/src/utils/get-package-manager"
import { z } from "zod"

const PROJECT_DEPENDENCIES = [
  "class-variance-authority",
  "clsx",
]

const CSS_FRAMEWORK_DEPENDENCY = {
  "styled-components": "styled-components",
  "emotion": "@emotion/styled",
  "pandacss": "@pandacss/dev",
}

const initOptionsSchema = z.object({
  cwd: z.string(),
  yes: z.boolean(),
  defaults: z.boolean(),
})

export const init = new Command()
  .name("init")
  .description("initialize your project and install dependencies")
  .option("-y, --yes", "skip confirmation prompt.", false)
  .option("-d, --defaults,", "use default configuration.", false)
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .action(async (opts) => {
    try {
      const options = initOptionsSchema.parse(opts)
      const cwd = path.resolve(options.cwd)
      if (!existsSync(cwd)) {
        logger.error(`The path ${cwd} does not exist. Please try again.`)
        process.exit(1)
      }

      const projectConfig = await getProjectConfig(cwd)

      if (projectConfig) {
        const config = await promptForMinimalConfig(
          cwd,
          projectConfig,
          options.defaults
        )
        await runInit(cwd, config)
      } else {
        // Read config.
        const existingConfig = await getConfig(cwd)
        const config = await promptForConfig(cwd, existingConfig, options.yes)
        await runInit(cwd, config)
      }
    } catch (error) {
      // do something ❌
    }
  })

export async function promptForConfig(
  cwd: string,
  defaultConfig: Config | null = null,
  skip = false
) {
  const highlight = (text: string) => chalk.cyan(text)

  const cssFrameworks = await getRegistryFrameworks()
  const styles = await getRegistryStyles()
  const baseColors = await getRegistryBaseColors()

  const options = await prompts([
    {
      type: "select",
      name: "integration",
      message: `Which ${highlight("CSS in JS")} framework would you like to use?`,
      choices: cssFrameworks.map((framework) => ({
        title: framework.label,
        value: framework.name,
      })),
    },
    {
      type: "toggle",
      name: "typescript",
      message: `Would you like to use ${highlight(
        "TypeScript"
      )} (recommended)?`,
      initial: defaultConfig?.tsx ?? true,
      active: "yes",
      inactive: "no",
    },
    {
      type: "select",
      name: "style",
      message: `Which ${highlight("style")} would you like to use?`,
      choices: styles.map((style) => ({
        title: style.label,
        value: style.name,
      })),
    },
    {
      type: "select",
      name: "baseColor",
      message: `Which color would you like to use as ${highlight(
        "base color"
      )}?`,
      choices: baseColors.map((color) => ({
        title: color.label,
        value: color.name,
      })),
    },
    {
      type: "text",
      name: "baseCss",
      message: `Where is your ${highlight("global CSS")} file?`,
      initial: defaultConfig?.library.css ?? DEFAULT_CSS,
    },
    {
      type: "text",
      name: "components",
      message: `Configure the import alias for ${highlight("components")}:`,
      initial: defaultConfig?.aliases["components"] ?? DEFAULT_COMPONENTS,
    },
    {
      type: "text",
      name: "utils",
      message: `Configure the import alias for ${highlight("utils")}:`,
      initial: defaultConfig?.aliases["utils"] ?? DEFAULT_UTILS,
    },
    {
      type: "toggle",
      name: "rsc",
      message: `Are you using ${highlight("React Server Components")}?`,
      initial: defaultConfig?.rsc ?? false,
      active: "yes",
      inactive: "no",
    },
  ])

  const config = rawConfigSchema.parse({
    $schema: "https://ui.shadcn.com/schema.json",
    style: options.style,
    library: {
      integration: options.integration,
      css: options.baseCss,
      baseColor: options.baseColor,
    },
    rsc: options.rsc,
    tsx: options.typescript,
    aliases: {
      utils: options.utils,
      components: options.components,
    },
  })

  if (!skip) {
    const { proceed } = await prompts({
      type: "confirm",
      name: "proceed",
      message: `Write configuration to ${highlight(
        "components.json"
      )}. Proceed?`,
      initial: true,
    })

    if (!proceed) {
      process.exit(0)
    }
  }

  // Write to file.
  logger.info("")
  const spinner = ora(`Writing components.json...`).start()
  const targetPath = path.resolve(cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  spinner.succeed()

  return await resolveConfigPaths(cwd, config)
}

// skip confirmation prompt
export async function promptForMinimalConfig(
  cwd: string,
  defaultConfig: Config,
  defaults = false
) {
  const highlight = (text: string) => chalk.cyan(text)
  let style = defaultConfig.style
  let baseColor = defaultConfig.library.baseColor

  if (!defaults) {
    const styles = await getRegistryStyles()
    const baseColors = await getRegistryBaseColors()

    const options = await prompts([
      {
        type: "select",
        name: "style",
        message: `Which ${highlight("style")} would you like to use?`,
        choices: styles.map((style) => ({
          title: style.label,
          value: style.name,
        })),
      },
      {
        type: "select",
        name: "baseColor",
        message: `Which color would you like to use as ${highlight(
          "base color"
        )}?`,
        choices: baseColors.map((color) => ({
          title: color.label,
          value: color.name,
        })),
      }
    ])

    style = options.style
    baseColor = options.baseColor
  }

  const config = rawConfigSchema.parse({
    $schema: defaultConfig?.$schema,
    style,
    library: {
      ...defaultConfig?.library,
      baseColor,
    },
    rsc: defaultConfig?.rsc,
    tsx: defaultConfig?.tsx,
    aliases: defaultConfig?.aliases,
  })

  // Write to file.
  logger.info("")
  const spinner = ora(`Writing components.json...`).start()
  const targetPath = path.resolve(cwd, "components.json")
  await fs.writeFile(targetPath, JSON.stringify(config, null, 2), "utf8")
  spinner.succeed()

  return await resolveConfigPaths(cwd, config)
}

export async function runInit(cwd: string, config: Config) {
  const spinner = ora(`Initializing project...`)?.start()

  // Ensure all resolved paths directories exist.
  for (const [key, resolvedPath] of Object.entries(config.resolvedPaths)) {
    // Determine if the path is a file or directory.
    // TODO: is there a better way to do this?
    let dirname = path.extname(resolvedPath)
      ? path.dirname(resolvedPath)
      : resolvedPath

    // If the utils alias is set to something like "@/lib/utils",
    // assume this is a file and remove the "utils" file name.
    if (key === "utils" && resolvedPath.endsWith("/utils")) {
      // Remove /utils at the end.
      dirname = dirname.replace(/\/utils$/, "")
    }

    if (!existsSync(dirname)) {
      await fs.mkdir(dirname, { recursive: true })
    }
  }

  const extension = config.tsx ? "ts" : "js"

  // Write css file.
  const baseColor = await getRegistryBaseColor(config.library.baseColor)
  if (baseColor) {
    await fs.writeFile(
      config.resolvedPaths.libraryCss,
      baseColor.cssVarsTemplate,
      "utf8"
    )
  }

  // Write cn file.
  await fs.writeFile(
    `${config.resolvedPaths.utils}.${extension}`,
    extension === "ts" ? templates.UTILS : templates.UTILS_JS,
    "utf8"
  )

  spinner?.succeed()

  // Install dependencies.
  const dependenciesSpinner = ora(`Installing dependencies...`)?.start()
  const packageManager = await getPackageManager(cwd)

  const deps = [
    ...PROJECT_DEPENDENCIES,
    CSS_FRAMEWORK_DEPENDENCY[config.library.integration as keyof typeof CSS_FRAMEWORK_DEPENDENCY],
    // config.style === "new-york" ? "@radix-ui/react-icons" : "lucide-react",
  ]

  await execa(
    packageManager,
    [packageManager === "npm" ? "install" : "add", ...deps],
    {
      cwd,
    }
  )
  dependenciesSpinner?.succeed()
}
