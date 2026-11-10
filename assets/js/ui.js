/* CourseFlow portal — toasts, modals, demo guide, notifications and shared UI helpers */

function notify(userId,title,body,type="info"){
  state.notifications.unshift({id:"NTF-"+Date.now()+"-"+Math.floor(Math.random()*999),userId,title,body,type,read:false,at:new Date().toISOString()});
}
function toast(title,message,type="info"){
  const root=document.getElementById("toast-root");
  if(!root)return;
  const el=document.createElement("div");
  el.className="toast "+type;
  const ic=type==="success"?"checkCircle":type==="danger"?"xCircle":type==="warn"?"alert":"info";
  el.innerHTML=`<div class="t-icon">${icon(ic,16)}</div><div class="grow"><b>${esc(title)}</b><p>${esc(message)}</p></div><button type="button" class="t-close" aria-label="Dismiss notification">${icon("x",13)}</button>`;
  root.appendChild(el);
  requestAnimationFrame(()=>el.classList.add("show"));
  el.querySelector(".t-close").addEventListener("click",()=>{el.classList.remove("show");setTimeout(()=>el.remove(),220);});
  setTimeout(()=>{el.classList.remove("show");setTimeout(()=>el.remove(),220);},5200);
}
function showFormError(id,msg){
  const el=document.getElementById(id);if(!el)return;el.className="form-error show";el.innerHTML=icon("alert",15)+`<span>${esc(msg)}</span>`;
}

/* ---------- notifications / guide / reset ---------- */
function openNotifications(){
  if(!state.currentUser)return;
  const list=state.notifications.filter(n=>n.userId===state.currentUser.id).sort((a,b)=>new Date(b.at)-new Date(a.at));
  list.forEach(n=>n.read=true);renderApp();
  openModal(`<div class="modal narrow" role="dialog" aria-modal="true" aria-labelledby="notif-title"><div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">Inbox</p><h2 id="notif-title">Notifications</h2><p>Simulated SMS and email confirmations</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div><div class="modal-body">${list.length?`<div class="notif-list">${list.map(n=>`<div class="notif-row"><div class="notif-icon ${n.type}">${icon(n.type==="success"?"checkCircle":n.type==="danger"?"xCircle":n.type==="warn"?"alert":"mail",15)}</div><div class="grow"><b>${esc(n.title)}</b><p>${esc(n.body)}</p></div><span class="notif-time">${timeAgo(n.at)}</span></div>`).join("")}</div>`:`<div class="empty-state" style="padding:34px 10px"><div class="empty-icon">${icon("bell",22)}</div><h3>No notifications</h3><p>Registration, approval, waitlist and payment updates will appear here.</p></div>`}</div><div class="modal-foot"><span class="left">${list.length} message${list.length===1?"":"s"} · all marked read</span><button class="btn btn-secondary" type="button" data-action="close-modal">Close</button></div></div>`);
}
function renderGuide(){
  const panel=document.getElementById("guide-panel");if(!panel)return;
  panel.innerHTML=`<div class="guide-head"><div><p class="eyebrow" style="margin-bottom:5px">CourseFlow</p><h2>Demo guide</h2><p>Three end-to-end scenarios · shared live state</p></div><button class="modal-close" type="button" data-action="close-guide" aria-label="Close demo guide">${icon("x",17)}</button></div><div class="guide-body">
    <div class="guide-section"><h3>Demo credentials</h3><div class="guide-cred"><div><b>Student</b><code>2024001 / student123</code></div><div><b>Advisor</b><code>ADV01 / advisor123</code></div><div><b>Administrator</b><code>ADMIN / admin123</code></div></div></div>
    <div class="guide-section"><h3>Scenarios</h3>
      <div class="guide-scenario"><div class="gs-title"><span class="gs-num">1</span><b>Full registration -> approval -> payment</b></div><ol><li>Sign in as <code>2024001</code> and open Course search.</li><li>Register for <code>CSE310 Web Technologies</code> (Mon/Wed, 11:45).</li><li>Submit the pending request, then sign out.</li><li>Sign in as <code>ADV01</code> and approve Ayaan's request.</li><li>Sign back in as the student, open Invoice &amp; payment and pay.</li><li>Authorize the gateway to see the Paid receipt and transaction ID.</li></ol></div>
      <div class="guide-scenario"><div class="gs-title"><span class="gs-num">2</span><b>Validation &amp; waitlist</b></div><ol><li><code>CSE301 Algorithms</code> -> missing prerequisite (CSE201).</li><li><code>CSE305 Database Systems</code> -> time clash with CSE201.</li><li><code>EEE201 Electrical Circuits II</code> -> 15 + 4 exceeds the 18-credit limit.</li><li><code>BBA201 Marketing Management</code> is full -> join the waitlist and see position #1.</li><li>As admin, edit the BBA201 offering capacity from 30 to 31. The first waitlisted student is promoted automatically.</li></ol></div>
      <div class="guide-scenario"><div class="gs-title"><span class="gs-num">3</span><b>Administration</b></div><ol><li>Sign in as <code>ADMIN</code>, open Courses &amp; offerings.</li><li>Add a course (duplicate codes are rejected) or publish a new offering.</li><li>Sign back in as the student and search — the new offering is visible immediately.</li><li>In Manage users, create an account or disable one. Disabled users cannot log in.</li></ol></div>
    </div>
    <div class="guide-section"><h3>Payment testing</h3><div class="rule-list"><div>${icon("check",12)}<span>Authorize payment -> invoice marked Paid with receipt and transaction ID.</span></div><div>${icon("x",12)}<span>Simulate declined payment -> invoice stays Unpaid with a Retry button.</span></div><div>${icon("info",12)}<span>Waitlist, approval and payment actions generate in-app toasts that simulate SMS/email.</span></div></div></div>
    <div class="guide-section"><h3>Business rules in this build</h3><div class="rule-list"><div>${icon("check",12)}<span>Pending amber · Approved green · Rejected red · Waitlisted blue · Dropped grey.</span></div><div>${icon("check",12)}<span>Seats reserve on submit, release on drop/reject, and promote the first waitlisted student.</span></div><div>${icon("check",12)}<span>Student, advisor and admin changes share one in-memory state.</span></div><div>${icon("check",12)}<span>Five failed logins lock an account for 15 minutes.</span></div></div></div>
  </div><div class="guide-foot"><button class="btn btn-secondary" type="button" data-action="open-reset">${icon("refresh",14)} Reset demo</button><button class="btn btn-primary" type="button" data-action="close-guide">Close guide</button></div>`;
}
function openGuide(){
  renderGuide();
  document.getElementById("guide-panel").classList.add("open");
  document.getElementById("guide-overlay").classList.add("open");
  document.body.classList.add("guide-open");
}
function closeGuide(){
  document.getElementById("guide-panel")?.classList.remove("open");
  document.getElementById("guide-overlay")?.classList.remove("open");
  if(!document.getElementById("modal-root")?.innerHTML.trim())document.body.classList.remove("guide-open");
}
function openResetModal(){
  openModal(`<div class="modal narrow" role="dialog" aria-modal="true" aria-labelledby="reset-title"><div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">Demo tools</p><h2 id="reset-title">Reset demo data?</h2><p>This clears registrations, payments, new users and lockouts, then returns to the login screen.</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div><div class="modal-body"><div class="notice-box warn" style="margin:0">${icon("alert",17)}<div><b>Everything returns to the initial mock state.</b><br>Useful after testing validation, waitlists or the 15-minute account lockout.</div></div></div><div class="modal-foot"><button class="btn btn-secondary" type="button" data-action="close-modal">Keep testing</button><button class="btn btn-danger" type="button" data-action="reset-demo">${icon("refresh",15)} Reset demo</button></div></div>`);
}
function resetDemo(){
  state=createInitialState();logout();renderGuide();
  toast("Demo reset","All mock data, accounts and lockouts are back to the initial state.","success");
}

/* ---------- modal helpers ---------- */
function openModal(html){
  const root=document.getElementById("modal-root");
  root.innerHTML=`<div class="modal-overlay">${html}</div>`;
  document.body.classList.add("modal-open");
  setTimeout(()=>{const f=root.querySelector(".modal input:not([type=hidden]),.modal select,.modal textarea,.modal button");if(f)f.focus();},30);
}
function closeModal(){
  const root=document.getElementById("modal-root");if(root)root.innerHTML="";
  state.payment.gateway=null;state.payment.result=null;
  if(!document.getElementById("guide-panel")?.classList.contains("open"))document.body.classList.remove("modal-open");
}
