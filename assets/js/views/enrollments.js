/* CourseFlow portal — waitlist queue, course drops and automatic seat promotion */

/* ---------- waitlist ---------- */
function openWaitlistModal(offeringId){
  const o=offeringById(offeringId);const c=courseOf(o);const u=state.currentUser;
  const existing=regForOffering(u.id,offeringId);
  if(existing&&existing.status!=="Waitlisted"){toast("Already registered","You already have an active registration for this course.","warn");return;}
  const joined=existing&&existing.status==="Waitlisted";
  const position=joined?waitlistPosition(existing.id):0;
  const total=waitlistFor(offeringId).length;
  openModal(`<div class="modal narrow" role="dialog" aria-modal="true" aria-labelledby="waitlist-title">
    <div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">S05 · Waitlist</p><h2 id="waitlist-title">${joined?"You're on the waitlist.":"This section is full."}</h2><p>${esc(c.code)} · ${esc(c.title)} · Sec ${esc(o.section)}</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div>
    <div class="modal-body">
      <div class="notice-box warn">${icon("alert",17)}<div><b>${o.enrolled} of ${o.capacity} seats are taken.</b><br>${joined?"We'll reserve the next released seat for you automatically and notify you by SMS and email.":"Join the queue to be offered the next released seat. Waitlisted courses do not count toward your credit load."}</div></div>
      <div class="waitlist-count"><div class="wl-num">${joined?position:total+1}</div><div><b>${joined?"Your position in queue":"Your position if you join now"}</b><span>${joined?"Status: Waitlisted · position updates automatically":"Estimated position · queue is first come, first served"}</span></div></div>
      <div class="receipt-box" style="margin:0;max-width:none"><div class="receipt-line"><span>Section</span><b>${esc(o.days.join(" / "))} · ${esc(SLOTS[o.slot].label)}</b></div><div class="receipt-line"><span>Instructor</span><b>${esc(o.instructor)}</b></div><div class="receipt-line"><span>Current waitlist</span><b>${total} student${total===1?"":"s"}</b></div><div class="receipt-line"><span>Credit impact</span><b>None while waitlisted</b></div></div>
    </div>
    <div class="modal-foot"><span class="left">${isRegistrationOpen()?"Waitlist is open.":"Registration is currently closed."}</span><button class="btn btn-secondary" type="button" data-action="close-modal">${joined?"Close":"Not now"}</button>${joined?`<button class="btn btn-primary" type="button" data-action="close-modal">${icon("check",15)} Got it</button>`:`<button class="btn btn-primary" type="button" data-action="join-waitlist" data-id="${o.id}" ${isRegistrationOpen()?"":"disabled"}>${icon("clock",15)} Join waitlist</button>`}</div>
  </div>`);
}
function joinWaitlist(offeringId){
  if(!isRegistrationOpen()){toast("Registration closed","The waitlist is not open.","danger");return;}
  const o=offeringById(offeringId);const c=courseOf(o);const u=state.currentUser;
  const existing=regForOffering(u.id,offeringId);
  if(existing){if(existing.status!=="Waitlisted"){toast("Already registered","You already have an active registration for this course.","warn");return;}openWaitlistModal(offeringId);return;}
  const id="REG-"+Date.now().toString().slice(-7);
  state.registrations.push({id,studentId:u.id,offeringId,status:"Waitlisted",paymentStatus:"Unpaid",createdAt:new Date().toISOString(),remark:null});
  notify(u.id,"Added to waitlist",`${c.code} ${c.title} · position #${waitlistPosition(id)}. SMS + email sent.`,"info");
  toast("Added to waitlist","Position #"+waitlistPosition(id)+" · SMS + email sent.","success");
  renderApp();openWaitlistModal(offeringId);
}

/* ---------- drop ---------- */
function openDropModal(regId){
  const r=registrationById(regId);if(!r)return;const o=offeringById(r.offeringId),c=courseOf(o);
  const open=isDropOpen();
  openModal(`<div class="modal narrow" role="dialog" aria-modal="true" aria-labelledby="drop-title">
    <div class="modal-head"><div><p class="eyebrow" style="margin-bottom:5px">S06 · Drop course</p><h2 id="drop-title">Drop ${esc(c.code)}?</h2><p>${esc(c.title)} · Sec ${esc(o.section)} · ${esc(SLOTS[o.slot].label)}</p></div><button class="modal-close" type="button" data-action="close-modal" aria-label="Close">${icon("x",17)}</button></div>
    <div class="modal-body"><div class="notice-box ${open?"warn":"danger"}">${icon("clock",17)}<div><b>${open?"Drop deadline: "+dateLong(state.settings.dropDeadline):"The drop window has closed."}</b><br>${open?"Dropping releases your seat immediately. If another student is waitlisted, the first in queue is promoted. Paid fees are non-refundable in this demo.":"The deadline was "+dateLong(state.settings.dropDeadline)+". Contact the registrar office for an exception."}</div></div>
    <div class="receipt-box" style="margin:0;max-width:none"><div class="receipt-line"><span>Status</span><b>${esc(r.status)}</b></div><div class="receipt-line"><span>Credits released</span><b>${["Pending","Approved"].includes(r.status)?c.credits:0} credits</b></div><div class="receipt-line"><span>Seat</span><b>${["Pending","Approved"].includes(r.status)?"Released to waitlist":"No seat reserved"}</b></div><div class="receipt-line"><span>Payment</span><b>${r.paymentStatus==="Paid"?"Paid · non-refundable":"Unpaid"}</b></div></div></div>
    <div class="modal-foot"><span class="left">${open?"This action cannot be undone.":"Drop is unavailable."}</span><button class="btn btn-secondary" type="button" data-action="close-modal">Keep course</button><button class="btn btn-danger" type="button" data-action="confirm-drop" data-id="${r.id}" ${open?"":"disabled"}>${icon("xCircle",15)} Confirm drop</button></div>
  </div>`);
}
function promoteFromWaitlist(offeringId){
  const o=offeringById(offeringId);if(!o)return null;
  const list=waitlistFor(offeringId);if(!list.length||o.enrolled>=o.capacity)return null;
  const r=list[0];r.status="Pending";r.promotedAt=new Date().toISOString();o.enrolled+=1;
  const c=courseOf(o);const s=userById(r.studentId);
  notify(r.studentId,"Seat released — you're in",`${c.code} ${c.title} was promoted from the waitlist. Status: Pending advisor approval. SMS + email sent.`,"success");
  toast("Waitlist promotion",`${s?s.name:"A student"} was promoted into ${c.code} ${c.title}.`,"success");
  return r;
}
function confirmDrop(regId){
  const r=registrationById(regId);if(!r||!isDropOpen()){toast("Drop unavailable","The drop deadline has passed.","danger");return;}
  const o=offeringById(r.offeringId),c=courseOf(o);
  const wasSeat=["Pending","Approved"].includes(r.status);
  r.status="Dropped";r.droppedAt=new Date().toISOString();
  if(wasSeat&&o)o.enrolled=Math.max(0,o.enrolled-1);
  notify(r.studentId,"Course dropped",`${c.code} ${c.title} was dropped. ${wasSeat?"Seat released to the waitlist.":"Removed from waitlist."} SMS + email sent.`,"info");
  toast("Course dropped",`${c.code} ${c.title} · ${wasSeat?"seat released":"removed from waitlist"}.`,"success");
  if(wasSeat)promoteFromWaitlist(r.offeringId);
  closeModal();renderApp();
}
