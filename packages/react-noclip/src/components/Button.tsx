import { Slot as SlotBase } from "@radix-ui/react-slot";
import { cva, cx, type VariantProps } from "cva";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import * as React from "react";

export type ButtonVariantProps = VariantProps<typeof variants>;
const variants = cva({
  variants: {
    variant: {
      base: "base",
      "back-button": "back-button",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonVariantProps & {
    asChild?: boolean;
  };

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, asChild = false, variant, ...props }, ref) => {
    const Comp = asChild ? Slot : Container;
    return (
      <Comp
        ref={ref}
        className={cx(className, variants({ variant }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

const styles = css`
  font-family: inherit;
  background: none;
  border: 0;
  color: var(--gray11);
  cursor: pointer;
  border-radius: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  &[aria-expanded="true"],
  &:hover {
    background: var(--gray4);
  }

  &.base {
    padding: 0 4px 0 8px;
    font-weight: 500;
    font-size: 12px;
    height: 28px;
    letter-spacing: -0.25px;
    gap: 2px;
  }

  &.back-button {
    width: 40px;
    height: 40px;
    &:hover {
      background: var(--gray2);
      color: black;
      border-radius: 8px;
    }
    svg {
      display: block;
    }
  }
`;

const Container = styled.button`
  ${styles}
`;
const Slot = styled(SlotBase)`
  ${styles}
`;

export { Button };
