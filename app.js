// Smooth anchor scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href'); const el=document.querySelector(id);
    if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
  });
});

// Case study expanders
document.querySelectorAll('.case-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const id = btn.getAttribute('data-toggle');
    const el = document.querySelector(id);
    const isOpen = el.classList.toggle('expanded');
    btn.textContent = isOpen ? 'Collapse' : 'Click for details';
  });
});

// In-card carousels
function move(track, dir=1){ track.scrollBy({left: dir*track.clientWidth, behavior:'smooth'}); }
document.querySelectorAll('.carousel').forEach(car=>{
  const track = car.querySelector('.track');
  car.querySelector('.car-prev')?.addEventListener('click',()=>move(track,-1));
  car.querySelector('.car-next')?.addEventListener('click',()=>move(track, 1));
});

// --- Lightbox with group navigation ---
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('img');
const btnPrev = lightbox.querySelector('.prev');
const btnNext = lightbox.querySelector('.next');

// Build galleries from ANY container that has data-group
const galleries = {}; // { groupId: [ {src, alt}, ... ] }

// Case-study carousels
document.querySelectorAll('.carousel[data-group]').forEach(car=>{
  const group = car.dataset.group;
  galleries[group] = Array.from(car.querySelectorAll('img.zoomable')).map(img => ({
    src: img.currentSrc || img.src, alt: img.alt || ''
  }));
});

// Service strips
document.querySelectorAll('.strip[data-group]').forEach(strip=>{
  const group = strip.dataset.group;
  galleries[group] = Array.from(strip.querySelectorAll('img.zoomable')).map(img => ({
    src: img.currentSrc || img.src, alt: img.alt || ''
  }));
});

let activeGroup = null;
let activeIndex = 0;

function show(index){
  if(!activeGroup) return;
  const list = galleries[activeGroup];
  if(!list || !list.length) return;
  activeIndex = (index + list.length) % list.length;
  lbImg.src = list[activeIndex].src;
  lbImg.alt = list[activeIndex].alt;
}
function openLb(group, index){ activeGroup = group; show(index); lightbox.classList.add('open'); }
function closeLb(){ lightbox.classList.remove('open'); activeGroup=null; }

// Open on any zoomable image: find nearest data-group container (strip or carousel)
document.addEventListener('click', (e)=>{
  const img = e.target.closest('img.zoomable');
  if(img){
    const container = img.closest('[data-group]');
    const group = container?.dataset.group || null;
    if(group && galleries[group]){
      const list = galleries[group];
      const src = img.currentSrc || img.src;
      let index = list.findIndex(i => i.src === src);
      if(index < 0) index = 0;
      openLb(group, index);
    } else {
      activeGroup = '__single__';
      galleries[activeGroup] = [{src: img.currentSrc || img.src, alt: img.alt || ''}];
      openLb(activeGroup, 0);
    }
    return;
  }
  // Close
  if(e.target === lightbox || e.target.classList.contains('lightbox-close')) closeLb();
});

btnPrev.addEventListener('click', ()=> show(activeIndex-1));
btnNext.addEventListener('click', ()=> show(activeIndex+1));

// Keyboard support
document.addEventListener('keydown', (e)=>{
  if(!lightbox.classList.contains('open')) return;
  if(e.key === 'Escape') closeLb();
  if(e.key === 'ArrowLeft') show(activeIndex-1);
  if(e.key === 'ArrowRight') show(activeIndex+1);
});

// Simple form feedback (still posts to Netlify)
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
  // Let Netlify handle the submit; just show quick feedback
  // (Don't preventDefault or it'll block Netlify Forms)
  setTimeout(()=>{
    const ok = document.getElementById('ok');
    if(ok) ok.style.display = 'block';
  }, 400);
});
