import path from "path"
import { Config } from "@/src/utils/get-config"
import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import {
  registryBaseColorSchema,
  registryIndexSchema,
  stylesSchema,
  registryWithContentSchema,
  registryItemWithContentSchema
} from "@/src/utils/registry/schema"
import { z } from "zod"

// deploy url with registry paths
const baseUrl = process.env.COMPONENTS_REGISTRY_URL ?? "https://..."
const agent = process.env.https_proxy
  ? new HttpsProxyAgent(process.env.https_proxy)
  : undefined

export async function getRegistryFrameworks() {
  return [
    {
      name: "emotion",
      label: "Emotion"
    },
    {
      name: "styled-components",
      label: "Styled Components"
    },
    {
      name: "panda",
      label: "Panda CSS"
    }
  ]
}

export async function getRegistryIndex() {
  try {
    const [result] = await fetchRegistry(["index.json"])

    return registryIndexSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch components from registry.`)
  }
}

export async function getRegistryStyles() {
  try {
    const [result] = await fetchRegistry(["styles/index.json"])

    return stylesSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch styles from registry.`)
  }
}

export async function getRegistryBaseColors() {
  return [
    // {
    //   name: "slate",
    //   label: "Slate",
    // },
    // {
    //   name: "gray",
    //   label: "Gray",
    // },
    // {
    //   name: "zinc",
    //   label: "Zinc",
    // },
    {
      name: "neutral",
      label: "Neutral",
    },
  ]
}

export async function resolveTree(
  index: z.infer<typeof registryIndexSchema>,
  names: string[]
) {
  const tree: z.infer<typeof registryIndexSchema> = []

  for (const name of names) {
    const entry = index.find((entry) => entry.name === name)

    if (!entry) {
      continue
    }

    tree.push(entry)

    if (entry.registryDependencies) {
      const dependencies = await resolveTree(index, entry.registryDependencies)
      tree.push(...dependencies)
    }
  }

  // console.log(tree) [ { name: 'button', files: [ 'ui/button.tsx' ], type: 'components:ui' } ] 

  return tree.filter(
    (component, index, self) =>
      self.findIndex((c) => c.name === component.name) === index
  )
}

export async function fetchTree(
  style: string,
  tree: z.infer<typeof registryIndexSchema>
) {
  try {
    const paths = tree.map((item) => `styles/${style}/${item.name}.json`)
    const result = await fetchRegistry(paths)

    return registryWithContentSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch tree from registry.`)
  }
}

export async function getItemTargetPath(
  config: Config,
  item: Pick<z.infer<typeof registryItemWithContentSchema>, "type">,
  override?: string
) {
  if (override) {
    return override
  }

  if (item.type === "components:ui" && config.aliases.ui) {
    return config.resolvedPaths.ui
  }

  const [parent, type] = item.type.split(":")
  if (!(parent in config.resolvedPaths)) {
    return null
  }

  return path.join(
    config.resolvedPaths[parent as keyof typeof config.resolvedPaths],
    type
  )
}

export async function getRegistryBaseColor(baseColor: string) {
  try {
    const [result] = await fetchRegistry([`colors/${baseColor}.json`])

    return registryBaseColorSchema.parse(result)
  } catch (error) {
    throw new Error(`Failed to fetch base color from registry.`)
  }
}

async function fetchRegistry(paths: string[]) {
  try {
    const results = await Promise.all(
      paths.map(async (path) => {
        const response = await fetch(`${baseUrl}/registry/${path}`, {
          agent,
        })
        return await response.json()
      })
    )

    return results
  } catch (error) {
    console.log(error)
    throw new Error(`Failed to fetch registry from ${baseUrl}.`)
  }
}
