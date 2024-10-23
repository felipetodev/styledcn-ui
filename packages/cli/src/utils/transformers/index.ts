import { promises as fs } from "fs"
import { tmpdir } from "os"
import path from "path"
import { transformImport } from "@/src/utils/transformers/transform-import"
import { registryBaseColorSchema } from "@/src/utils/registry/schema"
import { transformJsx } from "@/src/utils/transformers/transform-jsx"
import { transformRsc } from "@/src/utils/transformers/transform-rsc"
import { transformAdapter } from "@/src/utils/transformers/transform-adapter"
import { Project, ScriptKind, type SourceFile } from "ts-morph"
import { Config } from "@/src/utils/get-config"
import { z } from "zod"

export type TransformOpts = {
  filename: string
  raw: string
  config: Config
  baseColor?: z.infer<typeof registryBaseColorSchema>
}

export type Transformer<Output = SourceFile> = (
  opts: TransformOpts & {
    sourceFile: SourceFile
  }
) => Promise<Output>

const transformers: Transformer[] = [
  transformImport,
  transformRsc,
  transformAdapter,
  // transformCssVars,
  // transformTwPrefixes,
]

const project = new Project({
  compilerOptions: {},
})

async function createTempSourceFile(filename: string) {
  const dir = await fs.mkdtemp(path.join(tmpdir(), "styledcn-"))
  return path.join(dir, filename)
}

export async function transform(opts: TransformOpts) {
  const tempFile = await createTempSourceFile(opts.filename)
  const sourceFile = project.createSourceFile(tempFile, opts.raw, {
    scriptKind: ScriptKind.TSX,
  })

  for (const transformer of transformers) {
    transformer({ sourceFile, ...opts })
  }

  return await transformJsx({
    sourceFile,
    ...opts,
  })
}
