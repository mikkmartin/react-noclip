import styled from "@emotion/styled";
import * as Popover from "@radix-ui/react-popover";
import { Command as CommandBase } from "cmdk";
import * as React from "react";
import { styleVars } from "./styles";

type OnSubmit = (value: Object) => void;

type Form = {
  [key: string]: "text-area" | "text-input" | OnSubmit | undefined;
  onSubmit?: OnSubmit;
};

export type Content = {
  [key: string]: Function | Form;
};

type ModalProps = {
  content: Content;
  [key: string]: any;
};

function FormView({ form, onBack }: { form: Form; onBack?: Function }) {
  const formRef = React.useRef<HTMLFormElement>(null);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && e.metaKey) {
      e.preventDefault();
      if (!formRef.current) return;
      const formData = new FormData(formRef.current);
      const values = Object.keys(form).reduce((acc, key) => {
        if (typeof form[key] === "function") return acc;
        return { ...acc, [key]: formData.get(key) };
      }, {});
      if (form.onSubmit) form.onSubmit(values);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!formRef.current) return;
    const input = formRef.current.querySelector("input");
    if (input) input.focus();
  }, []);

  return (
    <>
      <BackHeader onClick={() => onBack && onBack()} />
      <FormContainer ref={formRef}>
        {Object.keys(form).map((key) => {
          if (form[key] === "text-area") {
            return (
              <React.Fragment key={key}>
                <label>{key}</label>
                <textarea name={key} />
                <div />
              </React.Fragment>
            );
          }
          if (form[key] === "text-input") {
            return (
              <React.Fragment key={key}>
                <label>{key}</label>
                <input name={key} />
                <div />
              </React.Fragment>
            );
          }
          return null;
        })}
      </FormContainer>
    </>
  );
}

const FormContainer = styled.form`
  display: grid;
  padding: 2rem;
  gap: 0.5rem;
  column-gap: 1rem;
  grid-template-columns: 1fr 2fr 1fr;
  place-content: center;
  height: min(330px, calc(var(--cmdk-list-height) + 16px));
  label {
    margin-left: auto;
    font-size: 12px;
    color: var(--gray11);
    line-height: 32px;
    letter-spacing: 0.5px;
    &::first-letter {
      text-transform: uppercase;
    }
  }
  input,
  textarea {
    border: 1px solid var(--gray9);
    min-height: 32px;
    border-radius: 4px;
    padding: 8px;
  }
  textarea {
    min-height: 100px;
    resize: none;
    font-family: inherit;
  }
`;

function BackHeader({ onClick }: any) {
  return (
    <StyledBackHeader>
      <button onClick={onClick}>
        <IconChevron />
      </button>
    </StyledBackHeader>
  );
}

const StyledBackHeader = styled.div`
  height: 54px;
  display: flex;
  border-bottom: 1px solid var(--gray6);
  padding-left: 8px;
`;

function IconChevron({ direction }: { direction?: "left" | "right" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      style={{
        transform: direction === "left" ? "rotate(180deg)" : undefined,
      }}
    >
      <path d="M15 18L9 12 15 6"></path>
    </svg>
  );
}

export function Noclip({ content, onUnmount }: ModalProps) {
  const firstValue = formatValue(Object.keys(content)[0]);
  const [value, setValue] = React.useState(firstValue);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef(null);
  const [pages, setPages] = React.useState<string[]>([]);
  const isHome = pages.length === 0;

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  function formatValue(value: string) {
    return value.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`);
  }

  const renderContent = () =>
    Object.keys(content).map((key) => {
      const value = formatValue(key);
      const action: Function =
        typeof content[key] === "function"
          ? (content[key] as Function)
          : () => setPages([...pages, key]);
      return (
        <Item key={key} value={value} onSelect={() => action()}>
          <span>{value}</span>
          <span className="accessory">
            {typeof content[key] === "function" ? "action" : "form"}
          </span>
        </Item>
      );
    });

  return (
    <Dialog open={true} onOpenChange={(state) => !state && onUnmount()}>
      <Command value={value} onValueChange={setValue}>
        {isHome && (
          <Input ref={inputRef} autoFocus placeholder="Type a command..." />
        )}
        {isHome && (
          <List ref={listRef}>
            <Empty>No results found.</Empty>
            {renderContent()}
          </List>
        )}
        {!isHome && (
          <FormView
            form={content[pages[0]] as Form}
            onBack={() => setPages(pages.slice(0, -1))}
          />
        )}

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
  all: revert;
  * {
    all: revert;
  }
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

  button {
    font-family: inherit;
    background: none;
    border: 0;
    color: var(--gray11);
    cursor: pointer;
  }

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
  padding: 4px 8px;
  border-top: 1px solid var(--gray6);
  border-radius: 0 0 12px 12px;
  button {
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
    &::first-letter {
      text-transform: uppercase;
    }
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
  display: flex;
  justify-content: space-between;

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

  span:first-of-type:first-letter {
    text-transform: uppercase;
  }

  span:last-of-type {
    color: var(--gray9);
  }

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
        sideOffset={14}
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
  border-radius: 8px;
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
