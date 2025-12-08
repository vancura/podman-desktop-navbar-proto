# Podman Desktop Navigation Bar Prototype

A prototype for the Podman Desktop navigation bar using dynamic SVG and TypeScript.

## Features

- **Dynamic SVG** — Programmatically generated and manipulated SVG elements
- **TypeScript** — Full type safety for SVG manipulation
- **Modern tooling** — Vite for fast development with HMR
- **Code quality** — ESLint, Prettier, Biome, and Husky pre-configured

## Prerequisites

- **Node.js** v20 or higher (LTS recommended)
- **pnpm** v10.24.0 or higher

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open your browser at `http://localhost:5173` to see the navigation bar prototype.

## Scripts

| Command             | Description                         |
| ------------------- | ----------------------------------- |
| `pnpm dev`          | Start dev server with HMR           |
| `pnpm build`        | Type-check and build for production |
| `pnpm preview`      | Preview the production build        |
| `pnpm lint`         | Run ESLint                          |
| `pnpm lint:fix`     | Run ESLint with auto-fix            |
| `pnpm format`       | Format code with Biome and Prettier |
| `pnpm format:check` | Check formatting without changes    |
| `pnpm typecheck`    | Run TypeScript type checking        |
| `pnpm clean`        | Remove dist and cache directories   |

## Project Structure

```text
podman-desktop-navbar-proto/
├── src/
│   └── main.ts           # SVG navigation bar entry point
├── index.html            # HTML template
├── package.json
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
├── eslint.config.js      # ESLint flat config
├── prettier.config.js    # Prettier configuration
└── commitlint.config.js  # Commit message linting
```

## Technologies

- **[SVG](https://developer.mozilla.org/en-US/docs/Web/SVG)** — Scalable Vector Graphics
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Vite](https://vite.dev/)** — Fast build tool with HMR

## License

ISC
