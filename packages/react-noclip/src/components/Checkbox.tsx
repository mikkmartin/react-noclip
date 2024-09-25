import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check } from "lucide-react";
import styled from "@emotion/styled";

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <Root ref={ref} {...props}>
    <CheckboxPrimitive.Indicator className="indicator">
      <Check />
    </CheckboxPrimitive.Indicator>
  </Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

const Root = styled(CheckboxPrimitive.Root)`
  height: 1rem;
  width: 1rem;
  flex-shrink: 0;
  border-radius: 0.125rem;
  border: 1px solid black;
  margin-top: auto;
  margin-bottom: auto;
  padding: 0;

  &:focus-visible {
    outline-offset: 1px;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  &[data-state="checked"] {
    background-color: black;
    color: white;
  }

  .indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: currentColor;
    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;

export { Checkbox };
