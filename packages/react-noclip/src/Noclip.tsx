import styled from "@emotion/styled";
import * as Popover from "@radix-ui/react-popover";
import { Command } from "cmdk";
import * as React from "react";

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
        <Command.Input
          ref={inputRef}
          autoFocus
          placeholder="Search for apps and commands..."
        />
        <hr cmdk-raycast-loader="" />
        <Command.List ref={listRef}>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Suggestions">
            <Item value="Linear">Linear</Item>
            <Item value="Figma">Figma</Item>
            <Item value="Slack">Slack</Item>
            <Item value="YouTube">YouTube</Item>
            <Item value="Raycast">Raycast</Item>
          </Command.Group>
          <Command.Group heading="Commands">
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
          </Command.Group>
        </Command.List>

        <div cmdk-raycast-footer="">
          <RaycastLightIcon />

          <button cmdk-raycast-open-trigger="">
            Open Application
            <kbd>↵</kbd>
          </button>

          <hr />

          <SubCommand
            listRef={listRef}
            selectedValue={value}
            inputRef={inputRef}
          />
        </div>
      </Command>
    </Dialog>
  );
}

const Dialog = styled(Command.Dialog)`
  * {
    box-sizing: border-box;
  }
  --font-sans: "Inter", --apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
    Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  --app-bg: var(--gray1);
  --cmdk-shadow: 0 16px 70px rgb(0 0 0 / 20%);

  --lowContrast: #ffffff;
  --highContrast: #000000;

  --gray1: hsl(0, 0%, 99%);
  --gray2: hsl(0, 0%, 97.3%);
  --gray3: hsl(0, 0%, 95.1%);
  --gray4: hsl(0, 0%, 93%);
  --gray5: hsl(0, 0%, 90.9%);
  --gray6: hsl(0, 0%, 88.7%);
  --gray7: hsl(0, 0%, 85.8%);
  --gray8: hsl(0, 0%, 78%);
  --gray9: hsl(0, 0%, 56.1%);
  --gray10: hsl(0, 0%, 52.3%);
  --gray11: hsl(0, 0%, 43.5%);
  --gray12: hsl(0, 0%, 9%);

  --grayA1: hsla(0, 0%, 0%, 0.012);
  --grayA2: hsla(0, 0%, 0%, 0.027);
  --grayA3: hsla(0, 0%, 0%, 0.047);
  --grayA4: hsla(0, 0%, 0%, 0.071);
  --grayA5: hsla(0, 0%, 0%, 0.09);
  --grayA6: hsla(0, 0%, 0%, 0.114);
  --grayA7: hsla(0, 0%, 0%, 0.141);
  --grayA8: hsla(0, 0%, 0%, 0.22);
  --grayA9: hsla(0, 0%, 0%, 0.439);
  --grayA10: hsla(0, 0%, 0%, 0.478);
  --grayA11: hsla(0, 0%, 0%, 0.565);
  --grayA12: hsla(0, 0%, 0%, 0.91);

  --blue1: hsl(206, 100%, 99.2%);
  --blue2: hsl(210, 100%, 98%);
  --blue3: hsl(209, 100%, 96.5%);
  --blue4: hsl(210, 98.8%, 94%);
  --blue5: hsl(209, 95%, 90.1%);
  --blue6: hsl(209, 81.2%, 84.5%);
  --blue7: hsl(208, 77.5%, 76.9%);
  --blue8: hsl(206, 81.9%, 65.3%);
  --blue9: hsl(206, 100%, 50%);
  --blue10: hsl(208, 100%, 47.3%);
  --blue11: hsl(211, 100%, 43.2%);
  --blue12: hsl(211, 100%, 15%);

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  [cmdk-root] {
    width: 640px;
    max-width: 100%;
    background: var(--gray1);
    border-radius: 12px;
    padding: 8px 0;
    font-family: var(--font-sans);
    box-shadow: var(--cmdk-shadow);
    border: 1px solid var(--gray6);
    position: relative;

    .dark & {
      background: var(--gray2);
      border: 0;

      &:after {
        content: "";
        background: linear-gradient(
          to right,
          var(--gray6) 20%,
          var(--gray6) 40%,
          var(--gray10) 50%,
          var(--gray10) 55%,
          var(--gray6) 70%,
          var(--gray6) 100%
        );
        z-index: -1;
        position: absolute;
        border-radius: 12px;
        top: -1px;
        left: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        animation: shine 3s ease forwards 0.1s;
        background-size: 200% auto;
      }

      &:before {
        content: "";
        z-index: -1;
        position: absolute;
        border-radius: 12px;
        top: -1px;
        left: -1px;
        width: calc(100% + 2px);
        height: calc(100% + 2px);
        box-shadow: 0 0 0 1px transparent;
        animation: border 1s linear forwards 0.5s;
      }
    }

    kbd {
      font-family: var(--font-sans);
      background: var(--gray3);
      color: var(--gray11);
      height: 20px;
      width: 20px;
      border-radius: 4px;
      padding: 0 4px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:first-of-type {
        margin-left: 8px;
      }
    }
  }

  [cmdk-input] {
    font-family: var(--font-sans);
    border: none;
    width: 100%;
    font-size: 15px;
    padding: 8px 16px;
    outline: none;
    background: var(--bg);
    color: var(--gray12);

    &::placeholder {
      color: var(--gray9);
    }
  }

  [cmdk-raycast-top-shine] {
    .dark & {
      background: linear-gradient(
        90deg,
        rgba(56, 189, 248, 0),
        var(--gray5) 20%,
        var(--gray9) 67.19%,
        rgba(236, 72, 153, 0)
      );
      height: 1px;
      position: absolute;
      top: -1px;
      width: 100%;
      z-index: -1;
      opacity: 0;
      animation: showTopShine 0.1s ease forwards 0.2s;
    }
  }

  [cmdk-raycast-loader] {
    --loader-color: var(--gray9);
    border: 0;
    width: 100%;
    width: 100%;
    left: 0;
    height: 1px;
    background: var(--gray6);
    position: relative;
    overflow: visible;
    display: block;
    margin-top: 12px;
    margin-bottom: 12px;

    &:after {
      content: "";
      width: 50%;
      height: 1px;
      position: absolute;
      background: linear-gradient(
        90deg,
        transparent 0%,
        var(--loader-color) 50%,
        transparent 100%
      );
      top: -1px;
      opacity: 0;
      animation-duration: 1.5s;
      animation-delay: 1s;
      animation-timing-function: ease;
      animation-name: loading;
    }
  }

  [cmdk-item] {
    content-visibility: auto;

    cursor: pointer;
    height: 40px;
    border-radius: 8px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    color: var(--gray12);
    user-select: none;
    will-change: background, color;
    transition: all 150ms ease;
    transition-property: none;

    &[aria-selected="true"] {
      background: var(--gray4);
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

    &:first-of-type {
      margin-top: 8px;
    }

    & + [cmdk-item] {
      margin-top: 4px;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  [cmdk-raycast-meta] {
    margin-left: auto;
    color: var(--gray11);
    font-size: 13px;
  }

  [cmdk-list] {
    padding: 0 8px;
    height: 393px;
    overflow: auto;
    overscroll-behavior: contain;
    scroll-padding-block-end: 40px;
    transition: 100ms ease;
    transition-property: height;
    padding-bottom: 40px;
  }

  [cmdk-raycast-open-trigger],
  [cmdk-raycast-subcommand-trigger] {
    color: var(--gray11);
    padding: 0px 4px 0px 8px;
    border-radius: 6px;
    font-weight: 500;
    font-size: 12px;
    height: 28px;
    letter-spacing: -0.25px;
  }

  [cmdk-raycast-clipboard-icon],
  [cmdk-raycast-hammer-icon] {
    width: 20px;
    height: 20px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;

    svg {
      width: 14px;
      height: 14px;
    }
  }

  [cmdk-raycast-clipboard-icon] {
    background: linear-gradient(to bottom, #f55354, #eb4646);
  }

  [cmdk-raycast-hammer-icon] {
    background: linear-gradient(to bottom, #6cb9a3, #2c6459);
  }

  [cmdk-raycast-open-trigger] {
    display: flex;
    align-items: center;
    color: var(--gray12);
  }

  [cmdk-raycast-subcommand-trigger] {
    display: flex;
    align-items: center;
    gap: 4px;
    right: 8px;
    bottom: 8px;

    svg {
      width: 14px;
      height: 14px;
    }

    hr {
      height: 100%;
      background: var(--gray6);
      border: 0;
      width: 1px;
    }

    &[aria-expanded="true"],
    &:hover {
      background: var(--gray4);

      kbd {
        background: var(--gray7);
      }
    }
  }

  [cmdk-separator] {
    height: 1px;
    width: 100%;
    background: var(--gray5);
    margin: 4px 0;
  }

  *:not([hidden]) + [cmdk-group] {
    margin-top: 8px;
  }

  [cmdk-group-heading] {
    user-select: none;
    font-size: 12px;
    color: var(--gray11);
    padding: 0 8px;
    display: flex;
    align-items: center;
  }

  [cmdk-raycast-footer] {
    display: flex;
    height: 40px;
    align-items: center;
    width: 100%;
    position: absolute;
    background: var(--gray1);
    bottom: 0;
    padding: 8px;
    border-top: 1px solid var(--gray6);
    border-radius: 0 0 12px 12px;

    svg {
      width: 20px;
      height: 20px;
      filter: grayscale(1);
      margin-right: auto;
    }

    hr {
      height: 12px;
      width: 1px;
      border: 0;
      background: var(--gray6);
      margin: 0 4px 0px 12px;
    }

    @media (prefers-color-scheme: dark) {
      background: var(--gray2);
    }
  }

  [cmdk-dialog] {
    z-index: var(--layer-portal);
    position: fixed;
    left: 50%;
    top: var(--page-top);
    transform: translateX(-50%);

    [cmdk] {
      width: 640px;
      transform-origin: center center;
      animation: dialogIn var(--transition-fast) forwards;
    }

    &[data-state="closed"] [cmdk] {
      animation: dialogOut var(--transition-fast) forwards;
    }
  }

  [cmdk-empty] {
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    white-space: pre-wrap;
    color: var(--gray11);
  }

  @keyframes loading {
    0% {
      opacity: 0;
      transform: translateX(0);
    }

    50% {
      opacity: 1;
      transform: translateX(100%);
    }

    100% {
      opacity: 0;
      transform: translateX(0);
    }
  }

  @keyframes shine {
    to {
      background-position: 200% center;
      opacity: 0;
    }
  }

  @keyframes border {
    to {
      box-shadow: 0 0 0 1px var(--gray6);
    }
  }

  @keyframes showTopShine {
    to {
      opacity: 1;
    }
  }

  .raycast-submenu {
    [cmdk-root] {
      display: flex;
      flex-direction: column;
      width: 320px;
      border: 1px solid var(--gray6);
      background: var(--gray2);
      border-radius: 8px;
    }

    [cmdk-list] {
      padding: 8px;
      overflow: auto;
      overscroll-behavior: contain;
      transition: 100ms ease;
      transition-property: height;
    }

    [cmdk-item] {
      height: 40px;

      cursor: pointer;
      height: 40px;
      border-radius: 8px;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px;
      color: var(--gray12);
      user-select: none;
      will-change: background, color;
      transition: all 150ms ease;
      transition-property: none;

      &[aria-selected="true"] {
        background: var(--gray5);
        color: var(--gray12);

        [cmdk-raycast-submenu-shortcuts] kbd {
          background: var(--gray7);
        }
      }

      &[aria-disabled="true"] {
        color: var(--gray8);
        cursor: not-allowed;
      }

      svg {
        width: 16px;
        height: 16px;
      }

      [cmdk-raycast-submenu-shortcuts] {
        display: flex;
        margin-left: auto;
        gap: 2px;

        kbd {
          font-family: var(--font-sans);
          background: var(--gray5);
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
            margin-left: 8px;
          }
        }
      }
    }

    [cmdk-group-heading] {
      text-transform: capitalize;
      font-size: 12px;
      color: var(--gray11);
      font-weight: 500;
      margin-bottom: 8px;
      margin-top: 8px;
      margin-left: 4px;
    }

    [cmdk-input] {
      padding: 12px;
      font-family: var(--font-sans);
      border: 0;
      border-top: 1px solid var(--gray6);
      font-size: 13px;
      background: transparent;
      margin-top: auto;
      width: 100%;
      outline: 0;
      border-radius: 0;
    }

    animation-duration: 0.2s;
    animation-timing-function: ease;
    animation-fill-mode: forwards;
    transform-origin: var(--radix-popover-content-transform-origin);

    &[data-state="open"] {
      animation-name: slideIn;
    }

    &[data-state="closed"] {
      animation-name: slideOut;
    }

    [cmdk-empty] {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64px;
      white-space: pre-wrap;
      font-size: 14px;
      color: var(--gray11);
    }
  }

  @keyframes slideIn {
    0% {
      opacity: 0;
      transform: scale(0.96);
    }

    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes slideOut {
    0% {
      opacity: 1;
      transform: scale(1);
    }

    100% {
      opacity: 0;
      transform: scale(0.96);
    }
  }

  @media (max-width: 640px) {
    .raycast {
      [cmdk-input] {
        font-size: 16px;
      }
    }
  }
`;

function Item({
  children,
  value,
  isCommand = false,
}: {
  children: React.ReactNode;
  value: string;
  isCommand?: boolean;
}) {
  return (
    <Command.Item value={value} onSelect={() => {}}>
      {children}
      <span cmdk-raycast-meta="">{isCommand ? "Command" : "Application"}</span>
    </Command.Item>
  );
}

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
          <Command.List>
            <Command.Group heading={selectedValue}>
              <SubItem shortcut="↵">
                <WindowIcon />
                Open Application
              </SubItem>
              <SubItem shortcut="⌘ ↵">
                <FinderIcon />
                Show in Finder
              </SubItem>
              <SubItem shortcut="⌘ I">
                <FinderIcon />
                Show Info in Finder
              </SubItem>
              <SubItem shortcut="⌘ ⇧ F">
                <StarIcon />
                Add to Favorites
              </SubItem>
            </Command.Group>
          </Command.List>
          <Command.Input placeholder="Search for actions..." />
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
  shortcut: string;
}) {
  return (
    <Command.Item>
      {children}
      <div cmdk-raycast-submenu-shortcuts="">
        {shortcut.split(" ").map((key) => {
          return <kbd key={key}>{key}</kbd>;
        })}
      </div>
    </Command.Item>
  );
}

function RaycastLightIcon() {
  return (
    <svg
      width="1024"
      height="1024"
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M934.302 511.971L890.259 556.017L723.156 388.902V300.754L934.302 511.971ZM511.897 89.5373L467.854 133.583L634.957 300.698H723.099L511.897 89.5373ZM417.334 184.275L373.235 228.377L445.776 300.923H533.918L417.334 184.275ZM723.099 490.061V578.209L795.641 650.755L839.74 606.652L723.099 490.061ZM697.868 653.965L723.099 628.732H395.313V300.754L370.081 325.987L322.772 278.675L278.56 322.833L325.869 370.146L300.638 395.379V446.071L228.097 373.525L183.997 417.627L300.638 534.275V634.871L133.59 467.925L89.4912 512.027L511.897 934.461L555.996 890.359L388.892 723.244H489.875L606.516 839.892L650.615 795.79L578.074 723.244H628.762L653.994 698.011L701.303 745.323L745.402 701.221L697.868 653.965Z"
        fill="#FF6363"
      />
    </svg>
  );
}

function WindowIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.25 4.75V3.75C14.25 2.64543 13.3546 1.75 12.25 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V4.75M14.25 4.75V12.25C14.25 13.3546 13.3546 14.25 12.25 14.25H3.75C2.64543 14.25 1.75 13.3546 1.75 12.25V4.75M14.25 4.75H1.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FinderIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5 4.75V6.25M11 4.75V6.25M8.75 1.75H3.75C2.64543 1.75 1.75 2.64543 1.75 3.75V12.25C1.75 13.3546 2.64543 14.25 3.75 14.25H8.75M8.75 1.75H12.25C13.3546 1.75 14.25 2.64543 14.25 3.75V12.25C14.25 13.3546 13.3546 14.25 12.25 14.25H8.75M8.75 1.75L7.08831 7.1505C6.9202 7.69686 7.32873 8.25 7.90037 8.25C8.36961 8.25 8.75 8.63039 8.75 9.09963V14.25M5 10.3203C5 10.3203 5.95605 11.25 8 11.25C10.0439 11.25 11 10.3203 11 10.3203"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.43376 2.17103C7.60585 1.60966 8.39415 1.60966 8.56624 2.17103L9.61978 5.60769C9.69652 5.85802 9.92611 6.02873 10.186 6.02873H13.6562C14.2231 6.02873 14.4665 6.75397 14.016 7.10088L11.1582 9.3015C10.9608 9.45349 10.8784 9.71341 10.9518 9.95262L12.0311 13.4735C12.2015 14.0292 11.5636 14.4777 11.1051 14.1246L8.35978 12.0106C8.14737 11.847 7.85263 11.847 7.64022 12.0106L4.89491 14.1246C4.43638 14.4777 3.79852 14.0292 3.96889 13.4735L5.04824 9.95262C5.12157 9.71341 5.03915 9.45349 4.84178 9.3015L1.98404 7.10088C1.53355 6.75397 1.77692 6.02873 2.34382 6.02873H5.81398C6.07389 6.02873 6.30348 5.85802 6.38022 5.60769L7.43376 2.17103Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
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
