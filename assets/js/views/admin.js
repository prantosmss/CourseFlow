/* CourseFlow portal — catalogue management, offerings, term settings and user access */


/* ---------- admin courses & offerings ---------- */
function renderAdminCourses(){
  const tab=state.adminTab;const activeCourses=state.courses.filter(c=>c.active).length;
  const totalSeats=state.offerings.reduce((s,o)=>s+o.capacity,0),filled=state.offerings.reduce((s,o)=>s+o.enrolled,0);
  const courses=state.courses.slice().sort((a,b)=>a.dept.localeCompare(b.dept)||a.code.localeCompare(b.code));
  const offerings=state.offerings.slice().sort((a,b)=>a.code.localeCompare(b.code));
  return `<div data-od-id="admin-courses">
    <div class="page-head"><div><p class="eyebrow">Administration · ${esc(state.settings.semester)}</p><h1>Courses &amp; offerings.</h1><p class="lede">Maintain the catalogue, publish sections and control the registration and drop windows.</p></div><div class="page-actions"><button class="btn btn-secondary" type="button" data-action="add-course">${icon("plus",16)} Add course</button><button class="btn btn-primary" type="button" data-action="add-offering">${icon("plus",16)} New offering</button></div></div>
    <div class="mini-stat-row" data-od-id="admin-course-stats"><div class="mini-stat"><span>Active courses</span><b>${activeCourses}</b></div><div class="mini-stat"><span>Published offerings</span><b>${state.offerings.length}</b></div><div class="mini-stat"><span>Seats filled</span><b>${filled}<small style="font-family:var(--font-body);font-size:11px;color:var(--muted);font-weight:500"> / ${totalSeats}</small></b></div></div>
    <div class="tabs" data-od-id="admin-tabs"><button class="tab ${tab==="courses"?"active":""}" type="button" data-action="admin-tab" data-tab="courses">Courses <span class="tab-count">${state.courses.length}</span></button><button class="tab ${tab==="offerings"?"active":""}" type="button" data-action="admin-tab" data-tab="offerings">Offerings <span class="tab-count">${state.offerings.length}</span></button><button class="tab ${tab==="dates"?"active":""}" type="button" data-action="admin-tab" data-tab="dates">Term settings</button></div>
    ${tab==="courses"?`<section class="card" data-od-id="admin-course-table"><div class="admin-toolbar"><div class="left"><h2>Catalogue</h2><span class="tiny muted">Duplicate course codes are rejected</span></div><button class="btn btn-secondary btn-sm" type="button" data-action="add-course">${icon("plus",14)} Add course</button></div><div class="table-wrap"><table class="data"><thead><tr><th>Course</th><th>Department</th><th>Credits</th><th>Prerequisite</th><th>Status</th><th style="text-align:right">Actions</th></tr></thead><tbody>${courses.map(c=>`<tr data-od-id="admin-course-${c.code}"><td><div class="cell-course"><span class="course-code">${esc(c.code)}</span><div><b>${esc(c.title)}</b><span>${esc(c.description)}</span></div></div></td><td><span class="tag ${deptClass(c.dept)}">${esc(c.dept)}</span></td><td><b>${c.credits}</b></td><td>${c.prereq.length?`<span class="course-code">${esc(c.prereq.join(", "))}</span>`:'<span class="tiny muted">None</span>'}</td><td>${c.active?`<span class="badge badge-approved"><span class="dot"></span>Active</span>`:`<span class="badge badge-dropped"><span class="dot"></span>Inactive</span>`}</td><td style="text-align:right"><button class="btn btn-secondary btn-sm" type="button" data-action="edit-course" data-code="${c.code}">${icon("edit",13)} Edit</button> <button class="btn btn-ghost btn-sm" type="button" data-action="toggle-course" data-code="${c.code}">${c.active?icon("pause",13)+" Deactivate":icon("play",13)+" Activate"}</button></td></tr>`).join("")}</tbody></table></div></section>`:tab==="offerings"?`<section class="card" data-od-id="admin-offering-table"><div class="admin-toolbar"><div class="left"><h2>Published sections</h2><span class="tiny muted">New offerings appear in student search immediately</span></div><button class="btn btn-secondary btn-sm" type="button" data-action="add-offering">${icon("plus",14)} New offering</button></div><div class="table-wrap"><table class="data"><thead><tr><th>Course</th><th>Section</th><th>Schedule</th><th>Instructor</th><th>Capacity</th><th style="text-align:right">Actions</th></tr></thead><tbody>${offerings.map(o=>{const c=courseOf(o);return `<tr data-od-id="admin-offering-${o.id}"><td><div class="cell-course"><span class="course-code">${esc(c.code)}</span><div><b>${esc(c.title)}</b><span>${esc(o.room)} · ${esc(o.semester)}</span></div></div></td><td><b>${esc(o.section)}</b></td><td><div class="cell-stack"><b>${esc(o.days.join(" / "))}</b><span>${esc(SLOTS[o.slot].label)}</span></div></td><td>${esc(o.instructor)}</td><td><div class="seat-cell"><div class="seat-line"><b>${o.enrolled} / ${o.capacity}</b><span>${o.capacity-o.enrolled} left</span></div><div class="progress ${o.enrolled>=o.capacity?"danger":""}"><span style="width:${Math.round(o.enrolled/o.capacity*100)}%"></span></div></div></td><td style="text-align:right"><button class="btn btn-secondary btn-sm" type="button" data-action="edit-offering" data-id="${o.id}">${icon("edit",13)} Edit</button></td></tr>`;}).join("")}</tbody></table></div></section>`:`<section class="card" data-od-id="admin-term-settings"><div class="card-head"><div><h2>Registration &amp; drop dates</h2><p>Changes apply to all roles immediately</p></div>${icon("calendar",18)}</div><div class="card-body"><div class="settings-note">${icon("info",14)} Registration opens at 00:00 on the start date and closes at 23:59 on the end date. The drop deadline must be after registration closes.</div><form id="dates-form" class="dates-form" novalidate><div class="form-error span-2" id="dates-form-error"></div><div class="field"><label for="set-semester">Semester label</label><input class="input" id="set-semester" value="${esc(state.settings.semester)}" /></div><div class="field"><label for="set-fee">Fee per credit (BDT)</label><input class="input" id="set-fee" type="number" min="1" step="1" value="${state.settings.feePerCredit}" /></div><div class="field"><label for="set-open">Registration opens</label><input class="input" id="set-open" type="date" value="${esc(state.settings.registrationOpen)}" /></div><div class="field"><label for="set-close">Registration closes</label><input class="input" id="set-close" type="date" value="${esc(state.settings.registrationClose)}" /></div><div class="field"><label for="set-drop">Drop deadline</label><input class="input" id="set-drop" type="date" value="${esc(state.settings.dropDeadline)}" /></div><div class="field"><label for="set-pay">Payment due</label><input class="input" id="set-pay" type="date" value="${esc(state.settings.paymentDue)}" /></div><div class="span-2"><button class="btn btn-primary" type="submit">${icon("check",15)} Save term settings</button></div></form></div></section>`}
  </div>`;
}
function openCourseModal(code){
  const c=code?state.courses.find(x=>x.code===code):null;
  openModal(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="course-modal-title"><div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">S09 · ${c?"Edit":"Add"} course</p><h2 id="course-modal-title">${c?"Edit "+esc(c.code):"Add a new course"}</h2><p>Course codes must be unique across the catalogue.</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div><div class="modal-body"><form id="course-form" data-mode="${c?"edit":"add"}" data-code="${c?esc(c.code):""}" novalidate><div class="form-error" id="course-form-error"></div><div class="form-grid"><div class="field"><label for="course-code">Course code</label><input class="input mono" id="course-code" value="${c?esc(c.code):""}" placeholder="e.g. CSE315" ${c?"readonly":""} /></div><div class="field"><label for="course-dept">Department</label><select class="select" id="course-dept">${Object.keys(DEPT_NAMES).map(d=>`<option value="${d}" ${c&&c.dept===d?"selected":""}>${d} · ${DEPT_NAMES[d]}</option>`).join("")}</select></div><div class="field span-2"><label for="course-title">Course title</label><input class="input" id="course-title" value="${c?esc(c.title):""}" placeholder="e.g. Mobile Application Development" /></div><div class="field"><label for="course-credits">Credits</label><input class="input" id="course-credits" type="number" min="1" max="6" value="${c?c.credits:3}" /></div><div class="field"><label for="course-prereq">Prerequisite</label><select class="select" id="course-prereq"><option value="">None</option>${state.courses.filter(x=>!c||x.code!==c.code).map(x=>`<option value="${x.code}" ${c&&c.prereq[0]===x.code?"selected":""}>${x.code} · ${esc(x.title)}</option>`).join("")}</select></div><div class="field span-2"><label for="course-desc">Description</label><textarea class="textarea" id="course-desc" placeholder="Short catalogue description">${c?esc(c.description):""}</textarea></div><div class="span-2"><label class="switch"><input type="checkbox" id="course-active" ${!c||c.active?"checked":""} /><span class="track"></span><span>Active and visible to students</span></label></div></div></form></div><div class="modal-foot"><span class="left">${c?"Changes apply immediately.":"The course is added to the catalogue."}</span><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="save-course">${icon("check",15)} ${c?"Save changes":"Add course"}</button></div></div>`);
}
function saveCourse(){
  const form=document.getElementById("course-form");if(!form)return;
  const mode=form.dataset.mode,oldCode=form.dataset.code;
  const code=(document.getElementById("course-code")?.value||"").trim().toUpperCase();
  const title=(document.getElementById("course-title")?.value||"").trim();
  const dept=document.getElementById("course-dept")?.value||"CSE";
  const credits=Number(document.getElementById("course-credits")?.value||0);
  const prereq=document.getElementById("course-prereq")?.value||"";
  const desc=(document.getElementById("course-desc")?.value||"").trim();
  const active=document.getElementById("course-active")?.checked;
  if(!code||!/^[A-Z]{2,4}\d{3}$/.test(code)){showFormError("course-form-error","Enter a valid course code, e.g. CSE315.");return;}
  if(!title){showFormError("course-form-error","Course title is required.");return;}
  if(!credits||credits<1||credits>6){showFormError("course-form-error","Credits must be between 1 and 6.");return;}
  if(mode==="add"&&state.courses.some(c=>c.code===code)){showFormError("course-form-error","Duplicate course code — "+code+" already exists in the catalogue.");return;}
  if(mode==="edit"){
    const c=state.courses.find(x=>x.code===oldCode);if(!c)return;
    Object.assign(c,{title,dept,credits,prereq:prereq?[prereq]:[],description:desc||c.description,active:!!active});
    toast("Course updated",`${oldCode} · ${title} saved.`,"success");
  }else{
    state.courses.push({code,title,dept,credits,prereq:prereq?[prereq]:[],active:!!active,description:desc||"New catalogue course."});
    toast("Course added",`${code} · ${title} is now in the catalogue.`,"success");
  }
  state.adminTab="courses";closeModal();renderApp();
}
function toggleCourse(code){
  const c=state.courses.find(x=>x.code===code);if(!c)return;
  c.active=!c.active;toast(c.active?"Course activated":"Course deactivated",`${code} is now ${c.active?"visible in":"hidden from"} student search.`,c.active?"success":"warn");renderApp();
}
function openOfferingModal(id){
  const o=id?offeringById(id):null;const courses=state.courses.filter(c=>c.active||o?.code===c.code);
  openModal(`<div class="modal wide" role="dialog" aria-modal="true" aria-labelledby="offering-modal-title"><div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">S09 · ${o?"Edit":"New"} offering</p><h2 id="offering-modal-title">${o?"Edit section "+esc(o.section):"Publish a new section"}</h2><p>Capacity must be greater than zero. The offering is visible to students as soon as it is saved.</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div><div class="modal-body"><form id="offering-form" data-mode="${o?"edit":"add"}" data-id="${o?esc(o.id):""}" novalidate><div class="form-error" id="offering-form-error"></div><div class="offering-form-grid"><div class="field span-2"><label for="off-course">Course</label><select class="select" id="off-course">${courses.map(c=>`<option value="${c.code}" ${o&&o.code===c.code?"selected":""}>${c.code} · ${esc(c.title)}</option>`).join("")}</select></div><div class="field"><label for="off-section">Section</label><input class="input mono" id="off-section" value="${o?esc(o.section):"01"}" placeholder="01" /></div><div class="field"><label for="off-semester">Semester</label><input class="input" id="off-semester" value="${o?esc(o.semester):esc(state.settings.semester)}" /></div><div class="field"><label for="off-days">Class days</label><select class="select" id="off-days">${[["Sun,Tue","Sunday & Tuesday"],["Mon,Wed","Monday & Wednesday"],["Wed","Wednesday"],["Thu","Thursday"],["Sun","Sunday"],["Tue","Tuesday"]].map(([v,l])=>`<option value="${v}" ${o&&o.days.join(",")===v?"selected":""}>${l}</option>`).join("")}</select></div><div class="field"><label for="off-slot">Time slot</label><select class="select" id="off-slot">${Object.keys(SLOTS).map(k=>`<option value="${k}" ${o&&o.slot===k?"selected":""}>${k} · ${SLOTS[k].label}</option>`).join("")}</select></div><div class="field"><label for="off-instructor">Instructor</label><input class="input" id="off-instructor" value="${o?esc(o.instructor):""}" placeholder="e.g. Dr. Farhana Islam" /></div><div class="field"><label for="off-room">Room</label><input class="input" id="off-room" value="${o?esc(o.room):""}" placeholder="e.g. CSE-402" /></div><div class="field"><label for="off-capacity">Capacity</label><input class="input" id="off-capacity" type="number" min="1" step="1" value="${o?o.capacity:30}" /><span class="help">Currently ${o?o.enrolled:0} enrolled</span></div></div></form></div><div class="modal-foot"><span class="left">${o?"Increasing capacity can promote the first waitlisted student.":"New sections start with zero enrolled students."}</span><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="save-offering">${icon("check",15)} ${o?"Save section":"Publish offering"}</button></div></div>`);
}
function saveOffering(){
  const form=document.getElementById("offering-form");if(!form)return;
  const mode=form.dataset.mode,id=form.dataset.id;
  const code=document.getElementById("off-course")?.value||"";
  const section=(document.getElementById("off-section")?.value||"").trim();
  const semester=(document.getElementById("off-semester")?.value||"").trim();
  const days=(document.getElementById("off-days")?.value||"").split(",");
  const slot=document.getElementById("off-slot")?.value||"A";
  const instructor=(document.getElementById("off-instructor")?.value||"").trim();
  const room=(document.getElementById("off-room")?.value||"").trim();
  const capacity=Number(document.getElementById("off-capacity")?.value||0);
  if(!section){showFormError("offering-form-error","Section code is required.");return;}
  if(!semester){showFormError("offering-form-error","Semester is required.");return;}
  if(!instructor){showFormError("offering-form-error","Instructor is required.");return;}
  if(!capacity||capacity<1){showFormError("offering-form-error","Capacity must be greater than zero.");return;}
  const duplicate=state.offerings.find(x=>x.code===code&&x.section===section&&x.semester===semester&&x.id!==id);
  if(duplicate){showFormError("offering-form-error","Duplicate offering — section "+section+" already exists for "+code+" in "+semester+".");return;}
  if(mode==="edit"){
    const o=offeringById(id);if(!o)return;
    if(capacity<o.enrolled){showFormError("offering-form-error","Capacity cannot be below the "+o.enrolled+" students already enrolled.");return;}
    Object.assign(o,{code,section,semester,days,slot,instructor,room,capacity});
    let promoted=0;while(o.enrolled<o.capacity&&waitlistFor(o.id).length){promoteFromWaitlist(o.id);promoted++;}
    toast("Offering updated",`${code} · Sec ${section} saved${promoted?` · ${promoted} waitlist promotion${promoted===1?"":"s"}`:""}.`,"success");
  }else{
    let oid="OFF-"+code+"-"+section;let suffix=2;while(state.offerings.some(x=>x.id===oid)){oid="OFF-"+code+"-"+section+"-"+suffix++;}
    state.offerings.push({id:oid,code,section,semester,days,slot,instructor,room,capacity,enrolled:0});
    toast("Offering published",`${code} · Sec ${section} is now visible in student search.`,"success");
  }
  state.adminTab="offerings";closeModal();renderApp();
}
function saveDates(){
  const sem=(document.getElementById("set-semester")?.value||"").trim();
  const open=document.getElementById("set-open")?.value;
  const close=document.getElementById("set-close")?.value;
  const drop=document.getElementById("set-drop")?.value;
  const pay=document.getElementById("set-pay")?.value;
  const fee=Number(document.getElementById("set-fee")?.value||0);
  if(!sem){showFormError("dates-form-error","Semester label is required.");return;}
  if(!open||!close||!drop||!pay){showFormError("dates-form-error","All four dates are required.");return;}
  if(parseDate(close)<parseDate(open)){showFormError("dates-form-error","Registration close date must be on or after the open date.");return;}
  if(parseDate(drop)<parseDate(close)){showFormError("dates-form-error","Drop deadline must be after registration closes.");return;}
  if(!fee||fee<1){showFormError("dates-form-error","Fee per credit must be greater than zero.");return;}
  state.settings={semester:sem,registrationOpen:open,registrationClose:close,dropDeadline:drop,paymentDue:pay,feePerCredit:fee};
  toast("Term settings saved","Dates and fee rate updated across all roles.","success");renderApp();
}

/* ---------- admin users ---------- */
function renderAdminUsers(){
  const users=state.users.slice().sort((a,b)=>a.role.localeCompare(b.role)||a.id.localeCompare(b.id));
  return `<div data-od-id="admin-users">
    <div class="page-head"><div><p class="eyebrow">Administration · Access control</p><h1>Manage users.</h1><p class="lede">Create accounts, assign roles and disable access. A disabled user cannot sign in.</p></div><div class="page-actions"><button class="btn btn-primary" type="button" data-action="add-user">${icon("plus",16)} Create user</button></div></div>
    <div class="mini-stat-row" data-od-id="admin-user-stats"><div class="mini-stat"><span>Students</span><b>${state.users.filter(u=>u.role==="student").length}</b></div><div class="mini-stat"><span>Advisors</span><b>${state.users.filter(u=>u.role==="advisor").length}</b></div><div class="mini-stat"><span>Disabled accounts</span><b>${state.users.filter(u=>!u.active).length}</b></div></div>
    <section class="card" data-od-id="admin-user-table"><div class="admin-toolbar"><div class="left"><h2>All accounts</h2><span class="tiny muted">Role changes take effect on next sign-in</span></div><button class="btn btn-secondary btn-sm" type="button" data-action="add-user">${icon("plus",14)} Create user</button></div><div class="table-wrap"><table class="data"><thead><tr><th>User</th><th>University ID</th><th>Role</th><th>Department</th><th>Advisor</th><th>Status</th><th style="text-align:right">Access</th></tr></thead><tbody>${users.map(u=>{const adv=u.advisorId?userById(u.advisorId):null;return `<tr data-od-id="admin-user-${u.id}"><td><div class="row"><div class="avatar sm">${initials(u.name)}</div><div><div class="cell-stack"><b>${esc(u.name)}</b><span>${u.id===state.currentUser.id?"Signed in as you":u.role==="student"?"Student account":u.role==="advisor"?"Faculty account":"Administrator"}</span></div></div></div></td><td><span class="mono" style="font-size:11px">${esc(u.id)}</span></td><td><span class="role-badge ${u.role}">${esc(u.role)}</span></td><td>${esc(u.dept)}</td><td>${adv?esc(adv.name):'<span class="tiny muted">-</span>'}</td><td><span class="status-cell"><span class="status-dot ${u.active?"":"off"}"></span><span class="tiny">${u.active?"Active":"Disabled"}</span></span></td><td style="text-align:right">${u.id===state.currentUser.id?'<span class="tiny muted">Current session</span>':`<button class="btn ${u.active?"btn-secondary":"btn-success"} btn-sm" type="button" data-action="toggle-user" data-id="${u.id}">${u.active?icon("pause",13)+" Disable":icon("play",13)+" Enable"}</button>`}</td></tr>`;}).join("")}</tbody></table></div></section>
  </div>`;
}
function openUserModal(){
  openModal(`<div class="modal" role="dialog" aria-modal="true" aria-labelledby="user-modal-title"><div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">S10 · Create user</p><h2 id="user-modal-title">Create an account</h2><p>Choose a role carefully — it controls the menu and permissions.</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div><div class="modal-body"><form id="user-form" novalidate><div class="form-error" id="user-form-error"></div><div class="form-grid"><div class="field"><label for="user-id">University ID</label><input class="input mono" id="user-id" placeholder="e.g. 2024010" /></div><div class="field"><label for="user-name">Full name</label><input class="input" id="user-name" placeholder="e.g. Samira Chowdhury" /></div><div class="field"><label for="user-pass">Temporary password</label><input class="input" id="user-pass" type="text" placeholder="At least 6 characters" /></div><div class="field"><label for="user-role">Role</label><select class="select" id="user-role"><option value="student">Student</option><option value="advisor">Faculty Advisor</option><option value="admin">Administrator</option></select></div><div class="field"><label for="user-dept">Department</label><select class="select" id="user-dept">${Object.keys(DEPT_NAMES).map(d=>`<option value="${d}">${d} · ${DEPT_NAMES[d]}</option>`).join("")}<option value="Administration">Administration</option></select></div><div class="field" id="advisor-field"><label for="user-advisor">Assigned advisor</label><select class="select" id="user-advisor">${state.users.filter(u=>u.role==="advisor").map(u=>`<option value="${u.id}">${esc(u.name)} · ${u.dept}</option>`).join("")}</select></div></div></form></div><div class="modal-foot"><span class="left">The user can sign in immediately.</span><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-primary" type="button" data-action="save-user">${icon("plus",15)} Create user</button></div></div>`);
}
function saveUser(){
  const id=(document.getElementById("user-id")?.value||"").trim().toUpperCase();
  const name=(document.getElementById("user-name")?.value||"").trim();
  const pass=document.getElementById("user-pass")?.value||"";
  const role=document.getElementById("user-role")?.value||"student";
  const dept=document.getElementById("user-dept")?.value||"CSE";
  const advisorId=document.getElementById("user-advisor")?.value||"ADV01";
  if(!id){showFormError("user-form-error","University ID is required.");return;}
  if(!name){showFormError("user-form-error","Full name is required.");return;}
  if(pass.length<6){showFormError("user-form-error","Temporary password must be at least 6 characters.");return;}
  if(state.users.some(u=>u.id.toUpperCase()===id)){showFormError("user-form-error","Duplicate ID — "+id+" already has an account.");return;}
  const u={id,name,password:pass,role,dept,active:true};
  if(role==="student"){u.advisorId=advisorId;u.completed=[];}
  if(role==="advisor")u.adviseeIds=[];
  state.users.push(u);
  toast("User created",`${name} · ${id} · ${role} account is ready.`,"success");closeModal();renderApp();
}
function toggleUser(id){
  if(id===state.currentUser.id){toast("Cannot disable yourself","Sign in as another administrator to change this account.","warn");return;}
  const u=userById(id);if(!u)return;u.active=!u.active;
  toast(u.active?"Account enabled":"Account disabled",`${u.name} ${u.active?"can now sign in":"cannot sign in until re-enabled"}.`,u.active?"success":"warn");renderApp();
}
