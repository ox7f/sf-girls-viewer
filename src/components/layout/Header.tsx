import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const pathname = location?.pathname ?? "/";

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
          <Link to="/" onClick={() => setIsOpen(false)}>
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
              to="https://github.com/ox7f/sf-girls-viewer"
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
              <Link
                to={menuItem.href}
                onClick={() => setIsOpen(false)}
                className={pathname === menuItem.href ? "is-active" : undefined}
              >
                <span>{menuItem.name}</span>
              </Link>
            </div>
          ))}
        </div>

        <div className="nav-right">
          <div className="nav-item">
            <Link
              to="https://www.buymeacoffee.com/ox7f"
              target="_blank"
              onClick={() => setIsOpen(false)}
            >
              <img
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
