/* CourseFlow landing page — interactive rules demo and screen index */

/* ---------- Live registration demo (FR03, FR04, UC11) ---------- */
const LIMIT = 18;
const START = [
  { code: "CSE 331", slot: "Sun/Tue 10:00" },
  { code: "CSE 341", slot: "Mon/Wed 12:00" }
];
const BASE_CREDITS = 15;
const OFFERINGS = [
  { id: "a", code: "CSE 225", title: "Algorithms", slot: "Sat/Mon 09:00", cr: 3, seats: 8, prereq: "CSE 221" },
  { id: "b", code: "MAT 211", title: "Linear Algebra", slot: "Sun/Tue 10:00", cr: 3, seats: 14, clash: "CSE 331" },
  { id: "c", code: "EEE 201", title: "Circuits", slot: "Thu 14:00", cr: 3, seats: 0 },
  { id: "d", code: "CSE 311", title: "Database Systems", slot: "Mon/Wed 15:00", cr: 3, seats: 6 },
  { id: "e", code: "ENG 301", title: "Technical Writing", slot: "Sat 11:00", cr: 3, seats: 20 }
];

const $ = (s) => document.querySelector(s);
let credits, status;

function resetDemo() {
  credits = BASE_CREDITS;
  status = {};
  renderDemo();
  say("Pick a section and select Register to see how each rule responds.");
}

function say(text, kind = "") {
  const m = $("#msg");
  m.textContent = text;
  m.className = "msg " + kind;
}

function badge(s) {
  const map = { Pending: "b-pending", Waitlisted: "b-waitlisted" };
  return `<span class="badge ${map[s]}">${s}</span>`;
}

function renderDemo() {
  $("#offerings").innerHTML = OFFERINGS.map((o) => {
    const s = status[o.id];
    const seats = o.seats ? `${o.seats} seats left` : "Section full";
    const action = s
      ? badge(s)
      : `<button class="btn btn-secondary btn-sm" data-id="${o.id}" type="button">Register</button>`;
    return `<li class="row"><div class="info"><b>${o.code} · ${o.title}</b><span>${o.slot} · ${o.cr} credits · ${seats}</span></div>${action}</li>`;
  }).join("");
  $("#credits").textContent = `${credits} / ${LIMIT} credits`;
  $("#bar").style.width = Math.min(100, (credits / LIMIT) * 100) + "%";
}

function tryRegister(id) {
  const o = OFFERINGS.find((x) => x.id === id);
  // Same order as UC11: prerequisites, time clash, seat, credit limit
  if (o.prereq) return say(`Can't register for ${o.code}: you haven't completed the prerequisite ${o.prereq}.`, "err");
  if (o.clash) return say(`Can't register for ${o.code}: it clashes with ${o.clash} (${o.slot}).`, "err");
  if (o.seats === 0) {
    status[o.id] = "Waitlisted";
    renderDemo();
    return say(`${o.code} is full. You joined the waitlist at position 1. You'll be enrolled when a seat is released.`, "wait");
  }
  if (credits + o.cr > LIMIT) return say(`Can't register for ${o.code}: ${credits + o.cr} credits would exceed the ${LIMIT}-credit limit.`, "err");
  credits += o.cr;
  o.seats -= 1;
  status[o.id] = "Pending";
  renderDemo();
  say(`${o.code} saved as Pending. Your advisor and you have been notified.`, "ok");
}

$("#offerings").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (b) tryRegister(b.dataset.id);
});
$("#reset").addEventListener("click", () => {
  OFFERINGS.find((x) => x.id === "d").seats = 6;
  OFFERINGS.find((x) => x.id === "e").seats = 20;
  resetDemo();
});

/* ---------- Screen gallery (Part E.1) ---------- */
const SCREENS = [
  ["S01", "Login", "All", "UC01", "FR01", "ID and password, error and locked-account messages."],
  ["S02", "Student dashboard and schedule", "Student", "UC06", "FR08", "Weekly timetable, status badges and deadlines."],
  ["S03", "Course search", "Student", "UC02", "FR02", "Search box, filters and results with seats left."],
  ["S04", "Register for course", "Student", "UC03, UC11", "FR03", "Credit counter and messages for prerequisite, clash, full section and credit limit."],
  ["S05", "Waitlist dialog", "Student", "UC04", "FR04", "Full-section notice, join button and waitlist position."],
  ["S06", "Drop course dialog", "Student", "UC05", "FR05", "Confirmation and deadline notice."],
  ["S07", "Invoice and payment", "Student", "UC07", "FR07", "Invoice lines, total, payment method and result page."],
  ["S08", "Pending approvals", "Advisor", "UC08", "FR06", "Advisee list with Approve and Reject (remark required)."],
  ["S09", "Manage courses and offerings", "Admin", "UC09", "FR09", "Course table, section form, capacity and dates."],
  ["S10", "Manage users", "Admin", "UC10", "FR09", "User table, create or disable, role dropdown."]
];
const ROLES = ["All", "Student", "Advisor", "Admin"];
let role = "All";

function renderTabs() {
  $("#tabs").innerHTML = ROLES.map((r) => `<button class="tab" type="button" aria-pressed="${r === role}" data-role="${r}">${r === "All" ? "All screens" : r}</button>`).join("");
}
function renderScreens() {
  const list = SCREENS.filter((s) => role === "All" || s[2] === role || s[2] === "All");
  $("#screens-grid").innerHTML = list.map(([id, name, who, uc, fr, desc]) =>
    `<article class="screen"><div class="shot">${id} screenshot</div><div class="body"><div class="meta">${who} · ${uc} · ${fr}</div><h3>${id} ${name}</h3><p>${desc}</p></div></article>`
  ).join("");
}
$("#tabs").addEventListener("click", (e) => {
  const b = e.target.closest("[data-role]");
  if (!b) return;
  role = b.dataset.role;
  renderTabs();
  renderScreens();
});

resetDemo();
renderTabs();
renderScreens();
