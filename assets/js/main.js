/* CourseFlow portal — delegated event handlers and application bootstrap */

/* ---------- events ---------- */
document.addEventListener("click",e=>{
  const overlay=e.target.closest(".modal-overlay");
  if(overlay&&e.target===overlay){closeModal();return;}
  const el=e.target.closest("[data-action]");if(!el)return;
  const a=el.dataset.action;
  if(a==="toggle-password"){
    const p=document.getElementById("login-password");if(!p)return;
    const show=p.type==="password";p.type=show?"text":"password";el.innerHTML=icon(show?"eyeOff":"eye",17);el.setAttribute("aria-label",show?"Hide password":"Show password");return;
  }
  if(a==="fill-demo"){
    document.getElementById("login-id").value=el.dataset.id;
    document.getElementById("login-password").value=el.dataset.pass;
    clearLoginError();handleLogin({preventDefault(){}});return;
  }
  if(a==="open-sidebar"){document.getElementById("sidebar")?.classList.add("open");document.getElementById("sidebar-overlay")?.classList.add("open");return;}
  if(a==="close-sidebar"){document.getElementById("sidebar")?.classList.remove("open");document.getElementById("sidebar-overlay")?.classList.remove("open");return;}
  if(a==="logout"){logout();return;}
  if(a==="navigate"){closeModal();closeGuide();navigate(el.dataset.route);return;}
  if(a==="open-guide"){openGuide();return;}
  if(a==="close-guide"){closeGuide();return;}
  if(a==="open-notifications"){openNotifications();return;}
  if(a==="close-modal"){closeModal();return;}
  if(a==="clear-filters"){state.search="";state.department="all";if(state.route==="search")renderApp();return;}
  if(a==="open-register"){openRegisterModal(el.dataset.id);return;}
  if(a==="open-waitlist"){openWaitlistModal(el.dataset.id);return;}
  if(a==="submit-registration"){submitRegistration(el.dataset.id);return;}
  if(a==="join-waitlist"){joinWaitlist(el.dataset.id);return;}
  if(a==="open-drop"){openDropModal(el.dataset.id);return;}
  if(a==="confirm-drop"){confirmDrop(el.dataset.id);return;}
  if(a==="select-payment"){selectPayment(el.dataset.method);return;}
  if(a==="gateway-authorize"){gatewayAuthorize();return;}
  if(a==="gateway-decline"){gatewayDecline();return;}
  if(a==="retry-payment"){closePaymentResult();return;}
  if(a==="download-receipt"){downloadReceipt();return;}
  if(a==="approve-registration"){approveRegistration(el.dataset.id);return;}
  if(a==="open-reject"){openRejectModal(el.dataset.id);return;}
  if(a==="confirm-reject"){confirmReject(el.dataset.id);return;}
  if(a==="admin-tab"){state.adminTab=el.dataset.tab;renderApp();return;}
  if(a==="add-course"){openCourseModal();return;}
  if(a==="edit-course"){openCourseModal(el.dataset.code);return;}
  if(a==="save-course"){saveCourse();return;}
  if(a==="toggle-course"){toggleCourse(el.dataset.code);return;}
  if(a==="add-offering"){openOfferingModal();return;}
  if(a==="edit-offering"){openOfferingModal(el.dataset.id);return;}
  if(a==="save-offering"){saveOffering();return;}
  if(a==="add-user"){openUserModal();return;}
  if(a==="save-user"){saveUser();return;}
  if(a==="toggle-user"){toggleUser(el.dataset.id);return;}
  if(a==="open-reset"){openResetModal();return;}
  if(a==="reset-demo"){resetDemo();return;}
});
document.addEventListener("submit",e=>{
  const f=e.target;
  if(f.id==="login-form"){handleLogin(e);return;}
  if(f.id==="payment-form"){handlePaymentSubmit(e);return;}
  if(f.id==="reject-form"){e.preventDefault();confirmReject(f.dataset.id);return;}
  if(f.id==="course-form"){e.preventDefault();saveCourse();return;}
  if(f.id==="offering-form"){e.preventDefault();saveOffering();return;}
  if(f.id==="dates-form"){e.preventDefault();saveDates();return;}
  if(f.id==="user-form"){e.preventDefault();saveUser();return;}
});
document.addEventListener("input",e=>{
  if(e.target.id==="reject-remark"){
    const n=e.target.value.length;const c=document.getElementById("reject-count");const b=document.getElementById("reject-submit");
    if(c)c.textContent=n+" / 240 · "+(n?"remark ready":"required");
    if(b)b.disabled=!e.target.value.trim();
  }
});
document.addEventListener("change",e=>{
  if(e.target.id==="user-role"){
    const field=document.getElementById("advisor-field");
    if(field)field.style.display=e.target.value==="student"?"grid":"none";
  }
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"){
    if(document.getElementById("guide-panel")?.classList.contains("open")){closeGuide();return;}
    if(document.getElementById("modal-root")?.innerHTML.trim()){closeModal();return;}
    document.getElementById("sidebar")?.classList.remove("open");document.getElementById("sidebar-overlay")?.classList.remove("open");
  }
});
document.getElementById("guide-overlay")?.addEventListener("click",closeGuide);
renderGuide();
const firstLogin=document.getElementById("login-id");if(firstLogin)setTimeout(()=>firstLogin.focus(),200);
