/* CourseFlow portal — invoices, simulated payment gateway and receipts */

/* ---------- payments ---------- */
function methodLabel(m){return m==="bkash"?"bKash":m==="nagad"?"Nagad":"Card";}
function methodDetail(m,d){
  if(m==="card")return "---- "+String(d.card||"").replace(/\s/g,"").slice(-4);
  return String(d.mobile||"").replace(/^(\d{3})\d{5}(\d{3})$/,"$1-----$2");
}
function renderPayments(){
  const u=state.currentUser;const lines=unpaidApproved(u.id);const total=invoiceTotal(u.id);const credits=invoiceCredits(u.id);
  const history=state.transactions.filter(t=>t.studentId===u.id).slice().reverse();
  const m=state.payment.method,d=state.payment.details;
  const empty=!lines.length;
  return `<div data-od-id="payments-screen">
    <div class="page-head"><div><p class="eyebrow">S07 · Student finance</p><h1>Invoice &amp; payment.</h1><p class="lede">Approved registrations are billed at ${money(state.settings.feePerCredit)} per credit. Pay securely through a simulated gateway.</p></div><div class="page-actions"><span class="term-pill">${esc(state.settings.semester)}</span></div></div>
    <div class="invoice-grid">
      <section class="card" data-od-id="invoice-card"><div class="card-head"><div><h2>Invoice</h2><p>INV-${new Date().getFullYear()}-${esc(u.id.slice(-4))} · Issued ${dateLong(dateOffset(-1))}</p></div><span class="badge ${empty?"badge-paid":"badge-unpaid"}"><span class="dot"></span>${empty?"Settled":"Unpaid"}</span></div><div class="card-body">
        ${empty?`<div class="empty-state" style="padding:32px 12px"><div class="empty-icon">${icon("checkCircle",22)}</div><h3>All dues settled</h3><p>There are no approved unpaid courses on your account. New invoices appear here after advisor approval.</p><button class="btn btn-secondary" type="button" data-action="navigate" data-route="search">Browse courses</button></div>`:`
        <div class="invoice-lines">${lines.map(r=>{const o=offeringById(r.offeringId),c=courseOf(o);return `<div class="invoice-line"><div class="il-main"><span class="course-code">${esc(c.code)}</span><div><b>${esc(c.title)}</b><span>Sec ${esc(o.section)} · ${esc(o.days.join("/"))} · ${c.credits} credits x ${money(state.settings.feePerCredit)}</span></div></div><div class="il-amt">${money(c.credits*state.settings.feePerCredit)}</div></div>`;}).join("")}</div>
        <div class="invoice-total"><div><div class="total-label">Amount due</div><div class="total-value">${money(total)}</div></div><div class="total-note">${credits} credits billed<br>Due ${dateLong(state.settings.paymentDue)}</div></div>`}
      </div></section>
      <section class="card" data-od-id="payment-card"><div class="card-head"><div><h2>Payment method</h2><p>Choose how you want to pay</p></div>${icon("shield",18)}</div><div class="card-body">
        ${empty?`<div class="notice-box info" style="margin:0">${icon("info",17)}<div>You have no outstanding balance. Payment options become available when an approved course is unpaid.</div></div>`:`
        <form id="payment-form" novalidate>
          <div class="pay-method-grid" data-od-id="payment-methods">
            ${[["bkash","bKash","bKash"],["nagad","Nagad","Nagad"],["card","Card","VISA"]].map(([id,label,mark])=>`<button type="button" class="pay-method ${m===id?"active":""}" data-action="select-payment" data-method="${id}" aria-pressed="${m===id}"><div class="pm-mark" style="color:${id==="bkash"?"#c5185e":id==="nagad"?"#d94f1e":"var(--accent-ink)"}">${mark}</div><div class="pm-name">${label}</div></button>`).join("")}
          </div>
          <div class="pay-detail-box" data-od-id="payment-details">${m==="card"?`<div class="stack-sm"><div class="field"><label for="pay-card">Card number</label><input class="input mono" id="pay-card" inputmode="numeric" value="${esc(d.card)}" placeholder="4242 4242 4242 4242" /></div><div class="form-grid"><div class="field"><label for="pay-expiry">Expiry</label><input class="input mono" id="pay-expiry" value="${esc(d.expiry)}" placeholder="MM/YY" /></div><div class="field"><label for="pay-cvc">CVC</label><input class="input mono" id="pay-cvc" inputmode="numeric" value="${esc(d.cvc)}" placeholder="123" /></div></div></div>`:`<div class="field"><label for="pay-mobile">${m==="bkash"?"bKash":"Nagad"} mobile number</label><input class="input mono" id="pay-mobile" inputmode="tel" value="${esc(d.mobile)}" placeholder="01XXXXXXXXX" /><span class="help">A payment request will be sent to this number in the simulated gateway.</span></div>`}</div>
          <button class="btn btn-primary btn-block" type="submit" style="height:48px">${icon("lock",15)} Pay ${money(total)} securely</button>
          <div class="secure-note">${icon("shield",11)} Simulated gateway · no real money moves</div>
        </form>`}
      </div></section>
    </div>
    <section class="card" style="margin-top:18px" data-od-id="payment-history"><div class="card-head"><div><h2>Payment history</h2><p>Receipts and transaction references</p></div></div><div class="card-body" style="padding-top:6px;padding-bottom:8px">${history.length?history.map(t=>`<div class="pay-history-row"><div class="ph-icon">${icon("receipt",15)}</div><div><b>${money(t.amount)} · ${methodLabel(t.method)}</b><span>${dateTime(t.date)} · ${t.regIds.length} course${t.regIds.length===1?"":"s"}</span></div><div class="ph-amt"><b>${esc(t.receipt)}</b><span>${esc(t.id)}</span></div></div>`).join(""):`<div class="empty-state" style="padding:26px 12px"><div class="empty-icon">${icon("receipt",20)}</div><h3>No payments yet</h3><p>Completed payments and receipt IDs will appear here.</p></div>`}</div></section>
  </div>`;
}
function selectPayment(method){
  state.payment.method=method;renderApp();
}
function handlePaymentSubmit(e){
  e.preventDefault();
  const u=state.currentUser;const lines=unpaidApproved(u.id);
  if(!lines.length){toast("Nothing to pay","There are no approved unpaid courses.","info");return;}
  const m=state.payment.method;
  let detail="";
  if(m==="card"){
    const card=(document.getElementById("pay-card")?.value||"").replace(/\s/g,"");
    const exp=document.getElementById("pay-expiry")?.value||"";
    const cvc=document.getElementById("pay-cvc")?.value||"";
    if(!/^\d{16}$/.test(card)){toast("Check card number","Enter a 16-digit demo card number.","danger");return;}
    if(!/^\d{2}\/\d{2}$/.test(exp)){toast("Check expiry","Use MM/YY format.","danger");return;}
    if(!/^\d{3}$/.test(cvc)){toast("Check CVC","Enter the 3-digit CVC.","danger");return;}
    state.payment.details={...state.payment.details,card:card.replace(/(\d{4})(?=\d)/g,"$1 "),expiry:exp,cvc};detail=methodDetail(m,state.payment.details);
  }else{
    const mobile=document.getElementById("pay-mobile")?.value||"";
    if(!/^01[3-9]\d{8}$/.test(mobile)){toast("Check mobile number","Enter a valid 11-digit Bangladeshi mobile number.","danger");return;}
    state.payment.details={...state.payment.details,mobile};detail=methodDetail(m,state.payment.details);
  }
  state.payment.gateway={amount:invoiceTotal(u.id),method:m,detail,status:"ready",credits:invoiceCredits(u.id)};
  renderGateway();
}
function renderGateway(){
  const g=state.payment.gateway;if(!g)return;
  const root=document.getElementById("modal-root");
  root.innerHTML=`<div class="gateway-overlay" data-od-id="payment-gateway"><div class="gateway-shell"><div class="gateway-brand">${icon("lock",13)} <b>SecurePay</b> · demo gateway</div><div class="gateway-card">
    <div class="gateway-head"><h2>Confirm your payment</h2><span>${esc(state.currentUser.id)}</span></div>
    <div class="gateway-amount"><div class="ga-label">Amount</div><div class="ga-value">${money(g.amount)}</div><div class="ga-sub">${g.credits} credits · ${esc(state.settings.semester)}</div></div>
    <div class="gateway-details"><div><span>Payer</span><b>${esc(state.currentUser.name)}</b></div><div><span>Method</span><b>${methodLabel(g.method)}</b></div><div><span>Account</span><b>${esc(g.detail)}</b></div><div><span>Invoice</span><b>INV-${new Date().getFullYear()}-${esc(state.currentUser.id.slice(-4))}</b></div></div>
    <div class="gateway-actions">${g.status==="processing"?`<button class="btn btn-primary btn-block" type="button" disabled><span class="spinner"></span> Contacting issuer...</button><div class="gateway-test">Do not close this window.</div>`:`<button class="btn btn-primary btn-block" type="button" data-action="gateway-authorize">${icon("lock",15)} Authorize payment</button><button class="btn btn-ghost btn-sm" type="button" data-action="gateway-decline">Simulate declined payment</button><div class="gateway-test">Test gateway · no real money moves</div>`}</div>
  </div></div></div>`;
  document.body.classList.add("modal-open");
}
function gatewayAuthorize(){
  const g=state.payment.gateway;if(!g)return;
  g.status="processing";renderGateway();
  setTimeout(()=>completePayment(true),1500);
}
function gatewayDecline(){
  const g=state.payment.gateway;if(!g)return;
  g.status="processing";renderGateway();
  setTimeout(()=>completePayment(false),1100);
}
function completePayment(success){
  const g=state.payment.gateway;if(!g)return;
  const u=state.currentUser;const lines=unpaidApproved(u.id);
  const now=new Date().toISOString();const txn="TXN-"+Date.now().toString().slice(-8);const receipt="RCPT-"+new Date().getFullYear()+"-"+String(Math.floor(Math.random()*9000)+1000);
  if(success){
    lines.forEach(r=>{r.paymentStatus="Paid";r.txnId=txn;});
    state.transactions.push({id:txn,studentId:u.id,amount:g.amount,method:g.method,date:now,status:"Success",receipt,regIds:lines.map(r=>r.id)});
    notify(u.id,"Payment successful",`${money(g.amount)} paid via ${methodLabel(g.method)}. Receipt ${receipt}. SMS + email sent.`,"success");
    toast("Payment successful",`${money(g.amount)} · receipt ${receipt} · SMS + email sent.`,"success");
    state.payment.result={success:true,amount:g.amount,method:g.method,receipt,txn,date:now,credits:g.credits,count:lines.length};
  }else{
    notify(u.id,"Payment declined",`The simulated ${methodLabel(g.method)} payment was declined. Invoice remains unpaid. SMS + email sent.`,"danger");
    toast("Payment declined","The invoice remains unpaid. You can retry with another method.","danger");
    state.payment.result={success:false,amount:g.amount,method:g.method,reason:"The issuer declined this transaction (simulated demo failure).",credits:g.credits};
  }
  state.payment.gateway=null;renderApp();renderPaymentResult();
}
function renderPaymentResult(){
  const r=state.payment.result;if(!r)return;
  const root=document.getElementById("modal-root");
  root.innerHTML=`<div class="result-overlay" data-od-id="payment-result"><div class="result-card">
    <div class="result-mark ${r.success?"success":"fail"}">${icon(r.success?"check":"x",30)}</div>
    <h2>${r.success?"Payment successful.":"Payment declined."}</h2>
    <p>${r.success?`Your invoice is marked Paid. A receipt and transaction reference are ready below — SMS and email confirmations have been sent.`:`Your invoice remains Unpaid. ${esc(r.reason)} You can retry with the same or a different method.`}</p>
    <div class="receipt-box" style="margin-bottom:0;max-width:none">${r.success?`<div class="receipt-line"><span>Amount paid</span><b>${money(r.amount)}</b></div><div class="receipt-line"><span>Method</span><b>${methodLabel(r.method)}</b></div><div class="receipt-line"><span>Receipt</span><b>${esc(r.receipt)}</b></div><div class="receipt-line"><span>Transaction ID</span><b>${esc(r.txn)}</b></div><div class="receipt-line"><span>Courses paid</span><b>${r.count} · ${r.credits} credits</b></div>`:`<div class="receipt-line"><span>Attempted amount</span><b>${money(r.amount)}</b></div><div class="receipt-line"><span>Method</span><b>${methodLabel(r.method)}</b></div><div class="receipt-line"><span>Invoice status</span><b style="color:var(--warn)">Unpaid</b></div>`}</div>
    <div class="result-actions">${r.success?`<button class="btn btn-primary" type="button" data-action="navigate" data-route="dashboard">${icon("dashboard",15)} Back to dashboard</button><button class="btn btn-secondary" type="button" data-action="download-receipt">${icon("download",15)} Download receipt</button>`:`<button class="btn btn-primary" type="button" data-action="retry-payment">${icon("refresh",15)} Retry payment</button><button class="btn btn-secondary" type="button" data-action="navigate" data-route="dashboard">Back to dashboard</button>`}</div>
  </div></div>`;
  document.body.classList.add("modal-open");
}
function closePaymentResult(){state.payment.result=null;closeModal();renderApp();}
function downloadReceipt(){
  const r=state.payment.result;
  if(!r||!r.success){toast("Receipt unavailable","Complete a successful payment before downloading a receipt.","danger");return;}
  const u=state.currentUser;
  const tx=state.transactions.find(t=>t.id===r.txn);
  const regs=(tx?.regIds||[]).map(registrationById).filter(Boolean);
  const courseRows=regs.map(x=>{
    const o=offeringById(x.offeringId),c=courseOf(o);
    return c&&o?`  ${c.code.padEnd(9)} ${c.title.slice(0,34).padEnd(35)} ${String(c.credits).padStart(2)} cr  Sec ${o.section}`:null;
  }).filter(Boolean);
  if(!courseRows.length)courseRows.push(`  ${String(r.count).padStart(2)} course(s), ${r.credits} credits`);
  const paidAt=new Date(r.date).toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"});
  const rule="=".repeat(62);
  const thin="-".repeat(62);
  const text=[
    "STAMFORD UNIVERSITY BANGLADESH",
    "CourseFlow - Office of the Registrar",
    rule,
    "OFFICIAL PAYMENT RECEIPT",
    thin,
    `Receipt no.   : ${r.receipt}`,
    `Transaction ID: ${r.txn}`,
    `Student       : ${u.name} (${u.id})`,
    `Programme     : ${u.dept} - ${u.role}`,
    `Semester      : ${state.settings.semester}`,
    `Paid on       : ${paidAt}`,
    `Payment method: ${methodLabel(r.method)}`,
    thin,
    "COURSES PAID",
    ...courseRows,
    thin,
    `TOTAL PAID    : ${money(r.amount)}`,
    `Credits       : ${r.credits}`,
    rule,
    "This is a computer-generated receipt from a demo environment.",
    "No real money was processed and no live student records were used.",
    "Keep this receipt for your records. SMS and email confirmations were sent.",
    "",
  ].join("\r\n");
  const blob=new Blob([text],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;a.download=`${r.receipt}.txt`;
  document.body.appendChild(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast("Receipt downloaded",`${r.receipt}.txt has been saved to your downloads.`,"success");
}
