const header=document.getElementById('header');
const menuToggle=document.getElementById('menuToggle');
const navMenu=document.getElementById('navMenu');
const topBtn=document.getElementById('topBtn');

window.addEventListener('scroll',()=>{
  header.classList.toggle('scrolled',window.scrollY>30);
  topBtn.style.display=window.scrollY>500?'grid':'none';
  const sections=[...document.querySelectorAll('main section[id]')];
  const y=window.scrollY+140;
  sections.forEach(s=>{if(y>=s.offsetTop&&y<s.offsetTop+s.offsetHeight){
    document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+s.id));
  }});
});
menuToggle?.addEventListener('click',()=>{
  const open=navMenu.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',open);
  menuToggle.innerHTML=open?'<i class="fas fa-xmark"></i>':'<i class="fas fa-bars"></i>';
});
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',()=>{
  navMenu.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');
  menuToggle.innerHTML='<i class="fas fa-bars"></i>';
}));
topBtn.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const counters=document.querySelectorAll('[data-count]');
const counterObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
  if(e.isIntersecting&&!e.target.dataset.done){e.target.dataset.done='1';
    const target=+e.target.dataset.count;
    let n=0;const step=Math.max(1,Math.ceil(target/35));
    const timer=setInterval(()=>{n=Math.min(n+step,target);
    e.target.textContent=n+(target===100?'':' +').replace(' +','+');
    if(n>=target)clearInterval(timer)},25)}}),{threshold:.7});
counters.forEach(c=>counterObserver.observe(c));

// Portfolio filters
const filters=document.querySelectorAll('.filter');
const projects=document.querySelectorAll('.project');
filters.forEach(btn=>btn.addEventListener('click',()=>{filters.forEach(b=>b.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;projects.forEach(p=>p.classList.toggle('hidden-filter',f!=='all'&&p.dataset.category!==f));}));

// Project detail modal
const modal=document.getElementById('projectModal');
const modalImage=document.getElementById('modalImage'),modalTitle=document.getElementById('modalTitle'),modalDescription=document.getElementById('modalDescription'),modalType=document.getElementById('modalType'),modalTech=document.getElementById('modalTech'),modalLink=document.getElementById('modalLink');
projects.forEach(project=>project.addEventListener('click',e=>{if(e.target.closest('a'))return;modalImage.src=project.dataset.image;modalImage.alt=project.dataset.title;modalTitle.textContent=project.dataset.title;modalDescription.textContent=project.dataset.description;modalType.textContent=project.dataset.category.toUpperCase();modalTech.innerHTML=project.dataset.tech.split(',').map(t=>`<b>${t.trim()}</b>`).join('');modalLink.href=project.dataset.link;modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');}));
document.querySelectorAll('[data-close]').forEach(el=>el.addEventListener('click',closeModal));
function closeModal(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});

// Contact form -> WhatsApp
const form=document.getElementById('contactForm');
const toast=document.getElementById('toast');
form.addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('name').value.trim();const email=document.getElementById('email').value.trim();
const phone=document.getElementById('phone').value.trim();const service=document.getElementById('service').value||'Not specified';const message=document.getElementById('message').value.trim();const text=`Hi T&L Tech! 👋\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone||'Not provided'}\nService: ${service}\n\nProject details:\n${message}`;
const whatsappUrl=`https://wa.me/27714767516?text=${encodeURIComponent(text)}`;
window.open(whatsappUrl,'_blank','noopener');toast.classList.add('show');
setTimeout(()=>toast.classList.remove('show'),3000);form.reset();});

// Small mouse-follow glow on desktop
const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});
