/* Nutcase P.I. · motor: estado, diálogo, cutscenes, painéis, puzzles, IA, save, loop */
(()=>{
const G=window.G,W=320,H=180;
const C=document.createElement('canvas');C.width=W;C.height=H;const X=C.getContext('2d');X.imageSmoothingEnabled=false;
const D_=document.getElementById('c'),DX=D_.getContext('2d'),DW=D_.width,DH=D_.height;
const $=id=>document.getElementById(id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));G.clamp=clamp;
const S=G.S={ch:0,day:1,scene:'office',p:{x:150,face:1,walk:0},cam:0,clues:[],solved:{},trust:{},facts:{},coat:false,flags:{},wrong:0,talks:0,quotes:[],play:0,
 actor:'DETNC',hideP:false,auto:null,autoCb:null,autoSpd:.55,cine:false,trans:false,fire:false,burnt:false,sit:false,catLap:false,front:false,ending:null,detLog:[],npcLog:{},idleT:0,idleI:0,sess:Date.now()};
G.has=id=>S.clues.includes(id);
const fill=t=>String(t).replace(/\{nome\}/g,S.facts.nome||'você');G.fill=fill;

/* ---------- save ---------- */
const KEY='inexistentes.save.v1';
G.save=()=>{try{localStorage.setItem(KEY,JSON.stringify({ch:S.ch,day:S.day,clues:S.clues,solved:S.solved,trust:S.trust,facts:S.facts,flags:S.flags,wrong:S.wrong,talks:S.talks,quotes:S.quotes.slice(-20),play:S.play,detLog:S.detLog.slice(-20),npcLog:S.npcLog}))}catch(e){}};
G.load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'null')}catch(e){return null}};
G.wipe=()=>{try{localStorage.removeItem(KEY)}catch(e){}};

/* ---------- diálogo ---------- */
const D={q:[],cb:null,tw:null,full:'',active:false};
let hideT=null;const showDlg=()=>{clearTimeout(hideT);$('dlg').classList.remove('hidden')},hideDlg=ms=>{clearTimeout(hideT);hideT=setTimeout(()=>{if(!D.active)$('dlg').classList.add('hidden')},ms||300)};G.hideDlg=hideDlg;
G.say=(lines,cb)=>{D.q=lines.slice();D.cb=cb||null;D.active=true;showDlg();next()};
function next(){clearInterval(D.tw);D.tw=null;if(!D.q.length){D.active=false;$('more').textContent='';hideDlg(350);const c=D.cb;D.cb=null;c&&c();return}
 const[w,t]=D.q.shift();$('who').textContent=w;D.full=fill(t);let i=0;$('txt').textContent='';$('more').textContent='▼ toque';
 if(!D.full){$('more').textContent='';return}
 let bk=0;D.tw=setInterval(()=>{i+=2;if(G.A&&(bk++%2===0))G.A.sfx('blip',w);$('txt').textContent=D.full.slice(0,i);if(i>=D.full.length){clearInterval(D.tw);D.tw=null}},22)}
$('dlg').onclick=()=>{if(D.tw){clearInterval(D.tw);D.tw=null;$('txt').textContent=D.full}else if(D.active)next()};
$('dlg').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('dlg').click()}};
G.aside=(w,t)=>{if(D.active)return;if(!t){hideDlg(0);return}showDlg();$('who').textContent=w;$('txt').textContent=fill(t);$('more').textContent='';hideDlg(7000)};
const panelOpen=()=>!!document.querySelector('.pan.show')||$('ov').classList.contains('show');
const busy=G.busy=()=>S.cine||S.trans||D.active||panelOpen()||S.auto!=null||!!S.talk;

/* ---------- cutscenes ---------- */
G.run=(steps,cb)=>{const q=steps.slice();S.cine=true;
 const nx=()=>{if(!q.length){S.cine=false;cb&&cb();return}const s=q.shift();
  if(typeof s==='function'){s();return nx()}
  if(Array.isArray(s))return G.say([s],nx);
  if(s.say)return G.say(s.say,nx);
  if(s.go)return G.go(s.go,s.x,nx,s);
  if(s.walk!=null){S.auto=s.walk;S.autoSpd=s.spd||.55;S.autoCb=nx;return}
  if(s.wait)return setTimeout(nx,s.wait);
  if(s.card!=null)return card(s.card,s.ms,nx);
  if(s.paper)return paper(s.paper,s.sub,nx);
  if(s.slow){G.slowmo(s.slow,s.word);return nx()}
  if(s.qte)return G.qte(s.qte,()=>nx());
  if(s.choice)return choice(s.choice,s.opts,i=>{S.cine=false;s.then(i)});
  nx()};nx()};
G.go=(sc,x,cb,o)=>{S.trans=true;G.A&&G.A.sfx('door');$('fade').style.opacity=1;setTimeout(()=>{S.scene=sc;S.p.x=x;if(o&&o.face)S.p.face=o.face;S.cam=clamp(x-160,0,G.SC[sc].w-W);hud();$('fade').style.opacity=0;
 setTimeout(()=>{S.trans=false;const sc0=G.SC[sc];const k='seen_'+sc+'_'+S.ch;if(!S.cine&&sc0.enter&&!S.flags[k]){S.flags[k]=1;sc0.enter()}cb&&cb()},300)},450)};
function hud(){$('hudL').textContent=`DIA ${S.day}/30`;$('hudR').textContent=G.SC[S.scene]?G.SC[S.scene].name:''}G.hud=hud;
function card(text,ms,cb){G.A&&text&&G.A.sfx('whoosh');const ov=$('ov');ov.innerHTML=`<div class="card">${text?fill(text).replace(/\n/g,'<br>'):''}</div>`;ov.classList.add('show');let done=false;
 const end=()=>{if(done)return;done=true;ov.classList.remove('show');ov.onclick=null;cb()};ov.onclick=text?end:null;setTimeout(end,ms||3200)}
function paper(h,sub,cb){G.A&&G.A.sfx('paper');const ov=$('ov');const d=new Date();ov.innerHTML=`<div class="paperw"><div class="paper"><div class="mast">Gazeta de Vila Serena</div><div class="date">Edição extra · ${d.toLocaleDateString('pt-BR',{day:'numeric',month:'long'})}</div><h3></h3><p></p></div><button class="go">Continuar</button></div>`;
 ov.querySelector('h3').textContent=h;ov.querySelector('p').textContent=fill(sub);ov.classList.add('show');ov.onclick=null;ov.querySelector('button').onclick=()=>{ov.classList.remove('show');cb()}}
function choice(title,opts,cb){G.A&&G.A.sfx('heart');const ov=$('ov');ov.innerHTML=`<div class="choicew"><h2></h2>${opts.map((o,i)=>`<button class="${i?'':'go'}" data-i="${i}"></button>`).join('')}</div>`;ov.querySelector('h2').textContent=title;
 ov.querySelectorAll('button').forEach((b,i)=>{b.textContent=opts[i];b.onclick=e=>{e.stopPropagation();ov.classList.remove('show');cb(i)}});ov.onclick=null;ov.classList.add('show')}

/* ---------- pistas e capítulos ---------- */
G.found=(id,lines,cb)=>{if(G.has(id))return G.say([['Brandão','Já anotei isso. '+G.CLUE[id][1]]],cb);S.clues.push(id);G.save();G.A&&G.A.sfx('clue');if(G.SHOCK&&G.SHOCK[id])G.slowmo(3600,G.SHOCK[id]);
 G.say([...(lines||[]),['Caderno','Pista anotada: '+G.CLUE[id][0]]],()=>{cb&&cb();readyCheck()})};
function readyCheck(){const c=G.CH[S.ch];if(!c.qs||S.flags['ready'+S.ch])return;const need=[...new Set(c.qs.flatMap(q=>q.need))];
 if(need.every(G.has)){S.flags['ready'+S.ch]=1;setTimeout(()=>{if(!busy())G.say([['Brandão','Acho que já dá pra montar a teoria, {nome}. Abre o botão Teoria quando quiser.']])},400)}}
G.startCh=i=>{const c=G.CH[i];G.A&&G.A.music(c.music||'noir');S.ch=i;S.day=Math.max(S.day,c.day);S.idleI=0;S.idleT=0;G.save();hud();
 G.run([{card:`${c.title}\n<span style="font-size:.6em;color:#8a8778">Dia ${S.day} de 30</span>`,ms:3200},...c.intro],()=>{if(c.hint)G.aside('Caderno',c.hint)})};
G.addDay=n=>{S.day=Math.min(S.ch<7?26:30,S.day+n);hud()};

/* ---------- painéis ---------- */
function openPan(id){closeAll();$(id).classList.add('show');if(id==='pNote')renderClues();if(id==='pBoard')renderBoard();if(id==='pWallet')renderAbout()}
G.openPan=openPan;
function closeAll(){document.querySelectorAll('.pan').forEach(p=>p.classList.remove('show'))}
G.closeAll=closeAll;
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeAll);
function addLog(w,t,cls){const p=document.createElement('p');p.className=cls||'';if(w){const b=document.createElement('b');b.textContent=w+': ';p.appendChild(b)}p.appendChild(document.createTextNode(fill(t)));$('log').appendChild(p);$('log').scrollTop=1e9;return p}
const chat={mode:'det',npc:null,pending:false};
const TL=['Estranho','Conhecido','Legal','Amigo','Confiável'];const lvl=id=>Math.min(4,Math.floor((S.trust[id]||0)/20));G.lvl=lvl;G.TL=TL;
const TCOL=['#d0473a','#e8892e','#e8c83a','#7ccf5a','#45b4f0'];G.TCOL=TCOL;
const SPR={helena:'HEL',seb:'SEB',davi:'DAVI',clara:'CLARA',rosa:'ROSA'};
const DOPTS=[['O que você acha?','O que você acha disso tudo até agora?'],['Onde olho agora?','Onde eu devo olhar agora? Com quem falar?'],['Resumo das pistas','Me dá um resumo das pistas.']];
let ttw=null;
function tSay(who,txt){clearInterval(ttw);$('tWho').textContent=who?who+':':'';const full=fill(txt);let i=0;$('tTxt').textContent='';ttw=setInterval(()=>{i+=2;$('tTxt').textContent=full.slice(0,i);if(G.A&&i%4===0)G.A.sfx('blip',who);if(i>=full.length)clearInterval(ttw)},20)}
function tChoices(){const box=$('tChoices');box.innerHTML='';if(chat.mode==='final')return;const used=S.flags['used_'+(chat.npc||'det')]||(S.flags['used_'+(chat.npc||'det')]=[]);
 const opts=chat.mode==='det'?DOPTS:(G.NPC[chat.npc].opts||[]);
 opts.forEach((o,i)=>{if(chat.mode==='npc'&&o[2]!=='keep'&&used.includes(i))return;const b=document.createElement('button');b.textContent=o[0];if(o[2]==='bad')b.className='bad';b.onclick=()=>{if(chat.pending)return;if(o[2]!=='keep')used.push(i);send(o[1])};box.appendChild(b)});
 const w=document.createElement('button');w.className='go';w.textContent='✎ Escrever';w.onclick=()=>{$('tForm').hidden=false;$('tChoices').hidden=true;setTimeout(()=>$('tIn').focus(),30)};box.appendChild(w);
 const x=document.createElement('button');x.textContent='Sair';x.onclick=closeTalk;box.appendChild(x)}
function openTalk(mode,id){chat.mode=mode;chat.npc=id||null;chat.pending=false;let nx=null;
 if(mode==='npc'){const sc=G.SC[S.scene],key=SPR[id];const n=(sc.npcs?sc.npcs():[]).find(n=>n.o===G.P[key]);nx=n?n.x:S.p.x+24}
 S.talk={mode,id,x:nx,fx:null};$('game').classList.add('talking');$('tForm').hidden=mode!=='final';$('tChoices').hidden=mode==='final';$('tIn').value='';
 const go=()=>{if(mode==='npc'){const n=G.NPC[id],L=S.npcLog[id]||[];tSay(n.name,L.length?L[L.length-1][1]:n.intro)}
  else if(mode==='det'){const L=S.detLog;tSay('Brandão',L.length?L[L.length-1][1]:(S.facts.nome?'{nome}, né? Pode falar. Teorias, palpites, o que vier.':'Pode falar. Teorias, palpites, o que vier. Eu tô ouvindo.'))}
  else tSay('Brandão','Você existe?');tChoices();if(mode==='final')setTimeout(()=>$('tIn').focus(),60)};
 if(mode==='npc'){const side=S.p.x<=nx?-1:1,tx=clamp(nx+side*26,10,G.SC[S.scene].w-10);if(Math.abs(S.p.x-tx)>2){S.auto=tx;S.autoSpd=1.2;S.autoCb=()=>{S.p.face=-side;go()}}else{S.p.face=-side;go()}}else go()}
function closeTalk(){if(chat.mode==='final'){if(!chat.pending)finalReply(null);return}S.talk=null;$('game').classList.remove('talking');clearInterval(ttw);hideDlg(0)}
G.closeTalk=closeTalk;
G.openDet=()=>openTalk('det');G.openNpc=id=>openTalk('npc',id);
$('tForm').onsubmit=e=>{e.preventDefault();const m=$('tIn').value.trim().slice(0,400);if(!m)return;$('tIn').value='';if(chat.mode!=='final'){$('tForm').hidden=true;$('tChoices').hidden=false}send(m)};
$('tIn').addEventListener('keydown',e=>{if(e.key==='Escape'){$('tForm').hidden=true;$('tChoices').hidden=false}});
async function send(msg){if(chat.pending)return;chat.pending=true;$('tChoices').classList.add('wait');
 try{
 if(chat.mode==='det'){tSay('Você',msg);S.talks++;S.quotes.push(msg);grab(msg);await new Promise(r=>setTimeout(r,500));$('tTxt').textContent='…';$('tWho').textContent='Brandão:';const r=await ask(detPrompt(msg));
  const fala=r&&typeof r.fala==='string'&&r.fala?r.fala:fbDet(msg);if(r&&r.fatos&&typeof r.fatos==='object')for(const k in r.fatos){const v=r.fatos[k];if(v&&typeof v!=='object')S.facts[String(k).slice(0,20)]=String(v).slice(0,60)}
  S.detLog.push(['Você',msg],['Brandão',fala]);tSay('Brandão',fala);G.save()}
 else if(chat.mode==='npc'){const id=chat.npc,n=G.NPC[id];tSay('Brandão',msg);await new Promise(r=>setTimeout(r,500));$('tWho').textContent=n.name+':';$('tTxt').textContent='…';let r=await ask(npcPrompt(id,msg));
  if(!r||typeof r.fala!=='string'||!r.fala)r=fbNpc(id,msg);const before=lvl(id),d=clamp(+r.delta||0,-15,25);S.trust[id]=clamp((S.trust[id]||0)+d,0,100);if(S.talk)S.talk.fx={d,t:performance.now()};
  (S.npcLog[id]=S.npcLog[id]||[]).push(['Brandão',msg],[n.name,r.fala]);let fala=r.fala;const l=lvl(id);
  if(l!==before&&G.A)G.A.sfx(l>before?'click':'wrong');
  let extra=null;if(n.at2&&l>=2)extra=n.at2();
  if(!G.has(n.clue)&&l>=3&&(r.revela||n.topics.test(msg.toLowerCase()))){if(!r.revela)fala=n.reveal;S.clues.push(n.clue);G.A&&G.A.sfx('clue');if(G.SHOCK&&G.SHOCK[n.clue])setTimeout(()=>G.slowmo(3600,G.SHOCK[n.clue]),400);setTimeout(()=>G.aside('Caderno','Pista anotada: '+G.CLUE[n.clue][0]),100);readyCheck()}
  tSay(n.name,fala);if(extra)setTimeout(()=>G.aside('Caderno',extra),fala.length*10+600);G.save()}
 else if(chat.mode==='final'){tSay('Você',msg);S.quotes.push(msg);const r=await ask(finalPrompt(msg));chat.pending=false;finalReply(r&&r.fala?r.fala:null);return}
 }finally{chat.pending=false;$('tChoices').classList.remove('wait');if(S.talk)tChoices()}}
G.drawTalk=(X,cx,t)=>{const k=S.talk;if(!k||k.mode!=='npc'||k.x==null)return;const id=k.id,o=G.P[SPR[id]],tr=S.trust[id]||0,l=lvl(id),col=TCOL[l];const x=Math.round(k.x-cx),top=G.FOOT-(o.child?38:54)-12;
 const w=28;G.rect(X,x-w/2-1,top-1,w+2,5,'#0c0c10');G.rect(X,x-w/2,top,w,3,'#2a2a30');G.rect(X,x-w/2,top,Math.max(1,Math.round(w*tr/100)),3,col);G.rect(X,x-w/2,top,Math.round(w*tr/100),1,G.sh(col,.35));for(let i=1;i<5;i++)G.rect(X,x-w/2+i*w/5,top,1,3,'#0c0c10');
 const lab=TL[l].normalize('NFD').replace(/[̀-ͯ]/g,'').toUpperCase();G.text(X,x-Math.round(lab.length*2),top-7,lab,col);
 if(k.fx&&performance.now()-k.fx.t<1400){const f=(performance.now()-k.fx.t)/1400,c=k.fx.d>=0?'#7ce05a':'#ff5a4a',yy=top-12-f*8;G.text(X,x+w/2+2,Math.round(yy),k.fx.d>=0?'+':'-',c)}};
function renderClues(){const by={};S.clues.forEach(c=>{const ch=G.CLUE[c][2];(by[ch]=by[ch]||[]).push(c)});
 $('clues').innerHTML=S.clues.length?Object.keys(by).map(ch=>`<div class="chap">${G.CH[ch].title.replace(/<[^>]+>/g,'')}</div>`+by[ch].map(c=>`<div class="clue"><b>${G.CLUE[c][0]}</b><br>${G.CLUE[c][1]}</div>`).join('')).join(''):'<p class="sub">Nada ainda. Ande pela cena e examine tudo.</p>'}
function renderAbout(){const f=S.facts,k=Object.keys(f);$('aboutYou').textContent=k.length?k.map(x=>x+': '+f[x]).join(' · '):'Nada. Ainda.'}
function renderBoard(){const c=G.CH[S.ch];if(!c.qs){$('qs').innerHTML='<p class="sub">Ainda não há teoria pra montar aqui.</p>';return}
 $('qs').innerHTML=c.qs.map((q,qi)=>{const miss=q.need.filter(n=>!G.has(n)),k=S.ch+'_'+qi;return`<div class="q ${S.solved[k]?'ok':''}"><b style="color:var(--lamp);font-weight:400">${q.q}</b>${S.solved[k]?`<div>✓ ${q.o[q.a]}</div>`:miss.length?`<div class="sub">Faltam pistas para afirmar isso (${miss.length}).</div>`:`<div class="opts">${q.o.map((o,i)=>`<button data-q="${qi}" data-i="${i}">${o}</button>`).join('')}</div>`}</div>`}).join('');
 $('qs').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{const qi=+b.dataset.q,q=c.qs[qi];if(+b.dataset.i===q.a){S.solved[S.ch+'_'+qi]=1;G.save();renderBoard();if(c.qs.every((_,j)=>S.solved[S.ch+'_'+j])){setTimeout(()=>{closeAll();G.run(c.outro,()=>G.startCh(S.ch+1))},700)}}
  else{S.wrong++;G.A&&G.A.sfx('wrong');G.addDay(1);closeAll();G.say([['Brandão',q.miss||'Não… isso não fecha. Segui a pista errada e perdi a noite inteira.'],['Caderno',`Um dia perdido. Agora é o dia ${S.day} de 30.`]])}})}

/* ---------- puzzles ---------- */
function puz(t,d){openPan('pPuz');$('puzT').textContent=t;$('puzD').textContent=d||'';return $('puzB')}
G.codeLock=o=>{const b=puz(o.title,o.desc);let code='';b.innerHTML=`<div class="code" id="code">____</div><div class="keys">${['1','2','3','4','5','6','7','8','9','←','0','OK'].map(k=>`<button data-k="${k}">${k}</button>`).join('')}</div>`;
 b.querySelector('.keys').onclick=e=>{const k=e.target.dataset.k;if(!k)return;G.A&&G.A.sfx('click');if(k==='←')code=code.slice(0,-1);else if(k==='OK'){if(code===o.code){closeAll();G.A&&G.A.sfx('unlock');o.ok()}else{code='';$('code').textContent='ERRO';return}}else if(code.length<4)code+=k;$('code').textContent=(code+'____').slice(0,4)}};
G.wordPuz=o=>{const b=puz(o.title,o.desc);b.innerHTML=`${o.html}<form class="row" id="wf"><input id="wi" autocomplete="off" placeholder="Resposta"><button class="go">Tentar</button></form><div class="sub" id="wm"></div>`;
 const norm=s=>s.normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z]/gi,'').toUpperCase();
 $('wf').onsubmit=e=>{e.preventDefault();if(norm($('wi').value)===o.answer){closeAll();o.ok()}else $('wm').textContent='Não é isso. Olhe de novo.'}};
G.orderPuz=o=>{const b=puz(o.title,o.desc);const idx=o.items.map((_,i)=>i).sort(()=>Math.random()-.5);let seq=[];
 const draw=()=>{b.innerHTML=`<div class="seq">${seq.map(i=>'▸ '+o.items[i]).join('<br>')||'Toque nos trechos na ordem certa.'}</div><div class="opts">${idx.filter(i=>!seq.includes(i)).map(i=>`<button data-i="${i}"></button>`).join('')}</div>`;
  b.querySelectorAll('[data-i]').forEach(x=>{x.textContent=o.items[+x.dataset.i];x.onclick=()=>{const i=+x.dataset.i;if(i!==seq.length){seq=[];draw();b.querySelector('.seq').textContent='A fita embola. Começa de novo.';return}seq.push(i);if(seq.length===o.items.length){setTimeout(()=>{closeAll();o.ok()},500)}draw()}})};draw()};
G.pathPuz=o=>{const b=puz(o.title,o.desc);b.innerHTML=`<div class="opts">${o.opts.map((t,i)=>`<button data-i="${i}"></button>`).join('')}</div>`;
 b.querySelectorAll('[data-i]').forEach(x=>{x.textContent=o.opts[+x.dataset.i];x.onclick=()=>{closeAll();+x.dataset.i===o.correct?o.ok():o.bad()}})};

/* ---------- IA ---------- */
let AI=null;try{if(window.claude&&claude.use)claude.use('sample').then(a=>{AI=a}).catch(()=>{})}catch(e){}
async function ask(prompt){if(!AI)return null;try{const r=await AI(prompt,{cache:false,modelTier:'quick'});const m=(r&&r.text||'').match(/\{[\s\S]*\}/);return m?JSON.parse(m[0]):null}catch(e){if(e&&e.code==='not_granted')AI=null;return null}}
const hora=()=>new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
function detPrompt(msg){const c=G.CH[S.ch];return`Você é o Detetive Otávio Brandão, protagonista do jogo noir em pixel art "Nutcase P.I.", na cidade fictícia de Vila Serena. O jogador é uma voz na sua cabeça que escreve pensamentos e teorias; você responde de igual pra igual: observador, conversador, frases curtas de noir, português do Brasil, no máximo 3 frases. Você fala muito e gosta da companhia dessa voz.
Momento da história: ${c.brief} Dia ${S.day} de 30. Local: ${G.SC[S.scene].name}.
Pistas no caderno: ${S.clues.map(id=>G.CLUE[id][0]+(G.CLUE[id][2]===S.ch?' ('+G.CLUE[id][1]+')':'')).join('; ')||'nenhuma'}.
Regras: se a mensagem não tiver relação com o caso, com a cena ou com conhecer o jogador, responda curto e termine com algo como "Vamos voltar à cena." Nunca revele a solução nem conclua mais do que as pistas sustentam; diga se a teoria do jogador combina com as pistas e sugira onde olhar ou com quem conversar. De vez em quando, de forma casual, pergunte algo sobre o jogador (nome, idade, cidade, família, trabalho, que horas são aí) — você coleciona esses detalhes em silêncio. Hora real do jogador: ${hora()}.
O que já sabe do jogador: ${JSON.stringify(S.facts)}
Conversa recente:
${S.detLog.slice(-8).map(l=>l[0]+': '+l[1]).join('\n')}
Jogador: ${msg}
Responda só com JSON: {"fala":"...","fatos":{}} — em "fatos" coloque apenas dados novos que o jogador revelou sobre si mesmo (chaves curtas: nome, idade, cidade, familia, trabalho, hora, outro).`}
function npcPrompt(id,msg){const n=G.NPC[id];return`Você interpreta ${n.name} no jogo noir "Nutcase P.I." (cidade fictícia de Vila Serena), conversando com o detetive Otávio Brandão. ${n.persona} Fale português do Brasil, no máximo 3 frases, sem narrar ações longas, sem sair do personagem.
Segredo: ${n.secret} Só conte o segredo se a confiança for Amigo ou mais E o detetive perguntar sobre o assunto do segredo.
Confiança atual: ${TL[lvl(id)]} (${S.trust[id]||0}/100). Gentileza, paciência e interesse real pela pessoa aumentam; acusações, grosseria e pressa diminuem.
Conversa:
${(S.npcLog[id]||[]).slice(-8).map(l=>l[0]+': '+l[1]).join('\n')}
Detetive: ${msg}
Responda só com JSON: {"fala":"...","delta":número de -15 a 25,"revela":true ou false}`}
function finalPrompt(msg){return`Você é o detetive Otávio Brandão no último momento do jogo "Nutcase P.I.". Você acabou de ler em voz alta o "Arquivo #5", sobre o próprio jogador (${JSON.stringify(S.facts)}), e perguntou: "Você existe?". O jogador respondeu: "${msg}". Responda com uma única fala final, 1 a 2 frases, noir, tocante, em português do Brasil, chamando o jogador pelo nome se souber, e termine se despedindo. Responda só com JSON: {"fala":"..."}`}
function grab(msg){let r;if(r=msg.match(/(?:meu nome é|me chamo|pode me chamar de)\s+([A-Za-zÀ-ú]+)/i))S.facts.nome=r[1];if(r=msg.match(/(?:tenho)\s+(\d{1,2})\s*anos/i))S.facts.idade=r[1];
 if(r=msg.match(/(?:moro em|sou de|estou em|moro no|moro na)\s+([A-Za-zÀ-ú ]{3,30})/i))S.facts.cidade=r[1].trim();if(r=msg.match(/(?:trabalho com|trabalho como|sou)\s+(professor|professora|estudante|programador|programadora|médico|médica|designer|engenheiro|engenheira|vendedor|vendedora)/i))S.facts.trabalho=r[1];
 if(r=msg.match(/(?:minha|meu)\s+(mãe|pai|irmã|irmão|filho|filha|esposa|marido|namorada|namorado|gato|cachorro)/i))S.facts.familia=(S.facts.familia?S.facts.familia+', ':'')+r[0];}
function fbDet(msg){const m=msg.toLowerCase();if(m.includes('resumo'))return S.clues.length?'Até agora: '+S.clues.slice(-5).map(c=>G.CLUE[c][0]).join('; ')+'.':'Nada no caderno ainda. Precisamos examinar a cena.';if(m.includes('onde eu devo')){const c=G.CH[S.ch];return c.hint||(c.idle&&c.idle[0])||'Olha em volta. Tudo fala, se a gente escuta.'}if(m.includes('o que você acha'))return S.clues.length>3?'Alguém está convencendo essa gente, peça por peça. Não é força. É conversa.':'Cedo demais pra achar. Me traz mais pistas.';for(const[k,v]of G.FB)if(m.includes(k))return v;
 if(/\b(oi|olá|ola|e aí|eae)\b/.test(m))return'Oi. Você de novo na minha cabeça. Me diz uma coisa: que horas são aí, de onde você fala?';
 if(/\d{1,2}[:h]\d{2}|horas/.test(m))return'Tarde assim e você aqui comigo. Anotado. Agora, de volta ao caso.';
 if(/meu nome|me chamo|anos|moro|minha|meu /.test(m))return'Vou lembrar disso. Eu lembro de tudo. Agora, de volta ao caso.';
 return'Interessante. Mas isso não me ajuda a resolver nada. Vamos voltar à cena.'}
function fbNpc(id,msg){const n=G.NPC[id],m=msg.toLowerCase(),rnd=a=>a[(Math.random()*a.length)|0];
 if(/matou|culpad|mentir|mentira|mentiros|prend|assassin|louc|doid|idiot|burr/.test(m))return{fala:rnd(n.bad),delta:-15};
 if(/ajud|calma|desculp|confi|como (a senhora|o senhor|você|vc) (está|esta|tá)|sinto muito|entendo|obrigad|filh|crianç|cuidad|seguro|segura|proteg|com licença|por favor/.test(m))return{fala:rnd(n.good),delta:22};
 if(n.topics.test(m))return lvl(id)>=3?{fala:n.reveal,delta:6,revela:true}:{fala:rnd(n.low),delta:8};
 return{fala:rnd(n.neutral),delta:6}}

/* ---------- final secreto ---------- */
G.finalChat=()=>openTalk('final');
function finalReply(f){chat.mode='det';S.talk=null;$('game').classList.remove('talking');
 G.run([['Brandão',f||'Então somos dois tentando acreditar, {nome}. Boa noite. Desliga a TV com cuidado.'],{wait:1200}],()=>G.tvoff(()=>{G.tvon();const e=$('end');e.style.display='flex';
  e.innerHTML=`<div class="cred"><h1>NUTCASE P.I.</h1><div class="file"><b>ARQUIVO #5 — ENCERRADO</b><br>Fim verdadeiro.<br><span style="color:var(--dim)">Obrigado por olhar. Enquanto você olhava, eles existiam.</span></div><button class="go" id="again">Jogar de novo</button></div>`;$('again').onclick=()=>{G.wipe();location.reload()}}))}

/* ---------- TV e zoom ---------- */
G.tvoff=cb=>{G.A&&(G.A.sfx('tvoff'),G.A.music('none'));$('game').classList.add('tvoff');setTimeout(cb,1250)};
G.tvon=()=>{G.A&&G.A.sfx('tvon');const g=$('game');g.classList.remove('tvoff');void g.offsetWidth};
G.zoom=(x,y)=>{const sx=x-S.cam;D_.style.transformOrigin=`${sx/W*100}% ${y/H*100}%`;D_.style.transform='scale(3.2)'};
G.unzoom=()=>{D_.style.transition='none';D_.style.transform='';void D_.offsetWidth;D_.style.transition=''};

/* ---------- controles ---------- */
const keys={};let hold=0;
const poke=()=>{S.idleT=0};
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;poke();const k=e.key.toLowerCase();if(S.q&&S.q.phase==='go'){if(k==='arrowleft'||k==='a')qRes(S.q.dir===-1);else if(k==='arrowright'||k==='d')qRes(S.q.dir===1);return}keys[k]=1;
 if(k==='e')interact();if(k==='t'&&!busy()){e.preventDefault();G.openDet()}if(k==='enter'&&D.active&&!panelOpen())$('dlg').click();if(k==='escape'){closeAll();if(S.talk&&$('tForm').hidden)closeTalk()}});
addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
addEventListener('pointerdown',poke);
for(const[id,d]of[['bL',-1],['bR',1]]){const b=$(id);const on=e=>{e.preventDefault();hold=d;b.classList.add('on')},off=()=>{if(hold===d)hold=0;b.classList.remove('on')};
 b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off)}
$('bE').onclick=interact;$('bT').onclick=()=>{if(!busy())G.openDet()};
$('bW').onclick=()=>{if(busy())return;if(!S.coat)return G.say([['Brandão','A carteira tá no bolso do casaco. E o casaco tá no cabide.']]);openPan('pWallet')};
$('bF').onclick=async()=>{const d=document,el=d.documentElement;try{if(d.fullscreenElement||d.webkitFullscreenElement){await(d.exitFullscreen||d.webkitExitFullscreen).call(d)}else{await(el.requestFullscreen||el.webkitRequestFullscreen).call(el);try{await screen.orientation.lock('landscape')}catch(e){}}}catch(e){G.aside('Caderno','Este navegador não deixou entrar em tela cheia. Gire o celular na horizontal: o jogo se ajusta sozinho.')}};
const fsTxt=()=>{$('bF').textContent=(document.fullscreenElement||document.webkitFullscreenElement)?'✕':'⛶'};document.addEventListener('fullscreenchange',fsTxt);document.addEventListener('webkitfullscreenchange',fsTxt);
const sTxt=()=>{$('bS').textContent=G.A&&!G.A.on?'Mudo':'Som'};sTxt();$('bS').onclick=()=>{G.A.init();G.A.toggle();sTxt()};
addEventListener('pointerdown',()=>G.A&&G.A.init(),{once:false});addEventListener('keydown',()=>G.A&&G.A.init());
$('bN').onclick=()=>{if(!busy())openPan('pNote')};$('bB').onclick=()=>{if(!busy())openPan('pBoard')};
function hots(){return(G.SC[S.scene].hot||[]).filter(h=>!h.when||h.when())}
function near(){let best=null,bd=18;for(const h of hots()){const d=Math.abs(h.x-S.p.x);if(d<bd){bd=d;best=h}}return best}
function interact(){if(busy())return;const h=near();if(h){poke();h.a()}}

/* ---------- câmera lenta, desvio e zonas ---------- */
S.slowT=0;S.slowA=0;S.zoomK=1;S.shake=0;S.q=null;S.dodgeV=0;
G.slowmo=(ms,word)=>{S.slowT=Math.max(S.slowT,ms);G.A&&(G.A.slow(1),G.A.sfx(word?'shock':'heart'));if(word){const el=$('shock');el.textContent=word;el.classList.remove('show');void el.offsetWidth;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),Math.min(ms,3200))}};
function qRes(ok){const q=S.q;if(!q||q.res!=null)return;q.res=ok;q.tr=performance.now();$('qte').classList.remove('show');
 if(ok){S.dodgeV=q.dir*2.4;G.A&&G.A.sfx('dodge')}else{S.flash=1.2;S.flashC='255,60,40';S.shake=1;G.A&&G.A.sfx('hit');G.addDay(1)}
 setTimeout(()=>{const c=q.cb;S.q=null;S.slowT=Math.min(S.slowT,300);G.say([['Brandão',ok?(q.o.ok||'Desviei por um fio.'):(q.o.fail||'Não deu tempo. Isso vai doer amanhã.')]].concat(ok?[]:[['Caderno',`Machucado. Perdeu um dia: dia ${S.day} de 30.`]]),c)},900)}
G.qte=(o,cb)=>{const dir=o.dodge||(Math.random()<.5?-1:1);S.cine=true;S.q={o,dir,cb,phase:'warn',t0:performance.now(),ms:o.ms||1500,res:null,x0:S.p.x};G.A&&G.A.sfx('danger');G.slowmo((o.ms||1500)+1400);
 setTimeout(()=>{if(!S.q)return;S.q.phase='go';S.q.tg=performance.now();const el=$('qte');el.querySelector('.ql').textContent=dir<0?'◀ DESVIE!':'DESVIE! ▶';el.querySelectorAll('[data-d]').forEach(b=>b.classList.toggle('hot',+b.dataset.d===dir));el.classList.add('show')},650)};
document.querySelectorAll('#qte [data-d]').forEach(b=>b.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();if(S.q&&S.q.phase==='go')qRes(+b.dataset.d===S.q.dir)}));
const b1=document.createElement('canvas');b1.width=160;b1.height=90;const b1x=b1.getContext('2d');const b2=document.createElement('canvas');b2.width=48;b2.height=27;const b2x=b2.getContext('2d');
const g1=document.createElement('canvas');g1.width=160;g1.height=90;const g1x=g1.getContext('2d');const g2=document.createElement('canvas');g2.width=64;g2.height=36;const g2x=g2.getContext('2d');
const M=document.createElement('canvas');M.width=W;M.height=H;const Mx=M.getContext('2d');
function present(fx,fy){const k=S.zoomK,sw=W/k,sh=H/k,sx=clamp(fx-sw/2,0,W-sw);let sy=clamp(fy-sh/2,0,H-sh);const tk=Math.max(0,Math.min(1,(k-1)/.75))*(S.talk?1:0);if(tk>0){const ty=Math.max(0,G.FOOT-.72*sh);sy=sy+(ty-sy)*tk}DX.fillStyle='#000';DX.fillRect(0,0,DW,DH);const ox=S.shake>0?(Math.random()-.5)*S.shake*28:0,oy=S.shake>0?(Math.random()-.5)*S.shake*28:0;
 DX.globalCompositeOperation='source-over';DX.globalAlpha=1;DX.imageSmoothingEnabled=false;DX.fillStyle='#000';if(S.shake>0)DX.fillRect(0,0,DW,DH);DX.drawImage(C,sx,sy,sw,sh,ox,oy,DW,DH);
 b1x.imageSmoothingEnabled=true;b1x.drawImage(C,sx,sy,sw,sh,0,0,160,90);b2x.imageSmoothingEnabled=true;b2x.drawImage(b1,0,0,48,27);
 g1x.clearRect(0,0,160,90);g1x.imageSmoothingEnabled=true;g1x.drawImage(G.PC,sx,sy,sw,sh,0,0,160,90);g2x.clearRect(0,0,64,36);g2x.imageSmoothingEnabled=true;g2x.drawImage(g1,0,0,64,36);
 DX.imageSmoothingEnabled=true;DX.globalCompositeOperation='screen';DX.globalAlpha=.16;DX.drawImage(b2,ox,oy,DW,DH);
 DX.globalCompositeOperation='lighter';DX.globalAlpha=.5;DX.drawImage(g2,ox,oy,DW,DH);DX.globalAlpha=.22;DX.drawImage(g1,ox,oy,DW,DH);
 if(S.slowA>.01){const px=(fx-sx)/sw*W,py=(fy-sy)/sh*H;Mx.globalCompositeOperation='source-over';Mx.clearRect(0,0,W,H);Mx.imageSmoothingEnabled=true;Mx.drawImage(b2,0,0,W,H);Mx.globalCompositeOperation='destination-out';const gr=Mx.createRadialGradient(px,py,22,px,py,110);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');Mx.fillStyle=gr;Mx.fillRect(0,0,W,H);
  DX.globalCompositeOperation='source-over';DX.globalAlpha=S.slowA*.95;DX.drawImage(M,0,0,DW,DH);DX.globalCompositeOperation='saturation';DX.globalAlpha=S.slowA*.7;DX.fillStyle='#808080';DX.fillRect(0,0,DW,DH);DX.globalCompositeOperation='multiply';DX.globalAlpha=S.slowA*.5;DX.fillStyle='#b8c4e0';DX.fillRect(0,0,DW,DH)}
 DX.globalCompositeOperation='source-over';DX.globalAlpha=1}
function drawQ(X,cx,now){const q=S.q;if(!q)return;const p=S.p,hx=p.x-cx,hy=G.FOOT-60;const fl=(now/90|0)%2;
 if(q.res==null){X.fillStyle=fl?'#ff3a2a':'#ffd060';for(let a=0;a<8;a++){const an=a*Math.PI/4+now/400;X.fillRect(hx+Math.cos(an)*9|0,hy-4+Math.sin(an)*6|0,2,2)}X.fillRect(hx-1,hy-12,3,8);X.fillRect(hx-1,hy-2,3,2)}
 let pr=q.phase==='warn'?0:Math.min(1.25,(now-q.tg)/q.ms);if(q.res!=null)pr=Math.min(1.25,(q.tr-q.tg)/q.ms+(now-q.tr)/400);
 const o=q.o,from=o.from||'up',tx=q.x0-cx,ty=G.FOOT-26;let sx=tx,sy=-24;if(from==='right'){sx=tx+170;sy=G.FOOT-8}else if(from==='left'){sx=tx-170;sy=G.FOOT-8}else if(from==='upright'){sx=tx+90;sy=-20}
 const e=pr*pr;const x=sx+(tx-sx)*(from==='up'||from==='upright'?pr:e*0+pr),y=from==='right'||from==='left'?sy:sy+(ty-sy)*e;G.qobj(X,o.kind||'bottle',x,y,now/80,from)}
G.drawQ=drawQ;

/* ---------- loop ---------- */
const rain=Array.from({length:110},()=>({x:Math.random()*W,y:Math.random()*H,v:2.2+Math.random()*2}));let t=0,last=performance.now(),hintTxt='',ringT=0;
function setHint(s){if(s!==hintTxt){hintTxt=s;$('hint').textContent=s}}
const AMB={street:'rain',praca:'rain',office:'rainIn',room:'rainIn',pensao:'rainIn',cozinha:'room',estrada:'rural',orfanato:'orf',bosque:'forest',fazenda:'rural',celeiro:'rural',casaj:'tv'};
const GAME=$('game');let tt=0;function frame(now){const dt=Math.min(.1,(now-last)/1000);last=now;const p=S.p,sc=G.SC[S.scene],F=G.FOOT;
 S.slowT-=dt*1000;const st=S.slowT>0?1:0;S.slowA+=(st-S.slowA)*.08;if(S.slowA<.02&&!st&&G.A&&S._slw){G.A.slow(0)}S._slw=st;const ts=1-.78*S.slowA;tt+=ts;t=tt|0;S.zoomK+=((S.talk?1.75:1+.14*S.slowA)-S.zoomK)*.08;if(S.shake>0)S.shake-=.05;
 if(S.dodgeV){p.x=clamp(p.x+S.dodgeV,8,sc.w-8);S.dodgeV*=.86;p.face=Math.sign(S.dodgeV)||p.face;if(Math.abs(S.dodgeV)<.1)S.dodgeV=0}
 if(!document.hidden&&G.started)S.play+=dt;
 if(G.A){G.A.amb(S.fire?'fire':(AMB[S.scene]||'room'));if(S.flags.ring&&S.ch===0){ringT-=dt;if(ringT<=0){ringT=3.2;G.A.sfx('ring')}}}
 if(S.auto!=null){const d=S.auto-p.x;if(Math.abs(d)>S.autoSpd*ts){p.x+=Math.sign(d)*S.autoSpd*ts;p.face=Math.sign(d);p.walk=1}else{p.x=S.auto;p.walk=0;S.auto=null;const c=S.autoCb;S.autoCb=null;c&&c()}}
 else if(!busy()){const dir=hold||((keys.arrowright||keys.d)?1:0)-((keys.arrowleft||keys.a)?1:0);if(dir){poke();p.x=clamp(p.x+dir*1.1*ts,8,sc.w-8);p.face=dir;p.walk=1}else p.walk=0;
  for(const z of(sc.zones||[]))if(!S.flags[z.id]&&(!z.when||z.when())&&Math.abs(p.x-z.x)<10){S.flags[z.id]=1;z.a();break}
  S.idleT+=dt;const c=G.CH[S.ch];if(S.idleT>40&&c.idle&&c.idle.length){S.idleT=0;G.aside('Brandão',c.idle[S.idleI++%c.idle.length])}}
 else p.walk=0;
 const camT=S.talk&&S.talk.x!=null?(p.x+S.talk.x)/2-160:p.x-160;S.cam+=(clamp(camT,0,sc.w-W)-S.cam)*.08;const cx=S.cam|0;
 X.drawImage(G.bg(S.scene),cx,0,W,H,0,0,W,H);
 const fl=(Math.sin(t/7)>.96||Math.sin(t/31)>.985)?.4:1;
 G.FX[S.scene]&&G.FX[S.scene](X,cx,t,fl,S);
 for(const n of(sc.npcs?sc.npcs():[]))G.person(X,n.x-cx,F,{...n.o,face:n.face||(n.x>p.x?-1:1)},t);
 if(!S.hideP){if(S.actor==='down')G.down(X,p.x-cx,F,G.P.DET);else G.person(X,p.x-cx,F,{...G.P[S.actor],face:p.face,walk:p.walk,sound:1},t)}
 const cfg=G.light(X,S.scene,cx,t,fl,S);
 G.POST[S.scene]&&G.POST[S.scene](X,cx,t,S);
 drawQ(X,cx,now);G.drawTalk(X,cx,t);
 if(sc.rain&&!S.fire)G.rain(X,rain,cfg,cx,ts);
 X.drawImage(G.vig,0,0);
 if(S.flash>0){X.fillStyle=`rgba(${S.flashC||'220,230,255'},${Math.min(1,S.flash)*(S.flashC?.55:.3)})`;X.fillRect(0,0,W,H);S.flash-=.06;if(S.flash<=0)S.flashC=null}
 if(!busy()&&G.started){const h=near();if(h){const bob=Math.sin(t/8)*1.5|0,mx=h.x-cx,my=80+bob;G.rect(X,mx-1,my,3,7,'#f0e4b0');G.rect(X,mx-1,my+9,3,2,'#f0e4b0');G.rect(X,mx-2,my-1,5,1,'#3a2a1a');setHint('Examinar: '+h.l)}else setHint('')}
 else setHint('');
 present(S.talk&&S.talk.x!=null?(p.x+S.talk.x)/2-cx:p.x-cx,G.FOOT-34);GAME.classList.toggle('cine',!!(S.cine||S.auto!=null||S.trans));
 requestAnimationFrame(frame)}

/* ---------- início ---------- */
G.boot=()=>{hud();requestAnimationFrame(frame);const sv=G.load();if(sv&&sv.ch>=1)$('cont').hidden=false;
 $('start').onclick=()=>{G.wipe();$('title').style.display='none';$('setup').style.display='flex'};
 $('cont').onclick=()=>{Object.assign(S,sv);S.coat=true;S.actor='DET';$('title').style.display='none';G.started=true;G.startCh(S.ch)};
 $('setupForm').onsubmit=e=>{e.preventDefault();const n=$('sName').value.trim().slice(0,30),a=$('sAge').value.trim().slice(0,3),c=$('sCity').value.trim().slice(0,40);if(n)S.facts.nome=n;if(a)S.facts.idade=a;if(c)S.facts.cidade=c;$('setup').style.display='none';G.started=true;G.startCh(0)};
 $('who').textContent='Nutcase P.I.';$('txt').textContent='Uma TV liga sozinha no escuro.'};
})();
