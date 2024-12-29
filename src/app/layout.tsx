import "./globals.css";
import "cirrus-ui";
import "pixi-spine";

import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { DataInitializer } from "@/components/DataInitializer";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "SF Girls Viewer",
  description: "A WIP Viewer for SF Girls",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="grid-c-12">
          <div
            className="hero fullscreen hero-img parallax-img"
            style={{
              opacity: 0.1,
              backgroundColor: "rgb(229, 229, 247)",
              backgroundImage:
                "linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, white 1px)",
              backgroundSize: "50px 50px, 50px 50px, 10px 10px, 10px 10px",
              backgroundPosition: "-2px -2px, -2px -2px, -1px -1px, -1px -1px",
            }}
          />
          <div className="u-absolute u-z-0 fullscreen">{children}</div>
          <DataInitializer />
          <Analytics />
        </main>
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
