import { test, expect } from '@playwright/test';
import { EquipmentFormBuilderPage } from '../pages/equipment-form-builder.page';

test.describe('Flow 1 – Equipment Inspection Form', () => {
  test('F1-01 – Create equipment form with various field types', async ({ page }) => {
    const formBuilder = new EquipmentFormBuilderPage(page);

    await formBuilder.open();
    await formBuilder.createSimpleEquipmentForm('Equipment Inspection – QA Demo');

    await expect(formBuilder.toastSuccess).toBeVisible();
  });

  test('F1-05 – Submit equipment inspection (happy path, rough web example)', async ({ page }) => {
    await page.goto('/equipment-inspection');

    await page.getByRole('button', { name: /New Submission/i }).click();
    await page.getByLabel('Form Code').selectOption('EQUIP-INSP-QA-DEMO');

    await page.getByLabel('Equipment Name').fill('Excavator 01');
    await page.getByLabel('Inspection Date').fill('2025-11-25');
    await page.getByLabel('Condition').selectOption('GOOD');
    await page.getByLabel('Requires Maintenance').check();

    await page.getByRole('button', { name: /Upload Image/i }).click();
    // In real test, attach file: await page.setInputFiles('input[type="file"]', 'fixtures/photo.png');

    await page.getByRole('button', { name: /Submit/i }).click();
    await expect(page.getByText(/Submission created/i)).toBeVisible();

    await expect(page.getByRole('row', { name: /Excavator 01/ })).toBeVisible();
  });
});