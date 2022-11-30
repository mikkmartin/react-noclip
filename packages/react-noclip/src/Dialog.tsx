import styled from "@emotion/styled";
import { FC } from "react";
import {
  Root,
  Content,
  DialogProps,
  PortalProps,
} from "@radix-ui/react-dialog";
import FocusTrap from "focus-trap-react";

export const Dialog: FC<
  DialogProps & PortalProps & { onUnmount: Function }
> = ({ children, open, onUnmount }) => {
  return (
    <Root open={open}>
      <FocusTrap
        active={open}
        focusTrapOptions={{
          escapeDeactivates: false,
        }}
      >
        <Container
          onEscapeKeyDown={() => onUnmount()}
          onOpenAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={() => onUnmount()}
        >
          {children}
        </Container>
      </FocusTrap>
    </Root>
  );
};

const Container = styled(Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--gray11);
`;
