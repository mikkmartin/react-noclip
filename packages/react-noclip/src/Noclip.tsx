import { css } from "@emotion/react";
import styled from "@emotion/styled";
import * as Dialog from "@radix-ui/react-dialog";
import * as Popover from "@radix-ui/react-popover";
import { Command as CommandBase } from "cmdk";
import * as React from "react";
import { useNoclipContext } from "./NoclipContext";
import { styleVars } from "./styles";
import { useAttributeChange } from "./utils/useAttributeChange";
import usePrevious from "./utils/usePrevious";

type OnSubmit = (value: { [key: string]: string }) => void;

type Form = {
  [key: string]: "text-area" | "text-input" | OnSubmit | undefined;
  onSubmit?: OnSubmit;
};

export type Content = {
  [key: string]: Function | Form;
};

type ModalProps = {
  content: Content;
};

function FormView({ form, onBack }: { form: Form; onBack: Function }) {
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
      if (form.onSubmit) {
        form.onSubmit(values);
        onBack();
      }
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
    <Dialog.Root
      defaultOpen
      onOpenChange={(state) => !state && onBack()}
      modal={false}
    >
      <Dialog.Content
        asChild
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(ev) => ev.preventDefault()}
      >
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
      </Dialog.Content>
    </Dialog.Root>
  );
}

const FormContainer = styled.form`
  display: grid;
  padding: 2rem;
  gap: 0.5rem;
  column-gap: 1rem;
  grid-template-columns: 1fr 2fr 1fr;
  place-content: center;
  //height: min(330px, calc(var(--cmdk-list-height) + 16px));
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

function BackHeader({ onClick, title }: any) {
  return (
    <StyledBackHeader>
      <button onClick={onClick}>
        <IconChevron />
      </button>
      <span>{title}</span>
    </StyledBackHeader>
  );
}

const StyledBackHeader = styled.div`
  height: 54px;
  display: flex;
  border-bottom: 1px solid var(--gray6);
  padding-left: 8px;
  align-items: center;
  gap: 4px;
  button {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background: var(--gray2);
      color: black;
      border-radius: 8px;
    }
    svg {
      display: block;
    }
  }
  span {
    color: var(--gray11);
    margin-bottom: 1px;
    &::first-letter {
      text-transform: uppercase;
    }
  }
`;

function IconChevron() {
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
    >
      <path d="M15 18L9 12 15 6"></path>
    </svg>
  );
}

type SubCommands = {
  title: string;
  actions: {
    [key: string]: () => void;
  };
};

function formatValue(value: string) {
  return value.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`);
}

const Item = React.forwardRef<
  HTMLDivElement | undefined,
  { onActive?: (state: string | null) => void } & React.ComponentProps<
    typeof ItemBase
  >
>(({ onActive, ...props }, ref) => {
  const _ref = React.useRef<HTMLDivElement>(null);
  if (ref) ref = _ref;
  useAttributeChange({ ref: _ref, attribute: "aria-selected" }, onActive);
  return <ItemBase {...props} ref={_ref} />;
});

export function Noclip({ content }: ModalProps) {
  const firstValue = formatValue(Object.keys(content)[0]);
  const [value, setValue] = React.useState(firstValue);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const container = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef(null);
  const [pages, setPages] = React.useState<string[]>([]);
  const isHome = pages.length === 0;

  const [title, setTitle] = React.useState<string>();
  const [subCommands, setSubCommands] = React.useState<SubCommands>();
  const { shortcuts } = useNoclipContext();

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

  const renderContent = () =>
    Object.keys(content).map((key) => {
      const value = formatValue(key);
      const action: Function =
        typeof content[key] === "function"
          ? (content[key] as Function)
          : () => setPages([...pages, key]);

      return (
        <Item
          key={key}
          value={value}
          onActive={(active) => {
            if (active !== "true") return;
            setSubCommands({
              title: key,
              actions: {
                runAction: () => action(),
              },
            });
          }}
          onSelect={() => {
            setTitle(value);
            action();
          }}
        >
          <span>{value}</span>
          {shortcuts && shortcuts[key] && (
            <KeyGroup>
              {shortcuts[key].split("").map((key) => (
                <kbd>{key}</kbd>
              ))}
            </KeyGroup>
          )}
          <span>{typeof content[key] === "function" ? "action" : "form"}</span>
        </Item>
      );
    });

  function bounce() {
    if (!container.current) return;
    container.current.style.transform = "scale(0.96)";
    setTimeout(() => {
      if (container.current) {
        container.current.style.transform = "";
      }
    }, 100);
  }

  return (
    <Command
      value={value}
      ref={container}
      onValueChange={setValue}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter") bounce();
      }}
    >
      {isHome && (
        <Input ref={inputRef} autoFocus placeholder="Type a command..." />
      )}
      {!isHome && (
        <BackHeader
          onClick={() => setPages(pages.slice(0, -1))}
          title={title}
        />
      )}
      <List ref={listRef}>
        {isHome && (
          <>
            <Empty>No results found.</Empty>
            {renderContent()}
          </>
        )}
        {!isHome && (
          <>
            <FormView
              form={content[pages[0]] as Form}
              onBack={() => setPages(pages.slice(0, -1))}
            />
          </>
        )}
      </List>

      <Footer>
        <button>
          {pages.length === 0 ? "Run action" : "Submit form"}
          {pages.length === 0 ? (
            <kbd>↵</kbd>
          ) : (
            <>
              <kbd>⌘</kbd>
              <kbd>↵</kbd>
            </>
          )}
        </button>
        {subCommands && (
          <SubCommand
            listRef={listRef}
            inputRef={inputRef}
            commands={subCommands}
          />
        )}
      </Footer>
    </Command>
  );
}

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
    text-transform: uppercase;

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

const ItemBase = styled(CommandBase.Item)`
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

  span:nth-child(2) {
    color: var(--gray9);
  }

  span ~ *:last-child {
    margin-left: auto;
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
  commands,
}: {
  inputRef: React.RefObject<HTMLInputElement>;
  listRef: React.RefObject<HTMLElement>;
  commands: SubCommands;
}) {
  const [open, setOpen] = React.useState(false);
  const [assigningShortucts, setAssigningShortuts] = React.useState(false);
  const [shortcutKeys, setShortcutKeys] = React.useState("");
  const assignedShortcuts = usePrevious(assigningShortucts);
  const blink = React.useMemo(
    () => assignedShortcuts && !assigningShortucts,
    [assigningShortucts]
  );

  const { shortcuts, setShortcuts } = useNoclipContext();
  const shortcut = shortcuts?.[commands.title];

  React.useEffect(() => {
    if (shortcut) setShortcutKeys(shortcut);
    else setShortcutKeys("");
  }, [shortcut]);

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
    if (open) el.style.overflow = "hidden";
    else el.style.overflow = "";
  }, [open, listRef]);

  React.useEffect(() => {
    if (!assigningShortucts) return;

    function hasModifierKey() {
      switch (true) {
        case shortcutKeys.includes("⌘"):
        case shortcutKeys.includes("⌥"):
        case shortcutKeys.includes("⇧"):
        case shortcutKeys.includes("⌃"):
          return true;
        default:
          return false;
      }
    }

    function listener(e: KeyboardEvent) {
      switch (e.key) {
        case "Escape":
          setShortcutKeys("");
          setAssigningShortuts(false);
          break;
        case "Meta":
          setShortcutKeys((s) => s + "⌘");
          break;
        case "Alt":
          setShortcutKeys((s) => s + "⌥");
          break;
        case "Shift":
          setShortcutKeys((s) => s + "⇧");
          break;
        case "Control":
          setShortcutKeys((s) => s + "⌃");
          break;
      }
      if (hasModifierKey() && e.key.length === 1) {
        setShortcutKeys((s) => {
          const shortcut = s + e.key;
          setShortcuts({ ...shortcuts, [commands.title]: shortcut });
          return shortcut;
        });
        setAssigningShortuts(false);
      }
    }

    function upListener(e: KeyboardEvent) {
      if (e.key === "Meta") setShortcutKeys((s) => s.replace("⌘", ""));
      if (e.key === "Alt") setShortcutKeys((s) => s.replace("⌥", ""));
      if (e.key === "Shift") setShortcutKeys((s) => s.replace("⇧", ""));
      if (e.key === "Control") setShortcutKeys((s) => s.replace("⌃", ""));
    }

    document.addEventListener("keydown", listener);
    document.addEventListener("keyup", upListener);
    return () => {
      document.removeEventListener("keydown", listener);
      document.removeEventListener("keyup", upListener);
    };
  }, [assigningShortucts, shortcutKeys]);

  function removeShortcut() {
    const newShortcuts = { ...shortcuts };
    delete newShortcuts[commands.title];
    setShortcuts(newShortcuts);
    setShortcutKeys("");
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (assigningShortucts) e.preventDefault();
  }

  const actions = {
    ...commands.actions,
    assignShortcut: () => {},
  };

  return (
    <Popover.Root open={open} modal>
      <Popover.Trigger onClick={() => setOpen(true)} aria-expanded={open}>
        Actions
        <kbd>⌘</kbd>
        <kbd>K</kbd>
      </Popover.Trigger>
      <Popover.Content
        side="top"
        align="end"
        sideOffset={14}
        alignOffset={0}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          inputRef?.current?.focus();
        }}
        onEscapeKeyDown={() => {
          if (assigningShortucts) return;
          setOpen(false);
        }}
      >
        <SubCommandContainer>
          <List>
            <Group heading={commands?.title || ""}>
              {Object.keys(actions).map((key) => {
                if (key === "assignShortcut") {
                  return (
                    <SubItem
                      key={key}
                      value={key}
                      onSelect={() => {
                        if (!shortcutKeys) setAssigningShortuts(true);
                        else removeShortcut();
                      }}
                    >
                      {assigningShortucts ? (
                        <>
                          <span>Recoding keys...</span>
                          {shortcutKeys.length ? (
                            <KeyGroup>
                              {shortcutKeys.split("").map((key) => (
                                <kbd key={key}>{key}</kbd>
                              ))}
                            </KeyGroup>
                          ) : (
                            <KeyGroup dimmed>
                              eg. <kbd>⌘</kbd>
                              <kbd>⇧</kbd>
                              <kbd>E</kbd>
                            </KeyGroup>
                          )}
                        </>
                      ) : (
                        <>
                          <span>
                            {shortcutKeys
                              ? "Remove shortcut"
                              : formatValue(key)}
                          </span>
                          {shortcutKeys && (
                            <KeyGroup blink={blink}>
                              {shortcutKeys.split("").map((key) => (
                                <kbd key={key}>{key}</kbd>
                              ))}
                            </KeyGroup>
                          )}
                        </>
                      )}
                    </SubItem>
                  );
                }
                return (
                  <SubItem
                    key={key}
                    onSelect={() => {
                      //@ts-ignore
                      actions[key]();
                      setOpen(false);
                    }}
                  >
                    <span>{formatValue(key)}</span>
                  </SubItem>
                );
              })}
            </Group>
          </List>
          <SubInput
            autoFocus
            onKeyDown={handleInputKeyDown}
            placeholder="Search for actions..."
          />
        </SubCommandContainer>
      </Popover.Content>
    </Popover.Root>
  );
}

const KeyGroup = styled.div<{ dimmed?: boolean; blink?: boolean }>`
  ${({ dimmed }) =>
    dimmed &&
    css`
      color: var(--gray9);
      opacity: 0.5;
    `}
  ${({ blink }) =>
    blink &&
    css`
      kbd {
        animation: blink 1s linear;
      }
    `}
  display: flex;
  gap: 4px;
  @keyframes blink {
    0% {
      background: black;
      color: white;
    }
    3% {
      background: rgba(0, 0, 0, 0.065);
    }
    10% {
      color: white;
    }
    100% {
      color: var(--gray11);
    }
  }
`;

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
