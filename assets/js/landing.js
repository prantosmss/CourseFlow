/* CourseFlow landing page — navigation, role previews, validation playground */

document.documentElement.classList.add("js");

/* ---------- navigation ---------- */
const head = document.getElementById("site-head");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.getElementById("site-nav");

function closeNav() {
  if (!siteNav || !navToggle) return;
  siteNav.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const open = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  siteNav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeNav();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && siteNav.classList.contains("is-open")) {
      closeNav();
      navToggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 860) closeNav();
  });
}

if (head) {
  const setScrolled = () => head.classList.toggle("scrolled", window.scrollY > 8);
  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });
}

/* ---------- role preview tabs ---------- */
const roleTabs = Array.from(document.querySelectorAll("[data-role-tab]"));
const rolePanels = Array.from(document.querySelectorAll("[data-role-panel]"));

function selectRole(name, moveFocus = false) {
  roleTabs.forEach((tab) => {
    const selected = tab.dataset.roleTab === name;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && moveFocus) tab.focus();
  });
  rolePanels.forEach((panel) => {
    panel.hidden = panel.dataset.rolePanel !== name;
  });
}

roleTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectRole(tab.dataset.roleTab));
  tab.addEventListener("keydown", (e) => {
    let next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (index + 1) % roleTabs.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (index - 1 + roleTabs.length) % roleTabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = roleTabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    selectRole(roleTabs[next].dataset.roleTab, true);
  });
});

/* ---------- validation playground ---------- */
const LIMIT = 18;
const BASE_CREDITS = 15;
const OFFERINGS = [
  { id: "a", code: "CSE 225", title: "Algorithms", slot: "Sat/Mon 09:00", cr: 3, seats: 8, prereq: "CSE 221" },
  { id: "b", code: "MAT 211", title: "Linear Algebra", slot: "Sun/Tue 10:00", cr: 3, seats: 14, clash: "CSE 331" },
  { id: "c", code: "EEE 201", title: "Circuits", slot: "Thu 14:00", cr: 3, seats: 0 },
  { id: "d", code: "CSE 311", title: "Database Systems", slot: "Mon/Wed 15:00", cr: 3, seats: 6 },
  { id: "e", code: "ENG 301", title: "Technical Writing", slot: "Sat 11:00", cr: 3, seats: 20 }
];
const INITIAL_SEATS = OFFERINGS.map((o) => o.seats);

const $ = (s) => document.querySelector(s);
let credits;
let status;

function say(text, kind = "") {
  const m = $("#msg");
  m.textContent = text;
  m.className = "demo-msg " + kind;
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
    return `<li class="demo-row"><div class="info"><b>${o.code} · ${o.title}</b><span>${o.slot} · ${o.cr} credits · ${seats}</span></div>${action}</li>`;
  }).join("");
  $("#credits").textContent = `${credits} / ${LIMIT} credits`;
  $("#bar").style.width = Math.min(100, (credits / LIMIT) * 100) + "%";
}

function tryRegister(id) {
  const o = OFFERINGS.find((x) => x.id === id);
  if (o.prereq) return say(`Can't register for ${o.code}: the prerequisite ${o.prereq} hasn't been completed.`, "err");
  if (o.clash) return say(`Can't register for ${o.code}: it clashes with ${o.clash} (${o.slot}).`, "err");
  if (o.seats === 0) {
    status[o.id] = "Waitlisted";
    renderDemo();
    return say(`${o.code} is full. You joined the waitlist at position 1 — you'll be enrolled when a seat opens.`, "wait");
  }
  if (credits + o.cr > LIMIT) return say(`Can't register for ${o.code}: ${credits + o.cr} credits would exceed the ${LIMIT}-credit limit.`, "err");
  credits += o.cr;
  o.seats -= 1;
  status[o.id] = "Pending";
  renderDemo();
  say(`${o.code} added as Pending. Your advisor has been notified.`, "ok");
}

function resetDemo() {
  credits = BASE_CREDITS;
  status = {};
  OFFERINGS.forEach((o, i) => { o.seats = INITIAL_SEATS[i]; });
  renderDemo();
  say("Select a section to see how CourseFlow checks it before submission.");
}

$("#offerings").addEventListener("click", (e) => {
  const b = e.target.closest("button[data-id]");
  if (b) tryRegister(b.dataset.id);
});
$("#reset").addEventListener("click", resetDemo);

resetDemo();

/* ---------- scroll reveal ---------- */
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

  document.querySelectorAll(".section-head, .cap-grid, .role-tabs, .validation-copy, .demo-shell, .flow-step, .cta-inner").forEach((el, i) => {
    el.classList.add("reveal");
    el.style.setProperty("--d", `${(i % 3) * 60}ms`);
    observer.observe(el);
  });
}
