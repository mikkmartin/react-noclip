import styled from "@emotion/styled";
import * as Popover from "@radix-ui/react-popover";
import { Command as CommandBase } from "cmdk";
import * as React from "react";
import { styleVars } from "./styles";

export type Content = {
  [key: string]: Function;
};
type ModalProps = {
  content: Content;
  [key: string]: any;
};

export function Noclip({ content, onUnmount }: ModalProps) {
  const [value, setValue] = React.useState("linear");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef(null);

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  return (
    <Dialog open={true} onOpenChange={(state) => !state && onUnmount()}>
      <Command value={value} onValueChange={(v) => setValue(v)}>
        <div cmdk-raycast-top-shine="" />
        <Input ref={inputRef} autoFocus placeholder="Type a command..." />
        <List ref={listRef}>
          <Empty>No results found.</Empty>
          <Item value="Linear">Linear</Item>
          <Item value="Figma">Figma</Item>
          <Item value="Slack">Slack</Item>
          <Item value="YouTube">YouTube</Item>
          <Item value="Raycast">Raycast</Item>
        </List>

        <Footer>
          <button>
            Run action
            <kbd>↵</kbd>
          </button>
          <SubCommand
            listRef={listRef}
            selectedValue={value}
            inputRef={inputRef}
          />
        </Footer>
      </Command>
    </Dialog>
  );
}

const Dialog = styled(CommandBase.Dialog)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Command = styled(CommandBase)`
  ${styleVars};
  width: 640px;
  max-width: 100%;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  font-family: var(--font-sans);
  box-shadow: var(--cmdk-shadow);
  transition: transform 100ms ease;

  kbd {
    font-family: var(--font-sans);
    background: rgba(0, 0, 0, 0.065);
    color: var(--gray11);
    height: 20px;
    width: 20px;
    border-radius: 4px;
    padding: 0 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:first-of-type {
      margin-left: 4px;
    }
  }
`;

const Input = styled(CommandBase.Input)`
  font-family: var(--font-sans);
  border: none;
  width: 100%;
  font-size: 17px;
  padding: 16px;
  outline: none;
  background: var(--bg);
  color: var(--gray12);
  border-bottom: 1px solid var(--gray6);
  border-radius: 0;

  &::placeholder {
    color: var(--gray9);
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  background: var(--gray1);
  padding: 8px;
  border-top: 1px solid var(--gray6);
  border-radius: 0 0 12px 12px;
  button {
    font-family: inherit;
    background: none;
    border: 0;
    color: var(--gray11);
    cursor: pointer;

    padding: 0 4px 0 8px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
    height: 28px;
    letter-spacing: -0.25px;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2px;

    &[aria-expanded="true"],
    &:hover {
      background: var(--gray4);
    }
  }
`;

const Group = styled(CommandBase.Group)`
  [cmdk-group-heading] {
    user-select: none;
    font-size: 12px;
    color: var(--gray11);
    padding: 8px 4px;
    padding-top: 4px;
  }
`;

const Empty = styled(CommandBase.Empty)`
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  white-space: pre-wrap;
  color: var(--gray11);
`;

const List = styled(CommandBase.List)`
  height: min(330px, calc(var(--cmdk-list-height) + 16px));
  padding: 8px;
  max-height: 400px;
  overflow: auto;
  overscroll-behavior: contain;
  transition: 100ms ease;
  transition-property: height;
`;

const Item = styled(CommandBase.Item)`
  content-visibility: auto;

  cursor: pointer;
  height: 48px;
  border-radius: 8px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  color: var(--gray11);
  user-select: none;
  will-change: background, color;
  transition: all 150ms ease;
  transition-property: none;

  &[aria-selected="true"] {
    background: var(--grayA3);
    color: var(--gray12);
  }

  &[aria-disabled="true"] {
    color: var(--gray8);
    cursor: not-allowed;
  }

  &:active {
    transition-property: background;
    background: var(--gray4);
  }
`;

function SubCommand({
  inputRef,
  listRef,
  selectedValue,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLElement>;
  selectedValue: string;
}) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    function listener(e: KeyboardEvent) {
      if (e.key === "k" && e.metaKey) {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
      }
    }

    document.addEventListener("keydown", listener);

    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, []);

  React.useEffect(() => {
    const el = listRef.current;

    if (!el) return;

    if (open) {
      el.style.overflow = "hidden";
    } else {
      el.style.overflow = "";
    }
  }, [open, listRef]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen} modal>
      <Popover.Trigger
        cmdk-raycast-subcommand-trigger=""
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        Actions
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </Popover.Trigger>
      <Popover.Content
        side="top"
        align="end"
        sideOffset={16}
        alignOffset={0}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          inputRef?.current?.focus();
        }}
      >
        <SubCommandContainer>
          <List>
            <Group heading={selectedValue}>
              <SubItem>Run action</SubItem>
              <SubItem>Assign shortcut</SubItem>
            </Group>
          </List>
          <SubInput placeholder="Search for actions..." />
        </SubCommandContainer>
      </Popover.Content>
    </Popover.Root>
  );
}

const SubCommandContainer = styled(Command)`
  width: 320px;
  box-shadow: none;
  border: 1px solid var(--gray6);
  background-color: var(--gray1);
`;

const SubItem = styled(Item)`
  height: 32px;
  padding: 0 10px;
  font-size: 13px;
`;

const SubInput = styled(Input)`
  padding: 12px;
  border-top: 1px solid var(--gray6);
  border-bottom: none;
  font-size: 13px;
`;
