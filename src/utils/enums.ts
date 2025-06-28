
export const SHOP_TYPE = {
  GROCERY: 'grocery',
  RESTAURANT: 'restaurant'
} as const

export type ShopType = typeof SHOP_TYPE[keyof typeof SHOP_TYPE];
