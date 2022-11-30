import styled from "@emotion/styled";
import { FC } from "react";
import { Root, Content, DialogProps } from "@radix-ui/react-dialog";

export const Dialog: FC<DialogProps & { onUnmount: Function }> = ({
  children,
  open,
  onUnmount,
}) => {
  return (
    <Root open={open}>
      <Container
        onEscapeKeyDown={() => onUnmount()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={() => onUnmount()}
      >
        {children}
      </Container>
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
