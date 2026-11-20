/* Nutcase P.I. · áudio: música noir composta (piano, Rhodes, contrabaixo), ambiente suave e efeitos */
(()=>{
const G=window.G=window.G||{};
let ac=null,master,lpf,musicG,sfxG,ambG,rev,on=true,mode='none',amb='none',ambNodes=[],timer=null,barT=0,barI=0;
try{on=localStorage.getItem('nutcase.som')!=='0'}catch(e){}
const N=n=>440*Math.pow(2,(n-69)/12);
const NM={C:0,D:2,E:4,F:5,G:7,A:9,B:11};const P=s=>{const m=s.match(/^([A-G])(#|b)?(\d)$/);return 12*(+m[3]+1)+NM[m[1]]+(m[2]==='#'?1:m[2]==='b'?-1:0)};
function noiseBuf(sec){const b=ac.createBuffer(1,ac.sampleRate*sec,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b}
function init(){if(ac){if(ac.state==='suspended')ac.resume();return}
 try{ac=new(window.AudioContext||window.webkitAudioContext)()}catch(e){return}
 master=ac.createGain();master.gain.value=on?.85:0;lpf=ac.createBiquadFilter();lpf.type='lowpass';lpf.frequency.value=20000;lpf.connect(master);master.connect(ac.destination);
 const comp=ac.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=3;comp.connect(lpf);
 musicG=ac.createGain();musicG.gain.value=0;sfxG=ac.createGain();sfxG.gain.value=.7;ambG=ac.createGain();ambG.gain.value=.35;
 rev=ac.createConvolver();const ir=ac.createBuffer(2,ac.sampleRate*2.6,ac.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,3)}rev.buffer=ir;
 const rg=ac.createGain();rg.gain.value=.32;rev.connect(rg);rg.connect(comp);[musicG,sfxG,ambG].forEach(g=>g.connect(comp));
 G.NB=noiseBuf(2);timer=setInterval(tick,50);setAmb(amb,true);if(mode!=='none')musicG.gain.value=.55;barT=ac.currentTime+.2;}
function env(g,t,a,peak,d){g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+d)}
function osc(type,f,t,dur,peak,dest,a,wet){const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f,t);env(g,t,a||.005,peak,dur);o.connect(g);g.connect(dest||sfxG);if(wet){const s=ac.createGain();s.gain.value=wet;g.connect(s);s.connect(rev)}o.start(t);o.stop(t+(a||.005)+dur+.05);return o}
function noise(t,dur,peak,ftype,f,q,dest,a){const s=ac.createBufferSource();s.buffer=G.NB;const fl=ac.createBiquadFilter();fl.type=ftype||'lowpass';fl.frequency.value=f||1000;fl.Q.value=q||.7;const g=ac.createGain();env(g,t,a||.003,peak,dur);s.connect(fl);fl.connect(g);g.connect(dest||sfxG);s.start(t,Math.random()*1.5);s.stop(t+dur+(a||0)+.1)}
/* --- instrumentos --- */
function piano(n,t,v,dur){const f=N(n);dur=dur||1.6;osc('triangle',f,t,dur,.075*v,musicG,.006,.45);osc('sine',f,t,dur*1.2,.06*v,musicG,.004,.4);osc('sine',f*2,t,dur*.4,.018*v,musicG,.003,.3);osc('sine',f*3,t,.15,.006*v,musicG,.002)}
function rhodes(n,t,dur,v){const f=N(n),o=ac.createOscillator(),o2=ac.createOscillator(),g=ac.createGain(),tr=ac.createOscillator(),tg=ac.createGain();o.type='sine';o2.type='sine';o.frequency.value=f;o2.frequency.value=f*2.001;
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.03*v,t+.02);g.gain.exponentialRampToValueAtTime(.014*v,t+.4);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
 const g2=ac.createGain();g2.gain.value=.25;tr.frequency.value=4.5;tg.gain.value=.006*v;tr.connect(tg);tg.connect(g.gain);o.connect(g);o2.connect(g2);g2.connect(g);g.connect(musicG);const s=ac.createGain();s.gain.value=.5;g.connect(s);s.connect(rev);
 [o,o2,tr].forEach(x=>{x.start(t);x.stop(t+dur+.05)})}
function bass(n,t,v,dur){const f=N(n),o=ac.createOscillator(),o2=ac.createOscillator(),fl=ac.createBiquadFilter(),g=ac.createGain();o.type='triangle';o2.type='sine';o.frequency.value=f;o2.frequency.value=f;fl.type='lowpass';fl.frequency.setValueAtTime(900,t);fl.frequency.exponentialRampToValueAtTime(260,t+.25);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.2*v,t+.012);g.gain.exponentialRampToValueAtTime(.08*v,t+.18);g.gain.exponentialRampToValueAtTime(.0001,t+(dur||.8));o.connect(fl);o2.connect(fl);fl.connect(g);g.connect(musicG);[o,o2].forEach(x=>{x.start(t);x.stop(t+(dur||.8)+.05)})}
function bell(n,t,v){osc('sine',N(n),t,1.6,.05*v,musicG,.002,.7);osc('sine',N(n)*2.76,t,.35,.012*v,musicG,.001,.5)}
function kick(t,v){const o=osc('sine',90,t,.25,.22*v,musicG,.004);o.frequency.exponentialRampToValueAtTime(40,t+.2)}
/* --- composição: "Vila Serena" (AABA em lá menor, 72 bpm, swing) --- */
const CH={Am9:{r:45,q:3,v:['C4','E4','G4','B4']},Dm9:{r:38,q:3,v:['F3','A3','C4','E4']},Bm7b5:{r:35,q:3,v:['A3','D4','F4']},E7b9:{r:40,q:4,v:['G#3','D4','F4']},Fmaj7:{r:41,q:4,v:['A3','C4','E4']},Em7:{r:40,q:3,v:['G3','B3','D4']},A7:{r:45,q:4,v:['G3','C#4','E4']},G7:{r:43,q:4,v:['F3','B3','D4']},Cmaj7:{r:36,q:4,v:['E3','G3','B3']}};
const SA=[['Am9',[['E5',0,1.5],['D5',1.5,.5],['C5',2,1],['B4',3,1]]],['Am9',[['A4',0,3]]],['Dm9',[['F5',0,1.5],['E5',1.5,.5],['D5',2,1],['C5',3,1]]],['Dm9',[['A4',0,3]]],['Bm7b5',[['D5',0,1],['F5',1,1],['A5',2,2]]],['E7b9',[['G#5',0,1],['F5',1,1],['D5',2,1],['B4',3,1]]],['Am9',[['C5',0,1.5],['B4',1.5,.5],['A4',2,2]]],['E7b9',[['B4',0,1],['G#4',1,1],['E4',2,2]]]];
const SB=[['Fmaj7',[['A5',0,1.5],['G5',1.5,.5],['E5',2,2]]],['Fmaj7',[['C5',0,1],['E5',1,1],['A5',2,2]]],['Em7',[['G5',0,1.5],['E5',1.5,.5],['D5',2,2]]],['A7',[['C#5',0,1],['E5',1,1],['G5',2,2]]],['Dm9',[['F5',0,1.5],['E5',1.5,.5],['D5',2,1],['A4',3,1]]],['G7',[['B4',0,1],['D5',1,1],['F5',2,2]]],['Cmaj7',[['E5',0,3]]],['E7b9',[['D5',0,1],['B4',1,1],['G#4',2,2]]]];
const SONG=[...SA,...SA,...SB,...SA];
const sw=b=>{const f=b%1;return Math.floor(b)+(f===.5?.66:f)};
function scheduleBar(t,i){const bpm=mode==='sad'?54:mode==='box'?62:72,spb=60/bpm,bar=SONG[i%SONG.length],c=CH[bar[0]],nx=CH[SONG[(i+1)%SONG.length][0]];
 if(mode==='noir'){bar[1].forEach(([n,b,d])=>piano(P(n),t+sw(b)*spb,.9+Math.random()*.15,d*spb*1.4));
  c.v.forEach(n=>{rhodes(P(n),t,spb*1.6,.9);rhodes(P(n),t+2.66*spb,spb*.9,.7)});
  const walk=[c.r,c.r+c.q,c.r+7,nx.r+(Math.random()<.5?1:-1)];walk.forEach((n,k)=>bass(n,t+k*spb,k?.8:1,spb*.95));
  if(i%2===0)kick(t,.5);if(Math.random()<.25){const n=P(bar[1][bar[1].length-1][0])+12;piano(n,t+3.5*spb,.35,spb)}}
 else if(mode==='sad'){bar[1].forEach(([n,b,d])=>piano(P(n),t+b*spb,.7,d*spb*1.8));c.v.forEach(n=>rhodes(P(n),t,spb*4,.7));bass(c.r,t,.6,spb*3.5)}
 else if(mode==='box'){if(i%SONG.length<16)bar[1].forEach(([n,b])=>bell(P(n)+12,t+b*spb,.9));if(i%2===0)c.v.forEach(n=>rhodes(P(n)-12,t,spb*8,.4))}
 else if(mode==='tense'){rhodes(33,t,spb*4.2,1.4);rhodes(34,t,spb*4.2,1);rhodes(45,t+spb*2,spb*2.2,.8);for(let k=0;k<4;k++){kick(t+k*spb,.9);kick(t+k*spb+.22,.55)}}
 return 4*spb}
function tick(){if(!ac)return;if(mode!=='none'&&mode){while(barT<ac.currentTime+.6){if(barT<ac.currentTime-.5)barT=ac.currentTime+.05;barT+=scheduleBar(barT,barI++)}}else barT=ac.currentTime+.1;
 if(amb==='rain'&&Math.random()<.0025)thunder();
 if(amb==='fire'&&Math.random()<.4)noise(ac.currentTime+Math.random()*.05,.03+Math.random()*.05,.05+Math.random()*.1,'bandpass',900+Math.random()*2500,1.5,ambG);
 if((amb==='rural'||amb==='orf')&&Math.random()<.05)for(let i=0;i<3;i++)osc('sine',4200+Math.random()*300,ac.currentTime+i*.06,.03,.004,ambG,.003);}
/* --- ambiente (suave) --- */
function stopAmb(){ambNodes.forEach(n=>{try{n.g.gain.setTargetAtTime(.0001,ac.currentTime,.4);n.s.stop(ac.currentTime+2)}catch(e){}});ambNodes=[]}
function loop(ftype,f,vol,q){const s=ac.createBufferSource();s.buffer=G.NB;s.loop=true;const fl=ac.createBiquadFilter();fl.type=ftype;fl.frequency.value=f;fl.Q.value=q||.5;const fl2=ac.createBiquadFilter();fl2.type='highpass';fl2.frequency.value=180;const g=ac.createGain();g.gain.value=.0001;g.gain.setTargetAtTime(vol,ac.currentTime,1);s.connect(fl);fl.connect(fl2);fl2.connect(g);g.connect(ambG);s.start();ambNodes.push({s,g})}
function setAmb(a,force){if(a===amb&&!force)return;amb=a;if(!ac)return;stopAmb();
 if(a==='rain')loop('lowpass',1400,.07);else if(a==='rainIn')loop('lowpass',500,.04);else if(a==='rural'||a==='orf'||a==='forest')loop('bandpass',500,.025,.3);else if(a==='fire')loop('lowpass',700,.12)}
function thunder(){const t=ac.currentTime;noise(t,3,.25,'lowpass',160,.7,ambG,.08);G.S&&(G.S.flash=1)}
/* --- efeitos --- */
const FX={
 step(v){const t=ac.currentTime;noise(t,.05,.05*(v||1),'lowpass',420+Math.random()*200,1,sfxG);osc('sine',70+Math.random()*15,t,.05,.05*(v||1))},
 blip(w){const t=ac.currentTime;if(!w||/^(Narrador|Caderno|Quadro|Bilhete|Fita|Rádio|Telefone)/.test(w))osc('sine',1100+Math.random()*80,t,.02,.012);else{let h=0;for(const c of w)h=(h*31+c.charCodeAt(0))%997;osc('triangle',220+h%200+Math.random()*20,t,.04,.025)}},
 door(){const t=ac.currentTime;osc('sine',65,t,.25,.2);noise(t,.08,.06,'lowpass',300,1)},
 clue(){const t=ac.currentTime;piano(76,t,1.1,1.2);piano(81,t+.12,1,1.6);piano(88,t+.24,.6,1.8)},
 wrong(){const t=ac.currentTime;piano(36,t,1.4,2);piano(37,t,1.2,2)},
 ring(){const t=ac.currentTime;for(let k=0;k<2;k++){const s=t+k*.5;[440,480].forEach(f=>{const o=ac.createOscillator(),g=ac.createGain(),m=ac.createOscillator(),mg=ac.createGain();o.frequency.value=f;m.frequency.value=20;mg.gain.value=.025;m.connect(mg);mg.connect(g.gain);g.gain.setValueAtTime(.025,s);g.gain.setValueAtTime(0,s+.4);o.connect(g);g.connect(sfxG);o.start(s);m.start(s);o.stop(s+.42);m.stop(s+.42)})}},
 click(){osc('square',1600,ac.currentTime,.012,.02)},
 unlock(){const t=ac.currentTime;osc('square',1400,t,.02,.04);osc('sine',300,t+.08,.15,.08)},
 paper(){noise(ac.currentTime,.3,.04,'bandpass',2500,.8,sfxG,.05)},
 whoosh(){noise(ac.currentTime,.7,.05,'bandpass',500,.6,sfxG,.3)},
 tvoff(){const t=ac.currentTime;const o=osc('sine',1200,t,.45,.1);o.frequency.exponentialRampToValueAtTime(30,t+.45)},
 tvon(){const t=ac.currentTime;const o=osc('sine',60,t,.6,.08,sfxG,.05);o.frequency.exponentialRampToValueAtTime(900,t+.5)},
 heart(){const t=ac.currentTime;osc('sine',55,t,.15,.35,sfxG,.01);osc('sine',48,t+.25,.18,.25,sfxG,.01)},
 shock(){const t=ac.currentTime;piano(33,t,1.6,3);piano(44,t,1.2,3);piano(51,t+.02,1,3);osc('sine',55,t,.15,.35,sfxG,.01);osc('sine',48,t+.28,.18,.28,sfxG,.01)},
 danger(){const t=ac.currentTime;for(let i=0;i<3;i++)osc('triangle',1320+i*220,t+i*.05,.12,.05,sfxG,.003,.5)},
 dodge(){noise(ac.currentTime,.25,.12,'bandpass',900,.8,sfxG,.02)},
 hit(){const t=ac.currentTime;osc('sine',80,t,.3,.4);noise(t,.15,.25,'lowpass',800,1)},
 meow(){const t=ac.currentTime,o=ac.createOscillator(),fl=ac.createBiquadFilter(),g=ac.createGain();o.type='sawtooth';o.frequency.setValueAtTime(500,t);o.frequency.linearRampToValueAtTime(820,t+.25);o.frequency.linearRampToValueAtTime(560,t+.7);fl.type='bandpass';fl.frequency.setValueAtTime(900,t);fl.frequency.linearRampToValueAtTime(1800,t+.3);fl.frequency.linearRampToValueAtTime(800,t+.7);fl.Q.value=4;env(g,t,.06,.1,.65);o.connect(fl);fl.connect(g);g.connect(sfxG);o.start(t);o.stop(t+.8)}};
G.A={init,
 sfx(n,a){if(!ac||!on)return;try{FX[n]&&FX[n](a)}catch(e){}},
 music(m){if(m===mode)return;const was=mode;mode=m;if(!ac)return;musicG.gain.cancelScheduledValues(ac.currentTime);musicG.gain.setTargetAtTime(m==='none'?0:.55,ac.currentTime,m==='none'?.3:.05);if(was==='none'||m!==was){barT=ac.currentTime+.15;barI=0}},
 amb:setAmb,
 slow(k){if(!ac)return;lpf.frequency.setTargetAtTime(k?650:20000,ac.currentTime,.25)},
 toggle(){on=!on;try{localStorage.setItem('nutcase.som',on?'1':'0')}catch(e){}if(ac)master.gain.setTargetAtTime(on?.85:0,ac.currentTime,.1);return on},
 get on(){return on}};
})();
