import styled from "@emotion/styled";
import * as React from "react";

export interface ButtonProps {
  children: React.ReactNode;
}

export function Button(props: ButtonProps) {
  return <Container>{props.children}</Container>;
}

const Container = styled.button`
  background: pink;
`;
