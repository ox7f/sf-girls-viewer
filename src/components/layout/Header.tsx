"use client";

import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import Image from "next/image";
import { FaGithub } from "react-icons/fa";

const menuItems = [
  { name: "Gallery", href: "/gallery" },
  { name: "Scene", href: "/scene" },
];

export const Header: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <div
      id="header"
      className="header header-animated grid-c-12 u-unselectable u-sticky u-top-0"
    >
      <div className="header-brand">
        <div className="nav-item no-hover">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <h6 className="title">SF Girls Viewer</h6>
          </Link>
        </div>

        <div
          className="nav-item nav-btn"
          id="header-btn"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span />
          <span />
          <span />
        </div>
      </div>

      <div id="header-menu" className={`header-nav ${isOpen ? "active" : ""}`}>
        <div className="nav-left">
          <div className="nav-item">
            <Link
              href="https://github.com/ox7f/sf-girls-viewer"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              <span className="icon">
                <FaGithub />
              </span>
            </Link>
          </div>

          {menuItems.map((menuItem) => (
            <div className="nav-item" key={menuItem.name}>
              <Link href={menuItem.href}>
                <span>{menuItem.name}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="nav-right">
          <div className="nav-item">
            <Link
              href="https://www.buymeacoffee.com/ox7f"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              <Image
                src="/buymeacoffee.png"
                alt="Buy Me A Coffee"
                height={36}
                width={130}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
