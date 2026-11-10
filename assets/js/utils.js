/* CourseFlow portal — formatting, date helpers, domain selectors and status badges */

function icon(name, size=18, cls=""){
  return `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.info}</svg>`;
}
function esc(v){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function money(n){return "BDT "+Number(n||0).toLocaleString("en-US");}
function initials(name){return name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join("").toUpperCase();}
function dateOffset(days){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+days);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");}
function parseDate(s){return new Date(s+"T00:00:00");}
function dateLong(s){return parseDate(s).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});}
function dateShort(s){return parseDate(s).toLocaleDateString("en-GB",{day:"numeric",month:"short"});}
function dateTime(iso){const d=new Date(iso);return d.toLocaleDateString("en-GB",{day:"numeric",month:"short"})+" · "+d.toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit"});}
function timeAgo(iso){const d=Date.now()-new Date(iso).getTime();if(d<60000)return "Just now";const m=Math.floor(d/60000);if(m<60)return m+"m ago";const h=Math.floor(m/60);if(h<24)return h+"h ago";const days=Math.floor(h/24);return days+"d ago";}
function deptClass(d){return "dept-"+String(d).toLowerCase();}
function courseOf(o){return state.courses.find(c=>c.code===o.code);}
function offeringById(id){return state.offerings.find(o=>o.id===id);}
function userById(id){return state.users.find(u=>u.id.toUpperCase()===String(id).toUpperCase());}
function registrationById(id){return state.registrations.find(r=>r.id===id);}
function studentRegs(id){return state.registrations.filter(r=>r.studentId===id);}
function activeRegs(id){return studentRegs(id).filter(r=>["Pending","Approved","Waitlisted"].includes(r.status));}
function creditsUsed(id){return activeRegs(id).filter(r=>["Pending","Approved"].includes(r.status)).reduce((s,r)=>s+(courseOf(offeringById(r.offeringId))?.credits||0),0);}
function unpaidApproved(id){return studentRegs(id).filter(r=>r.status==="Approved"&&r.paymentStatus!=="Paid");}
function invoiceTotal(id){return unpaidApproved(id).reduce((s,r)=>s+(courseOf(offeringById(r.offeringId))?.credits||0)*state.settings.feePerCredit,0);}
function invoiceCredits(id){return unpaidApproved(id).reduce((s,r)=>s+(courseOf(offeringById(r.offeringId))?.credits||0),0);}
function waitlistFor(offeringId){return state.registrations.filter(r=>r.offeringId===offeringId&&r.status==="Waitlisted").sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));}
function waitlistPosition(regId){const r=registrationById(regId);if(!r)return 0;const list=waitlistFor(r.offeringId);return list.findIndex(x=>x.id===regId)+1;}
function regForOffering(studentId, offeringId){return state.registrations.find(r=>r.studentId===studentId&&r.offeringId===offeringId&&["Pending","Approved","Waitlisted"].includes(r.status));}
function isRegistrationOpen(){const t=new Date();const close=parseDate(state.settings.registrationClose);close.setHours(23,59,59,999);return t>=parseDate(state.settings.registrationOpen)&&t<=close;}
function isDropOpen(){const d=parseDate(state.settings.dropDeadline);d.setHours(23,59,59,999);return new Date()<=d;}
function statusBadge(status){
  const map={Pending:"pending",Approved:"approved",Rejected:"rejected",Waitlisted:"waitlisted",Dropped:"dropped"};
  return `<span class="badge badge-${map[status]||"neutral"}"><span class="dot"></span>${esc(status)}</span>`;
}
function paymentBadge(r){
  if(r.status!=="Approved")return "";
  return r.paymentStatus==="Paid"?`<span class="badge badge-paid">Paid</span>`:`<span class="badge badge-unpaid">Unpaid</span>`;
}
