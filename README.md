# Modular Token-Driven UI System

This token system follows a layered architecture aligned with the Figma Variables model. Tokens are split into focused JSON files so updates stay scalable, traceable, and easy to maintain.

## Architecture Overview

### 1) Primitive Tokens (`/primitive`)
Primitives define raw, source values and should never reference other tokens.

- `color.json`: Brand and grayscale scales
- `spacing.json`: 8px-based spacing scale
- `radius.json`: Standardized corner radii

### 2) Global Tokens (`/global`)
Global tokens reference primitives and define semantic meaning and layout rules.

- `typography.json`: Font families, weights, and size scales per mode
- `layout.json`: Container widths, spacing, and responsive layout values
- `semantic.json`: Semantic colors, borders, and elevation/shadow values

### 3) Component Tokens (`/components`)
Component tokens define implementation-ready values per component and variant.

- Variants are split by file (for example, `button.primary.tokens.json`)
- States are explicit per variant (`Default`, `Hover`, `Active`, `Focus`, `Disabled`)

## Token Reference Syntax

Cross-token references use curly-brace paths:

- `{primitive.color.brand.500}`
- `{global.semantic.color.border.focus}`

## Responsive Modes (Desktop / Mobile)

Global token groups such as `typography` and `layout` support mode-specific values:

```json
"h1": {
  "desktop": { "value": "48px", "type": "dimension" },
  "mobile": { "value": "32px", "type": "dimension" }
}
```

## Import and Mapping

`token-mapper.ts` imports an external dataset that matches `import-schema.json` and applies overrides to the base system. This is useful for white-labeling and external variable ingestion.

### Mapping Flow

1. Load base tokens
2. Provide an override dataset
3. Merge overrides and recalculate derived scales when required
4. Output a fully resolved token system
