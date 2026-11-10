/* CourseFlow portal — student dashboard, timetable and registration history */

/* ---------- student dashboard ---------- */
function daysUntil(s){const t=new Date();t.setHours(0,0,0,0);return Math.ceil((parseDate(s)-t)/86400000);}
function scheduleText(o){return o.days.join("/")+" · "+SLOTS[o.slot].label;}
function timetableHTML(studentId){
  const regs=activeRegs(studentId).filter(r=>["Approved","Pending"].includes(r.status));
  const blocks=regs.map(r=>({r,o:offeringById(r.offeringId),c:courseOf(offeringById(r.offeringId))})).filter(x=>x.o&&x.c);
  let html=`<div class="timetable-scroll"><div class="timetable" data-od-id="weekly-timetable">`;
  html+=`<div></div>`+DAYS.map(d=>`<div class="tt-day">${d}</div>`).join("");
  for(const key of Object.keys(SLOTS)){
    html+=`<div class="tt-time">${SLOTS[key].label.split(" – ")[0]}<span>${SLOTS[key].label.split(" – ")[1]}</span></div>`;
    for(const day of DAYS){
      const items=blocks.filter(x=>x.o.days.includes(day)&&x.o.slot===key);
      html+=`<div class="tt-cell ${items.length?"":"empty"}">`;
      for(const x of items){
        html+=`<div class="course-block ${deptClass(x.c.dept)} ${x.r.status==="Pending"?"pending":""}" data-od-id="timetable-block-${x.r.id}" title="${esc(x.c.code+" · "+x.c.title+" · "+x.o.room)}">
          <div class="cb-code">${esc(x.c.code)}</div><div class="cb-title">${esc(x.c.title)}</div><div class="cb-meta">${esc(x.o.room)} · ${x.r.status==="Pending"?"Pending":"Enrolled"}</div></div>`;
      }
      html+=`</div>`;
    }
  }
  html+=`</div></div>`;
  if(!blocks.length)html=`<div class="empty-state" style="padding:30px"><div class="empty-icon">${icon("calendar",22)}</div><h3>No classes yet</h3><p>Your approved and pending courses will appear on the weekly timetable.</p></div>`;
  return html;
}
function regActionHTML(r){
  const c=courseOf(offeringById(r.offeringId));
  let html="";
  if(r.status==="Approved"&&r.paymentStatus!=="Paid")html+=`<button class="btn btn-primary btn-sm" type="button" data-action="navigate" data-route="payments">Pay now</button> `;
  if(["Pending","Approved","Waitlisted"].includes(r.status)){
    if(isDropOpen())html+=`<button class="btn btn-secondary btn-sm" type="button" data-action="open-drop" data-id="${r.id}">Drop</button>`;
    else html+=`<button class="btn btn-secondary btn-sm" type="button" disabled title="Drop deadline passed">Closed</button>`;
  }
  if(r.status==="Dropped"||r.status==="Rejected")html=`<span class="tiny muted">-</span>`;
  return html;
}
function registrationRowsHTML(studentId){
  const regs=studentRegs(studentId).slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
  if(!regs.length)return `<div class="empty-state"><div class="empty-icon">${icon("bookOpen",22)}</div><h3>No registrations yet</h3><p>Search the Fall 2026 catalogue and submit your first registration request.</p><button class="btn btn-primary" type="button" data-action="navigate" data-route="search">Browse courses</button></div>`;
  return `<div class="table-wrap desktop-table"><table class="data"><thead><tr><th>Course</th><th>Schedule</th><th>Credits</th><th>Status</th><th>Payment</th><th style="text-align:right">Action</th></tr></thead><tbody>${regs.map(r=>{
    const o=offeringById(r.offeringId),c=courseOf(o);
    return `<tr data-od-id="registration-row-${r.id}"><td><div class="cell-course"><span class="course-code">${esc(c.code)}</span><div><b>${esc(c.title)}</b><span>${esc(o.instructor)} · Sec ${esc(o.section)}</span></div></div></td><td><div class="cell-stack"><b>${esc(o.days.join(" / "))}</b><span>${esc(SLOTS[o.slot].label)}</span></div></td><td><b>${c.credits}</b></td><td>${statusBadge(r.status)}</td><td>${paymentBadge(r)||'<span class="tiny muted">-</span>'}</td><td style="text-align:right">${regActionHTML(r)}</td></tr>`;
  }).join("")}</tbody></table></div>
  <div class="mobile-list">${regs.map(r=>{
    const o=offeringById(r.offeringId),c=courseOf(o);
    return `<div class="m-card" data-od-id="registration-card-${r.id}"><div class="m-card-top"><div><div class="m-card-title">${esc(c.code)} · ${esc(c.title)}</div><div class="m-card-sub">${esc(o.instructor)} · Sec ${esc(o.section)}</div></div>${statusBadge(r.status)}</div><div class="m-meta"><div><span>Schedule</span><b>${esc(o.days.join(" / "))} · ${esc(SLOTS[o.slot].short)}</b></div><div><span>Credits</span><b>${c.credits} credits</b></div></div><div class="m-actions">${paymentBadge(r)||""}${regActionHTML(r)}</div></div>`;
  }).join("")}</div>`;
}
function renderStudentDashboard(){
  const u=state.currentUser;const used=creditsUsed(u.id);const pct=Math.round(used/CREDIT_LIMIT*100);
  const regs=activeRegs(u.id);const approved=regs.filter(r=>r.status==="Approved");
  const pending=regs.filter(r=>r.status==="Pending").length;
  const waitlisted=regs.filter(r=>r.status==="Waitlisted").length;
  const due=invoiceTotal(u.id);const advisor=userById(u.advisorId);
  const hour=new Date().getHours();const greet=hour<12?"Good morning":hour<17?"Good afternoon":"Good evening";
  const dropDays=daysUntil(state.settings.dropDeadline),regDays=daysUntil(state.settings.registrationClose),payDays=daysUntil(state.settings.paymentDue);
  return `<div data-od-id="student-dashboard">
    <div class="page-head"><div><p class="eyebrow">Student portal · ${esc(state.settings.semester)}</p><h1>${greet}, ${esc(u.name.split(" ")[0])}.</h1><p class="lede">Your semester at a glance — schedule, registration status and everything waiting on you.</p></div><div class="page-actions"><button class="btn btn-secondary" type="button" data-action="navigate" data-route="payments">${icon("wallet",16)} Pay fees</button><button class="btn btn-primary" type="button" data-action="navigate" data-route="search">${icon("search",16)} Browse courses</button></div></div>
    <div class="stats-grid" data-od-id="student-stats">
      <div class="stat-card"><div class="stat-top"><span class="stat-label">Credits used</span><span class="stat-icon accent">${icon("bookOpen",16)}</span></div><div class="stat-value">${used}<small> / ${CREDIT_LIMIT}</small></div><div class="stat-note"><strong>${CREDIT_LIMIT-used} credits</strong> still available</div><div class="stat-progress"><div class="progress ${pct>=90?"warn":""}"><span style="width:${pct}%"></span></div></div></div>
      <div class="stat-card"><div class="stat-top"><span class="stat-label">Active courses</span><span class="stat-icon">${icon("calendar",16)}</span></div><div class="stat-value">${approved.length}</div><div class="stat-note">${regs.length-approved.length} request${regs.length-approved.length===1?"":"s"} in progress</div></div>
      <div class="stat-card"><div class="stat-top"><span class="stat-label">Pending approvals</span><span class="stat-icon">${icon("clock",16)}</span></div><div class="stat-value">${pending}</div><div class="stat-note">${pending?"Waiting on your advisor":"Nothing waiting on you"}</div></div>
      <div class="stat-card"><div class="stat-top"><span class="stat-label">Outstanding</span><span class="stat-icon">${icon("receipt",16)}</span></div><div class="stat-value" style="font-size:24px">${due?money(due):"Settled"}</div><div class="stat-note">${due?`${invoiceCredits(u.id)} credits · due ${dateShort(state.settings.paymentDue)}`:"No unpaid approved courses"}</div></div>
    </div>
    <div class="dashboard-grid">
      <section class="card timetable-card" data-od-id="student-timetable-card"><div class="card-head"><div><h2>Weekly schedule</h2><p>${esc(state.settings.semester)} · Sunday to Thursday</p></div><span class="term-pill">${approved.length} courses · ${used} credits</span></div>${timetableHTML(u.id)}</section>
      <aside class="side-stack">
        <div class="card" data-od-id="student-deadlines"><div class="card-head" style="padding-bottom:12px"><div><h2 style="font-size:15px">Key dates</h2><p>Fall 2026</p></div>${icon("calendar",18)}</div><div class="card-body" style="padding-top:6px"><div class="deadline-list">
          <div class="deadline-row"><div class="deadline-icon">${icon("checkSquare",15)}</div><div><b>Registration closes</b><span>${dateLong(state.settings.registrationClose)}</span></div><span class="due">${regDays>0?regDays+"d left":"Closed"}</span></div>
          <div class="deadline-row"><div class="deadline-icon">${icon("xCircle",15)}</div><div><b>Last day to drop</b><span>${dateLong(state.settings.dropDeadline)}</span></div><span class="due">${dropDays>0?dropDays+"d left":"Passed"}</span></div>
          <div class="deadline-row"><div class="deadline-icon">${icon("wallet",15)}</div><div><b>Payment due</b><span>${dateLong(state.settings.paymentDue)}</span></div><span class="due">${payDays>0?payDays+"d left":"Due"}</span></div>
        </div></div></div>
        <div class="card advisor-card" data-od-id="student-advisor-card"><div class="card-body"><div class="advisor-top"><div class="avatar">${advisor?initials(advisor.name):"NA"}</div><div><b>${advisor?esc(advisor.name):"No advisor assigned"}</b><span>Faculty advisor · ${advisor?esc(advisor.dept):"-"}</span></div></div><p>${waitlisted?`You are on ${waitlisted} waitlist${waitlisted===1?"":"s"}. A released seat is offered in queue order.`:"Your advisor reviews pending registrations. You will receive an SMS and email when a decision is made."}</p><button class="advisor-link" type="button" data-action="open-notifications">${icon("mail",13)} View notifications ${icon("arrowRight",13)}</button></div></div>
      </aside>
    </div>
    <section class="card" data-od-id="student-registrations"><div class="card-head"><div><h2>My registrations</h2><p>Every request, decision and payment in one place</p></div><button class="btn btn-secondary btn-sm" type="button" data-action="navigate" data-route="search">${icon("plus",14)} Add course</button></div><div class="card-body" style="padding:0">${registrationRowsHTML(u.id)}</div></section>
  </div>`;
}
