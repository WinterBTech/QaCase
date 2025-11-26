export class HazardPage {
  get menuHazard() {
    return $('~menu-hazard');
  }
  get addHazardButton() {
    return $('~btn-add-hazard');
  }
  get locationSelect() {
    return $('~select-location');
  }
  get sublocationSelect() {
    return $('~select-sublocation');
  }
  get areaSelect() {
    return $('~select-area');
  }
  get areaDescriptionInput() {
    return $('~input-area-description');
  }
  get evidenceButton() {
    return $('~btn-add-evidence');
  }
  get picSelect() {
    return $('~select-pic');
  }
  get submitHazardButton() {
    return $('~btn-submit-hazard');
  }
  get toastSuccess() {
    return $('~toast-success');
  }

  async open() {
    await this.menuHazard.click();
  }

  async startNewHazard() {
    await this.addHazardButton.click();
  }
}