import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import env from '../../config/env.qa.json';

test.describe('Flow 0 – Sign in & initial master sync', () => {
  test('F0-01 – Successful sign-in and master data sync', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.enterUsername(env.defaultUser);

    const who = page.waitForResponse(res =>
      res.url().includes('/user/who') && res.request().method() === 'POST'
    );
    await login.submitUsername();
    await expect(await who).toBeOK();

    // Microsoft popup (simplified – exact selectors depend on your SSO page)
    const msPopup = await page.waitForEvent('popup');
    await msPopup.getByPlaceholder(/Email/i).fill(`${env.defaultUser}@wemine.local`);
    await msPopup.getByPlaceholder(/Password/i).fill(env.defaultPassword);
    await msPopup.getByRole('button', { name: /Sign in/i }).click();

    const userMe = page.waitForResponse(res => res.url().includes('/user/me'));
    const master = page.waitForResponse(res => res.url().includes('/tenant/master'));
    await Promise.all([userMe, master]);

    const progress = page.locator('[data-testid="master-data-progress"]');
    await expect(progress).toBeVisible();
    await expect(progress).toBeHidden({ timeout: 60000 });

    await expect(page.getByText(/Please restart/i)).toBeVisible();
  });
});