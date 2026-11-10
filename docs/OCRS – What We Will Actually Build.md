# OCRS – What We Will Actually Build

Oct 10, 2026 · @Abyss

We build a clickable Figma prototype of 7 core screens (about 95 hours); everything else stays in the report as design only. The full OCRS estimate is 2,556 hours, so this build is under 5% of it, which three students can finish.

## 1. Capacity check

These hours are assumptions; replace them with your own and the rest of this plan scales with them.

| Item | Assumption | Hours |
| --- | --- | --- |
| Total group time | 3 students × 16 weeks × 8 h per week | 384 |
| Report, UML, estimation, tests, risks, traceability | about 60% | 230 |
| Prototype | about 25% | 96 |
| Presentation and viva preparation | about 15% | 58 |

The prototype budget is therefore about 95 hours, which is roughly 0.6 person-month.

## 2. What we build

**Tier 1 – must build: clickable high-fidelity prototype in Figma**

| Screen | Why it is included | Use case | Requirement | Hours | Owner |
| --- | --- | --- | --- | --- | --- |
| S01 Login | Entry point for all three roles | UC01 | FR01 | 3 | Member 1 |
| S04 Course Search | First step of the main workflow | UC03 | FR03 | 8 | Member 1 |
| S05 Register for Course | Core of the system: success state plus error states for prerequisite, time conflict, full section and credit limit | UC04, UC15–UC17 | FR04–FR07 | 16 | Member 1 |
| S07 My Schedule & Status | Shows the result and the status badges | UC07 | FR12 | 8 | Member 2 |
| S09 Invoice & Payment | Second business process; mock gateway page with success and failure | UC08 | FR11 | 8 | Member 2 |
| S12 Manage Offerings | The one admin screen; shows capacity and dates | UC11 | FR13 | 8 | Member 2 |
| S10 Pending Approvals | Advisor role and approval process | UC09 | FR10 | 10 | Member 3 |
| S16 Notification toast and sample e-mail | Shows the notification step | UC18 | FR15 | 4 | Member 3 |
| Design system (colours, fonts, buttons, badges) | Keeps all screens consistent | – | – | 10 | Member 1 |
| Linking screens and navigation | Makes it clickable end to end | – | – | 12 | Member 2 |
| Click-through test and screenshots | Needed for Chapter 5 and test evidence | – | – | 6 | Member 3 |
| **Total** |  |  |  | **93** |  |

This covers 11 of the 17 functional requirements, all 3 roles, and both main business processes (registration with approval, and payment).

**Tier 2 – only if all of Tier 1 is done early: small working slice**

One HTML/CSS/JavaScript page for S05 with hard-coded sample courses, where the three checks (prerequisite, time conflict, seat and credit limit) really run in JavaScript. About 25 hours, no database or server. It lets you say “the core rule logic works” in the demo, but nobody requires it.

**Tier 3 – designed, not built**

These stay in the report (requirements, UML, estimation, test cases) but get no screens: S02 Profile, S03 Dashboard, S06 Waitlist, S08 Drop dialog, S11 Manage Courses, S13 Manage Users, S14 Reports, S15 Registration Slip. The requirements affected are FR02, FR08, FR09, FR14, FR16 and FR17.

## 3. Plan

Weeks are relative to your start; compress them if your deadline is shorter. The report work runs in parallel and is not shown.

| Weeks | Goal | Output |
| --- | --- | --- |
| 1–2 | Freeze scope; agree the 7 screens; build the design system; sketch every screen on paper | Approved screen list and Figma components |
| 3–5 | Build screens in parallel (owners as in the table) | S01, S04, S05, S07, S09, S10, S12, S16 |
| 6 | Link everything and fix navigation | Full click-through works |
| 7 | Walk through the prototype with the test cases; take screenshots | Chapter 5 screenshots and test results |
| 8 | Freeze the prototype; rehearse the 5-minute demo; start Tier 2 only if ahead | Final prototype link |

Member 3 has the lightest prototype load (20 hours) because that member also owns the test cases, risk analysis and traceability.

## 4. If we fall behind, cut in this order

1. Tier 2 working slice.
2. S12 Manage Offerings: replace it with one static screenshot-style mock.
3. S09 Invoice & Payment: reduce to a single success screen.
4. S16 Notification: show only the toast, no e-mail.

Never cut S05 and S10: they carry the use case, activity, sequence and traceability story.

## 5. Small edits to make in the main report

- **Chapter 5, screen inventory:** add a column “Built / Design only” using the Tier 1 and Tier 3 lists above.
- **Chapter 6:** add one sentence saying the 16.0 person-months estimate is for the complete system, while the student prototype implements the subset in this plan.
- **Chapter 8:** run only the test cases for built screens as walkthrough tests; mark the others “designed, not executed”.

The handbook says the prototype must show the major features; registration with validation, approval and payment are the major workflows, and the report states openly what is not prototyped.

## 6. Definition of done

- [ ] Every Tier 1 screen can be reached by clicking from S01.
- [ ] S05 shows one success state and four error states.
- [ ] The demo follows one story: student registers, advisor approves, student pays, admin sees the offering.
- [ ] Each member can explain every screen and which requirement and use case it covers.
- [ ] Screenshots of all Tier 1 screens are in Chapter 5.

## 7. How to explain this in the viva

“The analysis and design cover the full system. As a three-person student team we built a clickable prototype of the core workflows, about 4% of the estimated effort, and we documented the rest as design only.”
