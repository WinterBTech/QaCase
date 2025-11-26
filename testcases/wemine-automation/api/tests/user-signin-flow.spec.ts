import { test, expect } from '@playwright/test';
import env from '../../config/env.qa.json';

test.describe('Flow 0 – Sign in (API)', () => {
  test('F0-01 – /user/who and /user/me work for valid user', async ({ request, baseURL }) => {
    const whoRes = await request.post(`${baseURL}/user/who`, {
      data: { username: env.defaultUser }
    });
    expect(whoRes.ok()).toBeTruthy();
    const who = await whoRes.json();
    expect(who.tenantId).toBe(env.defaultTenant);

    const loginRes = await request.post(`${baseURL}/user/login`, {
      data: {
        username: env.defaultUser,
        password: env.defaultPassword
      }
    });
    expect(loginRes.ok()).toBeTruthy();
    const { token } = await loginRes.json();
    expect(token).toBeTruthy();

    const meRes = await request.get(`${baseURL}/user/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    expect(meRes.ok()).toBeTruthy();
    const me = await meRes.json();
    expect(me.username).toBe(env.defaultUser);
  });
});