/* CourseFlow portal — application shell, navigation, sidebar and top bar */

/* ---------- shell ---------- */
function navFor(role){
  if(role==="student")return [
    {id:"dashboard",label:"Dashboard",icon:"dashboard"},
    {id:"search",label:"Course search",icon:"search"},
    {id:"payments",label:"Invoice & payment",icon:"card"}
  ];
  if(role==="advisor")return [{id:"approvals",label:"Pending approvals",icon:"checkSquare"}];
  return [{id:"admin-courses",label:"Courses & offerings",icon:"book"},{id:"admin-users",label:"Manage users",icon:"users"}];
}
function renderApp(){
  if(!state.currentUser)return;
  renderSidebar();renderTopbar();
  const page=document.getElementById("page-content");
  const role=state.currentUser.role;
  if(role==="student"){
    if(state.route==="search")page.innerHTML=renderCourseSearch();
    else if(state.route==="payments")page.innerHTML=renderPayments();
    else page.innerHTML=renderStudentDashboard();
  }else if(role==="advisor")page.innerHTML=renderAdvisorApprovals();
  else if(role==="admin"){
    if(state.route==="admin-users")page.innerHTML=renderAdminUsers();
    else page.innerHTML=renderAdminCourses();
  }
  bindAfterRender();
}
function renderSidebar(){
  const u=state.currentUser;const nav=navFor(u.role);
  const pending=u.role==="advisor"?state.registrations.filter(r=>r.status==="Pending"&&u.adviseeIds?.includes(r.studentId)).length:0;
  const roleLabel=u.role==="student"?"Student portal":u.role==="advisor"?"Faculty advisor":"Administration";
  const roleIcon=u.role==="student"?"user":u.role==="advisor"?"bookOpen":"shield";
  document.getElementById("sidebar").innerHTML=`
    <div class="sidebar-top">
      <a class="brand-lockup sidebar-brand-link" href="index.html" aria-label="CourseFlow — back to the landing page" title="Back to CourseFlow home"><img class="sidebar-logo-mark" src="assets/images/logo.svg" alt=""><span class="sidebar-brand-name">CourseFlow</span></a>
      <button class="icon-btn sidebar-close" type="button" data-action="close-sidebar" aria-label="Close navigation">${icon("x",18)}</button>
    </div>
    <div class="role-chip"><div class="role-icon">${icon(roleIcon,15)}</div><div><b>${esc(roleLabel)}</b><span>${esc(u.dept)}</span></div></div>
    <nav class="nav" aria-label="${esc(roleLabel)}">
      <div class="nav-label">Workspace</div>
      ${nav.map(n=>`<button class="nav-item ${state.route===n.id?"active":""}" type="button" data-action="navigate" data-route="${n.id}">${icon(n.icon,17)}<span>${n.label}</span>${n.id==="approvals"&&pending?`<span class="nav-badge">${pending}</span>`:""}</button>`).join("")}
      <div class="nav-label">Support</div>
      <button class="nav-item" type="button" data-action="open-guide">${icon("help",17)}<span>Demo guide</span></button>
      <button class="nav-item" type="button" data-action="open-notifications">${icon("bell",17)}<span>Notifications</span>${unreadCount()?`<span class="nav-badge">${unreadCount()}</span>`:""}</button>
    </nav>
    <div class="sidebar-term"><div class="term-row"><b>${esc(state.settings.semester)}</b><span>${esc(u.role==="student"?"Student":"Staff")}</span></div><div class="term-status">${isRegistrationOpen()?"Registration open":"Registration closed"}</div><div style="font-size:10px;color:rgba(255,255,255,.42);margin-top:5px">Closes ${dateLong(state.settings.registrationClose)}</div></div>
    <div class="sidebar-user"><div class="avatar sm">${initials(u.name)}</div><div class="grow" style="min-width:0"><b>${esc(u.name)}</b><span>${esc(u.id)} · ${u.role}</span></div><button class="icon-btn logout" type="button" data-action="logout" aria-label="Sign out" title="Sign out">${icon("logout",17)}</button></div>`;
}
function unreadCount(){return state.currentUser?state.notifications.filter(n=>n.userId===state.currentUser.id&&!n.read).length:0;}
function renderTopbar(){
  const u=state.currentUser;const unread=unreadCount();
  document.getElementById("topbar").innerHTML=`
    <button class="icon-btn mobile-menu" type="button" data-action="open-sidebar" aria-label="Open navigation">${icon("menu",20)}</button>
    <div class="crumb"><span>CourseFlow</span><span class="slash">/</span><b>${esc(ROUTE_TITLES[state.route]||"Dashboard")}</b></div>
    <div class="topbar-right">
      <span class="topbar-date">${new Date().toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}</span>
      <button class="icon-btn bell-wrap" type="button" data-action="open-notifications" aria-label="Notifications${unread?` (${unread} unread)`:""}">${icon("bell",19)}${unread?`<span class="bell-badge">${unread}</span>`:""}</button>
      <div class="topbar-user"><div class="avatar sm">${initials(u.name)}</div><div><b>${esc(u.name)}</b><span>${esc(u.role==="advisor"?"Faculty advisor":u.role==="admin"?"Administrator":"Student")}</span></div></div>
    </div>`;
}
function navigate(route){
  if(!state.currentUser)return;
  state.route=route;state.ui.sidebarOpen=false;
  document.getElementById("sidebar")?.classList.remove("open");
  document.getElementById("sidebar-overlay")?.classList.remove("open");
  renderApp();window.scrollTo({top:0,behavior:"smooth"});
}
function bindAfterRender(){
  const search=document.getElementById("course-search");
  if(search){
    search.addEventListener("input",e=>{state.search=e.target.value;updateCourseResults();});
  }
  const dept=document.getElementById("dept-filter");
  if(dept){dept.addEventListener("change",e=>{state.department=e.target.value;updateCourseResults();});}
}
