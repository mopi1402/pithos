import React, { useCallback, type ReactNode } from "react";
import { useHistory } from "@docusaurus/router";
import { useCodeLinks } from "@site/src/contexts/CodeLinksContext";
import { useCmdKey } from "@site/src/hooks/useCmdKey";

interface TokenData {
  content: string;
  types: string[];
}

interface Props {
  children: ReactNode;
  line: TokenData[];
  token: TokenData;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: unknown;
}

export default function CodeBlockLineToken({
  line: _line,
  token,
  children,
  ...props
}: Props): ReactNode {
  const links = useCodeLinks();
  const cmdPressed = useCmdKey();
  const history = useHistory();

  const text = token.content.trim();
  const href = links[text];

  if (!href) {
    return <span {...props}>{children}</span>;
  }

  // Split leading/trailing whitespace so only the word gets underlined
  const raw = token.content;
  const leading = raw.slice(0, raw.indexOf(text));
  const trailing = raw.slice(raw.indexOf(text) + text.length);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        history.push(href);
      }
    },
    [history, href],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") history.push(href);
    },
    [history, href],
  );

  return (
    <span {...props}>
      {leading}
      <span
        data-api-link={href}
        role="link"
        tabIndex={0}
        aria-label={`API: ${text}`}
        className={`code-link-token${cmdPressed ? " code-link-token--active" : ""}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {text}
      </span>
      {trailing}
    </span>
  );
}
