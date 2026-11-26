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
    800: '#263F42',
    700: '#42595B',
    500: '#718486',
    300: '#D7E1E1',
    200: '#E8EEEE',
    100: '#F4F8F8',
    0: '#FFFFFF',
  },
  status: {
    success: '#16835D',
    warning: '#B7791F',
    danger: '#C43D3D',
    info: '#2563A6',
  },
} as const;

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
