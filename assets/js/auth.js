/* CourseFlow portal — sign-in validation, lockout handling and session lifecycle */

/* ---------- login ---------- */
function showLoginError(msg,kind="error"){
  const box=document.getElementById("login-error");
  if(!box)return;
  box.className="login-error show"+(kind==="info"?" info":"");
  box.innerHTML=icon(kind==="info"?"info":"alert",16)+`<span>${esc(msg)}</span>`;
}
function clearLoginError(){const b=document.getElementById("login-error");if(b){b.className="login-error";b.innerHTML="";}}
function startLockCountdown(id){
  if(window.__lockTimer)clearInterval(window.__lockTimer);
  const tick=()=>{
    const until=state.login.lockedUntil[id];
    if(!until||until<=Date.now()){clearLoginError();clearInterval(window.__lockTimer);return;}
    const left=Math.max(0,Math.ceil((until-Date.now())/1000));
    const m=String(Math.floor(left/60)).padStart(2,"0"),s=String(left%60).padStart(2,"0");
    showLoginError(`Too many failed attempts. Account locked for 15 minutes — try again in ${m}:${s}.`,"info");
  };
  tick();window.__lockTimer=setInterval(tick,1000);
}
function handleLogin(e){
  e.preventDefault();
  const id=document.getElementById("login-id").value.trim();
  const pass=document.getElementById("login-password").value;
  if(!id||!pass){showLoginError("Enter your university ID and password to continue.");return;}
  const key=id.toUpperCase();
  const locked=state.login.lockedUntil[key];
  if(locked&&locked>Date.now()){startLockCountdown(key);return;}
  if(locked){delete state.login.lockedUntil[key];delete state.login.attempts[key];}
  const user=userById(id);
  if(!user){recordFailed(key);return;}
  if(!user.active){showLoginError("This account has been disabled by the administrator. Contact the registrar office.");return;}
  if(user.password!==pass){recordFailed(key);return;}
  state.login.attempts[key]=0;delete state.login.lockedUntil[key];
  clearLoginError();clearInterval(window.__lockTimer);
  state.currentUser=user;
  state.route=user.role==="student"?"dashboard":user.role==="advisor"?"approvals":"admin-courses";
  state.ui.sidebarOpen=false;
  document.getElementById("login-screen").classList.add("hidden");
  document.getElementById("app-shell").classList.remove("hidden");
  renderApp();
  toast("Welcome back, "+user.name.split(" ")[0],"You are signed in as "+(user.role==="advisor"?"Faculty Advisor":user.role==="admin"?"Administrator":"Student")+".","success");
}
function recordFailed(key){
  const n=(state.login.attempts[key]||0)+1;
  state.login.attempts[key]=n;
  if(n>=5){
    state.login.lockedUntil[key]=Date.now()+15*60*1000;
    startLockCountdown(key);
    toast("Account locked","5 failed attempts. Try again in 15 minutes.","danger");
  }else{
    showLoginError(`Invalid ID or password. ${5-n} attempt${5-n===1?"":"s"} remaining before the account is locked.`);
  }
}
function logout(){
  closeModal();closeGuide();
  state.currentUser=null;state.route="dashboard";state.ui.sidebarOpen=false;
  document.getElementById("app-shell").classList.add("hidden");
  document.getElementById("login-screen").classList.remove("hidden");
  const f=document.getElementById("login-form");if(f)f.reset();
  const p=document.getElementById("login-password");if(p)p.type="password";
  const t=document.getElementById("toggle-password");if(t)t.innerHTML=icon("eye",17);
  clearLoginError();
}
