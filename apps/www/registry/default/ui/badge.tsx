"use client"
import * as React from "react"
import styled from "styled-components"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "styledcn/badge",
  {
    variants: {
      variant: {
        primary: "primary",
        secondary: "secondary",
        destructive: "destructive",
      },
    },
    compoundVariants: [
      { variant: "primary", className: "badge-primary--default" },
      { variant: "secondary", className: "badge-secondary--default" },
      { variant: "destructive", className: "badge-destructive--default" },
    ],
    defaultVariants: {
      variant: "primary",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof badgeVariants> { }

const StyledBadge = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  padding: 5px 10px;
  font-size: 12px;
  transition: background-color 0.2s;
  border-radius: 9999px;

  &:focus-visible {
    outline: none;
  }
  &:disabled {
    pointer-events: none;
  }
`

const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return (
    <StyledBadge
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}


export { Badge, StyledBadge, badgeVariants }
