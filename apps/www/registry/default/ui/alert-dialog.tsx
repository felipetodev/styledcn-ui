"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"
import styled from "styled-components"

import { cn } from "@/lib/utils"
import { buttonCssStyles, buttonVariants } from "@/registry/default/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

const StyledAlertDialogOverlay = styled(AlertDialogPrimitive.Overlay)`
  position: fixed;
  inset: 0;
  z-index: 50;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(1.5px);

  &[data-state="open"] {
    animation: fadeIn 0.2s;
  }

  &[data-state="closed"] {
    animation: fadeOut 0.2s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`

const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <StyledAlertDialogOverlay
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

const StyledAlertDialogContent = styled(AlertDialogPrimitive.Content)`
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 50;
  display: grid;
  width: 100%;
  max-width: 512px;
  transform: translate(-50%, -50%);
  gap: 1rem;
  border-radius: var(--radius);
  background-color: hsl(var(--background));
  padding: 1.5rem;
  box-shadow: var(--shadow-lg);
  transition: transform 0.2s, opacity 0.2s;
  opacity: 0;
  border-width: 1px;
  border-style: solid;
  border-color: hsl(var(--border));

  &[data-state="open"] {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  &[data-state="closed"] {
    transform: translate(-50%, -50%) scale(0.95);
    opacity: 0;
  }

  &[data-state="open"] {
    animation: zoomIn 0.2s;
  }

  &[data-state="closed"] {
    animation: zoomOut 0.2s;
  }

  @keyframes zoomIn {
    from {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0;
    }
    to {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }

  @keyframes zoomOut {
    from {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0;
    }
  }
`

const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <StyledAlertDialogContent
      ref={ref}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

const StyledAlertDialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  & > *:not(:first-child) {
    margin-top: 0.5rem;
  }

  @media (min-width: 640px) {
    text-align: left;
  }
`

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledAlertDialogHeader
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const StyledAlertDialogFooter = styled.div`
  display: flex;
  flex-direction: column-reverse;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: flex-end;
    & > *:not(:first-child) {
      margin-left: 0.5rem;
    }
  }
`

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledAlertDialogFooter
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const StyledAlertDialogTitle = styled(AlertDialogPrimitive.Title)`
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -.025em;
`

const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <StyledAlertDialogTitle
    ref={ref}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

const StyledAlertDialogDescription = styled(AlertDialogPrimitive.Description)`
  --text-sm: 0.875rem;
  font-size: var(--text-sm);
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`

const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <StyledAlertDialogDescription
    ref={ref}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

const StyledAlertDialogAction = styled(AlertDialogPrimitive.Action)`
  ${buttonCssStyles}
`

const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <StyledAlertDialogAction
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

const StyledAlertDialogCancel = styled(AlertDialogPrimitive.Cancel)`
  ${buttonCssStyles}
`

const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <StyledAlertDialogCancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
