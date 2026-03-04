import React from "react";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { translate } from "@docusaurus/Translate";
import { REPO_URL } from "@site/src/constants/repo";

export default function FooterCopyright(): JSX.Element {
  const changelogUrl = useBaseUrl("/guide/basics/changelog/");
  const logoUrl = useBaseUrl("/img/external/docusaurus_logo.svg");

  const license = translate({
    id: "footer.license",
    message: "MIT License",
  });

  const builtWith = translate({
    id: "footer.builtWith",
    message: "Website built with",
  });

  return (
    <div className="footer__copyright">
      <span className="footer__main">
        © {new Date().getFullYear()}{" "}
        <a
          href="https://www.linkedin.com/in/mopi1402/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pierre Moati
        </a>
        {" · "}
        <a
          href={`${REPO_URL}/blob/main/LICENSE`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {license}
        </a>
        {" · "}
        <a href={changelogUrl}>Changelog</a>
      </span>
      <span className="footer__dot"> · </span>
      <span className="footer__docusaurus" style={{ opacity: 0.7 }}>
        {builtWith}{" "}
        <a
          href="https://docusaurus.io/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "hsl(167, 68%, 45%)" }}
        >
          Docusaurus
        </a>{" "}
        <img src={logoUrl} alt="" width="20" height="20" />
      </span>
    </div>
  );
}
