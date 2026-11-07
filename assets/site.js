document.querySelectorAll('[data-today]').forEach(el=>el.textContent=new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long',year:'numeric'}));
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
// filtro e busca na página de notícias
const cards=[...document.querySelectorAll('[data-cat]')];
if(cards.length&&document.getElementById('search')){
  let cat='Todas',q='';
  const apply=()=>{let n=0;cards.forEach(c=>{const ok=(cat==='Todas'||c.dataset.cat===cat)&&(!q||c.textContent.toLowerCase().includes(q));c.style.display=ok?'':'none';if(ok)n++});
    document.getElementById('empty').style.display=n?'none':'block';};
  document.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{cat=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.classList.toggle('active',x===b));apply()});
  document.getElementById('search').oninput=e=>{q=e.target.value.trim().toLowerCase();apply()};
}
// copiar link
const cp=document.getElementById('copy');
if(cp)cp.onclick=()=>navigator.clipboard?.writeText(location.href).then(()=>cp.textContent='✅ Link copiado!').catch(()=>{});
