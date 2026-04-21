
// ===== DATA =====
const ITEMS = [
  { id:0, name:'Classic Burger',  price:890,  img:'classical-removebg-preview.png' },
  { id:1, name:'Cheese Burger',   price:1090, img:'cheese_burger-removebg-preview.png' },
  { id:2, name:'Special Burger',  price:1390, img:'12-removebg-preview.png' }
];
// ===== CART =====
let cart = [];

function addToCartById(id, e) {
  if(e){ e.stopPropagation(); }
  const item = ITEMS[id];
  const existing = cart.find(c => c.id === id);
  if(existing) existing.qty++;
  else cart.push({ ...item, qty:1 });
  renderCart();
  showToast(`${item.name} added!`);
  const btn = document.getElementById('add-btn-'+id);
  if(btn){ btn.textContent='✓ Added'; btn.classList.add('added');
    setTimeout(()=>{ btn.textContent='+ Add'; btn.classList.remove('added'); }, 1500);
  }
}
function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id);
  else renderCart();
}

function renderCart() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  const count = document.getElementById('cart-count');
  const total = document.getElementById('cartTotal');

  const totalQty = cart.reduce((s,c)=>s+c.qty,0);
  count.textContent = totalQty;

  if(cart.length === 0){
    body.innerHTML = '<div class="cart-empty"><span class="empty-icon">🛒</span>Your cart is empty.<br/>Add some burgers!</div>';
    footer.style.display = 'none';
    return;
  }

  footer.style.display = 'block';
  let sum = 0;
  body.innerHTML = cart.map(c => {
    sum += c.price * c.qty;
    return `
      <div class="cart-item">
        <img src="${c.img}" alt="${c.name}"/>
        <div class="cart-item-info">
          <div class="cart-item-name">${c.name}</div>
          <div class="cart-item-price">PKR ${(c.price*c.qty).toLocaleString()}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${c.id},-1)">−</button>
            <span class="qty-num">${c.qty}</span>
            <button class="qty-btn" onclick="changeQty(${c.id},1)">+</button>
          </div>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${c.id})">🗑</button>
      </div>`;
  }).join('');
  total.textContent = 'PKR ' + sum.toLocaleString();
}

function openCart(){ document.getElementById('cartDrawer').classList.add('open'); document.getElementById('cartOverlay').classList.add('open'); }
function closeCart(){ document.getElementById('cartDrawer').classList.remove('open'); document.getElementById('cartOverlay').classList.remove('open'); }

// ===== TOAST =====
function showToast(msg){
  const t = document.getElementById('toast');
  t.textContent = '🛒 '+msg;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2200);
}

// ===== SLIDER =====
let slideIdx = 0;
const TOTAL_SLIDES = 3;
let autoSlide;

function goToSlide(n){
  slideIdx = n;
  document.getElementById('sliderTrack').style.transform = `translateX(-${slideIdx*100}%)`;
  document.querySelectorAll('.dot').forEach((d,i)=>d.classList.toggle('active',i===slideIdx));
}
function changeSlide(dir){
  slideIdx = (slideIdx + dir + TOTAL_SLIDES) % TOTAL_SLIDES;
  goToSlide(slideIdx);
  resetAuto();
}
function resetAuto(){
  clearInterval(autoSlide);
  autoSlide = setInterval(()=>changeSlide(1), 4000);
}
resetAuto();

// ===== DARK MODE =====
let dark = true;
function toggleDark(){
  dark = !dark;
  document.body.style.filter = dark ? '' : 'invert(0.92) hue-rotate(180deg)';
}

// ===== MOBILE NAV =====
document.getElementById('hamburger').addEventListener('click',()=>document.getElementById('mobileNav').classList.add('open'));
document.getElementById('mobileClose').addEventListener('click',()=>document.getElementById('mobileNav').classList.remove('open'));
function closeMobileNav(){ document.getElementById('mobileNav').classList.remove('open'); }

// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll('.reveal');
const ro = new IntersectionObserver(entries=>{
  entries.forEach((e,i)=>{
    if(e.isIntersecting) setTimeout(()=>e.target.classList.add('vis'), i*90);
  });
},{threshold:0.12});
reveals.forEach(el=>ro.observe(el));
