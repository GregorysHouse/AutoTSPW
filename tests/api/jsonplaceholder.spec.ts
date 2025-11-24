import { test, expect } from '@playwright/test';

test.describe('API: JSONPlaceholder examples', () => {
  test('GET /posts returns array', async ({ request }) => {
    const res = await request.get('https://jsonplaceholder.typicode.com/posts', { timeout: 15000 });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
  });

  test('POST /posts creates resource', async ({ request }) => {
    const res = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: { title: 'foo', body: 'bar', userId: 1 }
    });
    expect(res.status()).toBe(201);
    const json = await res.json();
    expect(json).toHaveProperty('id');
  });
});