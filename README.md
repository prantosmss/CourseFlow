# CourseFlow

Online course registration system for **Stamford University Bangladesh**. CourseFlow lets students search the catalogue, validate registrations before submission, track advisor decisions, and pay invoices. Faculty advisors review requests, and administrators manage the catalogue, offerings, term dates, and accounts.

This repository contains a self-contained front-end prototype built with HTML, CSS, and vanilla JavaScript. There is no build step and no backend; all demo data lives in memory for the duration of the browser session.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Public landing page with an interactive registration-rules demo and a screen index. |
| `portal.html` | Registration portal for students, faculty advisors, and administrators. |

## Demo accounts

| Role | University ID | Password |
| --- | --- | --- |
| Student | `2024001` | `student123` |
| Advisor | `ADV01` | `advisor123` |
| Administrator | `ADMIN` | `admin123` |

Use the **Demo guide** button inside the portal for three end-to-end scenarios covering registration, validation, waitlists, payments, and administration.

## Project structure

```text
CourseFlow/
├── index.html                  # Landing page
├── portal.html                 # Registration portal (student / advisor / admin)
├── README.md
├── assets/
│   ├── css/
│   │   ├── base.css            # Design tokens, reset, utilities, buttons, forms, badges
│   │   ├── layout.css          # Cards, login screen, application shell
│   │   ├── components.css      # Dashboard, timetable, tables, modals, payments, admin
│   │   ├── responsive.css      # Breakpoints and reduced-motion support
│   │   └── landing.css         # Landing-page styles
│   ├── images/
│   │   └── logo.svg
│   └── js/
│       ├── config.js           # Constants, time slots, icon set, route metadata
│       ├── utils.js            # Formatting, dates, selectors, status badges
│       ├── data.js             # Seed data and in-memory state
│       ├── ui.js               # Toasts, modals, guide, notifications
│       ├── auth.js             # Sign-in, lockout, session lifecycle
│       ├── shell.js            # Navigation shell, sidebar, top bar
│       ├── main.js             # Delegated event handlers and bootstrap
│       ├── landing.js          # Landing-page demo and screen index
│       └── views/
│           ├── student.js      # Student dashboard, timetable, registration history
│           ├── catalog.js      # Course search and registration validation
│           ├── enrollments.js  # Waitlist queue, drops, seat promotion
│           ├── payments.js     # Invoices, gateway simulation, receipts
│           ├── advisor.js      # Approval queue and decision history
│           └── admin.js        # Catalogue, offerings, term settings, users
└── docs/                       # Project report and supporting documentation
```

## Run locally

Open `index.html` directly in a browser, or serve the folder over HTTP:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## Implementation notes

- The portal uses classic, sequentially loaded scripts so it also works when opened from the filesystem. All modules share one global in-memory `state` object.
- CSS is split by responsibility and loaded in order: base, layout, components, responsive.
- Registration is validated against duplicate enrolment, completed courses, prerequisites, timetable clashes, seat capacity, and the 18-credit semester limit.
- Payments, waitlists, approvals, notifications, and account lockouts are simulated for demonstration purposes. No real money is processed and no live student records are used.
