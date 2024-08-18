"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import { cva } from "class-variance-authority";
import styled from "styled-components"

import { cn } from "@/lib/utils"

const StyledScrollAreaRoot = styled(ScrollAreaPrimitive.Root)`
  position: relative;
  overflow: hidden;
`

const StyledScrollAreaViewport = styled(ScrollAreaPrimitive.Viewport)`
  width: 100%;
  height: 100%;
  border-radius: inherit;
`

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <StyledScrollAreaRoot
    ref={ref}
    {...props}
  >
    <StyledScrollAreaViewport>
      {children}
    </StyledScrollAreaViewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </StyledScrollAreaRoot>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

const scrollBarVariants = cva("styledcn/scroll", {
  variants: {
    variant: {
      vertical: "vertical",
      horizontal: "horizontal",
    },
  },
  compoundVariants: [
    { variant: "vertical", className: "scroll-vertical" },
    { variant: "horizontal", className: "scroll-horizontal" },
  ],
  defaultVariants: {
    variant: "vertical",
  },
})

const StyledScrollAreaScrollbar = styled(ScrollAreaPrimitive.ScrollAreaScrollbar)`
  display: flex;
  touch-action: none;
  user-select: none;
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;

  &.scroll-vertical {
    height: 100%;
    width: 0.75rem;
    padding: 1px;
    border-left-width: 1px;
    border-style: solid;
    border-color: transparent;
  }

  &.scroll-horizontal {
    width: 100%;
    height: 0.75rem;
    padding: 1px;
    border-top-width: 1px;
    border-style: solid;
    border-color: transparent;
  }
`

const StyledScrollAreaThumb = styled(ScrollAreaPrimitive.ScrollAreaThumb)`
  position: relative;
  flex: 1;
  border-radius: 9999px;
  background-color: hsl(var(--border));
`

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <StyledScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(scrollBarVariants({ variant: orientation }), className)}
    {...props}
  >
    <StyledScrollAreaThumb />
  </StyledScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

export { ScrollArea, ScrollBar }
