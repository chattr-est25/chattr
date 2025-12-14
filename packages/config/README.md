# Config Package

Centralized configuration package for shared TypeScript and code quality settings across all services and packages in the workspace.

## 📦 Purpose

This package provides:

- **TypeScript Configurations** - Base TypeScript configs
- **Biome Configurations** - Linting and formatting rules

## 🏗️ Structure

```
packages/config/
├── typescript/
│   └── base.json
├── biome/
│   └── root.json
└── package.json
```

## 🔧 Usage

### In Services

**tsconfig.json:**

```json
{
  "extends": "../../packages/config/typescript/base.json"
}
```

**biome.jsonc:**

```json
{
  "extends": "./packages/config/biome/root.json"
}
```

## 🚀 Updating Configurations

To update shared configurations:

1. Edit the relevant config file in `packages/config/`
2. Changes automatically apply to all extending packages
3. Run `bun run check:write` to apply to all files
4. Run `bun run typecheck` to verify TypeScript
