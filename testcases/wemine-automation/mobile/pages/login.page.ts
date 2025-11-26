export class MobileLoginPage {
  get usernameInput() {
    return $('~input-username'); // accessibility id (testID)
  }

  get nextButton() {
    return $('~button-next');
  }

  async enterUsername(username: string) {
    await this.usernameInput.setValue(username);
  }

  async submitUsername() {
    await this.nextButton.click();
  }
}