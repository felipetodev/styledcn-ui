#!/usr/bin/env node
import { Command } from "commander"
import { init } from "@/src/commands/init"

process.on("SIGINT", () => process.exit(0))
process.on("SIGTERM", () => process.exit(0))

async function main() {
  const program = new Command()
    .name("styledcn-ui")
    .description("add components and dependencies to your project")
    .version(
      "1.0.0",
      "-v, --version",
      "display the version number"
    )

  program.addCommand(init)

  program.parse()
}

main()
