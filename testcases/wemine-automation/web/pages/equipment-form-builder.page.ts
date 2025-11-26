import { Page, Locator } from '@playwright/test';

export class EquipmentFormBuilderPage {
  readonly page: Page;
  readonly newFormButton: Locator;
  readonly formNameInput: Locator;
  readonly addFieldButton: Locator;
  readonly saveFormButton: Locator;
  readonly toastSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    this.newFormButton = page.getByRole('button', { name: /New Form/i });
    this.formNameInput = page.getByPlaceholder('Form Name');
    this.addFieldButton = page.getByRole('button', { name: /Add Field/i });
    this.saveFormButton = page.getByRole('button', { name: /Save/i });
    this.toastSuccess = page.getByText(/Form saved/i);
  }

  async open() {
    await this.page.goto('/forms');
  }

  async createSimpleEquipmentForm(name: string) {
    await this.newFormButton.click();
    await this.formNameInput.fill(name);

    // Example: add a few fields (text, date, select, radio, image)
    await this.addField('Text');
    await this.addField('Date');
    await this.addField('Select');
    await this.addField('Radio');
    await this.addField('Image');

    await this.saveFormButton.click();
    await this.toastSuccess.waitFor();
  }

  private async addField(typeLabel: string) {
    await this.addFieldButton.click();
    await this.page.getByRole('menuitem', { name: typeLabel }).click();
  }
}