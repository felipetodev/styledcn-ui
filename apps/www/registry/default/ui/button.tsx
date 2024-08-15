"use client"
import * as React from "react"
import styled, { css } from "styled-components"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "styledcn/button",
  {
    variants: {
      variant: {
        default: "primary",
        secondary: "secondary",
        destructive: "destructive",
        outline: "outline",
      },
      size: {
        small: "small",
        default: "medium",
      },
    },
    compoundVariants: [
      { variant: "default", size: "default", className: "button-primary--default" },
      { variant: "secondary", size: "default", className: "button-secondary--default" },
      { variant: "destructive", size: "default", className: "button-destructive--default" },
      { variant: "outline", size: "default", className: "button-outline--default" },
      { variant: "default", size: "small", className: "button-primary--small" },
      { variant: "secondary", size: "small", className: "button-secondary--small" },
      { variant: "destructive", size: "small", className: "button-destructive--small" },
      { variant: "outline", size: "small", className: "button-outline--small" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

const buttonCssStyles = css`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  font-family: inherit;
  cursor: pointer;
  outline: none;
  border: none;
  white-space: nowrap;
  font-weight: 500;
  font-size: 14px;

  &:focus-visible {
    outline: none;
  }
  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  transition: background-color 0.2s;
  border-radius: var(--radius);
  padding: 0.5rem 1rem;
  height: 2.5rem;

  &.small {
    padding: 0.25rem 0.5rem;
    height: 2rem;
  }

  &.outline {
    border: 1px solid hsl(var(--input));
  }
`

const StyledButton = styled.button`
  ${buttonCssStyles}
`

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <StyledButton
        type="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, StyledButton, buttonCssStyles, buttonVariants }
