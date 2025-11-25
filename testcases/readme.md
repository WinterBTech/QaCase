# Hi there, Best of Luck

## Test Strategy & Tool Choices

Because WeMine has Web + Mobile + Offline + Heavy API, I’d split layers like this:

1. Web (WeMineOffice)

***Tool: Playwright (TypeScript)***

Why:

- Built-in auto-waits, nice for dynamic form builder & long loading master data.

- Great for network mocking & offline mode to simulate “bad / no internet”.

- Cross-browser out of the box.

- Has trace viewer that’s super useful for debugging complex flows like sign-in + big sync.

2. Mobile (WeMine)

***Tool: Appium + WebdriverIO (TypeScript)***

Why:

- Works with real devices / emulators for both Android & iOS.

- Can reuse TypeScript ecosystem (same mono-repo with Playwright).

- Good Page Object support via WebdriverIO and easy integration with CI.

3. API & Backend Services

***Tool: REST API tests using Playwright request***

Why:

- Faster feedback than UI.

- Can validate key backend logic: tenant lookup, user profile, hazard creation, notification, workflow, etc.

- Easy to hook into CI and run on every PR.

4. Reporting & CI

- Allure Report or Playwright HTML report for UI & API.

## Possible Cases

# Flow 0 – Sign In & Initial Master Data Sync

## Scope
- /user/who  
- Microsoft login  
- /user/me  
- /tenant/master  
- Initial master data download  
- Restart prompt  

---

# Positive / Happy Flow

## F0-01 – Successful Sign-In (Web) – Automated
**Precondition:** Valid username exists.

### Steps
1. Open WeMineOffice login.
2. Enter valid username.
3. Verify `/user/who` returns tenant info.
4. App opens Microsoft login screen.
5. Enter valid password.
6. Verify `/user/me` and `/tenant/master` calls succeed.

### Expected Result
- User lands on dashboard.
- Master data endpoints called correctly.
- Progress bar shown during master data download.
- Restart prompt shown after sync completes.

---

## F0-02 – Successful Sign-In (Mobile) – Automated

### Expected Result
- Same results as Web sign-in.
- Master data stored locally for offline mode.

---

## F0-03 – Master Data Progress Bar Behaviour – Automated

### Steps
1. Trigger login with large master data.

### Expected Result
- Progress bar visible during fetch.
- Progress indicator updates.
- Progress bar disappears after completion.

---

## F0-04 – First-Time Restart Prompt – Automated

### Steps
1. Login on a clean device with empty local DB.

### Expected Result
- Prompt: "Please restart app to apply updated master data."
- After restart, new data available (locations, forms, etc.).

---

# Negative / Edge Cases

## F0-05 – Unknown Username – Automated

### Steps
1. Enter invalid username.

### Expected Result
- `/user/who` returns tenant-not-found.
- Message shown: "User/tenant not found."
- Microsoft login is not opened.

---

## F0-06 – Wrong Password on Microsoft Login – Manual/Automated

### Expected Result
- Microsoft displays incorrect password error.
- No `/user/me` call is triggered.

---

## F0-07 – Network Lost During Master Sync – Manual

### Steps
1. Start sign-in.
2. After `/user/me`, turn off internet before `/tenant/master` finishes.

### Expected Result
- Progress bar stops or shows error.
- Retry option presented.
- Partial master data is not applied.

---

## F0-08 – Offline Login After Cached Data – Automated

**Precondition:** User has already logged in once and synced master data.

### Steps
1. Turn on airplane mode.
2. Open app.

### Expected Result
- App allows offline login using cached session.
- Cached master data remains available.

---

# Flow 1 – Equipment Inspection Form

Covers Web Form Builder and Web/Mobile submission.

---

# Web Form Builder

## F1-01 – Create New Equipment Form (Various Field Types) – Automated

### Steps
1. Open form builder.
2. Create a form containing:
   - Text input
   - Date picker
   - Select
   - Radio (up to 4 options)
   - Image picker

### Expected Result
- Form saved with unique Form Code.
- All field types and validations stored correctly.

---

## F1-02 – Max Field Limit (50 Fields) – Manual/Automated

### Steps
1. Attempt to add 51 fields.

### Expected Result
- App prevents adding more than 50 fields.
- Friendly error message shown.

---

## F1-03 – Edit Form Without Breaking Old Submissions – Manual

### Expected Result
- Newly added fields do not break old submissions.
- Historical data remains readable.

---

# Equipment Inspection Submission

## F1-04 – View Previous Submissions – Automated

### Expected Result
- Submission history visible.
- Status and timestamp match.
- "Create New Submission" available.

---

## F1-05 – Submit Equipment Inspection (Happy Flow) – Automated

**Precondition:** Form already exists.

### Steps
1. Open Equipment Inspection.
2. Select form by Form Code.
3. Fill mandatory fields.
4. Attach image.
5. Submit form.

### Expected Result
- Submission is saved.
- Appears in submission list with correct data.

---

## F1-06 – Validation of Mandatory Fields – Automated

### Steps
1. Leave required fields empty.
2. Submit form.

### Expected Result
- Inline validation messages shown.
- Submission is blocked.

---

## F1-07 – Offline Form Submission with Sync – Automated

### Steps
1. Turn off internet.
2. Fill form and submit.

### Expected Result
- Submission stored locally as "Pending Sync".
- After reconnecting, submission auto-syncs.

---

# Flow 2 – Safety Hazard Report

Hazard creation, follow-up workflow, notifications.

---

# Hazard Creation (Reporter)

## F2-01 – Submit Hazard Report (Happy Flow) – Automated

### Steps
1. Open Hazard menu.
2. Fill fields:
   - Location (required)
   - Sublocation (required)
   - Area (required)
   - Area Description (optional)
   - Evidence (required)
   - PIC (defaults to current user)
3. Submit.

### Expected Result
- Hazard entry created.
- Follow-up task created and assigned to PIC.
- Notifications sent:
  - PIC → follow-up task
  - All area members → hazard report

---

## F2-02 – Evidence Mandatory – Automated

### Steps
1. Submit hazard without image.

### Expected Result
- Validation error displayed.
- Submission blocked.

---

## F2-03 – Mandatory Location Fields – Automated

### Steps
1. Leave Location/Sublocation/Area empty.

### Expected Result
- Mandatory field validation triggered.

---

## F2-04 – PIC Preselected – Automated

### Expected Result
- PIC field automatically filled with reporter.
- User can modify if needed.

---

## F2-05 – Offline Hazard Submission + Sync – Automated

### Steps
1. Turn off internet.
2. Create hazard with image.

### Expected Result
- Hazard saved locally as "Pending Sync".
- Auto-sync occurs once online.

---

# Follow-Up Task (PIC)

## F2-06 – PIC Receives Follow-Up Notification – Automated (API + Mobile UI)

### Expected Result
- PIC receives:
  - Mobile push notification
  - Inbox notification
- Follow-up task appears in list.

---

## F2-07 – Submit Follow-Up Task (Happy Flow) – Automated

### Steps
1. Open task.
2. Attach resolution evidence.
3. Set resolution date/time.
4. Add co-observer(s).
5. Submit.

### Expected Result
- Task marked as completed.
- Resolution stored correctly.

---

## F2-08 – Add/Remove Co Observer – Manual/Automated

### Steps
1. Add multiple co-observers.
2. Remove one.

### Expected Result
- Dynamic list updates correctly.
- Duplicate entries prevented.

---

## F2-09 – Resolution Date Mandatory – Automated

### Steps
1. Submit without selecting date.

### Expected Result
- Error displayed.
- Submission blocked.

---

## F2-10 – Supervisor Notification – Automated (API)

### Expected Result
- Direct Supervisor receives notification after follow-up completion.
