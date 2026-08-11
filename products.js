/* Deir — product catalogue
  Image path convention: images/{filename}
  Drop your product photography into the images/ folder using these exact filenames
  and every page (home teaser, catalogue grid, catalogue rows, slider) updates automatically. */

const PRODUCTS = [
  { id:"1",  slug:"blood-sugar.jpeg",      name:"Blood Sugar Support",              cat:"Metabolic",  pack:"30 Caps", mrp:899,  sell:649, tag:"Bestseller" },
  { id:"2",  slug:"weight.jpeg",           name:"Weight Management",                cat:"Metabolic",  pack:"30 Caps", mrp:899,  sell:649 },
  { id:"3",  slug:"gut-clean.jpeg",        name:"Colon Cleanse & Gut Detox",        cat:"Digestive",  pack:"30 Caps", mrp:799,  sell:599 },
//   { id:"3B", slug:"colon-cleanse-powder",     name:"Colon Cleanse Powder",             cat:"Digestive",  pack:"100 g",   mrp:899,  sell:null },
  { id:"4",  slug:"stress.jpeg",           name:"Stress & Sleep Support",           cat:"Wellbeing",  pack:"30 Caps", mrp:899,  sell:649 },
  { id:"5",  slug:"hair-grow.jpeg",        name:"Hair Growth Support",              cat:"Beauty",     pack:"30 Caps", mrp:699,  sell:null },
  { id:"6",  slug:"women-wellness.jpeg",   name:"Women\u2019s Wellness / PCOS Support", cat:"Wellbeing", pack:"30 Caps", mrp:999,  sell:699 },
  { id:"7",  slug:"immunity.jpeg",         name:"Immunity Support",                 cat:"Immunity",   pack:"30 Caps", mrp:799,  sell:599 },
  { id:"8",  slug:"joint-support.jpeg",    name:"Joint Support",                    cat:"Mobility",   pack:"30 Caps", mrp:899,  sell:549 },
  { id:"9",  slug:"men-wellness.jpeg",     name:"Men\u2019s Wellness",              cat:"Wellbeing",  pack:"30 Caps", mrp:1799, sell:799, tag:"Premium" },
  { id:"10", slug:"ashwagandha.jpeg",      name:"Ashwagandha",                      cat:"Adaptogen",  pack:"30 Caps", mrp:799,  sell:549 },
  { id:"11", slug:"image.png",             name:"Premium Shilajit Resin",           cat:"Adaptogen",  pack:"20 g",    mrp:1499, sell:1199, tag:"Himalayan" },
  { id:"12", slug:"colloger.jpeg",         name:"Collagen Booster Powder",          cat:"Beauty",     pack:"100 g",   mrp:1899, sell:999 },
  { id:"12B",slug:"colloger.jpeg",         name:"Collagen Booster Capsules",        cat:"Beauty",     pack:"30 Caps", mrp:1199, sell:799 },
  { id:"13", slug:"fiber-husk.jpeg",       name:"Psyllium Husk / Isabgol",          cat:"Digestive",  pack:"100 g",   mrp:399,  sell:299 },
  { id:"14", slug:"turmeric.jpeg",         name:"Turmeric Curcumin",                cat:"Immunity",   pack:"60 Caps", mrp:899,  sell:null },
];

function imgPath(p){ return `${p.slug}`; }
function initials(name){ return name.split(/\s|\u2019/).filter(Boolean).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }

function fmt(n){ return n==null ? null : '\u20B9' + n.toLocaleString('en-IN'); }

function savePct(p){
  if(!p.sell) return null;
  return Math.round(((p.mrp - p.sell) / p.mrp) * 100);
}

/* ---------- card (grid / slider) ---------- */
function cardHTML(p){
  const save = savePct(p);
  return `
  <article class="p-card" data-cat="${p.cat}">
    <div class="thumb">
      <img src="${imgPath(p)}" alt="${p.name}" loading="lazy"
           onerror="this.style.display='none';this.parentElement.querySelector('.init').style.display='flex';">
      <span class="init" style="display:none;align-items:center;justify-content:center;width:100%;height:100%;">${initials(p.name)}</span>
    </div>
    <div class="info">
      <div class="cat">${p.cat}${p.tag ? ' \u00b7 ' + p.tag : ''}</div>
      <h4>${p.name}</h4>
      <div style="font-size:12px;color:#8a8672;">${p.pack}</div>
      <div class="price-row">
        ${p.mrp ? `<span class="mrp">${fmt(p.mrp)}</span>` : ''}
        <span class="sell">${fmt(p.sell) || fmt(p.mrp)}</span>
        ${save ? `<span class="badge">-${save}%</span>` : ''}
      </div>
    </div>
  </article>`;
}

/* ---------- inline row (catalogue page) ---------- */
function rowHTML(p){
  const save = savePct(p);
  return `
  <div class="p-row" data-cat="${p.cat}">
    <div class="row-thumb">
      <img src="${imgPath(p)}" alt="${p.name}" loading="lazy"
           onerror="this.style.display='none';this.parentElement.querySelector('.init').style.display='flex';">
      <span class="init" style="display:none;align-items:center;justify-content:center;width:100%;height:100%;">${initials(p.name)}</span>
    </div>
    <div class="row-mid">
      <div class="cat">${p.cat}${p.tag ? ' \u00b7 ' + p.tag : ''}</div>
      <h3>#${p.id} \u2014 ${p.name}</h3>
      <div class="pack">${p.pack} pack</div>
    </div>
    <div class="row-price">
      ${p.mrp ? `<span class="mrp">MRP ${fmt(p.mrp)}</span>` : ''}
      <span class="sell">${fmt(p.sell) || fmt(p.mrp)}</span>
      ${save ? `<div class="save">You save ${save}%</div>` : ''}
      <button class="btn-add">Order Now</button>
    </div>
  </div>`;
}

/* ---------- render: home teaser grid (first 8) ---------- */
function renderTeaser(){
  const el = document.getElementById('teaser-grid');
  if(!el) return;
  el.innerHTML = PRODUCTS.slice(0,8).map(cardHTML).join('');
}

/* ---------- render: catalogue grid + rows + filters ---------- */
function renderCatalogue(){
  const rowsEl = document.getElementById('product-rows');
  if(!rowsEl) return;
  rowsEl.innerHTML = PRODUCTS.map(rowHTML).join('');

  const cats = ['All', ...Array.from(new Set(PRODUCTS.map(p=>p.cat)))];
  const filterBar = document.getElementById('filter-bar');
  filterBar.innerHTML = cats.map((c,i)=>`<button data-cat="${c}" class="${i===0?'active':''}">${c}</button>`).join('');
  filterBar.addEventListener('click', e=>{
    const btn = e.target.closest('button'); if(!btn) return;
    filterBar.querySelectorAll('button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.cat;
    document.querySelectorAll('.p-row').forEach(r=>{
      r.style.display = (cat==='All' || r.dataset.cat===cat) ? 'grid' : 'none';
    });
  });
}

/* ---------- render + control: slider ---------- */
function renderSlider(){
  const track = document.getElementById('slider-track');
  if(!track) return;
  track.innerHTML = PRODUCTS.map(cardHTML).join('');

  const wrap = document.getElementById('slider-wrap');
  const prev = document.getElementById('slider-prev');
  const next = document.getElementById('slider-next');
  let index = 0;
  function cardWidth(){
    const card = track.querySelector('.p-card');
    return card ? card.offsetWidth + 24 : 300;
  }
  function visibleCount(){ return Math.max(1, Math.floor(wrap.offsetWidth / cardWidth())); }
  function update(){
    const max = PRODUCTS.length - visibleCount();
    index = Math.max(0, Math.min(index, max));
    track.style.transform = `translateX(-${index * cardWidth()}px)`;
  }
  prev.addEventListener('click', ()=>{ index--; update(); });
  next.addEventListener('click', ()=>{ index++; update(); });
  window.addEventListener('resize', update);
  update();
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderTeaser();
  renderCatalogue();
  renderSlider();
});
