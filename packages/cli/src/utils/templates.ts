export const UTILS = `import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}
`

export const UTILS_JS = `import { clsx } from "clsx"

export function cn(...inputs) {
  return clsx(inputs)
}
`
