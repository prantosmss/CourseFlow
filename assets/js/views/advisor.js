/* CourseFlow portal — advisor approval queue and decision history */


/* ---------- advisor ---------- */
function advisorRegs(){
  const u=state.currentUser;return state.registrations.filter(r=>(u.adviseeIds||[]).includes(r.studentId));
}
function renderAdvisorApprovals(){
  const u=state.currentUser;const all=advisorRegs();const pending=all.filter(r=>r.status==="Pending").sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
  const history=all.filter(r=>["Approved","Rejected"].includes(r.status)).sort((a,b)=>new Date(b.decidedAt||b.createdAt)-new Date(a.decidedAt||a.createdAt)).slice(0,6);
  const advisees=(u.adviseeIds||[]).map(id=>userById(id)).filter(Boolean);
  return `<div data-od-id="advisor-approvals">
    <div class="page-head"><div><p class="eyebrow">Faculty workspace · ${esc(state.settings.semester)}</p><h1>Pending approvals.</h1><p class="lede">Review registration requests from your advisees. Approvals unlock payment; rejections require a remark and release the seat.</p></div><div class="page-actions"><span class="term-pill">${pending.length} waiting</span></div></div>
    <div class="stats-grid" data-od-id="advisor-stats">
      <div class="stat-card"><div class="stat-top"><span class="stat-label">Pending requests</span><span class="stat-icon accent">${icon("clock",16)}</span></div><div class="stat-value">${pending.length}</div><div class="stat-note">Across ${advisees.length} advisees</div></div>
      <div class="stat-card"><div class="stat-top"><span class="stat-label">Your advisees</span><span class="stat-icon">${icon("users",16)}</span></div><div class="stat-value">${advisees.length}</div><div class="stat-note">Only your assigned students are shown</div></div>
      <div class="stat-card"><div class="stat-top"><span class="stat-label">Approved this term</span><span class="stat-icon">${icon("checkCircle",16)}</span></div><div class="stat-value">${all.filter(r=>r.status==="Approved").length}</div><div class="stat-note">Registration decisions recorded</div></div>
      <div class="stat-card"><div class="stat-top"><span class="stat-label">Rejected this term</span><span class="stat-icon">${icon("xCircle",16)}</span></div><div class="stat-value">${all.filter(r=>r.status==="Rejected").length}</div><div class="stat-note">All rejections include a remark</div></div>
    </div>
    <div class="two-col">
      <section class="card" data-od-id="advisor-pending-list"><div class="card-head"><div><h2>Waiting for you</h2><p>Oldest requests first</p></div><span class="badge badge-pending"><span class="dot"></span>${pending.length} pending</span></div><div class="card-body" style="padding-top:14px">${pending.length?pending.map(r=>{
        const s=userById(r.studentId),o=offeringById(r.offeringId),c=courseOf(o);
        return `<div class="approval-card" data-od-id="approval-card-${r.id}"><div class="approval-main"><div class="avatar lg">${initials(s.name)}</div><div class="grow"><div class="approval-name"><b>${esc(s.name)}</b><span>${esc(s.id)}</span>${statusBadge(r.status)}</div><div class="small muted">${esc(s.dept)} · ${creditsUsed(s.id)} credits currently registered</div><div class="approval-course"><b>${esc(c.code)} · ${esc(c.title)}</b><span>Sec ${esc(o.section)} · ${esc(o.days.join(" / "))} · ${esc(SLOTS[o.slot].label)} · ${c.credits} credits · ${esc(o.instructor)}</span></div><div class="approval-actions"><span class="submitted">Submitted ${timeAgo(r.createdAt)} · ${esc(r.id)}</span><button class="btn btn-success btn-sm" type="button" data-action="approve-registration" data-id="${r.id}">${icon("check",14)} Approve</button><button class="btn btn-secondary btn-sm" type="button" data-action="open-reject" data-id="${r.id}">${icon("x",14)} Reject</button></div></div></div></div>`;
      }).join(""):`<div class="empty-state"><div class="empty-icon">${icon("checkCircle",22)}</div><h3>You're all caught up</h3><p>No pending registration requests from your advisees right now. New submissions appear here immediately.</p></div>`}</div></section>
      <aside class="side-stack">
        <div class="card" data-od-id="advisor-advisees"><div class="card-head" style="padding-bottom:10px"><div><h2 style="font-size:15px">Your advisees</h2><p>${esc(state.settings.semester)} load</p></div>${icon("users",18)}</div><div class="card-body" style="padding-top:6px">${advisees.map(s=>{const p=state.registrations.filter(r=>r.studentId===s.id&&r.status==="Pending").length;return `<div class="advisee-row"><div class="avatar sm">${initials(s.name)}</div><div><b>${esc(s.name)}</b><span>${esc(s.id)} · ${esc(s.dept)}</span></div><div class="ar-meta"><b>${creditsUsed(s.id)} / 18</b><span>${p?p+" pending":"No pending"}</span></div></div>`;}).join("")}</div></div>
        <div class="card" data-od-id="advisor-history"><div class="card-head" style="padding-bottom:10px"><div><h2 style="font-size:15px">Recent decisions</h2><p>Approved and rejected</p></div></div><div class="card-body" style="padding-top:6px">${history.length?history.map(r=>{const s=userById(r.studentId),c=courseOf(offeringById(r.offeringId));return `<div class="history-row"><div class="avatar sm">${initials(s.name)}</div><div><b>${esc(s.name.split(" ")[0])} · ${esc(c.code)}</b><span>${dateTime(r.decidedAt||r.createdAt)}</span></div>${statusBadge(r.status)}</div>`;}).join(""):`<div class="empty-state" style="padding:24px 8px"><div class="empty-icon">${icon("list",20)}</div><h3>No decisions yet</h3><p>Approve or reject a request to start the history.</p></div>`}</div></div>
      </aside>
    </div>
  </div>`;
}
function approveRegistration(id){
  const r=registrationById(id);if(!r||r.status!=="Pending")return;
  r.status="Approved";r.decidedAt=new Date().toISOString();
  const s=userById(r.studentId),c=courseOf(offeringById(r.offeringId));
  notify(r.studentId,"Registration approved",`${c.code} ${c.title} was approved. Your invoice is ready for payment. SMS + email sent.`,"success");
  toast("Registration approved",`${s.name} · ${c.code} ${c.title} · SMS + email sent.`,"success");
  renderApp();
}
function openRejectModal(id){
  const r=registrationById(id);if(!r)return;const s=userById(r.studentId),c=courseOf(offeringById(r.offeringId));
  openModal(`<div class="modal narrow" role="dialog" aria-modal="true" aria-labelledby="reject-title"><div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">S08 · Reject request</p><h2 id="reject-title">Reject ${esc(c.code)}?</h2><p>${esc(s.name)} · ${esc(s.id)} · ${esc(c.title)}</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div><div class="modal-body"><form id="reject-form" data-id="${r.id}" novalidate><div class="form-error" id="reject-form-error"></div><div class="notice-box danger">${icon("alert",17)}<div><b>A remark is required.</b><br>The student will see your remark and the seat will be released to the waitlist immediately.</div></div><div class="field"><label for="reject-remark">Remark to student <span style="color:var(--danger)">*</span></label><textarea class="textarea" id="reject-remark" maxlength="240" placeholder="e.g. This course would exceed your 18-credit limit. Please meet me before re-submitting."></textarea><span class="help" id="reject-count">0 / 240 · required</span></div></form></div><div class="modal-foot"><span class="left">Rejection cannot be undone.</span><button class="btn btn-secondary" type="button" data-action="close-modal">Cancel</button><button class="btn btn-danger" type="button" data-action="confirm-reject" data-id="${r.id}" id="reject-submit" disabled>${icon("xCircle",15)} Reject request</button></div></div>`);
}
function confirmReject(id){
  const r=registrationById(id);if(!r||r.status!=="Pending")return;
  const remark=(document.getElementById("reject-remark")?.value||"").trim();
  if(!remark){showFormError("reject-form-error","A remark is required before rejecting this request.");return;}
  const o=offeringById(r.offeringId),c=courseOf(o),s=userById(r.studentId);
  r.status="Rejected";r.remark=remark;r.decidedAt=new Date().toISOString();
  if(o)o.enrolled=Math.max(0,o.enrolled-1);
  notify(r.studentId,"Registration rejected",`${c.code} ${c.title} was rejected. Remark: ${remark} SMS + email sent.`,"danger");
  toast("Registration rejected",`${s.name} · ${c.code} · seat released.`,"warn");
  promoteFromWaitlist(r.offeringId);
  closeModal();renderApp();
}
