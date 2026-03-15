/**
 * Token Mapper Utility
 * 
 * This script handles the importing of an external design dataset and maps it 
 * to the modular token system. It supports overriding primitives and component-specific tokens.
 */

type TokenValue = string | number | { [key: string]: any };

interface DesignSystemTokens {
  primitive: Record<string, any>;
  global: Record<string, any>;
  component: Record<string, any>;
}

interface ImportDataset {
  colors?: {
    brand?: string;
    neutral?: string;
  };
  typography?: {
    fontFamily?: string;
    baseFontSize?: string;
  };
  spacing?: {
    baseUnit?: number;
  };
  overrides?: Record<string, any>;
}

class TokenSystemArchitect {
  private tokens: DesignSystemTokens;

  constructor(baseTokens: DesignSystemTokens) {
    this.tokens = JSON.parse(JSON.stringify(baseTokens));
  }

  /**
   * Imports an external dataset and applies it to the token system.
   */
  public importVariables(dataset: ImportDataset): DesignSystemTokens {
    if (dataset.colors) {
      this.updateColors(dataset.colors);
    }

    if (dataset.typography) {
      this.updateTypography(dataset.typography);
    }

    if (dataset.spacing) {
      this.updateSpacing(dataset.spacing);
    }

    if (dataset.overrides) {
      this.applyOverrides(dataset.overrides);
    }

    return this.tokens;
  }

  private updateColors(colors: { brand?: string; neutral?: string }) {
    if (colors.brand) {
      // Logic to generate brand scale from base brand color
      this.tokens.primitive.color.brand['500'].value = colors.brand;
      // In a real system, you'd use a color library to generate the 50-900 scale
    }
  }

  private updateTypography(typography: { fontFamily?: string; baseFontSize?: string }) {
    if (typography.fontFamily) {
      this.tokens.global.typography['font-family'].sans.value = typography.fontFamily;
    }
  }

  private updateSpacing(spacing: { baseUnit?: number }) {
    if (spacing.baseUnit) {
      // Recalculate spacing scale based on base unit (e.g., 4px, 8px)
      const unit = spacing.baseUnit;
      Object.keys(this.tokens.primitive.spacing).forEach((key) => {
        const factor = parseInt(key);
        if (!isNaN(factor)) {
          this.tokens.primitive.spacing[key].value = `${factor * unit}px`;
        }
      });
    }
  }

  private applyOverrides(overrides: Record<string, any>) {
    // Deep merge overrides into component tokens
    this.tokens.component = this.deepMerge(this.tokens.component, overrides);
  }

  private deepMerge(target: any, source: any) {
    for (const key of Object.keys(source)) {
      if (source[key] instanceof Object && key in target) {
        Object.assign(source[key], this.deepMerge(target[key], source[key]));
      }
    }
    Object.assign(target || {}, source);
    return target;
  }

  public getTokens(): DesignSystemTokens {
    return this.tokens;
  }
}

export default TokenSystemArchitect;
