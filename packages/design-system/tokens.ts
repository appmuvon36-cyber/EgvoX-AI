/**
 * EgvoX cross-platform design tokens.
 * Values are platform-neutral strings/numbers so web and future Expo clients
 * can consume the same source without importing DOM-specific styles.
 */
export const egvoxTokens = {
  brand: {
    teal700: '#027F86',
    teal600: '#039998',
    teal500: '#04B8B4',
    teal300: '#55B6B4',
    orange600: '#FC840E',
    yellow500: '#FDBA27',
  },
  neutral: {
    950: '#102326',
    900: '#193235',
    800: '#263F42',
    700: '#42595B',
    600: '#596F71',
    500: '#718486',
    400: '#A9BABB',
    300: '#D7E1E1',
    200: '#E8EEEE',
    100: '#F4F8F8',
    0: '#FFFFFF',
  },
  semantic: {
    light: {
      success: { fg: '#116B4A', bg: '#E8F5EF', border: '#A8D9C2' },
      warning: { fg: '#80520D', bg: '#FFF5DF', border: '#F2D28C' },
      danger: { fg: '#A52D35', bg: '#FCEBED', border: '#EAB8BD' },
      info: { fg: '#20588D', bg: '#EAF2FA', border: '#B9D1E8' },
    },
    dark: {
      success: { fg: '#83D7B1', bg: '#173D30', border: '#326D54' },
      warning: { fg: '#F5CE79', bg: '#493817', border: '#80652B' },
      danger: { fg: '#F0A0A6', bg: '#4A252A', border: '#804047' },
      info: { fg: '#9BC5EF', bg: '#1D3853', border: '#355F86' },
    },
  },
  typography: {
    family: {
      sans: 'Inter, Aptos, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
    },
    size: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    lineHeight: {
      tight: 1.2,
      snug: 1.35,
      normal: 1.5,
      relaxed: 1.65,
    },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },
  spacing: {
    0: '0px', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
    5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px',
    16: '64px', 20: '80px', 24: '96px',
  },
  breakpoints: { sm: '640px', md: '768px', lg: '1024px', xl: '1280px' },
  layout: {
    contentSm: '640px',
    contentMd: '768px',
    contentLg: '1024px',
    contentXl: '1280px',
    contentWide: '1440px',
    pageGutter: 'clamp(16px, 3vw, 32px)',
    gridGap: '24px',
  },
  border: { width: '1px', style: 'solid' },
  radius: {
    xs: '4px', sm: '6px', md: '8px', lg: '12px',
    xl: '16px', '2xl': '24px', full: '9999px',
  },
  shadow: {
    card: '0 1px 3px rgb(16 35 38 / 8%), 0 4px 12px rgb(16 35 38 / 4%)',
    popover: '0 12px 32px rgb(16 35 38 / 14%)',
    modal: '0 20px 48px rgb(16 35 38 / 20%)',
  },
  focus: { width: '2px', offset: '2px', color: '#039998', halo: '0 0 0 3px rgb(4 184 180 / 24%)' },
  motion: {
    fast: '120ms',
    normal: '180ms',
    slow: '240ms',
    easing: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  touchTarget: { minimum: '44px' },
} as const;

export type EgvoXColorMode = 'light' | 'dark';
export type EgvoXSemanticTone = keyof typeof egvoxTokens.semantic.light;

export const EGVOX_IDR_PER_USD = 16000;

export const egvoxConvertIDRtoUSD = (amountIDR: number): number => {
  if (!Number.isFinite(amountIDR)) return 0;
  return amountIDR / EGVOX_IDR_PER_USD;
};

export const egvoxFormatIDR = (amount: number): string => {
  const rounded = Math.round(Number.isFinite(amount) ? amount : 0);
  const sign = rounded < 0 ? '-' : '';
  const digits = Math.abs(rounded)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${sign}Rp ${digits}`;
};

export const egvoxFormatUSD = (amountIDR: number): string => {
  const usd = egvoxConvertIDRtoUSD(amountIDR);
  const sign = usd < 0 ? '-' : '';
  const abs = Math.abs(usd);
  const fixed = abs.toFixed(2);
  const [intPart, decPart] = fixed.split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${sign}$${formattedInt}.${decPart}`;
};
