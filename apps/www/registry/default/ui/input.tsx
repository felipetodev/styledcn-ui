import * as React from "react"
import styled from "styled-components"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const StyledInput = styled.input`
  --text-sm: 0.875rem;
  display: flex;
  height: 2.5rem;
  width: 100%;
  border-radius: var(--radius);
  border-width: 1px;
  border-style: solid;
  border-color: hsl(var(--input));
  background-color: hsl(var(--background));
  padding: 0.5rem 0.75rem;
  font-size: var(--text-sm);
  outline: 2px solid transparent;
  outline-offset: 2px;

  &::placeholder {
    color: hsl(var(--muted-foreground));
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  &:focus-visible {
    outline: 2px solid hsl(var(--ring));
    outline-offset: 2px;
  }
`

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <StyledInput
        type={type}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
