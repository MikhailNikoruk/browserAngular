import { describe, expect, it, beforeEach } from 'vitest';

import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  const storageKey = 'local-storage-service-spec';
  let service: LocalStorageService;

  beforeEach(() => {
    localStorage.clear();
    service = new LocalStorageService();
  });

  it('returns fallback when key does not exist', () => {
    expect(service.getItem(storageKey, ['fallback'])).toEqual(['fallback']);
  });

  it('stores and reads typed values', () => {
    const value = { query: 'angular', category: 'frontend' };

    service.setItem(storageKey, value);

    expect(service.getItem(storageKey, null)).toEqual(value);
  });

  it('returns fallback when stored JSON is invalid', () => {
    localStorage.setItem(storageKey, '{invalid json');

    expect(service.getItem(storageKey, { ok: false })).toEqual({ ok: false });
  });

  it('removes items by key', () => {
    service.setItem(storageKey, { ok: true });
    service.removeItem(storageKey);

    expect(localStorage.getItem(storageKey)).toBeNull();
  });
});
