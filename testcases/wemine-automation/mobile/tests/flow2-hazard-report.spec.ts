import { HazardPage } from '../pages/hazard.page';

describe('Flow 2 – Safety Hazard Report', () => {
  it('F2-01 – Reporter can submit hazard (happy path)', async () => {
    const hazard = new HazardPage();

    await hazard.open();
    await hazard.startNewHazard();

    await hazard.locationSelect.click();
    await $('android=new UiSelector().text("Location A")').click();

    await hazard.sublocationSelect.click();
    await $('android=new UiSelector().text("Sublocation 1")').click();

    await hazard.areaSelect.click();
    await $('android=new UiSelector().text("Crusher Area")').click();

    await hazard.areaDescriptionInput.setValue('Oil spill near conveyor');

    await hazard.evidenceButton.click();
    await $('~gallery-image-1').click(); // fake selector

    const picText = await hazard.picSelect.getText();
    expect(picText).to.contain('Current User');

    await hazard.submitHazardButton.click();
    await hazard.toastSuccess.waitForDisplayed();
  });
});