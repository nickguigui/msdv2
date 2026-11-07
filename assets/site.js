document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

// sintonizador da página inicial
const tuner=document.querySelector('.tuner');
if(tuner){
  const stations=[...tuner.querySelectorAll('.station')], needle=tuner.querySelector('.needle');
  const t=tuner.querySelector('[data-out-title]'), r=tuner.querySelector('[data-out-resumo]'), go=tuner.querySelector('.go');
  const tune=s=>{
    stations.forEach(x=>x.setAttribute('aria-pressed',x===s));
    needle.style.left=s.style.left;
    t.textContent=s.dataset.titulo; r.textContent=s.dataset.resumo;
    go.href=s.dataset.href; go.textContent='Ler a notícia '+s.dataset.id;
  };
  stations.forEach((s,i)=>{
    s.onclick=()=>tune(s);
    s.onkeydown=e=>{
      const k={ArrowLeft:-1,ArrowRight:1}[e.key]; if(!k) return;
      const n=stations[i+k]; if(n){e.preventDefault();n.focus();tune(n);}
    };
  });
  tune(stations[stations.length-1]);
}

// filtros e busca da página de notícias
const rows=[...document.querySelectorAll('.row[data-cat]')];
const search=document.getElementById('search');
if(rows.length&&search){
  let cat='Todas',q='';
  const apply=()=>{let n=0;rows.forEach(row=>{const ok=(cat==='Todas'||row.dataset.cat===cat)&&(!q||row.textContent.toLowerCase().includes(q));row.hidden=!ok;if(ok)n++;});
    document.getElementById('empty').hidden=n>0;};
  document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>{cat=b.dataset.filter;document.querySelectorAll('.filter').forEach(x=>x.setAttribute('aria-pressed',x===b));apply();});
  search.oninput=()=>{q=search.value.trim().toLowerCase();apply();};
}

// copiar link da notícia
const copy=document.getElementById('copy');
if(copy)copy.onclick=()=>{
  if(!navigator.clipboard){copy.textContent='Copie o endereço da barra';return;}
  navigator.clipboard.writeText(location.href).then(()=>copy.textContent='Link copiado').catch(()=>copy.textContent='Copie o endereço da barra');
};
