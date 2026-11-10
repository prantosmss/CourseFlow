/* CourseFlow portal — course catalogue, registration validation and request submission */

/* ---------- course search ---------- */
function courseActionHTML(o){
  const u=state.currentUser;const c=courseOf(o);const existing=regForOffering(u.id,o.id);
  const completed=(u.completed||[]).includes(c.code);
  if(!c.active||o.active===false)return `<button class="btn btn-secondary btn-sm" type="button" disabled>Unavailable</button>`;
  if(completed)return `<button class="btn btn-secondary btn-sm" type="button" disabled>Completed</button>`;
  if(existing){
    const label=existing.status==="Approved"?"Enrolled":existing.status;
    return `<span class="badge badge-${existing.status.toLowerCase()}"><span class="dot"></span>${label}</span>`;
  }
  if(!isRegistrationOpen())return `<button class="btn btn-secondary btn-sm" type="button" disabled>Closed</button>`;
  if(o.enrolled>=o.capacity)return `<button class="btn btn-secondary btn-sm" type="button" data-action="open-waitlist" data-id="${o.id}">${icon("clock",13)} Join waitlist</button>`;
  return `<button class="btn btn-primary btn-sm" type="button" data-action="open-register" data-id="${o.id}">${icon("plus",13)} Register</button>`;
}
function filteredOfferings(){
  const q=state.search.trim().toLowerCase();const dept=state.department;
  return state.offerings.filter(o=>{
    const c=courseOf(o);if(!c||!c.active||o.active===false)return false;
    if(dept!=="all"&&c.dept!==dept)return false;
    if(!q)return true;
    return (c.code+" "+c.title+" "+o.instructor+" "+c.dept).toLowerCase().includes(q);
  }).sort((a,b)=>{const ca=courseOf(a),cb=courseOf(b);return ca.dept.localeCompare(cb.dept)||ca.code.localeCompare(cb.code);});
}
function renderCourseResultsHTML(){
  const list=filteredOfferings();
  if(!list.length)return `<div class="empty-state"><div class="empty-icon">${icon("search",22)}</div><h3>No sections match</h3><p>Try a different course code, title or instructor, or clear the department filter.</p><button class="btn btn-secondary" type="button" data-action="clear-filters">Clear filters</button></div>`;
  return `<div class="table-wrap desktop-table"><table class="data"><thead><tr><th>Course</th><th>Credits</th><th>Instructor</th><th>Schedule</th><th>Seats</th><th style="text-align:right">Action</th></tr></thead><tbody>${list.map(o=>{
    const c=courseOf(o);const left=o.capacity-o.enrolled;const pct=Math.round(o.enrolled/o.capacity*100);const tone=left===0?"danger":left<=3?"warn":"";
    return `<tr data-od-id="search-row-${o.id}"><td><div class="cell-course"><span class="course-code">${esc(c.code)}</span><div><b>${esc(c.title)}</b><span><span class="tag ${deptClass(c.dept)}">${esc(c.dept)}</span> · Sec ${esc(o.section)} · ${esc(o.room)}</span></div></div></td><td><b>${c.credits}</b></td><td><div class="cell-stack"><b>${esc(o.instructor)}</b><span>${esc(DEPT_NAMES[c.dept])}</span></div></td><td><div class="cell-stack"><b>${esc(o.days.join(" / "))}</b><span>${esc(SLOTS[o.slot].label)}</span></div></td><td><div class="seat-cell"><div class="seat-line"><b>${left} left</b><span>${o.enrolled}/${o.capacity}</span></div><div class="progress ${tone}"><span style="width:${pct}%"></span></div></div></td><td style="text-align:right">${courseActionHTML(o)}</td></tr>`;
  }).join("")}</tbody></table></div>
  <div class="mobile-list">${list.map(o=>{
    const c=courseOf(o);const left=o.capacity-o.enrolled;const pct=Math.round(o.enrolled/o.capacity*100);const tone=left===0?"danger":left<=3?"warn":"";
    return `<div class="m-card" data-od-id="search-card-${o.id}"><div class="m-card-top"><div><div class="m-card-title">${esc(c.code)} · ${esc(c.title)}</div><div class="m-card-sub"><span class="tag ${deptClass(c.dept)}">${esc(c.dept)}</span> · Sec ${esc(o.section)} · ${c.credits} credits</div></div><span class="course-code">${esc(c.code)}</span></div><div class="m-meta"><div><span>Instructor</span><b>${esc(o.instructor)}</b></div><div><span>Schedule</span><b>${esc(o.days.join(" / "))} · ${esc(SLOTS[o.slot].short)}</b></div></div><div class="row-between"><div style="flex:1"><div class="seat-line" style="display:flex;justify-content:space-between;font-size:10px;color:var(--muted);margin-bottom:4px"><span>${left} seats left</span><span>${o.enrolled}/${o.capacity}</span></div><div class="progress ${tone}"><span style="width:${pct}%"></span></div></div>${courseActionHTML(o)}</div></div>`;
  }).join("")}</div>`;
}
function updateCourseResults(){
  const el=document.getElementById("course-results");
  if(el)el.innerHTML=renderCourseResultsHTML();
  const count=document.getElementById("results-count");
  if(count){const n=filteredOfferings().length;count.textContent=n+" section"+(n===1?"":"s");}
}
function renderCourseSearch(){
  const n=filteredOfferings().length;
  return `<div data-od-id="course-search">
    <div class="page-head"><div><p class="eyebrow">Fall 2026 catalogue</p><h1>Find your next course.</h1><p class="lede">Search by course code, title or instructor. Validation runs automatically before you submit.</p></div><div class="page-actions"><span class="term-pill">Registration ${isRegistrationOpen()?"open":"closed"}</span></div></div>
    <div class="filter-bar" data-od-id="course-filters"><div class="filter-search"><span class="in-icon">${icon("search",17)}</span><input class="input" id="course-search" type="search" placeholder="Search CSE201, Data Structures, Farhana..." value="${esc(state.search)}" autocomplete="off" /></div><select class="select" id="dept-filter" aria-label="Filter by department"><option value="all">All departments</option>${Object.keys(DEPT_NAMES).map(d=>`<option value="${d}" ${state.department===d?"selected":""}>${d} · ${DEPT_NAMES[d]}</option>`).join("")}</select><button class="btn btn-ghost btn-sm" type="button" data-action="clear-filters">${icon("refresh",14)} Reset</button></div>
    <div class="results-head"><div><h2>Available sections</h2><span class="count" id="results-count">${n} section${n===1?"":"s"}</span></div><div class="result-toolbar"><span class="term-pill">${esc(state.settings.semester)}</span></div></div>
    <div id="course-results">${renderCourseResultsHTML()}</div>
    <p class="help" style="margin-top:14px">${icon("info",12)} A full section opens the waitlist flow. Prerequisites, time clashes and the 18-credit limit are checked before submission.</p>
  </div>`;
}

/* ---------- registration validation / modal ---------- */
function validateRegistration(studentId,offeringId){
  const offering=offeringById(offeringId);const course=courseOf(offering);const user=userById(studentId);
  const completed=(user.completed||[]).includes(course.code);
  const existing=regForOffering(studentId,offeringId);
  const sameCourse=activeRegs(studentId).find(r=>r.offeringId!==offeringId&&courseOf(offeringById(r.offeringId))?.code===course.code);
  const missing=(course.prereq||[]).filter(p=>!(user.completed||[]).includes(p));
  const clashReg=activeRegs(studentId).filter(r=>["Pending","Approved"].includes(r.status)&&r.offeringId!==offeringId).find(r=>{const o=offeringById(r.offeringId);return o&&o.slot===offering.slot&&o.days.some(d=>offering.days.includes(d));});
  const current=creditsUsed(studentId);const projected=current+course.credits;
  const left=offering.capacity-offering.enrolled;
  return {offering,course,user,completed,existing,sameCourse,missing,clashReg,clashCourse:clashReg?courseOf(offeringById(clashReg.offeringId)):null,current,projected,left,full:left<=0,over:projected>CREDIT_LIMIT};
}
function openRegisterModal(offeringId){
  const v=validateRegistration(state.currentUser.id,offeringId);
  if(v.existing&&v.existing.status==="Waitlisted"){openWaitlistModal(offeringId);return;}
  if(v.full&&!v.existing){openWaitlistModal(offeringId);return;}
  const c=v.course,o=v.offering;
  const checks=[
    {pass:!v.completed&&!v.sameCourse&&!v.existing,label:"Course eligibility",detail:v.existing?"You already have an active registration for this section.":v.sameCourse?"You are already registered in "+v.sameCourse.code+".":v.completed?"You have already completed "+c.code+".":"No duplicate or completed-course conflict."},
    {pass:v.missing.length===0,label:"Prerequisite check",detail:v.missing.length?"Missing prerequisite: "+v.missing.join(", ")+". Complete it before registering.":"All prerequisites are satisfied."},
    {pass:!v.clashReg,label:"Time clash check",detail:v.clashReg?"Clashes with "+v.clashCourse.code+" — "+v.clashCourse.title+" on "+v.offering.days.join("/")+" at "+SLOTS[o.slot].label+".":"No overlap with your current schedule."},
    {pass:!v.full,label:"Seat availability",detail:v.full?"This section is full ("+o.enrolled+"/"+o.capacity+"). Join the waitlist instead.":v.left+" of "+o.capacity+" seats available."},
    {pass:!v.over,label:"Credit limit",detail:v.over?"Credit limit exceeded: "+v.current+" + "+c.credits+" = "+v.projected+" of "+CREDIT_LIMIT+" credits.":"Projected load is "+v.projected+" of "+CREDIT_LIMIT+" credits."}
  ];
  const blocked=checks.some(x=>!x.pass);
  openModal(`<div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="reg-modal-title">
    <div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">S04 · Confirm registration</p><h2 id="reg-modal-title">Register for ${esc(c.code)}</h2><p>Review the section and automatic validation before submitting.</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div>
    <div class="modal-body"><div class="confirm-grid">
      <div><div class="course-summary" data-od-id="register-course-summary"><div class="cs-top"><span class="tag ${deptClass(c.dept)}">${esc(c.dept)} · ${esc(DEPT_NAMES[c.dept])}</span><span class="course-code">${esc(c.code)}</span></div><h3>${esc(c.title)}</h3><div class="cs-sub">${esc(c.description)}</div><div class="cs-facts"><div><span>Instructor</span><b>${esc(o.instructor)}</b></div><div><span>Section</span><b>Sec ${esc(o.section)} · ${esc(o.room)}</b></div><div><span>Schedule</span><b>${esc(o.days.join(" / "))}</b></div><div><span>Time</span><b>${esc(SLOTS[o.slot].label)}</b></div><div><span>Credits</span><b>${c.credits} credits</b></div><div><span>Seats</span><b>${v.left} left of ${o.capacity}</b></div></div></div></div>
      <div><div class="credit-meter" data-od-id="register-credit-meter"><div class="cm-top"><div><div class="cm-label">Credit load</div><div class="cm-value">${v.current}<small> / ${CREDIT_LIMIT}</small></div></div><div style="text-align:right"><div class="cm-label">After registration</div><div style="font-family:var(--font-display);font-size:20px;font-weight:600;color:${v.over?"var(--danger)":"var(--success)"}">${v.projected} / ${CREDIT_LIMIT}</div></div></div><div class="progress ${v.over?"danger":v.projected>=CREDIT_LIMIT?"warn":"success"}"><span style="width:${Math.min(100,v.projected/CREDIT_LIMIT*100)}%"></span></div><div class="cm-note">${v.over?"This exceeds the 18-credit semester limit.":"You have "+(CREDIT_LIMIT-v.projected)+" credits remaining after this course."}</div></div>
      <div class="check-list" data-od-id="register-validation">${checks.map(x=>`<div class="check-row ${x.pass?"pass":"fail"}"><span class="check-ic">${icon(x.pass?"check":"x",12)}</span><div><b>${x.label}</b><span>${esc(x.detail)}</span></div></div>`).join("")}</div></div>
    </div></div>
    <div class="modal-foot"><span class="left">${blocked?"Resolve the highlighted checks to continue.":"Submitting reserves a seat and sends the request to your advisor."}</span><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button>${v.full?`<button class="btn btn-secondary" type="button" data-action="open-waitlist" data-id="${o.id}">Join waitlist</button>`:`<button class="btn btn-primary" type="button" data-action="submit-registration" data-id="${o.id}" ${blocked?"disabled":""}>${icon("check",15)} Submit registration</button>`}</div>
  </div>`);
}
function submitRegistration(offeringId){
  if(!isRegistrationOpen()){toast("Registration closed","The registration window is not open.","danger");return;}
  const v=validateRegistration(state.currentUser.id,offeringId);
  if(v.existing){toast("Already registered","You already have an active registration for this section.","warn");return;}
  if(v.completed||v.sameCourse){toast("Registration blocked","You cannot register for this course again.","danger");return;}
  if(v.missing.length){toast("Missing prerequisite","Complete "+v.missing.join(", ")+" before registering.","danger");return;}
  if(v.clashReg){toast("Time clash","This section clashes with "+v.clashCourse.code+" — "+v.clashCourse.title+".","danger");return;}
  if(v.full){openWaitlistModal(offeringId);return;}
  if(v.over){toast("Credit limit exceeded",v.current+" + "+v.course.credits+" = "+v.projected+" of "+CREDIT_LIMIT+" credits.","danger");return;}
  const o=v.offering;const id="REG-"+Date.now().toString().slice(-7);
  state.registrations.push({id,studentId:state.currentUser.id,offeringId,status:"Pending",paymentStatus:"Unpaid",createdAt:new Date().toISOString(),remark:null});
  o.enrolled+=1;
  notify(state.currentUser.id,"Registration submitted",`${v.course.code} ${v.course.title} is pending advisor approval. SMS + email sent.`,"warn");
  const adv=userById(state.currentUser.advisorId);
  if(adv)notify(adv.id,"New registration request",`${state.currentUser.name} submitted ${v.course.code} ${v.course.title}.`,"info");
  toast("Registration submitted","Seat reserved. Pending advisor approval · SMS + email sent.","success");
  renderApp();
  const used=creditsUsed(state.currentUser.id);
  openModal(`<div class="modal narrow" role="dialog" aria-modal="true" aria-labelledby="reg-success-title"><div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">S04 · Submitted</p><h2 id="reg-success-title">Registration received</h2></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div><div class="modal-body"><div class="success-panel"><div class="success-mark">${icon("check",28)}</div><h3>Seat reserved.</h3><p>${esc(v.course.code)} · ${esc(v.course.title)} is now <b>Pending</b>. Your advisor will approve or reject the request, and you will receive an SMS and email.</p><div class="receipt-box"><div class="receipt-line"><span>Registration ID</span><b>${esc(id)}</b></div><div class="receipt-line"><span>Course</span><b>${esc(v.course.code)} · Sec ${esc(o.section)}</b></div><div class="receipt-line"><span>Credits after registration</span><b>${used} / ${CREDIT_LIMIT}</b></div><div class="receipt-line"><span>Status</span><b>Pending advisor approval</b></div></div><div class="row" style="justify-content:center;gap:9px;flex-wrap:wrap"><button class="btn btn-secondary" type="button" data-action="navigate" data-route="dashboard">Go to dashboard</button><button class="btn btn-primary" type="button" data-action="close-modal">Done</button></div></div></div></div>`);
}
