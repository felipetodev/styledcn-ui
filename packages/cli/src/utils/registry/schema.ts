import { z } from "zod"

export const stylesSchema = z.array(
  z.object({
    name: z.string(),
    label: z.string(),
  })
)

export const registryBaseColorSchema = z.object({
  cssVars: z.object({
    light: z.record(z.string(), z.string()),
    dark: z.record(z.string(), z.string()),
  }),
  cssVarsTemplate: z.string(),
})
