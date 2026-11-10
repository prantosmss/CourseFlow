# CourseFlow: Online Course Registration System

**Design, Prototype, Planning and Cost Estimation of an Online Course Registration System (OCRS)**

Stamford University Bangladesh  
Department of Computer Science & Engineering  
Course: System Design & Software Engineering Sessional (0613CSE432)  
Faculty: Zerin Hasan Sahosh, Lecturer, Department of CSE

---

## Access and Deployment

The system is deployed on Vercel. To visit the site, click the deployment link shown below the repository description, or use the direct link below:

**[Click here to visit CourseFlow](https://courseflow-sub.vercel.app)**

No installation or local server is required. The application runs entirely in a web browser.

---

## Abstract

CourseFlow is a role-based web prototype of an online course registration system designed for Stamford University Bangladesh. The prototype demonstrates the complete registration lifecycle: course discovery, automated eligibility checks, advisor approval, waitlist management, course drops, fee invoicing and simulated online payment. Three actors are supported — student, faculty advisor and administrator — each with a dedicated workspace and access permissions.

The implementation is a client-side, high-fidelity prototype developed with HTML5, CSS3 and vanilla JavaScript. Business rules such as prerequisite completion, timetable conflicts, seat availability and the 18-credit semester limit are enforced before a registration request is submitted. External services, including the payment gateway and SMS/email notifications, are simulated so that the system can be demonstrated without processing real transactions or personal data.

**Keywords:** online course registration, role-based access control, business rule validation, waitlist, academic workflow, web prototype.

---

## 1. Introduction

At the beginning of each semester, students must select courses, verify prerequisites, avoid timetable conflicts, observe the credit limit, obtain advisor approval and pay tuition fees. When these activities are performed through paper forms, spreadsheets or disconnected tools, registration becomes slow, error-prone and difficult to audit.

CourseFlow addresses this problem by providing a single web interface for the entire registration workflow. The prototype establishes one source of truth for courses, sections, schedules, registration status, approvals and payments, and it applies validation rules before a request reaches an advisor.

The prototype is intended for academic demonstration and requirements validation. It illustrates how the functional requirements, business rules and role-based interactions described in the project report can be realised in a working interface.

## 2. Objectives

The prototype pursues the following objectives:

1. Provide a role-based portal for students, faculty advisors and administrators.
2. Validate prerequisites, timetable clashes, seat capacity and credit limits before registration.
3. Support advisor approval and rejection with a recorded remark.
4. Implement waitlist management and automatic seat promotion.
5. Link approved registrations to fee invoicing and a simulated payment gateway.
6. Allow administrators to manage courses, offerings, term dates and user accounts.
7. Demonstrate the system design through a high-fidelity, browser-based prototype.

## 3. Actors and Scope

| Actor | Responsibility in the prototype |
| --- | --- |
| Student | Searches offered sections, registers, joins waitlists, drops courses, views the weekly timetable and pays invoices. |
| Faculty Advisor | Reviews pending requests from assigned advisees and approves or rejects them with a remark. |
| Administrator | Manages the course catalogue, sections, capacity, registration and drop dates, and user access. |

The prototype covers authentication, course search, registration validation, advisor approval, waitlisting, course drops, invoicing, payment simulation, notifications and administrative management. It does not manage grades, transcripts, attendance, payroll or examination scheduling, consistent with the scope defined in the project report.

## 4. Functional Overview

| Requirement | Prototype implementation |
| --- | --- |
| FR01 | Role-based sign-in with account lockout after five failed attempts. |
| FR03–FR04 | Course catalogue search, filtering and section registration. |
| FR05–FR07 | Validation of prerequisites, timetable clashes, seat availability and credit limit. |
| FR08 | Waitlist queue with automatic promotion when a seat is released. |
| FR09 | Course drop before the deadline, with immediate seat release. |
| FR10 | Advisor approval or rejection with a mandatory remark. |
| FR11 | Invoice generation from approved credits and simulated online payment. |
| FR13 | Administrative management of courses, offerings and term settings. |

## 5. Demonstration Accounts

| Role | University ID | Password |
| --- | --- | --- |
| Student | `2024001` | `student123` |
| Faculty Advisor | `ADV01` | `advisor123` |
| Administrator | `ADMIN` | `admin123` |

The **Demo guide** inside the portal provides three end-to-end scenarios: full registration and payment, validation and waitlisting, and administrative management.

## 6. System Architecture and Implementation

The system is implemented as a static front-end prototype. It has no server-side component and does not require a build step.

| Layer | Implementation |
| --- | --- |
| Presentation | Semantic HTML5 and a responsive CSS architecture. |
| Application logic | Vanilla JavaScript modules loaded in dependency order. |
| State management | A single in-memory state object shared by all role views. |
| Data | Seeded demonstration data for courses, sections, users, registrations and transactions. |
| External services | Simulated payment gateway and simulated SMS/email notifications. |

The CSS is organised by responsibility: design tokens and controls, layout and application shell, feature components, responsive behaviour, and landing-page styling. The JavaScript is separated into configuration, utility functions, seed data, shared UI helpers, authentication, application shell, role-specific views and a bootstrap module.

## 7. Repository Structure

```text
CourseFlow/
├── index.html                  # Landing page and interactive rules demonstration
├── portal.html                 # Registration portal for all three roles
├── README.md
├── assets/
│   ├── css/
│   │   ├── base.css            # Tokens, reset, utilities, controls and badges
│   │   ├── layout.css          # Cards, login screen and application shell
│   │   ├── components.css      # Dashboard, tables, modals, payments and administration
│   │   ├── responsive.css      # Breakpoints and reduced-motion support
│   │   └── landing.css         # Landing-page styles
│   ├── images/
│   │   ├── favicon.svg
│   │   └── logo.svg
│   └── js/
│       ├── config.js           # Constants, time slots, icons and route metadata
│       ├── utils.js            # Formatting, date helpers, selectors and status badges
│       ├── data.js             # Seed data and in-memory state
│       ├── ui.js               # Toasts, modals, guide and notifications
│       ├── auth.js             # Sign-in, lockout and session lifecycle
│       ├── shell.js            # Navigation shell, sidebar and top bar
│       ├── main.js             # Event handlers and application bootstrap
│       ├── landing.js          # Landing-page demo and screen index
│       └── views/
│           ├── student.js      # Student dashboard, timetable and registration history
│           ├── catalog.js      # Course search and registration validation
│           ├── enrollments.js  # Waitlist, drops and seat promotion
│           ├── payments.js     # Invoices, gateway simulation and receipts
│           ├── advisor.js      # Approval queue and decision history
│           └── admin.js        # Catalogue, offerings, term settings and users
└── docs/                       # Project report and supporting documentation
```

## 8. Validation and Testing

The prototype was assessed through the following demonstration scenarios:

1. **Registration and approval:** A student registers for a valid section, the request appears in the advisor queue, the advisor approves it, and the student pays the resulting invoice.
2. **Business-rule validation:** Registration is blocked when prerequisites are missing, class times clash, the section is full or the projected credit load exceeds 18 credits.
3. **Waitlist management:** A student joins the waitlist for a full section and is promoted automatically when a seat is released.
4. **Administration:** An administrator creates or edits a course, publishes an offering, changes term dates and enables or disables an account.
5. **Payment outcomes:** The gateway simulation supports both successful payment and a declined transaction, with the invoice status updated accordingly.

The JavaScript modules were additionally checked for syntax validity, and the role-specific views were smoke-tested to confirm that each dashboard renders without runtime errors.

## 9. Limitations and Future Work

The current implementation is a front-end prototype. Its limitations are deliberate:

- Application state is held in memory and is reset when the page is reloaded.
- Authentication, authorisation and data storage are simulated in the browser.
- Payment, SMS and email services are demonstrations only.
- The data set represents a single semester and does not integrate with a university ERP or student information system.

Future work would include a persistent backend and database, secure authentication, integration with a payment-gateway sandbox and notification service, generated PDF registration slips, administrative reporting, accessibility auditing and automated unit and end-to-end tests.

## 10. Documentation

The complete academic documentation — including requirement analysis, use cases, UML diagrams, process model, estimation, testing and cost analysis — is available in the `docs/` directory:

- `docs/Online Course Registration System – SDSE Project Report.md`
- `docs/OCRS – What We Will Actually Build.md`

The README focuses on the deployed prototype and its evaluation. The project report remains the authoritative design document for the system.
