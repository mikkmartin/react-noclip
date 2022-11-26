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
          <Group heading="Suggestions">
            <Item value="Linear">Linear</Item>
            <Item value="Figma">Figma</Item>
            <Item value="Slack">Slack</Item>
            <Item value="YouTube">YouTube</Item>
            <Item value="Raycast">Raycast</Item>
          </Group>
          <Group heading="Commands">
            <Item isCommand value="Clipboard History">
              Clipboard History
            </Item>
            <Item isCommand value="Import Extension">
              <HammerIcon />
              Import Extension
            </Item>
            <Item isCommand value="Manage Extensions">
              <HammerIcon />
              Manage Extensions
            </Item>
          </Group>
        </List>

        <Footer>
          <button cmdk-raycast-open-trigger="">
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
`;

const Group = styled(CommandBase.Group)``;

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
  height: min(330px, calc(var(--cmdk-list-height)));
  padding: 0 8px 8px;
  max-height: 400px;
  overflow: auto;
  overscroll-behavior: contain;
  transition: 100ms ease;
  transition-property: height;
`;

function Item({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
  isCommand?: boolean;
}) {
  return (
    <StyledItem value={value} onSelect={() => {}}>
      {children}
      <span>Command</span>
    </StyledItem>
  );
}

const StyledItem = styled(CommandBase.Item)`
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

  & + [cmdk-item] {
    margin-top: 4px;
  }

  svg {
    width: 18px;
    height: 18px;
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
        className="raycast-submenu"
        sideOffset={16}
        alignOffset={0}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          inputRef?.current?.focus();
        }}
      >
        <Command>
          <CommandBase.List>
            <Group heading={selectedValue}>
              <SubItem shortcut="↵">Run action</SubItem>
              <SubItem>Assign shortcut</SubItem>
            </Group>
          </CommandBase.List>
          <CommandBase.Input placeholder="Search for actions..." />
        </Command>
      </Popover.Content>
    </Popover.Root>
  );
}

function SubItem({
  children,
  shortcut,
}: {
  children: React.ReactNode;
  shortcut?: string;
}) {
  return (
    <CommandBase.Item>
      {children}
      <div cmdk-raycast-submenu-shortcuts="">
        {shortcut &&
          shortcut.split(" ").map((key) => {
            return <kbd key={key}>{key}</kbd>;
          })}
      </div>
    </CommandBase.Item>
  );
}

function HammerIcon() {
  return (
    <div cmdk-raycast-hammer-icon="">
      <svg
        width="32"
        height="32"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6.73762 6.19288L2.0488 11.2217C1.6504 11.649 1.6504 12.3418 2.0488 12.769L3.13083 13.9295C3.52923 14.3568 4.17515 14.3568 4.57355 13.9295L9.26238 8.90071M6.73762 6.19288L7.0983 5.80605C7.4967 5.37877 7.4967 4.686 7.0983 4.25872L6.01627 3.09822L6.37694 2.71139C7.57213 1.42954 9.50991 1.42954 10.7051 2.71139L13.9512 6.19288C14.3496 6.62017 14.3496 7.31293 13.9512 7.74021L12.8692 8.90071C12.4708 9.328 11.8248 9.328 11.4265 8.90071L11.0658 8.51388C10.6674 8.0866 10.0215 8.0866 9.62306 8.51388L9.26238 8.90071M6.73762 6.19288L9.26238 8.90071"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
