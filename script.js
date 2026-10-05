'use strict';
const username='Nesi56';
const nav=document.querySelector('#navigation');
const menu=document.querySelector('.menu-toggle');
function closeMenu(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');document.body.classList.remove('menu-open');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');document.body.classList.toggle('menu-open',open);});
nav.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('open')){closeMenu();menu.focus();}});
matchMedia('(min-width:721px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const page=document.body.dataset.page;
nav.querySelectorAll('a').forEach(link=>{const active=link.getAttribute('href')===`/${page}/`;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','page');});
if(page==='home'){const logo=document.querySelector('.site-header .brand');logo.classList.add('active');logo.setAttribute('aria-current','page');}
document.querySelector('#year').textContent=new Date().getFullYear();
document.addEventListener('keydown',event=>{if(event.key!=='Tab'||!nav.classList.contains('open'))return;const items=[menu,...nav.querySelectorAll('a')];if(event.shiftKey&&document.activeElement===items[0]){event.preventDefault();items.at(-1).focus();}else if(!event.shiftKey&&document.activeElement===items.at(-1)){event.preventDefault();items[0].focus();}});
// Keep accessible names stable while the visual labels decode.
const decodeMotion=matchMedia('(prefers-reduced-motion: reduce)');
const decodeFrames=new WeakMap();
nav.querySelectorAll('a').forEach(link=>{
 const label=link.textContent.trim();link.dataset.label=label;link.setAttribute('aria-label',label);
 const wrapper=document.createElement('span');wrapper.className='nav-label';wrapper.dataset.label=label;wrapper.setAttribute('aria-hidden','true');
 const text=document.createElement('span');text.className='nav-label-text';text.textContent=label;wrapper.append(text);link.replaceChildren(wrapper);
 link.addEventListener('pointerenter',()=>settleLabel(link));link.addEventListener('pointerleave',()=>decodeLabel(link));
 link.addEventListener('focus',()=>settleLabel(link));link.addEventListener('blur',()=>{if(!link.matches(':hover'))decodeLabel(link);});
});
function decodeLabel(link){
 const label=link.dataset.label,text=link.querySelector('.nav-label-text');if(!text)return;
 cancelAnimationFrame(decodeFrames.get(link));
 if(decodeMotion.matches){text.textContent=label;return;}
 const chars='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%<>/';let start;let last=-1;
 function frame(now){start??=now;const elapsed=now-start;if(elapsed>=800){text.textContent=label;decodeFrames.delete(link);return;}
 const tick=Math.floor(elapsed/50);if(tick!==last){last=tick;const revealed=Math.floor(elapsed/800*label.length);text.textContent=Array.from(label,(char,index)=>index<revealed||char===' '?char:chars[Math.floor(Math.random()*chars.length)]).join('');}
 decodeFrames.set(link,requestAnimationFrame(frame));}
 decodeFrames.set(link,requestAnimationFrame(frame));
}
decodeMotion.addEventListener('change',()=>{if(decodeMotion.matches)nav.querySelectorAll('a').forEach(decodeLabel);});

function settleLabel(link){cancelAnimationFrame(decodeFrames.get(link));decodeFrames.delete(link);link.querySelector('.nav-label-text').textContent=link.dataset.label;}
nav.querySelectorAll('a').forEach(decodeLabel);

const status=document.querySelector('#projectStatus');
const retry=document.querySelector('#retry');
const grid=document.querySelector('#projectGrid');
const board=document.querySelector('#skillBoard');
let repositories=[];
let selectedLanguage='all';
const libraryNames=['FastAPI','React','TypeScript','MapLibre','Expo','NumPy','PyTorch','TensorFlow','OpenCV','Flask','Django','Next.js','Tailwind','Docker','PostgreSQL','MongoDB'];
function technologies(repo){
 const result=repo.language?[repo.language]:[];
 for(const name of libraryNames){const escaped=name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');if(new RegExp(`\\b${escaped}(?=\\b|[., ])`,'i').test(repo.description||'')&&!result.includes(name))result.push(name);}
 return result;
}
function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
function repoLink(repo,label){const link=element('a','text-link',label);link.href=`https://github.com/Nesi56/${encodeURIComponent(repo.name)}`;link.target='_blank';link.rel='noopener noreferrer';return link;}
function renderProjects(){
 const query=document.querySelector('#search').value.trim().toLowerCase();
 const visible=repositories.filter(repo=>(selectedLanguage==='all'||repo.language===selectedLanguage)&&`${repo.name} ${repo.description||''}`.toLowerCase().includes(query));
 grid.replaceChildren();status.textContent=visible.length?`${visible.length} projects · Nesi56 on GitHub`:'No matching projects. Try another search or filter.';
 visible.forEach((repo,index)=>{
 const card=element('article','project-card');
 const cover=element('div','project-cover');cover.setAttribute('aria-hidden','true');cover.append(element('span','cover-number',String(index+1).padStart(2,'0')),element('span','cover-name',repo.name),element('span','cover-type',repo.language||'Source code'));
 const content=element('div','project-content');content.append(element('h2','',repo.name),element('p','repo-meta',repo.fork?'Open-source fork':'Personal project'),element('p','',repo.description||'Source code and updates are available in this repository.'));
 const tags=element('div','project-tags');technologies(repo).forEach(name=>tags.append(element('span','',name)));content.append(tags);
 const actions=element('div','project-actions');const button=element('button','button','View details');button.addEventListener('click',()=>openProject(repo));actions.append(button,repoLink(repo,'Source code ↗'));content.append(actions);card.append(cover,content);grid.append(card);
 });
}
function openProject(repo){
 const dialog=document.querySelector('#projectDialog'),details=document.querySelector('#projectDetails');details.replaceChildren();
 const title=element('h2','',repo.name);title.id='detailTitle';dialog.setAttribute('aria-labelledby','detailTitle');
 details.append(title,element('p','',repo.description||'Explore the source code and updates on GitHub.'),element('h3','','Technologies'));
 const tags=element('div','project-tags');const tools=technologies(repo);tools.forEach(name=>tags.append(element('span','',name)));if(!tools.length)tags.append(element('p','','No languages or libraries reported yet.'));details.append(tags,element('p','repo-meta',`Updated ${new Date(repo.updated_at).toLocaleDateString()} · ${repo.stargazers_count} stars`),repoLink(repo,'Open repository ↗'));
 dialog.showModal();
}
let selectedYear='all';
let selectedCluster=null;
const clusterPositions=new Map();
function repoLanguages(repo){return repo.languages || (repo.language?[repo.language]:[]);}
function selectCluster(language){selectedCluster=language;renderBoard();}
function renderBoard(){
 board.replaceChildren();
 const scoped=repositories.filter(repo=>selectedYear==='all'||String(new Date(repo.created_at).getUTCFullYear())===selectedYear);
 const languages=[...new Set(scoped.flatMap(repoLanguages))].sort();
 if(!languages.includes(selectedCluster))selectedCluster=null;
 const related=selectedCluster?scoped.filter(repo=>repoLanguages(repo).includes(selectedCluster)):[];
 const connected=new Set(related.flatMap(repoLanguages));
 const edges=[];
 for(let i=0;i<languages.length;i++)for(let j=i+1;j<languages.length;j++){
  const shared=scoped.filter(repo=>repoLanguages(repo).includes(languages[i])&&repoLanguages(repo).includes(languages[j]));
  if(shared.length)edges.push({a:languages[i],b:languages[j],count:shared.length});
 }
 status.textContent=languages.length?`${languages.length} languages · ${edges.length} connections · ${selectedYear==='all'?'all years':selectedYear}`:'No reported languages for this year. Choose another year.';
 const positions=new Map();const ring=languages.filter(language=>language!==selectedCluster);
 ring.forEach((language,index)=>{const angle=2*Math.PI*index/Math.max(ring.length,1)-Math.PI/2;positions.set(language,{x:350+265*Math.cos(angle),y:300+220*Math.sin(angle)});});
 if(selectedCluster)positions.set(selectedCluster,{x:350,y:300});
 const layoutKey=`${selectedYear}:${selectedCluster||'all'}`;
 for(const language of languages){const saved=clusterPositions.get(`${layoutKey}:${language}`);if(saved)positions.set(language,saved);}
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 700 600');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');svg.classList.add('cluster-lines');
 edges.forEach(edge=>{const a=positions.get(edge.a),b=positions.get(edge.b),line=document.createElementNS(svg.namespaceURI,'line');line.dataset.a=edge.a;line.dataset.b=edge.b;line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);const highlighted=selectedCluster&&(edge.a===selectedCluster||edge.b===selectedCluster);line.setAttribute('class',highlighted?'connection highlighted':selectedCluster?'connection muted':'connection');svg.append(line);});board.append(svg);
 languages.forEach(language=>{const pos=positions.get(language),button=element('button','cluster-node',language);button.dataset.language=language;button.style.left=`${pos.x/7}%`;button.style.top=`${pos.y/6}%`;button.setAttribute('aria-pressed',String(language===selectedCluster));button.classList.toggle('connected',connected.has(language)&&language!==selectedCluster);button.classList.toggle('unrelated',!!selectedCluster&&!connected.has(language));let dragged=false,dragStart=null;
 button.addEventListener('pointerdown',event=>{if(event.button!==0)return;dragged=false;dragStart={x:event.clientX,y:event.clientY,position:{...positions.get(language)},id:event.pointerId};button.setPointerCapture(event.pointerId);});
 button.addEventListener('pointermove',event=>{if(!dragStart||event.pointerId!==dragStart.id)return;const dx=event.clientX-dragStart.x,dy=event.clientY-dragStart.y;if(!dragged&&Math.hypot(dx,dy)<5)return;dragged=true;button.classList.add('dragging');const rect=board.getBoundingClientRect();const marginX=Math.max(60,button.offsetWidth/2/rect.width*700+8),marginY=Math.max(35,button.offsetHeight/2/rect.height*600+8);const position={x:Math.max(marginX,Math.min(700-marginX,dragStart.position.x+dx/rect.width*700)),y:Math.max(marginY,Math.min(600-marginY,dragStart.position.y+dy/rect.height*600))};positions.set(language,position);clusterPositions.set(`${layoutKey}:${language}`,position);button.style.left=`${position.x/7}%`;button.style.top=`${position.y/6}%`;svg.querySelectorAll('line').forEach(line=>{const a=positions.get(line.dataset.a),b=positions.get(line.dataset.b);line.setAttribute('x1',a.x);line.setAttribute('y1',a.y);line.setAttribute('x2',b.x);line.setAttribute('y2',b.y);});});
 function endDrag(event){if(!dragStart||event.pointerId!==dragStart.id)return;dragStart=null;button.classList.remove('dragging');if(button.hasPointerCapture(event.pointerId))button.releasePointerCapture(event.pointerId);}
 button.addEventListener('pointerup',endDrag);button.addEventListener('pointercancel',endDrag);
 button.addEventListener('click',event=>{if(dragged){dragged=false;event.preventDefault();return;}selectCluster(language);});board.append(button);});
 if(!languages.length)board.append(element('p','cluster-empty','No language data for this year.'));
 const detail=document.querySelector('#skillDetail');detail.replaceChildren();
 if(!selectedCluster){detail.append(element('h2','','Select a language'),element('p','','Lines connect languages used together in at least one repository. Select a node to explore its connections.'));return;}
 detail.append(element('h2','',selectedCluster),element('p','',`${related.length} project${related.length===1?'':'s'}${selectedYear==='all'?' across all years':' created in '+selectedYear}`),element('h3','','Used alongside'));
 const other=[...connected].filter(language=>language!==selectedCluster).sort(),list=element('div','related-languages');
 other.forEach(language=>{const count=related.filter(repo=>repoLanguages(repo).includes(language)).length;const button=element('button','related-language',`${language} · ${count}`);button.addEventListener('click',()=>selectCluster(language));list.append(button);});
 if(!other.length)list.append(element('p','','No other languages reported in these projects.'));detail.append(list,element('h3','','Shared projects'));
 related.forEach(repo=>{const item=element('article','skill-project');item.append(element('h3','',repo.name),element('p','',repo.description||'Public GitHub repository.'),element('p','connection-source',repoLanguages(repo).join(' · ')),repoLink(repo,'Explore repository ↗'));detail.append(item);});
 const reset=element('button','button','Show all connections');reset.addEventListener('click',()=>{selectedCluster=null;renderBoard();});detail.append(reset);
}
async function loadRepositories(){
 retry.hidden=true;status.textContent='Loading GitHub projects…';const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
 try{const response=await fetch('https://api.github.com/users/Nesi56/repos?sort=updated&per_page=100',{signal:controller.signal,headers:{Accept:'application/vnd.github+json'}});if(!response.ok)throw Error();const data=await response.json();if(!Array.isArray(data))throw Error();repositories=data.filter(repo=>!repo.archived).sort((a,b)=>Number(a.fork)-Number(b.fork)||new Date(b.updated_at)-new Date(a.updated_at));
 if(grid){const filters=document.querySelector('.filters');filters.querySelectorAll('button:not([data-language="all"])').forEach(button=>button.remove());[...new Set(repositories.map(repo=>repo.language).filter(Boolean))].sort().forEach(name=>{const button=element('button','',name);button.dataset.language=name;button.setAttribute('aria-pressed',String(selectedLanguage===name));button.classList.toggle('selected',selectedLanguage===name);filters.append(button);});renderProjects();}else{
 const results=await Promise.allSettled(repositories.map(async repo=>{const response=await fetch(`https://api.github.com/repos/Nesi56/${encodeURIComponent(repo.name)}/languages`,{signal:controller.signal});if(!response.ok)throw Error();const languages=await response.json();repo.languages=Object.keys(languages);}));
 const year=document.querySelector('#skillYear');const previous=year.value;year.querySelectorAll('option:not([value="all"])').forEach(option=>option.remove());[...new Set(repositories.map(repo=>new Date(repo.created_at).getUTCFullYear()))].filter(Number.isFinite).sort((a,b)=>b-a).forEach(value=>{const option=element('option','',String(value));option.value=String(value);year.append(option);});year.value=previous;selectedYear=year.value||'all';renderBoard();
 }
 }catch{status.textContent='GitHub could not load. Retry or visit github.com/Nesi56.';retry.hidden=false;}finally{clearTimeout(timer);}
}
if(grid){document.querySelector('#search').addEventListener('input',renderProjects);document.querySelector('.filters').addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;selectedLanguage=button.dataset.language;document.querySelectorAll('.filters button').forEach(item=>{item.classList.toggle('selected',item===button);item.setAttribute('aria-pressed',String(item===button));});renderProjects();});document.querySelector('.dialog-close').addEventListener('click',()=>document.querySelector('#projectDialog').close());}
if(grid||board){retry.addEventListener('click',loadRepositories);loadRepositories();}

if(board)document.querySelector('#skillYear').addEventListener('change',event=>{selectedYear=event.target.value;renderBoard();});
