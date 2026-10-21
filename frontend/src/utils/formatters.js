/**
 * Indian Rupee (INR) Currency and Number Formatters
 */

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (isNaN(num)) return `₹${amount}`;
  return `₹${num.toLocaleString('en-IN')}`;
};

export const formatNumberIN = (amount) => {
  if (amount === undefined || amount === null || amount === '') return '0';
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (isNaN(num)) return `${amount}`;
  return num.toLocaleString('en-IN');
};

export const calculateDiscount = (originalPrice, currentPrice) => {
  const orig = Number(originalPrice);
  const curr = Number(currentPrice);
  if (!orig || !curr || orig <= curr) return 0;
  return Math.round(((orig - curr) / orig) * 100);
};

export const calculateSavings = (originalPrice, currentPrice) => {
  const orig = Number(originalPrice);
  const curr = Number(currentPrice);
  if (!orig || !curr || orig <= curr) return 0;
  return Math.round(orig - curr);
};
