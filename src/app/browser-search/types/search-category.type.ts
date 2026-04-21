export const SEARCH_CATEGORIES = [
  'all',
  'frontend',
  'javascript',
  'css',
  'performance',
  'architecture',
  'testing',
  'browser',
] as const;

export type SearchCategory = (typeof SEARCH_CATEGORIES)[number];
