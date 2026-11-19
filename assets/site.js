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

// filtros e busca ("sintonizar": um número abre aquela notícia; texto tolera falta de acento e erro de digitação)
const rows=[...document.querySelectorAll('.list li[data-cat]')], search=document.getElementById('search');
if(rows.length&&search){
  const $=id=>document.getElementById(id);
  const list=$('list'), empty=$('empty'), emptyMsg=$('empty-msg'), count=$('count'), go=$('empty-go'), all=$('empty-all');
  const segs=[...document.querySelectorAll('.seg button')];
  const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const docs=rows.map(r=>({r,id:+r.dataset.id,cat:r.dataset.cat,words:norm(r.dataset.text).split(' ')}));
  const newest=Math.max(...docs.map(d=>d.id));
  // distância de edição (com troca de letras vizinhas), parando cedo quando passa do limite
  const dist=(a,b,max)=>{if(Math.abs(a.length-b.length)>max)return max+1;
    let p2=[],p=[...Array(b.length+1).keys()];
    for(let i=1;i<=a.length;i++){const c=[i];let lo=i;
      for(let k=1;k<=b.length;k++){let v=Math.min(p[k]+1,c[k-1]+1,p[k-1]+(a[i-1]===b[k-1]?0:1));
        if(i>1&&k>1&&a[i-1]===b[k-2]&&a[i-2]===b[k-1])v=Math.min(v,p2[k-2]+1);c[k]=v;if(v<lo)lo=v;}
      if(lo>max)return max+1;p2=p;p=c;}
    return p[b.length];};
  // um pedaço da busca casa com uma palavra se estiver dentro dela, ou quase (1 erro até 6 letras, 2 depois)
  const hit=(t,w)=>{if(w.includes(t))return true;const max=t.length<4?0:t.length<7?1:2;if(!max)return false;
    for(let i=0;i<=w.length-t.length+max;i++)for(let L=t.length-max;L<=t.length+max;L++){
      if(L<1||i+L>w.length)continue;if(dist(t,w.slice(i,i+L),max)<=max)return true;}
    return false;};
  const match=(d,q)=>q.split(' ').every(t=>d.words.some(w=>hit(t,w)));
  const plural=(n,a,b)=>n+' '+(n===1?a:b);
  let cat='Todas',q='';
  const state=()=>{const n=norm(q);return{n,num:/^\d+$/.test(n)?+n:null};};
  const apply=()=>{
    const {n,num}=state();let shown=0,elsewhere=0;
    for(const d of docs){
      const okQ=!n||(num!==null?d.id===num:match(d,n)), okC=cat==='Todas'||d.cat===cat;
      d.r.hidden=!(okQ&&okC);if(okQ&&okC)shown++;else if(okQ)elsewhere++;}
    list.hidden=shown===0;empty.hidden=shown>0;go.hidden=all.hidden=true;
    const em=q.trim();
    if(shown===0){
      if(num!==null&&num>newest){emptyMsg.textContent='A notícia '+num+' ainda não saiu. A mais recente é a '+newest+'.';go.hidden=false;go.href=newest+'/';go.textContent='Abrir a notícia '+newest;}
      else if(elsewhere){emptyMsg.textContent='Nenhuma notícia de '+cat+' com “'+em+'”, mas '+(elsewhere===1?'existe uma':'existem '+elsewhere)+' em outros assuntos.';all.hidden=false;}
      else emptyMsg.textContent=n?'Nenhuma notícia com “'+em+'”. Tente outra palavra ou o número da notícia.':'Nenhuma notícia em '+cat+' ainda.';
    }
    $('clear').classList.toggle('primary',go.hidden&&all.hidden); // só um botão branco por vez
    count.textContent=shown===0?'':num!==null?'Notícia '+num+' sintonizada · Enter abre':
      plural(shown,'notícia','notícias')+(cat!=='Todas'?' em '+cat:'')+(n?' com “'+em+'”':'');
    // guarda no endereço para dar para mandar o link e voltar no mesmo lugar
    const u=new URL(location.href);
    cat==='Todas'?u.searchParams.delete('assunto'):u.searchParams.set('assunto',cat);
    em?u.searchParams.set('q',em):u.searchParams.delete('q');
    history.replaceState(null,'',u);
  };
  const setCat=c=>{cat=segs.some(b=>b.dataset.filter===c)?c:'Todas';segs.forEach(x=>x.setAttribute('aria-pressed',x.dataset.filter===cat));};
  // ao trocar o filtro, as notícias que ficam deslizam para o lugar novo
  const vtTypes=window.ViewTransition&&'types' in ViewTransition.prototype;
  const smooth=fn=>vtTypes&&!reduce?document.startViewTransition({update:fn,types:['filtrar']}):fn();
  segs.forEach(b=>b.onclick=()=>smooth(()=>{setCat(b.dataset.filter);apply();}));
  search.oninput=()=>{q=search.value;apply();};
  search.onkeydown=e=>{if(e.key!=='Enter')return;const vis=docs.filter(d=>!d.r.hidden);
    if(vis.length===1||state().num!==null&&vis.length){e.preventDefault();location.href=vis[0].id+'/';}
    else if(!vis.length&&!go.hidden){e.preventDefault();location.href=go.getAttribute('href');}};
  $('clear').onclick=()=>{search.value=q='';setCat('Todas');apply();search.focus();};
  all.onclick=()=>{setCat('Todas');apply();};
  // volta ao estado do endereço (ex.: ?assunto=Rádio&q=antena)
  const p=new URLSearchParams(location.search);setCat(p.get('assunto')||'Todas');q=p.get('q')||'';search.value=q;apply();
  // filtro que não cabe na tela: esmaece a borda e deixa o assunto escolhido à vista
  const seg=document.querySelector('.seg');
  const edge=()=>{seg.classList.toggle('overflows',seg.scrollWidth>seg.clientWidth+1);seg.classList.toggle('at-end',seg.scrollLeft+seg.clientWidth>=seg.scrollWidth-2);seg.classList.toggle('scrolled',seg.scrollLeft>2);};
  seg.addEventListener('scroll',edge,{passive:true});addEventListener('resize',edge);edge();
  const on=segs.find(b=>b.dataset.filter===cat);if(on&&cat!=='Todas')seg.scrollLeft=on.offsetLeft-seg.clientWidth/2+on.offsetWidth/2;
}

// copiar link
const copy=document.getElementById('copy');
if(copy)copy.onclick=()=>{
  const done=t=>{copy.textContent=t;setTimeout(()=>copy.textContent='Copiar link',2200);};
  if(navigator.share&&matchMedia('(pointer:coarse)').matches){navigator.share({title:document.title,url:location.href}).catch(()=>{});return;}
  navigator.clipboard?navigator.clipboard.writeText(location.href).then(()=>done('Link copiado'),()=>done('Copie o endereço da barra')):done('Copie o endereço da barra');
};
