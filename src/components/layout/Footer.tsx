import Link from "next/link";
import type { FC } from "react";

export const Footer: FC = () => (
  <footer className="footer grid-c-12 bg-white">
    <h6 className="footer__title uppercase">SF Girls Viewer</h6>

    <p className="subtitle mx-5">
      The source code is licensed{" "}
      <Link
        href="http://opensource.org/licenses/mit-license.php"
        target="_blank"
      >
        MIT
      </Link>
      . The website content is licensed{" "}
      <Link
        rel="license"
        href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        target="_blank"
      >
        CC BY-NC-SA 4.0
      </Link>
      .
    </p>

    <p className="subtitle mx-5">
      Made with{" "}
      <svg
        aria-label="love"
        style={{ display: "inline" }}
        aria-hidden="true"
        data-icon="heart"
        className="h-2 animated pound text-red-500"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 512 512"
      >
        <title>love</title>
        <path
          fill="currentColor"
          d="M462.3 62.6C407.5 15.9 326 24.3 275.7 76.2L256 96.5l-19.7-20.3C186.1 24.3 104.5 15.9 49.7 62.6c-62.8 53.6-66.1 149.8-9.9 207.9l193.5 199.8c12.5 12.9 32.8 12.9 45.3 0l193.5-199.8c56.3-58.1 53-154.3-9.8-207.9z"
        ></path>
      </svg>
      {" by "}
      <Link
        className="utb utb-OLR"
        href="https://discordapp.com/users/382197237842837514"
        target="_blank"
        rel="noopener noreferrer"
      >
        Dalberg
      </Link>
    </p>
  </footer>
);
