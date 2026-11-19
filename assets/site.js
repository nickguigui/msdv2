// brilho do vidro segue o dedo ou o mouse
const glasses=[...document.querySelectorAll('.glass')];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduce){
  // no máximo uma atualização por quadro, mesmo com muitos cartões
  let ev=null;
  addEventListener('pointermove',e=>{
    if(!ev)requestAnimationFrame(()=>{
      for(const g of glasses){const r=g.getBoundingClientRect();
        g.style.setProperty('--mx',(ev.clientX-r.left)+'px');g.style.setProperty('--my',(ev.clientY-r.top)+'px');}
      ev=null;
    });
    ev=e;
  },{passive:true});
}

// filtros e busca
const rows=[...document.querySelectorAll('.list li[data-cat]')], search=document.getElementById('search');
if(rows.length&&search){
  let cat='Todas',q='';
  const apply=()=>{let n=0;rows.forEach(r=>{const ok=(cat==='Todas'||r.dataset.cat===cat)&&(!q||r.textContent.toLowerCase().includes(q));r.hidden=!ok;if(ok)n++;});
    document.getElementById('empty').hidden=n>0;};
  // ao trocar o filtro, as notícias que ficam deslizam para o lugar novo
  const vtTypes=window.ViewTransition&&'types' in ViewTransition.prototype;
  const smooth=fn=>vtTypes&&!reduce?document.startViewTransition({update:fn,types:['filtrar']}):fn();
  document.querySelectorAll('.seg button').forEach(b=>b.onclick=()=>{cat=b.dataset.filter;smooth(()=>{document.querySelectorAll('.seg button').forEach(x=>x.setAttribute('aria-pressed',x===b));apply();});});
  search.oninput=()=>{q=search.value.trim().toLowerCase();apply();};
}

// copiar link
const copy=document.getElementById('copy');
if(copy)copy.onclick=()=>{
  const done=t=>{copy.textContent=t;setTimeout(()=>copy.textContent='Copiar link',2200);};
  if(navigator.share&&matchMedia('(pointer:coarse)').matches){navigator.share({title:document.title,url:location.href}).catch(()=>{});return;}
  navigator.clipboard?navigator.clipboard.writeText(location.href).then(()=>done('Link copiado'),()=>done('Copie o endereço da barra')):done('Copie o endereço da barra');
};
