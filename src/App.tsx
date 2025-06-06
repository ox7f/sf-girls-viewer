import { canvas } from "@drincs/pixi-vn";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import { /*Footer,*/ Header } from "./components/layout";
import { DataInitializer } from "./components/DataInitializer";

function App() {
  const pixiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pixiRef.current) {
      canvas.initialize(pixiRef.current, 1080, 720);
    }
  }, []);

  return (
    <>
      <Header />
      <main className="grid-c-12">
        <div
          className="hero fullscreen hero-img parallax-img background"
          style={{
            opacity: 0.1,
            backgroundColor: "rgb(229, 229, 247)",
            backgroundImage:
              "linear-gradient(black 1px, transparent 1px), linear-gradient(90deg, black 1px, white 1px)",
            backgroundSize: "50px 50px, 50px 50px, 10px 10px, 10px 10px",
            backgroundPosition: "-2px -2px, -2px -2px, -1px -1px, -1px -1px",
          }}
        />
        <div className="u-absolute u-z-0 fullscreen" id="app">
          <Outlet />
        </div>
        <div ref={pixiRef} className="u-none" />
        <DataInitializer />
        <Analytics />
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;
