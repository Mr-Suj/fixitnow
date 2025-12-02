
// app.js - localStorage login, booking, contact save
document.addEventListener('DOMContentLoaded', ()=>{

  function el(id){return document.getElementById(id)}

  // show user in nav if logged in
  function applyUser(user){
    const badges = document.querySelectorAll('.user-badge');
    badges.forEach(b=>{ b.style.display='inline-block'; b.textContent = user.name; b.onclick = ()=>{ if(confirm('Logout?')){ localStorage.removeItem('fixitnow_user'); location.reload(); } }});
    const loginLinks = document.querySelectorAll('.nav-login');
    loginLinks.forEach(l=> l.style.display='none');
  }
  const raw = localStorage.getItem('fixitnow_user');
  if(raw){ try{ applyUser(JSON.parse(raw)); }catch(e){} }

  // Login page actions
  const doLoginBtn = el('doLogin');
  if(doLoginBtn){
    doLoginBtn.addEventListener('click', ()=>{
      const name = el('lname').value.trim();
      const phone = el('lphone').value.trim();
      const address = el('laddress').value.trim();
      if(!name||!phone||!address){ alert('Please fill all fields'); return; }
      const user = {name,phone,address,at:new Date().toISOString()};
      localStorage.setItem('fixitnow_user', JSON.stringify(user));
      alert('Welcome, '+name);
      location.href = 'index.html';
    });
  }

  // Booking flow (buttons with class .book-btn)
  document.addEventListener('click', (e)=>{
    const b = e.target.closest('.book-btn');
    if(b){
      const worker = b.dataset.worker || 'Worker';
      const img = b.dataset.img || '';
      const role = b.dataset.role || '';
      const userRaw = localStorage.getItem('fixitnow_user');
      if(!userRaw){
        if(confirm('Please login to book. Go to login page now?')) location.href = 'login.html';
        return;
      }
      // Save booking (for demo)
      const user = JSON.parse(userRaw);
      const bookings = JSON.parse(localStorage.getItem('fixitnow_bookings')||'[]');
      const bk = {id:Date.now(), worker, role, img, user, created:new Date().toISOString()};
      bookings.push(bk);
      localStorage.setItem('fixitnow_bookings', JSON.stringify(bookings));

      // show booking card
      const card = document.getElementById('bookingCard');
      if(card){
        document.getElementById('bkImg').src = img;
        document.getElementById('bkName').textContent = worker + ' ('+role+')';
        document.getElementById('bkRole').textContent = worker + ' ('+role+')';
        card.style.display = 'block';
        document.getElementById('bkHome').addEventListener('click', ()=>{ card.style.display='none'; window.location.href='services.html'; });
      }else{
        alert('Booking confirmed. ' + worker + ' is on the way. Thank you for choosing Fix It Now.');
      }
    }
  });

  // Contact form
  const sendContact = el('sendContact');
  if(sendContact){
    sendContact.addEventListener('click', ()=>{
      const name = el('cname').value.trim();
      const phone = el('cphone').value.trim();
      const city = el('ccity').value.trim();
      const msg = el('cmsg').value.trim();
      if(!name||!phone||!city||!msg){ alert('Please fill all fields'); return; }
      const requests = JSON.parse(localStorage.getItem('fixitnow_requests')||'[]');
      requests.push({id:Date.now(),name,phone,city,msg,created:new Date().toISOString()});
      localStorage.setItem('fixitnow_requests', JSON.stringify(requests));
      alert('Request received — we will contact you soon');
      el('cname').value=''; el('cphone').value=''; el('ccity').value=''; el('cmsg').value='';
    });
  }
  const exportBtn = el('exportRequests');
  if(exportBtn){
    exportBtn.addEventListener('click', ()=>{
      const data = localStorage.getItem('fixitnow_requests')||'[]';
      if(data==='[]'){ alert('No requests'); return; }
      const blob = new Blob([data], {type:'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = 'fixitnow_requests.json'; a.click();
      URL.revokeObjectURL(url);
    });
  }

});
