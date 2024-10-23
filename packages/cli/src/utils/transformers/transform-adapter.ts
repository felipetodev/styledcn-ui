import { Transformer } from "@/src/utils/transformers"

const CSS_FRAMEWORK_DEPENDENCY = {
  "styled-components": "styled-components",
  "emotion": "@emotion/styled",
  "pandacss": "@pandacss/dev",
}

export const transformAdapter: Transformer = async ({ sourceFile, config }) => {
  if (!config.library.integration) {
    return sourceFile
  }

  // Delete existing adapter import
  sourceFile.getImportDeclaration((node) => {
    const moduleSpecifier = node.getModuleSpecifierValue()

    return Object.entries(CSS_FRAMEWORK_DEPENDENCY).some(([_, adapter]) => {
      return moduleSpecifier === adapter
    })
  })?.remove()

  // Add actual adapter import from components.json
  sourceFile.addImportDeclaration({
    moduleSpecifier: CSS_FRAMEWORK_DEPENDENCY[
      config.library.integration as keyof typeof CSS_FRAMEWORK_DEPENDENCY
    ],
    ...config.library.integration === "pandacss"
      ? { namedImports: ["styled"] }
      : { defaultImport: "styled" }
  })

  return sourceFile
}
