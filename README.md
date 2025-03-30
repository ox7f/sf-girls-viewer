# SF-Girls Viewer

## Overview

The **SF-Girls Viewer** is a web-based tool that allows players to explore in-game assets, animations, and character models from **SF Girls**. It provides an interactive way to view and analyze game resources with a streamlined interface.

![Preview](./static/img/example.gif)

## Features

- **Character Model Viewer** – Inspect detailed 2D/3D assets from the game
- **Animation Playback** – Play character animations with adjustable speed and settings
- **Asset Exploration** – Browse and analyze in-game textures, sprites, and effects
- **Optimized Performance** – Lightweight and efficient for smooth operation

## Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/ox7f/sf-girls-viewer
   ```
2. Navigate to the project directory:
   ```bash
   cd sf-girls-viewer
   ```
3. Pull all necessary files:
   ```bash
   git lfs pull
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
   Or use alternative package managers:
   ```bash
   yarn dev
   pnpm dev
   bun dev
   ```
6. Open your browser and go to [http://localhost:5173](http://localhost:5173) to access the viewer.

## Updating Assets

When updating assets, ensure you regenerate the entity map with:

```bash
npm run generate-entity-map
```

## Requirements

- **Node.js** (Latest LTS version recommended)
- **NPM, Yarn, PNPM, or Bun** for package management
- **Modern Web Browser** (Chrome, Firefox, Edge, etc.)

## Disclaimer

This project is a **fan-made** tool and is **not affiliated** with or endorsed by the developers of **SF Girls**. All assets belong to their respective owners. This tool is for **educational and personal use only**.

## License

This repository is for **personal and educational use only**. Redistribution or commercial use is prohibited.

## Contact

For any issues, suggestions, or contributions, feel free to create an **issue** or reach out via GitHub.

---

Explore and enjoy the **SF-Girls Viewer**! 🎨
