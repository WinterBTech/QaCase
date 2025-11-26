export class FollowupPage {
  get followupTaskListItem() {
    return $('~followup-task-0');
  }
  get evidenceButton() {
    return $('~btn-add-resolution-evidence');
  }
  get resolutionDateInput() {
    return $('~input-resolution-date');
  }
  get addCoObserverButton() {
    return $('~btn-add-coobserver');
  }
  get submitFollowupButton() {
    return $('~btn-submit-followup');
  }
  get toastSuccess() {
    return $('~toast-followup-success');
  }

  async openFirstTask() {
    await this.followupTaskListItem.click();
  }
}