"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import styled from "styled-components"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const StyledDialogOverlay = styled(DialogPrimitive.Overlay)`
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

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <StyledDialogOverlay
    ref={ref}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const StyledDialogContent = styled(DialogPrimitive.Content)`
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

const StyledDialogClose = styled(DialogPrimitive.Close)`
  cursor: pointer;
  background-color: transparent;
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: calc(var(--radius) - 4px);
  opacity: 0.7;
  outline: none;
  border: none;
  transition-property: opacity;
  transition-timing-function: cubic-bezier(.4,0,.2,1);
  transition-duration: .15s;
  color: inherit;

  &:hover {
    opacity: 1;
  }

  &:focus {
    box-shadow: 0 0 0 2px hsl(var(--focus-ring));
  }
`

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <StyledDialogContent
      ref={ref}
      {...props}
    >
      {children}
      <StyledDialogClose>
        <svg aria-label="close-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
        <span className="sr-only">Close</span>
      </StyledDialogClose>
    </StyledDialogContent>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const StyledDialogHeader = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  & > *:not(:first-child) {
    margin-top: 0.375rem;
  }

  @media (min-width: 640px) {
    text-align: left;
  }
`

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledDialogHeader
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const StyledDialogTitle = styled(DialogPrimitive.Title)`
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: -.025em;
  line-height: 1;
`

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <StyledDialogTitle
    ref={ref}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const StyledDialogDescription = styled(DialogPrimitive.Description)`
  font-size: .875rem;
  line-height: 1.25rem;
  color: hsl(var(--muted-foreground));
`

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <StyledDialogDescription
    ref={ref}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

const StyledDialogFooter = styled.div`
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

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <StyledDialogFooter
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
}
