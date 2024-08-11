import { HttpsProxyAgent } from "https-proxy-agent"
import fetch from "node-fetch"
import { registryBaseColorSchema, stylesSchema } from "@/src/utils/registry/schema"

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
