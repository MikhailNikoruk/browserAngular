export const SEARCH_REQUEST_STATUSES = ['idle', 'loading', 'success', 'empty', 'error'] as const;

export type SearchRequestStatus = (typeof SEARCH_REQUEST_STATUSES)[number];
