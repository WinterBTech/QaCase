import { test, expect } from '@playwright/test';
import env from '../../config/env.qa.json';
import { buildAuthHeaders } from '../../utils/apiClient';

test.describe('Flow 2 – Safety Hazard API + Workflow', () => {
  test('F2-01 – Hazard creation generates followup and notifications', async ({ request, baseURL }) => {
    const reporterToken = 'fake-reporter-jwt';
    const picUserId = 'USER-PIC-01';

    const hazardRes = await request.post(`${baseURL}/safety/hazard`, {
      headers: buildAuthHeaders(reporterToken),
      data: {
        locationId: 'LOC-01',
        sublocationId: 'SUB-01',
        areaId: 'AREA-01',
        areaDescription: 'Loose cable near conveyor',
        evidenceImageId: 'IMG-123',
        picUserId
      }
    });

    expect(hazardRes.ok()).toBeTruthy();
    const hazard = await hazardRes.json();
    expect(hazard.id).toBeTruthy();
    expect(hazard.followupTaskId).toBeTruthy();

    const picToken = 'fake-pic-jwt';
    const tasksRes = await request.get(`${baseURL}/workflow/tasks?assignee=${picUserId}`, {
      headers: buildAuthHeaders(picToken)
    });
    expect(tasksRes.ok()).toBeTruthy();
    const tasks = await tasksRes.json();
    expect(tasks.some((t: any) => t.id === hazard.followupTaskId)).toBe(true);

    const notifRes = await request.get(`${baseURL}/notification/inbox?userId=${picUserId}`, {
      headers: buildAuthHeaders(picToken)
    });
    expect(notifRes.ok()).toBeTruthy();
    const notif = await notifRes.json();
    expect(
      notif.some((n: any) => n.type === 'FOLLOWUP_CREATED' && n.refId === hazard.followupTaskId)
    ).toBe(true);
  });
});