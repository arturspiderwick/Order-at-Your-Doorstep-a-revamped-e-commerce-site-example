// script.js - Minimal but full-featured front-end logic
document.addEventListener('DOMContentLoaded', ()=>{
  // basic UI hooks
  const navToggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  const viewMenu = document.getElementById('view-menu');
  const openContact = document.getElementById('open-contact');
  const openOrder = document.getElementById('open-order');
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modal-close');
  const cartList = document.getElementById('cart-list');
  const cartCount = document.getElementById('cart-count');
  const cartTotal = document.getElementById('cart-total');
  const clearCartBtn = document.getElementById('clear-cart');
  const checkoutBtn = document.getElementById('checkout');
  const yr = document.getElementById('yr');

  // sample products
  const products = [
    {id:1, title:'Klasik Burger', desc:'Taze ve lezzetli', price:85.00},
    {id:2, title:'Cikolatali Kek', desc:'El yapımı tatlı', price:45.50},
    {id:3, title:'Margherita Pizza', desc:'İtalyan usulü', price:115.00},
    {id:4, title:'Soğuk İçecek', desc:'Serinletici', price:20.00},
    {id:5, title:'Patates Kızartması', desc:'Çıtır çıtır', price:30.00}
  ];

  // utilities: currency format
  const fmt = (n)=> '₺' + n.toFixed(2);

  // render products
  const pg = document.getElementById('product-grid');
  products.forEach(p=>{
    const el = document.createElement('article');
    el.className='card';
    el.innerHTML = `
      <div class="product-img">${p.title}</div>
      <div class="product-meta">
        <div>
          <strong>${p.title}</strong><div class="muted">${p.desc}</div>
        </div>
        <div class="price">${fmt(p.price)}</div>
      </div>
      <div style="margin-top:10px;display:flex;gap:8px;justify-content:flex-end">
        <button class="btn" data-add="${p.id}">Favori</button>
        <button class="btn btn-primary" data-buy="${p.id}">Sepete Ekle</button>
      </div>
    `;
    pg.appendChild(el);
  });

  // simple cart in localStorage
  const CART_KEY = 'demo_cart_v1';
  function readCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY))||[] }catch(e){return []} }
  function writeCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)) }
  function addToCart(id){
    const pr = products.find(p=>p.id==id); if(!pr) return;
    const c = readCart();
    const item = c.find(x=>x.id==id);
    if(item) item.qty++;
    else c.push({id:pr.id,title:pr.title,price:pr.price,qty:1});
    writeCart(c); renderCart();
  }
  function clearCart(){ writeCart([]); renderCart(); }

  function renderCart(){
    const c = readCart();
    cartList.innerHTML='';
    let total=0;
    c.forEach(it=>{
      const li = document.createElement('li');
      li.textContent = `${it.title} × ${it.qty} — ${fmt(it.price*it.qty)}`;
      cartList.appendChild(li);
      total += it.price*it.qty;
    });
    cartCount.textContent = c.reduce((s,i)=>s+i.qty,0);
    cartTotal.textContent = fmt(total);
  }

  // attach delegated listeners for product buttons
  document.body.addEventListener('click', e=>{
    const add = e.target.closest('[data-buy]');
    const fav = e.target.closest('[data-add]');
    if(add){ addToCart(Number(add.dataset.buy)); return; }
    if(fav){ alert('Favorilere eklendi: ' + fav.dataset.add); return; }
  });

  // nav toggle for small screens
  navToggle.addEventListener('click', ()=> nav.classList.toggle('show'));

  // scroll to menu
  viewMenu.addEventListener('click', ()=> location.hash = '#menu');
  openContact.addEventListener('click', ()=> location.hash = '#contact');
  openOrder.addEventListener('click', ()=> showModal());

  // modal handling
  function showModal(){ modal.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden'; renderCart(); }
  function hideModal(){ modal.setAttribute('aria-hidden','true'); document.body.style.overflow=''; }
  modalClose.addEventListener('click', hideModal);
  modal.addEventListener('click', (ev)=>{ if(ev.target===modal) hideModal(); });

  clearCartBtn.addEventListener('click', ()=>{ if(confirm('Sepeti temizlemek istiyor musunuz?')) clearCart(); });
  checkoutBtn.addEventListener('click', ()=>{ alert('Demo: Ödeme işlemi burada gerçekleşir.'); clearCart(); hideModal(); });

  // contact form (demo: client-side validation + pretend submit)
  const contactForm = document.getElementById('contact-form');
  const status = document.getElementById('contact-status');
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    if(!name || !email || !message){ status.textContent = 'Lütfen formu tamamlayın.'; return; }
    status.textContent = 'Gönderiliyor... (demo)';
    setTimeout(()=>{ status.textContent = 'Mesajınız alındı! Teşekkürler.'; contactForm.reset(); }, 900);
  });

  // wire up add-to-cart buttons in product grid for dynamic nodes
  pg.addEventListener('click', (e)=>{
    const b = e.target.closest('[data-buy]');
    if(!b) return;
    addToCart(Number(b.dataset.buy));
  });

  // init
  renderCart();
  yr.textContent = new Date().getFullYear();
});