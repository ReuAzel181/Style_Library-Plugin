# Modular Token-Driven UI System

This design system is built on a multi-layered token architecture, following the Figma variables model. Every component and global setting is modularized into separate JSON files for scalability and ease of editing.

## Token Architecture

### 1. Primitive Tokens (`/primitive`)
These are the foundation. They define the raw values of the system (colors, spacing, radius, opacity). Primitives should **never** reference other tokens.
- `color.json`: Brand and greyscale scales.
- `spacing.json`: The 8px base grid.
- `radius.json`: Standardized border radii.

### 2. Global Tokens (`/global`)
These reference primitives and define the semantic layer of the design system.
- `typography.json`: Font families, weights, and scales (Desktop/Mobile).
- `layout.json`: Container widths and section margins for responsive modes.
- `semantic.json`: Semantic colors (text-primary, surface-brand) and shadows.

### 3. Component Tokens (`/components`)
Each component has its own directory and references global/primitive tokens.
- **Variants**: Handled by separate files (e.g., `button.primary.tokens.json`).
- **States**: Every variant defines state-specific tokens (Default, Hover, Active, Focus, Disabled).

## Token Referencing Syntax
Tokens use a standard `{path.to.token}` syntax for cross-referencing:
- Example: `{primitive.color.brand.500}`
- Example: `{global.semantic.color.border.focus}`

## Responsive Modes (Desktop / Mobile)
Global tokens such as `typography` and `layout` include mode-specific values:
```json
"h1": {
  "desktop": { "value": "48px", "type": "dimension" },
  "mobile": { "value": "32px", "type": "dimension" }
}
```

## Import & Mapping Feature
The system includes a `token-mapper.ts` utility that allows importing an external JSON dataset (matching the provided `import-schema.json`) to override the system values. This is ideal for white-labeling or importing variables from tools like Figma.

### Mapping Process:
1. Load base tokens.
2. Provide override dataset.
3. Mapper merges overrides and recalculates scales (e.g., generating a new spacing scale from a different base unit).
4. Output a resolved design system.
