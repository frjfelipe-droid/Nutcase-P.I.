/* Nutcase P.I. · arte: cenários detalhados, sprites sombreados, iluminação com dither */
(()=>{
const G=window.G=window.G||{};const W=320,H=180,FOOT=150;G.FOOT=FOOT;
let seed=1;const R=()=>(seed=seed*16807%2147483647)/2147483647;const pick=a=>a[(R()*a.length)|0];const rr=(a,b)=>a+R()*(b-a);
const mk=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
const rect=(g,x,y,w,h,c)=>{w=Math.round(w);h=Math.round(h);if(w<=0||h<=0)return;g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)};G.rect=rect;
const HX={};const rgb=h=>HX[h]||(HX[h]=[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)]);
const c8=v=>v<0?0:v>255?255:v|0;const hex=(r,g,b)=>'#'+((1<<24)|(c8(r)<<16)|(c8(g)<<8)|c8(b)).toString(16).slice(1);
const mix=(a,b,t)=>{const A=rgb(a),B=rgb(b);return hex(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t)};
const sh=(c,f)=>f>=0?mix(c,'#ffffff',f):mix(c,'#000000',-f);G.sh=sh;
const vary=(c,a)=>sh(c,(R()-.5)*a);
let NS=1;const hash=(x,y)=>{let h=(Math.imul(x|0,374761393)+Math.imul(y|0,668265263)+Math.imul(NS,1442695041))|0;h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967296};
const vn=(x,y,s)=>{x/=s;y/=s;const xi=Math.floor(x),yi=Math.floor(y),xf=x-xi,yf=y-yi,a=hash(xi,yi),b=hash(xi+1,yi),c=hash(xi,yi+1),d=hash(xi+1,yi+1),u=xf*xf*(3-2*xf),v=yf*yf*(3-2*yf);return a+(b-a)*u+(c-a)*v+(a-b-c+d)*u*v};
const BY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5];const by=(x,y)=>BY[(x&3)+((y&3)<<2)]/16-.47;
function pix(g,x,y,w,h,fn){x=Math.max(0,x|0);y=Math.max(0,y|0);w=Math.min(g.canvas.width-x,w|0);h=Math.min(g.canvas.height-y,h|0);if(w<=0||h<=0)return;const id=g.getImageData(x,y,w,h),d=id.data;for(let j=0;j<h;j++)for(let i=0;i<w;i++)fn(d,(j*w+i)*4,x+i,y+j);g.putImageData(id,x,y)}
function dgrad(g,x,y,w,h,cols,steps,horiz){const C=cols.map(rgb),n=C.length-1,s=steps||4;pix(g,x,y,w,h,(d,k,px,py)=>{const t=horiz?(px-x)/Math.max(1,w-1):(py-y)/Math.max(1,h-1);let q=Math.round(t*n*s+by(px,py))/s;q=q<0?0:q>n?n:q;const i=Math.min(n-1,Math.floor(q)),f=q-i,a=C[i],b=C[i+1];d[k]=a[0]+(b[0]-a[0])*f;d[k+1]=a[1]+(b[1]-a[1])*f;d[k+2]=a[2]+(b[2]-a[2])*f;d[k+3]=255})}
function tex(g,x,y,w,h,amt,sc,blot){pix(g,x,y,w,h,(d,k,px,py)=>{if(!d[k+3])return;const f=((vn(px,py,sc||6)-.5)*(blot||1.2)+(hash(px,py)-.5)*.7)*amt;d[k]+=f;d[k+1]+=f;d[k+2]+=f})}
function grime(g,x,y,w,h,amt,up){pix(g,x,y,w,h,(d,k,px,py)=>{let t=(py-y)/h;if(up)t=1-t;const n=vn(px*1.5,py*.4,6);const f=1-amt*Math.max(0,Math.min(1,t*t*1.3+(n-.5)*.7));d[k]*=f;d[k+1]*=f;d[k+2]*=f})}
function streaks(g,x,y,w,h,n,amt){for(let i=0;i<n;i++){const sx=x+R()*w|0,len=h*rr(.3,1);pix(g,sx,y,rr(1,3),len,(d,k,px,py)=>{const f=1-amt*(1-(py-y)/len);d[k]*=f;d[k+1]*=f;d[k+2]*=f})}}
function line(g,x0,y0,x1,y1,col){x0=Math.round(x0);y0=Math.round(y0);x1=Math.round(x1);y1=Math.round(y1);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy,n=0;g.fillStyle=col;while(n++<900){g.fillRect(x0,y0,1,1);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}}G.line=line;
function thick(g,x0,y0,x1,y1,w,col){const n=Math.max(1,Math.ceil(Math.max(Math.abs(x1-x0),Math.abs(y1-y0))));for(let i=0;i<=n;i++){const t=i/n;rect(g,x0+(x1-x0)*t-w/2+.5,y0+(y1-y0)*t,w,1,col)}}
function ell(g,cx,cy,rx,ry,col){for(let y=-ry;y<=ry;y++){const xx=Math.round(rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry+.01))));rect(g,cx-xx,cy+y,xx*2+1,1,col)}}
function disc(g,cx,cy,r,col){ell(g,cx,cy,r,r,col)}
function blob(g,cx,cy,r,col,hi,shd){const rx=Math.ceil(r*1.25);for(let y=-r;y<=r;y++)for(let x=-rx;x<=rx;x++){const d=x*x/1.55+y*y;if(d<r*r)rect(g,cx+x,cy+y,1,1,(x+y<-r*.6&&d<r*r*.7)?hi:(y>r*.45||x>r*.7)?shd:col)}}
/* fonte 3x5 */
const F3={A:'010101111101101',B:'110101110101110',C:'011100100100011',D:'110101101101110',E:'111100110100111',F:'111100110100100',G:'011100101101011',H:'101101111101101',I:'111010010010111',J:'001001001101010',K:'101101110101101',L:'100100100100111',M:'101111111101101',N:'110101101101101',O:'010101101101010',P:'110101110100100',Q:'010101101110011',R:'110101110101101',S:'011100010001110',T:'111010010010010',U:'101101101101111',V:'101101101101010',W:'101101111111101',X:'101101010101101',Y:'101101010010010',Z:'111001010100111','0':'111101101101111','1':'010110010010111','2':'110001010100111','3':'110001010001110','4':'101101111001001','5':'111100110001110','6':'011100111101111','7':'111001010010010','8':'111101111101111','9':'111101111001110','.':'000000000000010','#':'101111101111101','?':'110001010000010'};
function text(g,x,y,s,col,sc){sc=sc||1;let cx=x;for(const ch of s.toUpperCase()){const m=F3[ch];if(m){for(let i=0;i<15;i++)if(m[i]==='1')rect(g,cx+(i%3)*sc,y+((i/3)|0)*sc,sc,sc,col)}cx+=4*sc}}G.text=text;

/* ---------- kit ---------- */
function bricks(g,x,y,w,h,base,o){o=o||{};const mort=o.mort||sh(base,-.5);rect(g,x,y,w,h,mort);for(let yy=y;yy<y+h;yy+=4){const row=(yy-y)/4|0,off=(row%2)*4;for(let xx=x-off;xx<x+w;xx+=8){const x0=Math.max(xx,x),x1=Math.min(xx+7,x+w);if(x1<=x0)continue;let c=vary(base,.22);if(R()<.07)c=sh(base,-.25);if(R()<.04)c=mix(base,'#a08070',.4);rect(g,x0,yy,x1-x0,3,c);rect(g,x0,yy,x1-x0,1,sh(c,.12));rect(g,x0,yy+2,x1-x0,1,sh(c,-.12));if(R()<.08)rect(g,x0+rr(0,5),yy+rr(0,2),1,1,mort)}}tex(g,x,y,w,h,14,4,1)}
function plaster(g,x,y,w,h,base,o){o=o||{};rect(g,x,y,w,h,base);tex(g,x,y,w,h,o.tex||30,7,1.8);for(let i=0;i<(o.cracks||4);i++){let cx=x+R()*w,cy=y+R()*h;for(let k=0;k<rr(10,30);k++){cx+=rr(-1,1.2);cy+=rr(0,1.2);if(cx>x&&cx<x+w&&cy<y+h)rect(g,cx,cy,1,1,sh(base,-.45))}}
 for(let i=0;i<(o.patches||0);i++){const px=x+rr(4,w-26),py=y+rr(4,h-16),pw=rr(10,24),ph=rr(6,12);bricks(g,px,py,pw,ph,o.brick||'#8a5240');for(let k=0;k<pw;k++)if(R()<.6)rect(g,px+k,py-1,1,1,sh(base,.1)),rect(g,px+k,py+ph,1,1,sh(base,-.3))}}
function windowW(g,x,y,w,h,o){o=o||{};const fr=o.frame||'#5a4a3a';rect(g,x-2,y-2,w+4,h+4,sh(fr,-.5));rect(g,x-1,y-1,w+2,h+2,fr);
 if(o.lit){dgrad(g,x,y,w,h,[o.lit,sh(o.lit,-.35)],3);if(o.silh)rect(g,x+w*.3,y+h*.45,w*.25,h*.55,sh(o.lit,-.6)),disc(g,x+w*.42,y+h*.38,Math.max(1,w*.1|0),sh(o.lit,-.6))}
 else{dgrad(g,x,y,w,h,[o.glass||'#2a3a4c','#0e141c'],3);for(let i=0;i<Math.min(w,h);i+=1)if(i%5<2)rect(g,x+w-1-i*.8,y+i,1,1,'#4a5a6c')}
 if(o.curtain){const cc=o.curtain;for(let i=0;i<w*.28;i++){rect(g,x+i,y,1,h,i%3?cc:sh(cc,-.3));rect(g,x+w-1-i,y,1,h,i%3?cc:sh(cc,-.3))}}
 if(o.cross!==false){rect(g,x+w/2-.5,y,1,h,fr);rect(g,x,y+h/2-.5,w,1,fr)}
 if(o.bars)for(let i=x+2;i<x+w;i+=4)rect(g,i,y,1,h,'#2a2a2e');
 rect(g,x-3,y+h+1,w+6,2,sh(o.sill||'#9a9488',0));rect(g,x-3,y+h+1,w+6,1,sh(o.sill||'#9a9488',.2));rect(g,x-2,y+h+3,w+4,1,'rgba(0,0,0,.3)');
 if(o.lintel)rect(g,x-3,y-5,w+6,3,o.lintel),rect(g,x-3,y-5,w+6,1,sh(o.lintel,.2))}
function door(g,x,y,w,h,col,o){o=o||{};rect(g,x-3,y-3,w+6,h+3,sh(col,-.6));rect(g,x-2,y-2,w+4,h+2,sh(col,-.3));rect(g,x,y,w,h,col);const half=o.double?w/2:w;
 for(let k=0;k<(o.double?2:1);k++){const dx=x+k*half;const pw=half-6;const ph=[h*.28,h*.3,h*.25];let py=y+4;for(let i=0;i<3;i++){const p=ph[i];if(i===0&&o.glass){rect(g,dx+3,py,pw,p,sh(col,-.5));dgrad(g,dx+4,py+1,pw-2,p-2,[o.glass,sh(o.glass,-.5)],2)}else{rect(g,dx+3,py,pw,p,sh(col,-.18));rect(g,dx+3,py,pw,1,sh(col,-.4));rect(g,dx+3,py,1,p,sh(col,-.35));rect(g,dx+3,py+p-1,pw,1,sh(col,.15));rect(g,dx+2+pw,py,1,p,sh(col,.12))}py+=p+3}
  if(o.double&&k===0)rect(g,dx+half-1,y,1,h,sh(col,-.5))}
 tex(g,x,y,w,h,14,3,1);rect(g,x+(o.double?w/2-4:w-5),y+h*.52,2,2,'#c8a860');rect(g,x+(o.double?w/2+2:w-5),y+h*.52,2,2,'#c8a860');if(o.arch)for(let i=0;i<w/2;i++){const yy=Math.round(Math.sqrt(Math.max(0,(w/2)**2-(i-w/2)**2))*.5);rect(g,x+i,y-yy-1,1,yy+1,sh(col,-.6));rect(g,x+w-1-i,y-yy-1,1,yy+1,sh(col,-.6))}}
function steps(g,x,y,n,w,col){for(let i=0;i<n;i++){const sx=x-i*4,sw=w+i*8,sy=y+i*5;rect(g,sx,sy,sw,5,sh(col,-.15));rect(g,sx,sy,sw,1,sh(col,.18));rect(g,sx,sy+4,sw,1,sh(col,-.4));tex(g,sx,sy,sw,5,20,3,1)}}
function lamp(g,x){rect(g,x-3,140,7,2,'#2a2e30');rect(g,x-2,132,5,8,'#363b3e');rect(g,x-1,30,3,104,'#3a4044');rect(g,x-1,30,1,104,'#5a6266');rect(g,x+1,30,1,104,'#22262a');
 for(let i=0;i<14;i++){const a=Math.PI*(1-i/13);rect(g,x+6+Math.cos(a)*6,28-Math.sin(a)*5,2,2,'#3a4044')}rect(g,x+9,26,14,3,'#2a2e30');rect(g,x+10,25,12,1,'#4a5054');rect(g,x+11,29,10,1,'#1a1c1e')}
function chain(g,x0,x1,y0,y1,base){for(let x=x0;x<x1;x++)for(let y=y0;y<y1;y++){const a=(x+y)%6,b=(x-y+600)%6;if(a===0||b===0)rect(g,x,y,1,1,a===0&&b===0?sh(base,.2):(a===0?base:sh(base,-.25)))}
 for(let x=x0;x<=x1;x+=100){rect(g,x,y0-4,4,y1-y0+4,'#4a5254');rect(g,x,y0-4,1,y1-y0+4,'#7a8486');rect(g,x+3,y0-4,1,y1-y0+4,'#2a3032')}rect(g,x0,y0-2,x1-x0+4,2,'#5a6466');rect(g,x0,y0-2,x1-x0+4,1,'#8a9496');
 for(let x=x0;x<x1;x+=5){rect(g,x,y0-7,1,1,'#6a7476');rect(g,x+2,y0-6,1,1,'#6a7476')}line(g,x0,y0-6,x1,y0-6,'#3a4244')}
function bag(g,cx,cy,r,col){const hi=sh(col,.45),sd=sh(col,-.45);ell(g,cx,cy+1,r+1,Math.round(r*.85)+1,'#0e1014');ell(g,cx,cy,r,Math.round(r*.85),col);for(let i=0;i<r;i++)if(R()<.5)line(g,cx-r*.6+i*.4,cy-r*.5+R()*r*.8,cx-r*.3+i*.5,cy+R()*r*.5,sh(col,-.25));
 ell(g,cx+r*.3,cy+r*.4,r*.6,r*.35|0,sd);for(let k=0;k<4;k++)rect(g,cx-r*.55+k*2+rr(-1,1),cy-r*.45+rr(0,r*.6),rr(1,3),1,hi);rect(g,cx-2,cy-r*.85-3,4,4,col);rect(g,cx-3,cy-r*.85-4,2,2,sd);rect(g,cx+1,cy-r*.85-4,2,2,sd)}
function eOut(g,cx,cy,rx,ry,col,th){for(let a=0;a<Math.PI*2;a+=.05){const x=cx+Math.cos(a)*rx,y=cy+Math.sin(a)*ry;rect(g,x,y,th||1,th||1,col)}}
function bubbleTag(g,x,y,n,fill,out){for(let i=0;i<n;i++){const cx=x+i*rr(10,13),cy=y+rr(-3,3),rx=rr(5,7)|0,ry=rr(6,9)|0;eOut(g,cx,cy,rx+1,ry+1,out,1);eOut(g,cx,cy,rx,ry,fill,2);if(R()<.6)line(g,cx-rx+2,cy,cx+rx-2,cy+rr(-3,3),fill);if(R()<.5){line(g,cx,cy-ry,cx+rr(-3,3),cy+ry,fill)}}}
function scribTag(g,x,y,w,col){let px=x,py=y;for(let i=0;i<w*2;i++){const nx=px+rr(.3,1.4),ny=y+Math.sin(i*.9+R())*rr(2,6);line(g,px,py,nx,ny,col);if(R()<.15){line(g,nx,ny,nx+rr(-2,2),ny-rr(3,7),col)}px=nx;py=ny}}
function drips(g,x,y,w,col,n){for(let i=0;i<n;i++){const dx=x+R()*w,l=rr(3,14);rect(g,dx,y,1,l,col);rect(g,dx,y+l,1,1,sh(col,-.3))}}
function wire(g,x0,y0,x1,y1,sag,col){let px=x0,py=y0;for(let i=1;i<=40;i++){const t=i/40,x=x0+(x1-x0)*t,y=y0+(y1-y0)*t+Math.sin(t*Math.PI)*sag;line(g,px,py,x,y,col);px=x;py=y}}
function pipe(g,x,y0,y1,col){rect(g,x,y0,3,y1-y0,col);rect(g,x,y0,1,y1-y0,sh(col,.25));rect(g,x+2,y0,1,y1-y0,sh(col,-.35));for(let y=y0+8;y<y1;y+=22)rect(g,x-1,y,5,2,sh(col,-.2))}
function poster(g,x,y,w,h,col){rect(g,x,y,w,h,col);tex(g,x,y,w,h,25,2,1);for(let yy=y+2;yy<y+h-2;yy+=3)rect(g,x+2,yy,w*rr(.4,.85),1,sh(col,-.45));rect(g,x+w-3,y,3,3,'rgba(0,0,0,.35)');rect(g,x+w-3,y,1,1,sh(col,.3))}
function tree(g,x,base,s,dk){rect(g,x-2,base-s,5,s,'#3a2c20');rect(g,x-2,base-s,1,s,'#4e3c2c');rect(g,x+2,base-s,1,s,'#22180f');for(let i=0;i<14;i++){const bx=x+rr(-.55,.55)*s,byy=base-s-rr(-.15,.55)*s,r=Math.round(rr(.18,.3)*s);blob(g,bx,byy,r,dk?'#2a3a2c':'#3a5038',dk?'#3a4a38':'#567050',dk?'#1a2620':'#24341f')}}
function cobble(g,x,y,w,h,base){rect(g,x,y,w,h,sh(base,-.55));for(let yy=y;yy<y+h;yy+=4)for(let xx=x+((yy/4)%2)*3;xx<x+w;xx+=rr(5,8)){const c=vary(base,.25),sw=rr(3,6)|0;rect(g,xx,yy,sw,3,c);rect(g,xx,yy,sw,1,sh(c,.18));rect(g,xx+sw-1,yy+1,1,2,sh(c,-.2))}}
function planks(g,x,y,w,h,col,vert,size){size=size||6;rect(g,x,y,w,h,col);if(vert){for(let xx=x;xx<x+w;xx+=size){const c=vary(col,.18);rect(g,xx,y,size-1,h,c);rect(g,xx+size-1,y,1,h,sh(col,-.5));rect(g,xx,y,1,h,sh(c,.1))}}else{for(let yy=y;yy<y+h;yy+=size){const c=vary(col,.15);rect(g,x,yy,w,size-1,c);rect(g,x,yy+size-1,w,1,sh(col,-.45));for(let xx=x+rr(0,40);xx<x+w;xx+=rr(30,60))rect(g,xx,yy,1,size-1,sh(col,-.45))}}tex(g,x,y,w,h,18,vert?3:2,1);for(let i=0;i<w*h/120;i++)rect(g,x+R()*w,y+R()*h,rr(2,6),1,sh(col,-.2))}
function damask(g,x,y,w,h,base,mot){rect(g,x,y,w,h,base);for(let yy=y+3;yy<y+h;yy+=12)for(let xx=x+((yy-y)/12%2)*8;xx<x+w;xx+=16){rect(g,xx,yy,1,5,mot);rect(g,xx-2,yy+1,5,1,mot);rect(g,xx-1,yy+3,3,1,mot);rect(g,xx-3,yy+2,1,1,mot);rect(g,xx+3,yy+2,1,1,mot)}tex(g,x,y,w,h,12,8,1)}
function tiles(g,x,y,w,h,col,s){s=s||8;rect(g,x,y,w,h,sh(col,-.35));for(let yy=y;yy<y+h;yy+=s)for(let xx=x;xx<x+w;xx+=s){const c=vary(col,.08);rect(g,xx,yy,s-1,s-1,c);rect(g,xx,yy,s-1,1,sh(c,.15))}}
function checker(g,x,y,w,h,a,b,s){for(let yy=y;yy<y+h;yy+=s)for(let xx=x;xx<x+w;xx+=s)rect(g,xx,yy,s,s,((xx/s+yy/s)|0)%2?a:b);tex(g,x,y,w,h,14,4,1)}
function rug(g,x,y,w,h,col,brd){rect(g,x,y,w,h,brd);rect(g,x+3,y+2,w-6,h-4,col);for(let i=x+5;i<x+w-5;i+=4){rect(g,i,y+1,2,1,sh(brd,.3));rect(g,i,y+h-2,2,1,sh(brd,.3))}ell(g,x+w/2,y+h/2,w*.15|0,h*.25|0,brd);ell(g,x+w/2,y+h/2,w*.08|0,h*.13|0,sh(col,.25));tex(g,x,y,w,h,16,2,1)}
function crate(g,x,y,w,h,col,label){rect(g,x,y,w,h,col);for(let yy=y;yy<y+h;yy+=4)rect(g,x,yy+3,w,1,sh(col,-.4));rect(g,x,y,2,h,sh(col,-.25));rect(g,x+w-2,y,2,h,sh(col,-.25));rect(g,x,y,w,1,sh(col,.2));tex(g,x,y,w,h,16,2,1);if(label)text(g,x+3,y+2,label,sh(col,-.55))}
function sky(g,w,h,cols,nstar,moon){dgrad(g,0,0,w,h,cols,5);for(let i=0;i<nstar;i++){const x=R()*w,y=R()*h*.7;rect(g,x,y,1,1,R()<.25?'#e8e4d0':'#8a92a8');if(R()<.06){rect(g,x-1,y,3,1,'#b8bcc8');rect(g,x,y-1,1,3,'#b8bcc8')}}
 if(moon){const[mx,my,mr]=moon;disc(g,mx,my,mr,'#e8e2c4');disc(g,mx-2,my-2,mr-3,'#f4f0da');for(let i=0;i<6;i++)disc(g,mx+rr(-mr*.6,mr*.6),my+rr(-mr*.6,mr*.6),rr(1,2.5)|0,'#cfc8a8')}}
function clouds(g,w,y0,y1,col){for(let i=0;i<w/30;i++){const cx=R()*w,cy=rr(y0,y1),l=rr(20,60);for(let k=0;k<3;k++)rect(g,cx+rr(-8,8),cy+k*2,l*rr(.5,1),2,k?sh(col,-.1*k):col)}}
function skyline(g,x0,x1,base,lit,meta,maxTop){let x=x0;while(x<x1){const bw=rr(30,52)|0,top=rr(6,maxTop||58)|0,col=vary(base,.2);rect(g,x,top,bw,150-top,col);rect(g,x,top,bw,2,sh(col,.15));rect(g,x,top+2,bw,1,sh(col,-.4));tex(g,x,top,bw,150-top,10,5,1);
  if(R()<.3){rect(g,x+bw*.3,top-10,10,8,sh(col,-.2));rect(g,x+bw*.3+1,top-12,8,2,sh(col,-.3));rect(g,x+bw*.3+2,top-2,1,2,sh(col,-.3));rect(g,x+bw*.3+7,top-2,1,2,sh(col,-.3))}
  if(R()<.35)rect(g,x+bw*.7,top-14,1,14,sh(col,-.3));
  for(let wy=top+6;wy<138;wy+=9)for(let wx=x+4;wx<x+bw-5;wx+=8){const L=R()<lit;rect(g,wx,wy,4,5,L?(R()<.75?'#e8b060':'#d06040'):'#1c222c');rect(g,wx,wy+5,4,1,sh(col,.12));if(L&&meta)meta.push([wx+2,wy+2,R()<.75?'255,190,110':'255,110,80'])}
  if(R()<.35){const fx=x+4;for(let y=top+14;y<130;y+=18){rect(g,fx,y,bw*.5,1,'#22262c');for(let i=0;i<bw*.5;i+=2)rect(g,fx+i,y-4,1,4,'#22262c');line(g,fx+2,y,fx+bw*.4,y+18,'#22262c')}}
  x+=bw+(R()<.3?rr(2,6)|0:0)}}
function sidewalk(g,x,y,w,base,curb){rect(g,x,y,w,12,base);for(let xx=x;xx<x+w;xx+=26){rect(g,xx,y,1,12,sh(base,-.35));if(R()<.4){let cx=xx+rr(4,20),cy=y+2;for(let k=0;k<8;k++){cx+=rr(-1,1);cy+=1;rect(g,cx,cy,1,1,sh(base,-.4))}}}rect(g,x,y,w,1,sh(base,.12));tex(g,x,y,w,12,22,4,1.4);
 rect(g,x,y+12,w,3,curb||sh(base,.1));rect(g,x,y+12,w,1,sh(curb||base,.25));rect(g,x,y+15,w,1,sh(base,-.6))}
function asphalt(g,x,y,w,h,base){dgrad(g,x,y,w,h,[sh(base,-.1),base],2);tex(g,x,y,w,h,26,3,1.3);for(let i=0;i<w/18;i++)rect(g,x+R()*w,y+R()*h,rr(1,3),1,sh(base,.25))}
function puddle(g,cx,cy,rx,col){ell(g,cx,cy,rx,Math.max(1,rx*.18|0),col);rect(g,cx-rx*.5,cy-1,rx*.6,1,sh(col,.18))}
function litter(g,x,y,w,h,n){for(let i=0;i<n;i++){const px=x+R()*w,py=y+R()*h;const t=R();if(t<.35)rect(g,px,py,rr(2,4),rr(1,2),pick(['#c8c0a8','#a8a090','#d8d0b8']));else if(t<.6)rect(g,px,py,2,1,pick(['#8a5a2a','#6a4a22','#a0702a']));else if(t<.75)rect(g,px,py,3,1,'#5a6a7a');else rect(g,px,py,rr(3,8),1,'rgba(120,40,30,.6)')}}

/* ---------- cenários ---------- */
const META={};G.META=META;
const B={
street(){const w=520,c=mk(w,H),g=c.getContext('2d');seed=11;NS=11;const M=META.street={lit:[]};
 sky(g,w,150,['#2a3848','#3a4a5a','#4a5866'],20);skyline(g,250,w,'#5a5e6a',.16,M.lit);
 wire(g,250,24,520,30,8,'#14171c');wire(g,250,32,520,44,10,'#14171c');wire(g,0,10,252,6,6,'#14171c');
 bricks(g,0,0,252,60,'#94584a');
 for(const wx of[16,76,140,198]){windowW(g,wx,6,30,26,{frame:'#3a3430',lintel:'#a8a294',sill:'#a8a294',lit:wx===140?'#d8a058':null,silh:wx===140,curtain:wx===140?'#7a3a30':null});if(wx===140)M.lit.push([155,19,'255,190,110'])}
 rect(g,0,32,132,2,'#24272c');for(let i=0;i<132;i+=3)rect(g,i,24,1,8,'#24272c');rect(g,0,24,132,1,'#3a3e44');for(let i=0;i<16;i++)rect(g,120+i,34+i*1.4,2,1,'#24272c');
 rect(g,176,36,16,11,'#8a8e8a');for(let i=178;i<190;i+=2)rect(g,i,38,1,7,'#5a5e5a');rect(g,176,36,16,1,'#aaaeaa');drips(g,180,47,6,'#3a4a4a',2);
 rect(g,0,56,252,6,'#a8a294');rect(g,0,56,252,1,'#c8c2b4');rect(g,0,61,252,1,'#5a564c');
 plaster(g,0,62,252,80,'#8c9c84',{patches:5,brick:'#94584a',cracks:8});
 grime(g,0,62,252,80,.35);streaks(g,0,62,252,60,26,.25);
 rect(g,84,60,58,8,'#a8a294');rect(g,84,60,58,1,'#c8c2b4');rect(g,84,67,58,1,'#4a463c');for(let i=0;i<6;i++)rect(g,88+i*9,64,6,2,'#968f80');
 door(g,92,70,40,58,'#6a4a36',{double:true,glass:'#3a4a58'});rect(g,100,74,6,8,'#d8d0c0');rect(g,118,96,4,4,'#c8c0a8');
 steps(g,86,128,3,52,'#8a8e86');
 for(let i=0;i<3;i++){rect(g,146+i*4,120+i*5,1,8,'#2a2c30')}line(g,146,118,158,133,'#2a2c30');line(g,146,119,158,134,'#4a4e54');
 bubbleTag(g,158,82,6,'#b8402e','#4a2a22');scribTag(g,150,100,40,'#16181c');scribTag(g,190,108,20,'#16181c');scribTag(g,20,90,25,'#2a2c3a');scribTag(g,30,104,18,'#7a2a3a');bubbleTag(g,12,120,3,'#2a2c3a','#4a4e5a');
 drips(g,156,96,70,'#a03a2c',14);drips(g,150,118,60,'#16181c',6);
 poster(g,62,86,12,16,'#c8b890');poster(g,46,96,10,13,'#a8483a');poster(g,222,118,10,12,'#d8d0b8');
 rect(g,150,124,14,16,'#7a8078');rect(g,150,124,14,1,'#9aa098');scribTag(g,151,130,6,'#16181c');
 pipe(g,244,0,140,'#5a6058');
 lamp(g,255);
 dgrad(g,272,76,198,66,['#1e2a24','#2a3a2e'],3);for(let i=0;i<34;i++)blob(g,rr(276,466),rr(86,136),rr(4,9)|0,'#30482e','#44603e','#1c2c1c');rect(g,370,100,30,40,'#3a3e40');rect(g,372,102,26,1,'#5a5e60');
 chain(g,270,470,78,142,'#8a9496');rect(g,388,100,12,14,'#4a8a7a');rect(g,388,100,12,1,'#7abaa8');text(g,389,104,'NO','#1a3a32');
 for(let i=0;i<5;i++)rect(g,rr(276,460),rr(132,140),rr(2,6),2,pick(['#c8c0a8','#8a5a3a','#5a6a7a']));
 sidewalk(g,0,142,w,'#8a9088','#a0a69c');
 asphalt(g,0,158,w,22,'#3e444a');for(const[px,py,rx]of[[262,166,22],[120,172,16],[400,170,26],[40,164,12]])puddle(g,px,py,rx,'#2a3440');
 litter(g,0,142,w,36,70);for(let i=0;i<14;i++)ell(g,rr(0,w),rr(144,176),rr(2,6)|0,1,'rgba(130,50,40,.45)');
 bag(g,452,132,10,'#3a4a5e');bag(g,482,130,12,'#34465a');bag(g,500,136,7,'#2c3a4c');rect(g,440,140,4,2,'#c8c0a8');rect(g,466,141,3,1,'#c86a3a');
 return c},
room(){const w=320,c=mk(w,H),g=c.getContext('2d');seed=12;NS=12;
 damask(g,0,0,w,102,'#4c6c5c','#5e8070');grime(g,0,0,w,102,.25,true);rect(g,0,0,w,6,'#6a4a30');rect(g,0,6,w,1,'#8a6a48');rect(g,0,7,w,1,'#3a2618');rect(g,0,30,w,2,'#5a4028');
 planks(g,0,102,w,46,'#5e3c28',true,10);for(let x=4;x<w;x+=30){rect(g,x,108,24,32,'#4e3020');rect(g,x,108,24,1,'#3a2216');rect(g,x,139,24,1,'#7a5236');rect(g,x+23,108,1,32,'#7a5236')}rect(g,0,101,w,3,'#7a5236');rect(g,0,101,w,1,'#9a7250');
 planks(g,0,150,w,30,'#6e4a32',false,5);rect(g,0,146,w,4,'#4a2c1c');rect(g,0,146,w,1,'#7a5236');
 rect(g,22,30,56,74,'#3a2618');windowW(g,28,36,44,62,{frame:'#6a4a30',glass:'#2a3a5a',sill:'#8a6a48'});disc(g,58,50,4,'#e8e2c4');
 for(let i=0;i<12;i++){const cc=i%3?'#8a2e2e':'#6a2020';rect(g,18+i,26,1,80,cc);rect(g,82-i,26,1,80,cc)}rect(g,14,24,72,3,'#a08040');
 rect(g,104,38,54,46,'#7a5a24');rect(g,105,39,52,44,'#c8a050');rect(g,107,41,48,40,'#8a6a2a');rect(g,109,43,44,36,'#2e2a24');dgrad(g,109,43,44,36,['#3a3428','#221e18'],2);
 [[118,'#d8b89a',0],[130,'#d8b89a',0],[140,'#e0c8b0',1],[148,'#e0c8b0',1]].forEach(([fx,sk,kid])=>{const fy=kid?60:52;rect(g,fx-3,fy,6,7,sk);rect(g,fx-4,fy+7,8,kid?12:20,kid?'#5a4a6a':'#2a2a34');rect(g,fx-3,fy-1,6,2,'#3a2a1a');if(!kid){rect(g,fx-2,fy+2,4,2,'#d8d0c0');rect(g,fx-2,fy+3,4,1,'#9a9080')}else{rect(g,fx-2,fy+3,1,1,'#1a1010');rect(g,fx+1,fy+3,1,1,'#1a1010')}});
 rect(g,148,118,82,28,'#7a3a34');rect(g,150,106,78,16,'#8a443c');for(let i=154;i<226;i+=6)for(let j=109;j<120;j+=5)rect(g,i+(j%2)*3,j,1,1,'#5a2a24');rect(g,144,112,8,34,'#6a302a');rect(g,226,112,8,34,'#6a302a');ell(g,148,112,4,3,'#7a3a34');ell(g,230,112,4,3,'#7a3a34');rect(g,152,124,36,6,'#94504a');rect(g,190,124,36,6,'#94504a');rect(g,150,146,3,4,'#2a1810');rect(g,226,146,3,4,'#2a1810');tex(g,144,104,92,44,14,2,1);
 rect(g,234,96,34,24,'#6e3a56');rect(g,232,108,6,38,'#5a2e46');rect(g,264,108,6,38,'#5a2e46');rect(g,236,118,30,28,'#7a4462');rect(g,238,120,26,6,'#8a5070');tex(g,232,96,38,50,14,2,1);
 rect(g,272,106,28,42,'#5a3a26');rect(g,272,106,28,2,'#7a5236');for(let y=110;y<146;y+=12){rect(g,274,y,24,10,'#4e3220');rect(g,274,y,24,1,'#3a2416');rect(g,284,y+4,4,2,'#c8a050')}
 rect(g,282,100,8,6,'#8a6a40');rect(g,284,94,4,6,'#a08050');
 rect(g,56,144,14,4,'#9a9aa8');rect(g,56,144,14,1,'#c8c8d4');rect(g,58,143,10,2,'#7a5a3a');
 rect(g,300,72,20,76,'#3a2618');door(g,302,76,18,72,'#6a4a32',{});
 rug(g,110,156,170,18,'#7a2a2a','#4a1a1a');
 rect(g,189,0,1,12,'#2a1a10');rect(g,180,12,20,3,'#a08040');for(const dx of[-9,-3,3,9])rect(g,190+dx,9,1,4,'#e8e0c8');
 return c},
office(){const w=320,c=mk(w,H),g=c.getContext('2d');seed=21;NS=21;
 plaster(g,0,0,w,104,'#8a8068',{cracks:3,tex:20});grime(g,0,0,w,104,.3,true);
 planks(g,0,104,w,44,'#5e4230',true,12);rect(g,0,103,w,2,'#7a5a40');rect(g,0,103,w,1,'#9a7a58');
 checker(g,0,150,w,30,'#5a5650','#706a60',10);rect(g,0,146,w,4,'#3a2a1e');
 rect(g,12,24,72,70,'#4a3e32');dgrad(g,16,28,64,62,['#1c2840','#2c3a54'],3);skyline(g,16,80,'#3a4258',.25,null,40);rect(g,0,0,16,180,'rgba(0,0,0,0)');
 g.save();g.beginPath();g.rect(16,28,64,62);g.clip();skyline(g,16,82,'#2e3448',.3,null,50);g.restore();
 rect(g,12,24,4,70,'#4a3e32');rect(g,80,24,4,70,'#4a3e32');rect(g,12,24,72,4,'#4a3e32');rect(g,12,90,72,4,'#4a3e32');
 for(let y=29;y<90;y+=4){rect(g,16,y,64,2,'#b8b0a0');rect(g,16,y,64,1,'#d8d0c0')}rect(g,47,28,2,62,'#4a3e32');rect(g,8,94,80,3,'#7a6a58');rect(g,8,94,80,1,'#9a8a78');
 rect(g,20,112,58,26,'#8a8a86');for(let x=22;x<76;x+=4){rect(g,x,112,3,26,'#a0a09a');rect(g,x+2,112,1,26,'#6a6a66')}
 rect(g,95,52,3,94,'#4a3222');rect(g,95,52,1,94,'#6a4a32');rect(g,88,144,17,2,'#3a2418');rect(g,89,56,15,1,'#4a3222');rect(g,89,56,1,4,'#4a3222');rect(g,103,56,1,4,'#4a3222');
 rect(g,112,110,106,5,'#7a5236');rect(g,112,110,106,1,'#9a7250');rect(g,116,115,98,31,'#5e3c28');for(const dx of[120,168])rect(g,dx,119,42,10,'#4e3020'),rect(g,dx+18,123,6,2,'#c8a050');rect(g,116,131,98,1,'#3a2416');tex(g,112,110,106,36,14,2,1);
 rect(g,160,90,24,22,'#3a2a20');rect(g,160,90,24,2,'#5a4232');
 rect(g,124,104,16,6,'#e0d8c8');rect(g,126,103,14,1,'#c8c0b0');rect(g,148,106,16,4,'#d8d0c0');rect(g,166,105,10,5,'#2a2a2e');rect(g,168,103,6,2,'#4a4a4e');
 rect(g,133,104,14,6,'#1a1a1e');rect(g,131,102,18,3,'#1a1a1e');rect(g,132,102,4,2,'#2a2a2e');rect(g,144,102,4,2,'#2a2a2e');disc(g,140,107,2,'#3a3a40');
 rect(g,190,107,14,3,'#8a7040');rect(g,196,96,2,11,'#a08850');rect(g,186,90,22,7,'#2a7a4a');rect(g,186,90,22,1,'#4aa070');rect(g,188,97,18,1,'#e8e0a0');
 rect(g,222,98,28,48,'#6a747a');rect(g,222,98,28,1,'#8a949a');for(let y=101;y<144;y+=14){rect(g,224,y,24,12,'#5a646a');rect(g,224,y,24,1,'#7a848a');rect(g,232,y+5,8,2,'#a0a8ae');rect(g,232,y+2,8,2,'#d8d0b8')}
 rect(g,252,34,48,58,'#5a3a22');rect(g,254,36,44,54,'#9a7040');tex(g,254,36,44,54,30,2,1);
 const pins=[[258,40],[272,44],[286,39],[262,62],[276,66],[288,58]];pins.forEach(([x,y],i)=>{rect(g,x,y,10,13,i===5?'#2a2a2a':'#e0d8c8');rect(g,x+1,y+3,7,1,'#8a8478');rect(g,x+1,y+6,5,1,'#8a8478');if(i===2){rect(g,x+2,y+2,6,6,'#6a6058')}rect(g,x+4,y-1,2,2,'#c03a2e')});
 for(let i=0;i<pins.length-1;i++)line(g,pins[i][0]+5,pins[i][1],pins[i+1][0]+5,pins[i+1][1],'#b02a22');
 rect(g,300,66,20,82,'#3a2a1e');door(g,302,70,18,78,'#6a4a32',{glass:'#a8b8b0'});text(g,304,78,'DET','#2a3a34');
 disc(g,232,16,7,'#3a2a1e');disc(g,232,16,6,'#e0d8c8');rect(g,232,11,1,5,'#1a1a1a');rect(g,232,16,4,1,'#1a1a1a');
 return c},
praca(){const w=480,c=mk(w,H),g=c.getContext('2d');seed=31;NS=31;const M=META.praca={lit:[]};
 sky(g,w,150,['#1e2a3c','#2e3c50','#3e4a5c'],50,[420,24,9]);clouds(g,w,10,50,'#3a4658');
 skyline(g,0,w,'#383c48',.07,M.lit,70);
 rect(g,280,20,24,100,'#5a5a62');rect(g,280,20,24,2,'#7a7a82');for(let x=278;x<306;x++)rect(g,x,10+Math.abs(x-292)*.7,1,10-Math.abs(x-292)*.7,'#3a3a42');disc(g,292,36,5,'#c8c0a0');rect(g,292,32,1,4,'#2a2a2a');rect(g,292,36,3,1,'#2a2a2a');rect(g,291,4,2,6,'#8a8a90');rect(g,288,6,8,1,'#8a8a90');
 tree(g,30,148,46);tree(g,140,148,40,true);tree(g,394,148,48);
 bricks(g,412,24,68,124,'#86503e');for(const wx of[420,452])windowW(g,wx,36,18,22,{frame:'#3a3028',sill:'#a8a294',lit:wx===452?'#d8a058':null,curtain:wx===452?'#6a3a2a':null});M.lit.push([461,47,'255,190,110']);
 rect(g,434,72,34,10,'#2a2420');rect(g,435,73,32,8,'#c8b070');text(g,437,75,'PENSAO','#3a2a1a');door(g,440,92,22,56,'#5a3a28',{glass:'#3a4a50'});rect(g,450,84,3,4,'#3a3a3a');
 rect(g,64,98,60,50,'#2e5a40');rect(g,64,98,60,2,'#4a7a5a');tex(g,64,98,60,50,16,3,1);for(let x=60;x<128;x+=8){rect(g,x,90,4,8,'#a83a2c');rect(g,x+4,90,4,8,'#e0d4b0')}rect(g,60,88,68,2,'#5a2a20');
 for(let i=0;i<14;i++)rect(g,68+(i%7)*8,104+((i/7)|0)*14,6,11,pick(['#b04a36','#3a6a9a','#d8b860','#6a9a5a','#e0d8c8'])),rect(g,68+(i%7)*8,104+((i/7)|0)*14,6,1,'#f0e8d0');rect(g,70,132,48,14,'#24482f');
 rect(g,204,128,72,20,'#8a8a80');rect(g,200,125,80,4,'#a8a8a0');rect(g,200,125,80,1,'#c8c8c0');tex(g,200,125,80,23,20,3,1);rect(g,236,102,8,24,'#8a8a80');rect(g,236,102,1,24,'#a8a8a0');rect(g,228,99,24,4,'#a8a8a0');rect(g,226,98,28,1,'#c8c8c0');rect(g,206,128,68,3,'#3a5a6a');
 rect(g,318,128,40,3,'#6a4a30');rect(g,318,120,40,2,'#6a4a30');rect(g,318,124,40,1,'#5a3a24');rect(g,320,131,2,9,'#2a2a2a');rect(g,354,131,2,9,'#2a2a2a');rect(g,318,120,40,1,'#8a6a48');
 lamp(g,170);lamp(g,300);poster(g,165,92,11,14,'#d8d0b8');rect(g,168,96,5,3,'#f0ece4');
 cobble(g,0,148,w,32,'#7a7c7e');for(const[px,py,rx]of[[186,164,20],[316,170,18],[60,168,14],[420,166,16]])puddle(g,px,py,rx,'#2c3644');litter(g,0,148,w,30,40);
 return c},
pensao(){const w=320,c=mk(w,H),g=c.getContext('2d');seed=41;NS=41;
 plaster(g,0,0,w,148,'#b0a274',{tex:34,cracks:10});grime(g,0,0,w,148,.4,true);streaks(g,0,0,w,100,20,.3);
 for(let i=0;i<8;i++){const px=rr(0,w-20),py=rr(10,90);rect(g,px,py,rr(6,16),rr(10,30),'#c8bc90');rect(g,px,py,1,20,'#8a7e58')}
 for(let y=14;y<138;y+=6)for(let x=24+rr(0,8)|0;x<300;x+=rr(3,5)|0)if(R()<.7&&!(x>32&&x<84&&y>32&&y<96)&&!(x>186&&y>104))rect(g,x,y,rr(1,3),1,R()<.1?'#9a2a22':'#2a2618');
 rect(g,0,0,w,6,'#4a4230');
 rect(g,32,34,52,62,'#3a3428');dgrad(g,36,38,44,54,['#1a1018','#2a1418'],2);rect(g,40,44,30,10,'#3a1414');text(g,42,46,'HOTEL','#6a2020');for(let x=38;x<80;x+=5)rect(g,x,38,2,54,'#2a2a2e'),rect(g,x,38,1,54,'#4a4a4e');rect(g,30,96,56,3,'#7a6a50');
 planks(g,0,148,w,32,'#6a4a34',false,5);rect(g,0,146,w,3,'#4a3424');
 rect(g,190,104,4,44,'#2a2a2e');rect(g,266,112,4,36,'#2a2a2e');for(let x=194;x<266;x+=6)rect(g,x,106,1,12,'#2a2a2e');rect(g,190,104,80,2,'#3a3a3e');
 rect(g,194,124,72,12,'#8a8a78');rect(g,194,120,72,6,'#b0ac98');rect(g,196,116,16,6,'#d8d0c0');rect(g,214,124,52,12,'#5a6a5a');rect(g,214,124,52,1,'#7a8a7a');tex(g,194,116,72,20,16,2,1);rect(g,190,136,80,2,'#2a2a2e');
 rect(g,104,114,44,4,'#6a4a30');rect(g,104,114,44,1,'#8a6a48');rect(g,107,118,3,30,'#4a3220');rect(g,142,118,3,30,'#4a3220');
 rect(g,112,96,28,18,'#7a4a2a');rect(g,112,96,28,1,'#9a6a42');rect(g,115,99,12,12,'#3a2a1c');for(let y=100;y<110;y+=2)rect(g,116,y,10,1,'#5a4230');disc(g,133,104,3,'#c8a860');disc(g,133,104,1,'#3a2a1a');rect(g,130,110,6,2,'#d8d0b0');
 rect(g,150,46,24,20,'#d8d0b0');rect(g,152,48,20,16,'#7a7260');for(let i=0;i<5;i++)rect(g,153+i*4,54,3,8,'#3a3428'),rect(g,153+i*4,52,3,2,'#c8b090');rect(g,160,50,4,4,'#e0d8c0');rect(g,161,45,2,2,'#c03a2e');
 rect(g,159,0,1,26,'#1a1a1a');rect(g,157,26,5,3,'#5a5a5a');
 rect(g,266,140,7,8,'#4a2e1c');rect(g,274,140,7,8,'#4a2e1c');rect(g,266,146,15,2,'#8a3a26');rect(g,266,140,7,1,'#6a4a30');
 rect(g,0,74,22,74,'#3a2618');door(g,2,78,18,70,'#6a4a32',{});
 return c},
estrada(){const w=560,c=mk(w,H),g=c.getContext('2d');seed=51;NS=51;
 sky(g,w,150,['#101a32','#24304c','#3e3e56'],140,[120,32,14]);clouds(g,w,40,70,'#3a4258');
 for(let x=0;x<w;x++){const h1=76+Math.sin(x/41)*7+Math.sin(x/13)*2,h2=86+Math.sin(x/29+2)*5;rect(g,x,h1,1,100-h1,'#1e2636');rect(g,x,h2,1,100-h2,'#283040')}
 dgrad(g,0,90,w,52,['#2e3a24','#46542e'],3);
 for(let x=0;x<w;x+=2){const t=90+rr(-2,8);rect(g,x,t,1,142-t,pick(['#4a5a30','#56683a','#3e4c28']));if(R()<.5)rect(g,x,t-2,1,3,'#b8984e');if(R()<.4)rect(g,x+1,t+rr(4,30),2,1,'#6a7c40');if(R()<.3)rect(g,x-1,t+rr(6,30),2,1,'#3a4a24')}
 for(let x=0;x<w;x+=3){const t=106+rr(0,8);rect(g,x,t,2,142-t,pick(['#5a6c38','#667a40','#4a5a2e']));if(R()<.4)rect(g,x,t-3,2,3,'#c8a858');rect(g,x+2,t+rr(3,20),2,1,'#7a8c48')}
 for(let x=10;x<w;x+=40){rect(g,x,112,4,32,'#6a5038');rect(g,x,112,1,32,'#8a6a4a');rect(g,x+3,112,1,32,'#3a2a1c');rect(g,x-1,111,6,2,'#7a5e42')}for(const y of[120,130]){line(g,0,y,w,y,'#7a7a74');for(let x=4;x<w;x+=10)rect(g,x,y-1,1,3,'#9a9a90')}
 dgrad(g,0,142,w,38,['#a85a3a','#8a4a30'],3);tex(g,0,142,w,38,30,4,1.5);for(const y of[152,168]){for(let x=0;x<w;x++)rect(g,x,y+Math.sin(x/30)*1,1,2,'#6a3420')}
 for(let i=0;i<60;i++){const px=R()*w,py=rr(144,178);rect(g,px,py,rr(1,3),rr(1,2),pick(['#7a6a5a','#c8a080','#5a3a2a']))}
 for(let x=186;x<226;x++){rect(g,x,155+Math.sin(x/8),1,1,'#5a2a18');rect(g,x,159+Math.sin(x/8),1,1,'#5a2a18')}
 return c},
orfanato(){const w=480,c=mk(w,H),g=c.getContext('2d');seed=61;NS=61;const M=META.orfanato={lit:[]};
 sky(g,w,150,['#1a2234','#2a3448','#3a4458'],40);tree(g,90,110,40,true);tree(g,420,104,44,true);tree(g,20,120,34,true);
 plaster(g,116,30,288,118,'#b4a888',{tex:26,cracks:8});grime(g,116,30,288,118,.35);streaks(g,116,30,288,80,30,.25);
 for(let x=108;x<412;x++){const top=14+Math.abs(x-260)/12;rect(g,x,top,1,18-Math.abs(x-260)/12+6,'#8a3e2c');if(x%4===0)rect(g,x,top,1,18-Math.abs(x-260)/12+6,'#6a2e20')}for(let x=108;x<412;x++)rect(g,x,30,1,2,'#d8ccb0');rect(g,108,32,304,1,'#5a5040');
 rect(g,258,0,4,16,'#a8a8a0');rect(g,252,4,16,4,'#a8a8a0');rect(g,258,0,1,16,'#c8c8c0');
 rect(g,212,36,96,12,'#2a2a2a');rect(g,213,37,94,10,'#3a3a3a');text(g,215,39,'ORFANATO SANTA LUZIA','#d8d0b0');
 for(let row=0;row<2;row++)for(let x=140;x<392;x+=36){if(row&&x>230&&x<290)continue;const y=56+row*42,lit=R()<.35;windowW(g,x,y,16,24,{frame:'#6a5a48',lit:lit?'#d8a860':null,curtain:lit?'#8a6a5a':null,sill:'#c8bca0',cross:true});for(let i=0;i<8;i++){const yy=Math.round(Math.sqrt(64-(i-8)**2)*.6);rect(g,x+i,y-yy-1,1,yy+1,'#6a5a48');rect(g,x+15-i,y-yy-1,1,yy+1,'#6a5a48')}if(lit)M.lit.push([x+8,y+10,'255,200,120'])}
 door(g,248,98,26,50,'#6a4a32',{double:true,arch:true});rect(g,258,86,6,6,'#3a3a3a');steps(g,244,146,1,34,'#a8a090');
 plaster(g,0,108,116,40,'#a09a84',{tex:22,cracks:3});rect(g,0,106,116,3,'#c0b8a0');grime(g,0,108,116,40,.3);
 rect(g,6,84,58,64,'rgba(0,0,0,0)');for(let x=8;x<62;x+=4){rect(g,x,86,2,62,'#2a2e30');rect(g,x,86,1,62,'#4a5054');rect(g,x,83,2,3,'#3a3e40')}rect(g,6,90,58,2,'#2a2e30');rect(g,6,120,58,2,'#2a2e30');rect(g,4,80,4,68,'#3a3e40');rect(g,62,80,4,68,'#3a3e40');
 crate(g,288,134,30,14,'#8a6a40','BOA VISTA');crate(g,292,122,24,12,'#7a5a36');crate(g,296,110,18,12,'#8a6a40');
 for(const x of[420,474]){line(g,x,148,x+6,90,'#4a4a4e');line(g,x+1,148,x+7,90,'#6a6a6e')}line(g,478,90,478,148,'#4a4a4e');rect(g,424,88,56,3,'#5a5a5e');rect(g,424,88,56,1,'#7a7a7e');
 dgrad(g,0,148,w,32,['#6a5a44','#5a4a38'],2);tex(g,0,148,w,32,26,3,1.3);for(let i=0;i<60;i++)rect(g,R()*w,rr(148,178),1,rr(2,4),pick(['#4a5a30','#5a6a38']));litter(g,0,150,w,28,14);
 return c},
bosque(){const w=560,c=mk(w,H),g=c.getContext('2d');seed=71;NS=71;
 dgrad(g,0,0,w,150,['#0e1418','#1a2624','#24302c'],4);
 for(let i=0;i<60;i++){const x=R()*w,tw=rr(2,5);rect(g,x,0,tw,146,'#1e2a26')}
 for(let i=0;i<26;i++)blob(g,R()*w,rr(-6,40),rr(14,24)|0,'#1e2e24','#2a3e30','#141e18');
 for(let i=0;i<30;i++){const x=R()*w,tw=rr(4,9)|0;rect(g,x,0,tw,148,'#4a3a2c');rect(g,x,0,1,148,'#6a5640');rect(g,x+tw-1,0,1,148,'#2a1e14');tex(g,x,0,tw,148,20,3,1);if(R()<.4)rect(g,x-4,rr(40,100),5,1,'#4a3a2c')}
 dgrad(g,0,140,w,40,['#4a3c26','#3a2e1e'],3);tex(g,0,140,w,40,30,3,1.4);for(let x=0;x<w;x++){const y=150+Math.sin(x/38)*4;rect(g,x,y,1,9,'#7a6444')}for(let i=0;i<300;i++)rect(g,R()*w,rr(140,180),rr(1,3),1,pick(['#8a5a2a','#a0702a','#5a3a1a','#6a7a3a']));
 for(let i=0;i<10;i++){const x=R()*w;rect(g,x,144,1,3,'#d8d0c0');rect(g,x-1,143,3,1,'#c04030')}
 rect(g,498,62,26,86,'#5a544c');for(let y=62;y<148;y+=4){const ins=(148-y)/14;rect(g,498+ins,y,26-ins*2,1,sh('#7a7268',(y%8?-.05:.08)))}rect(g,506,112,10,36,'#1a1612');rect(g,508,80,6,8,'#2a2420');tex(g,498,62,26,86,20,3,1);rect(g,494,58,34,6,'#4a3a2c');
 rect(g,428,110,3,40,'#7a6040');rect(g,428,110,1,40,'#9a7a54');rect(g,418,112,16,5,'#8a6a46');rect(g,430,120,15,5,'#8a6a46');rect(g,414,128,16,5,'#8a6a46');rect(g,418,112,16,1,'#aa8a62');
 return c},
cozinha(){const w=320,c=mk(w,H),g=c.getContext('2d');seed=81;NS=81;
 plaster(g,0,0,w,40,'#9a9a88',{tex:18,cracks:2});tiles(g,0,40,w,108,'#c8ccbc',8);grime(g,0,40,w,108,.45);streaks(g,0,40,w,60,14,.2);
 checker(g,0,150,w,30,'#3a3a38','#8a8a7e',10);rect(g,0,146,w,4,'#4a4a44');
 rect(g,55,0,7,104,'#2a2a2e');rect(g,55,0,1,104,'#4a4a4e');rect(g,28,100,66,48,'#2a2a2e');rect(g,28,96,66,5,'#3e3e44');rect(g,28,96,66,1,'#5a5a60');for(const bx of[40,78])ell(g,bx,97,6,1,'#141416');rect(g,34,108,54,26,'#1e1e22');rect(g,36,110,50,2,'#3a3a40');rect(g,58,118,6,3,'#8a8a8a');rect(g,30,140,4,8,'#1a1a1c');rect(g,88,140,4,8,'#1a1a1c');
 rect(g,34,86,14,10,'#8a8a92');rect(g,34,86,14,1,'#b0b0b8');rect(g,72,88,12,8,'#6a6a72');rect(g,48,88,4,2,'#3a3a3a');
 rect(g,98,26,44,46,'#5a4a3a');dgrad(g,102,30,36,38,['#1e2a3c','#101820'],2);rect(g,119,30,2,38,'#5a4a3a');rect(g,102,48,36,2,'#5a4a3a');rect(g,96,72,48,3,'#7a6a58');
 for(const x of[166,180,194]){disc(g,x,58,6,'#a8603a');disc(g,x-1,57,3,'#c87a4a');rect(g,x,44,1,8,'#3a3a3a')}rect(g,160,42,42,2,'#4a4a4a');
 rect(g,222,48,30,2,'#6a4a30');for(let i=0;i<4;i++)rect(g,224+i*7,40,5,8,pick(['#8a9a6a','#c8a060','#a04a3a','#d8d0b0'])),rect(g,224+i*7,39,5,1,'#6a5a4a');
 rect(g,114,116,100,5,'#8a6a48');rect(g,114,116,100,1,'#aa8a62');rect(g,118,121,4,27,'#5a4230');rect(g,206,121,4,27,'#5a4230');rect(g,140,102,26,14,'#7a7a84');rect(g,138,100,30,3,'#9a9aa4');rect(g,138,100,30,1,'#c0c0c8');rect(g,186,112,16,4,'#e0d8c0');rect(g,186,112,16,1,'#f0ecd8');rect(g,193,112,1,4,'#8a6a48');
 crate(g,214,126,36,22,'#8a6a40','BOA VISTA');crate(g,218,108,30,18,'#7a5a36');crate(g,222,94,22,14,'#8a6a40');
 rect(g,254,72,32,76,'#3a2a1e');door(g,256,76,28,72,'#6a4a32',{});
 rect(g,288,82,30,66,'#4a3426');rect(g,288,82,30,1,'#6a4a36');rect(g,302,82,2,66,'#2a1e14');tex(g,288,82,30,66,16,2,1);rect(g,299,104,8,6,'#c8a860');rect(g,300,101,6,4,'rgba(0,0,0,0)');rect(g,300,100,1,4,'#a08850');rect(g,305,100,1,4,'#a08850');rect(g,300,100,6,1,'#a08850');
 rect(g,159,0,1,22,'#1a1a1a');rect(g,155,22,9,4,'#3a3a3a');
 rect(g,0,74,16,74,'#3a2618');door(g,2,78,12,70,'#6a4a32',{});
 return c},
fazenda(){const w=560,c=mk(w,H),g=c.getContext('2d');seed=91;NS=91;
 sky(g,w,150,['#0a1224','#18243a','#2a3448'],260,[300,24,9]);for(let i=0;i<200;i++){const x=R()*w,y=40+Math.sin(x/90)*20+rr(-14,14);rect(g,x,y,1,1,'rgba(200,210,230,.35)')}
 for(let x=0;x<w;x++){const h1=96+Math.sin(x/53)*8+Math.sin(x/17)*2;rect(g,x,h1,1,150-h1,'#1a2228')}
 dgrad(g,0,138,w,42,['#8a5034','#6a3c28'],3);tex(g,0,138,w,42,30,4,1.4);for(let i=0;i<80;i++)rect(g,R()*w,rr(138,178),1,rr(2,4),pick(['#5a6a34','#4a5a2a','#6a7a3a']));
 for(const y of[112,122,132])rect(g,12,y,52,3,'#8a6a48'),rect(g,12,y,52,1,'#aa8a62');line(g,14,134,62,112,'#7a5a3c');for(const x of[10,62])rect(g,x,100,5,48,'#6a5038'),rect(g,x,100,1,48,'#8a6a4a');
 rect(g,14,88,48,14,'#7a6040');rect(g,14,88,48,1,'#9a7a58');text(g,17,90,'BOA VISTA','#2a1a10');text(g,26,96,'1931','#2a1a10');
 for(let y=46;y<146;y+=6){const s=(y-46)/9;line(g,100-s,y,100+s+.6,y+6,'#6a6a6a');line(g,100+s,y,100-s-.6,y+6,'#6a6a6a');rect(g,100-s-1,y,1,6,'#5a5a5a');rect(g,100+s+1,y,1,6,'#5a5a5a')}rect(g,96,40,8,6,'#5a5a5a');rect(g,104,42,14,2,'#5a5a5a');rect(g,116,38,6,8,'#7a7a7a');
 planks(g,156,70,120,78,'#8a6a4a',true,6);grime(g,156,70,120,78,.3);for(let x=146;x<286;x++){const t=46+Math.abs(x-216)/2.9;rect(g,x,t,1,26-Math.abs(x-216)/2.9,'#4a2e22');if((x+Math.floor(t))%5===0)rect(g,x,t,1,26-Math.abs(x-216)/2.9,'#3a2218')}rect(g,146,70,140,2,'#2a1a12');
 windowW(g,196,84,20,16,{frame:'#4a3424',lit:'#d8a050',curtain:'#8a3a2a',sill:'#7a5a40'});door(g,228,102,18,46,'#5a3a26',{});rect(g,156,114,120,3,'#6a4a32');rect(g,156,114,120,1,'#8a6a4a');for(const x of[160,200,270])rect(g,x,117,3,31,'#6a4a32');for(let x=160;x<272;x+=4)rect(g,x,124,1,10,'#5a3a26');rect(g,156,134,120,2,'#5a3a26');
 rect(g,172,124,12,2,'#4a3020');rect(g,172,124,2,10,'#4a3020');rect(g,182,116,2,10,'#4a3020');line(g,170,136,186,136,'#4a3020');
 rect(g,366,116,44,16,'#7a5a3c');rect(g,366,116,44,1,'#9a7a54');for(let x=368;x<410;x+=6)rect(g,x,117,1,15,'#5a3e28');for(const wx of[374,402]){disc(g,wx,136,8,'#3a2a1c');disc(g,wx,136,6,'#6a4e34');for(let a=0;a<6;a++)line(g,wx,136,wx+Math.cos(a)*6,136+Math.sin(a)*6,'#3a2a1c');disc(g,wx,136,1,'#2a1a10')}line(g,410,126,436,130,'#6a4a30');
 rect(g,426,124,30,24,'#7a7a72');for(let y=124;y<148;y+=4)for(let x=426+((y/4)%2)*4;x<456;x+=8)rect(g,x,y,7,3,vary('#8a8a80',.2));rect(g,424,122,34,3,'#9a9a90');rect(g,428,96,3,28,'#5a4030');rect(g,451,96,3,28,'#5a4030');for(let x=422;x<460;x++)rect(g,x,92-Math.abs(x-441)/3,1,5,'#4a2e22');rect(g,440,104,2,10,'#6a6a6a');rect(g,437,112,8,6,'#7a5a3c');
 planks(g,466,48,92,100,'#a03e2e',true,5);for(let x=458;x<562;x++){const t=30+Math.abs(x-512)/2.4;rect(g,x,t,1,20,'#4a1a14')}rect(g,466,48,92,2,'#e0d8c8');
 rect(g,492,84,42,64,'#7a2e22');line(g,492,84,533,147,'#e0d8c8');line(g,533,84,492,147,'#e0d8c8');rect(g,492,84,42,2,'#e0d8c8');rect(g,492,84,2,64,'#e0d8c8');rect(g,532,84,2,64,'#e0d8c8');rect(g,512,84,2,64,'#e0d8c8');rect(g,505,60,14,14,'#1a0c0a');rect(g,504,59,16,1,'#e0d8c8');grime(g,466,48,92,100,.25);
 return c},
celeiro(){const w=320,c=mk(w,H),g=c.getContext('2d');seed=101;NS=101;
 planks(g,0,0,w,148,'#8a5a3a',true,9);grime(g,0,0,w,148,.35,true);for(let x=0;x<w;x+=36){rect(g,x,0,6,148,'#5a3a24');rect(g,x,0,1,148,'#7a5236')}rect(g,0,20,w,6,'#5a3a24');rect(g,0,20,w,1,'#7a5236');
 dgrad(g,0,148,w,32,['#b0964e','#8a7440'],2);tex(g,0,148,w,32,30,2,1.3);for(let i=0;i<260;i++){const x=R()*w,y=rr(146,178);line(g,x,y,x+rr(-4,4),y+rr(-1,1),pick(['#d8c070','#a08a40','#7a6a30']))}
 for(const[bx,byy]of[[6,134],[34,134],[18,120],[6,106]]){rect(g,bx,byy,28,14,'#c0a050');rect(g,bx,byy,28,1,'#d8c070');rect(g,bx,byy+4,28,1,'#8a7030');rect(g,bx,byy+9,28,1,'#8a7030');tex(g,bx,byy,28,14,30,1,1)}
 rect(g,68,112,86,5,'#7a5236');rect(g,68,112,86,1,'#9a7250');rect(g,72,117,4,31,'#5a3a24');rect(g,146,117,4,31,'#5a3a24');
 rect(g,76,100,22,12,'#2a2a2e');rect(g,78,96,18,4,'#e0d8c8');for(let x=78;x<96;x+=2)rect(g,x,106,1,2,'#8a8a8a');rect(g,76,100,22,1,'#4a4a4e');
 rect(g,104,102,10,10,'#a83a2e');rect(g,104,102,10,2,'#c85040');rect(g,116,102,10,10,'#1e1e22');rect(g,116,102,10,2,'#3a3a40');rect(g,106,112,1,6,'#a83a2e');rect(g,120,112,1,4,'#1e1e22');
 rect(g,130,104,18,8,'#3a3a40');disc(g,135,108,2,'#1a1a1a');disc(g,143,108,2,'#1a1a1a');rect(g,130,104,18,1,'#5a5a60');
 rect(g,166,110,24,38,'#3a3a3a');for(let x=166;x<191;x+=3)rect(g,x,110,1,38,'#9a9a9a');rect(g,166,110,24,1,'#b0b0b0');rect(g,166,147,24,1,'#9a9a9a');rect(g,172,142,7,2,'#ecece4');rect(g,180,143,4,1,'#ecece4');rect(g,174,138,8,3,'#8a8a92');
 rect(g,198,138,7,10,'#4a2e1c');rect(g,206,138,7,10,'#4a2e1c');rect(g,198,146,15,2,'#9a4a2e');rect(g,198,138,7,1,'#6a4a30');
 rect(g,220,38,78,54,'#5a3a24');rect(g,222,40,74,50,'#d8ccaa');tex(g,222,40,74,50,24,3,1);for(let i=0;i<16;i++)line(g,rr(224,294),rr(42,88),rr(224,294),rr(42,88),'#9a8e70');rect(g,240,52,10,6,'#b8ac8a');rect(g,262,60,14,8,'#b8ac8a');
 line(g,30,30,30,90,'#6a6a6a');for(let i=-3;i<=3;i+=3)line(g,30+i,90,30+i,100,'#8a8a8a');rect(g,27,90,7,1,'#8a8a8a');rect(g,42,40,16,4,'#8a8a8a');rect(g,42,44,16,1,'#6a6a6a');for(let x=42;x<58;x+=2)rect(g,x,45,1,1,'#6a6a6a');
 rect(g,300,60,20,88,'#4a2e1c');door(g,302,64,18,84,'#7a4a2e',{});
 rect(g,159,0,1,18,'#1a1a1a');
 return c},
casaj(){const w=440,c=mk(w,H),g=c.getContext('2d');seed=111;NS=111;
 damask(g,0,0,w,100,'#6a5644','#78624e');grime(g,0,0,w,100,.3,true);planks(g,0,100,260,48,'#6a4a32',true,10);rect(g,0,99,260,3,'#8a6a48');
 planks(g,0,150,w,30,'#5a3e2a',false,5);rect(g,0,146,w,4,'#3a2618');
 line(g,20,40,30,98,'#8a8a8a');rect(g,17,34,7,8,'#7a5a3a');line(g,44,40,44,100,'#7a5a3a');for(let i=0;i<5;i++)rect(g,40+i*2,98,1,5,'#9a9a9a');line(g,60,46,60,88,'#7a5a3a');for(let i=0;i<6;i++)rect(g,56+i,46+i*.5,1,1,'#aaaaaa');
 rect(g,58,128,10,14,'#a83a2e');rect(g,58,128,10,2,'#c85040');rect(g,58,142,10,1,'#6a2a20');rect(g,70,131,10,11,'#1e1e22');rect(g,70,131,10,2,'#3a3a40');rect(g,62,142,1,4,'#a83a2e');
 rect(g,94,134,7,10,'#4a2e1c');rect(g,102,134,7,10,'#4a2e1c');rect(g,94,142,15,2,'#9a4a2e');
 rect(g,122,114,44,4,'#7a5236');rect(g,126,118,3,26,'#5a3a24');rect(g,159,118,3,26,'#5a3a24');rect(g,132,102,22,12,'#2a2a2e');rect(g,134,98,18,4,'#e0d8c8');
 rect(g,166,86,32,3,'#7a5236');rect(g,170,78,14,8,'#3a3a40');disc(g,174,82,1,'#1a1a1a');disc(g,180,82,1,'#1a1a1a');
 rect(g,198,118,24,26,'#3a3a3a');for(let x=198;x<223;x+=3)rect(g,x,118,1,26,'#9a9a9a');rect(g,198,118,24,1,'#b0b0b0');rect(g,216,114,10,2,'#9a9a9a');
 rect(g,234,58,6,2,'#5a4230');rect(g,236,60,2,4,'#5a4230');
 rect(g,256,30,8,118,'#4a3020');rect(g,256,26,26,6,'#4a3020');rect(g,256,26,26,1,'#6a4a30');
 damask(g,260,100,180,46,'#6a5644','#78624e');rect(g,260,144,180,4,'#3a2618');rug(g,280,152,150,18,'#6a2424','#3a1414');
 rect(g,288,40,36,44,'#5a4230');dgrad(g,291,43,30,38,['#1e2c48','#101828'],2);disc(g,312,54,3,'#e8e2c4');rect(g,305,43,1,38,'#5a4230');rect(g,286,84,40,3,'#7a5a40');
 rect(g,330,96,32,22,'#7a3a34');rect(g,326,108,7,40,'#6a2e2a');rect(g,360,108,7,40,'#6a2e2a');rect(g,332,120,28,10,'#8a443c');rect(g,330,130,32,16,'#6a302a');tex(g,326,96,41,52,14,2,1);ell(g,330,108,4,3,'#7a3a34');ell(g,363,108,4,3,'#7a3a34');
 rect(g,376,98,2,48,'#5a4a3a');rect(g,372,144,10,2,'#3a2a1e');rect(g,369,88,16,10,'#d8b070');rect(g,369,88,16,1,'#f0d090');
 rect(g,390,108,42,28,'#4a3a2c');rect(g,390,108,42,1,'#6a5a48');rect(g,394,112,28,20,'#1a2422');rect(g,425,116,4,4,'#a08a50');rect(g,425,122,4,2,'#3a3a3a');rect(g,394,136,3,10,'#3a2a1e');rect(g,425,136,3,10,'#3a2a1e');line(g,404,108,398,98,'#5a5a5a');line(g,414,108,420,98,'#5a5a5a');
 return c}};
const cache={};G.bg=n=>cache[n]||(cache[n]=B[n]());

/* ---------- personagens ---------- */
const P=G.P={
 DET:{type:'trench',coat:'#a87e54',pants:'#2c2c34',shoe:'#1a1616',skin:'#dcae88',hair:'#3a2a20',hat:'fedora',hatC:'#4e4036',tie:'#8a2e2a',shirt:'#e0d8c8'},
 DETNC:{type:'vest',coat:'#4e4e58',shirt:'#d8d4c8',pants:'#2c2c34',shoe:'#1a1616',skin:'#dcae88',hair:'#3a2a20',tie:'#8a2e2a'},
 FARM:{type:'overalls',shirt:'#9a5038',coat:'#3e5a80',pants:'#3e5a80',shoe:'#4e3626',skin:'#b88a66',hair:'#a8a498',beard:'#b8b4a8',hat:'straw',hatC:'#d0b064'},
 FARMNH:{type:'overalls',shirt:'#9a5038',coat:'#3e5a80',pants:'#3e5a80',shoe:'#4e3626',skin:'#b88a66',hair:'#a8a498',beard:'#b8b4a8'},
 HEL:{type:'dress',coat:'#623460',skin:'#eccab2',hair:'#2a1a18',bun:1,shoe:'#1a1010',neck:'#ece4d4'},
 LIA:{type:'dress',child:1,coat:'#9484c0',skin:'#f0d4bc',hair:'#6e4628',long:1,shoe:'#3a2a2a',neck:'#f0ece0'},
 DAVI:{type:'jacket',child:1,coat:'#405a80',pants:'#3a3a46',shoe:'#2a2020',skin:'#e4c4a4',hair:'#6e4628',shirt:'#e0dcd0'},
 SEB:{type:'jacket',coat:'#706a50',pants:'#4e4636',shoe:'#3a2a1a',skin:'#c49474',hair:'#9a9a8a',beard:'#8a8a7a',messy:1,shirt:'#a8a090'},
 CLARA:{type:'dress',coat:'#24242c',skin:'#f0d4bc',hat:'veil',hatC:'#1e1e26',neck:'#f0f0e8',shoe:'#111'},
 ROSA:{type:'dress',coat:'#804e4e',apron:'#e8e4d8',skin:'#d4a484',hair:'#a8a8a8',bun:1,shoe:'#2a1a1a'},
 NINA:{type:'dress',child:1,coat:'#c44e42',skin:'#f0d4bc',hair:'#2a1a12',long:1,shoe:'#2a1a1a',neck:'#f0ece0'},
 PAIVA:{type:'jacket',coat:'#484852',pants:'#30303a',shoe:'#151515',skin:'#d4a484',hair:'#2a2a2a',hat:'fedora',hatC:'#2c2c34',stache:'#3a2a20',tie:'#2c3c6e',shirt:'#d8d4c8'},
 VIZ:{type:'jacket',coat:'#625c56',pants:'#36363e',shoe:'#1a1a1a',skin:'#cca484',hair:'#3a2a1a',shirt:'#c8c4b8'}};
function outline(c){const g=c.getContext('2d'),w=c.width,h=c.height,id=g.getImageData(0,0,w,h),d=id.data,o=new Uint8ClampedArray(d);for(let y=0;y<h;y++)for(let x=0;x<w;x++){const k=(y*w+x)*4;if(d[k+3])continue;const n=(x>0&&d[k-1])||(x<w-1&&d[k+7])||(y>0&&d[k-w*4+3])||(y<h-1&&d[k+w*4+3]);if(n){o[k]=14;o[k+1]=11;o[k+2]=16;o[k+3]=255}}g.putImageData(new ImageData(o,w,h),0,0);return c}
function paintFig(o,fr){const c=mk(44,72),g=c.getContext('2d'),r=(x,y,w,h,col)=>rect(g,x,y,w,h,col);const cx=20,foot=70,ch=!!o.child;
 const L=ch?{h0:2,h1:10,sh:11,wa:20,hip:22,hemT:30,hemJ:25,hemD:34,sW:4,wW:4,hW:6,H:38}:{h0:4,h1:12,sh:14,wa:26,hip:30,hemT:45,hemJ:33,hemD:51,sW:6,wW:5,hW:7,H:54};
 const top=foot-L.H,Y=v=>top+v;const bob=(fr===2||fr===4)?-1:0;
 const legs=[[0,0,0,0],[3,-3,0,0],[1,-1,0,2],[-3,3,0,0],[-1,1,2,0]][fr];
 const T=o.type,coat=o.coat,cHi=sh(coat,.18),cSh=sh(coat,-.28),cDk=sh(coat,-.5),skin=o.skin,sSh=sh(skin,-.22),hair=o.hair||'#2a1a10';
 const pants=T==='overalls'?coat:(o.pants||sh(coat,-.2)),shoe=o.shoe||'#1a1616',lw=ch?2:3;
 const hip=Y(L.hip)+bob;
 const leg=(dx,lift,front)=>{const fx=cx+dx,fy=foot-lift;const col=front?pants:sh(pants,-.3);thick(g,cx+(front?.5:-1.5),hip,fx,fy-2,T==='overalls'?lw+1:lw,col);r(fx-1,fy-2,lw+2,2,front?shoe:sh(shoe,-.2));r(fx+lw,fy-1,1,1,shoe);r(fx-1,fy-2,2,1,sh(shoe,.3))};
 const armC=(T==='vest'||T==='overalls')?(o.shirt||coat):coat;
 const sw=[0,-2,0,2,0][fr];
 const arm=(dx,front)=>{const sx=cx+(front?1:-1),sy=Y(L.sh+1)+bob,hx=cx+dx+(front?2:-2),hy=Y(L.wa+(ch?3:5))+bob;const col=front?armC:sh(armC,-.3);thick(g,sx,sy,hx,hy,ch?2:3,col);if(front)thick(g,sx+1,sy+1,hx+1,hy-1,1,sh(armC,.15));r(hx-1,hy+1,2,2,front?skin:sSh)};
 leg(legs[1],legs[3],false);arm(-sw,false);leg(legs[0],legs[2],true);
 const hem=T==='trench'?L.hemT:T==='dress'?L.hemD:T==='overalls'?L.wa+1:L.hemJ;const torsoC=T==='vest'||T==='overalls'?(o.shirt||coat):coat;const tHi=sh(torsoC,.16),tSh=sh(torsoC,-.28);
 for(let yy=L.sh;yy<=hem;yy++){let hw=yy<=L.wa?L.sW+(L.wW-L.sW)*(yy-L.sh)/(L.wa-L.sh):L.wW+(L.hW-L.wW)*(yy-L.wa)/Math.max(1,hem-L.wa);if(T==='jacket'||T==='vest'||T==='overalls')hw=yy<=L.wa?hw:L.wW;hw=Math.round(hw)-(yy===L.sh?1:0);const y=Y(yy)+bob,ext=(T==='trench'||T==='dress')&&yy>hem-6&&(fr===1||fr===3)?1:0;
  r(cx-hw-ext,y,hw*2+1+ext,1,torsoC);r(cx-hw-ext,y,2,1,tSh);r(cx+hw,y,1,1,tHi);
  if((T==='trench'||T==='dress')&&yy>L.wa+2&&yy<hem){if(yy%4)r(cx-2,y,1,1,tSh);if((yy+2)%5)r(cx+3,y,1,1,tSh)}}
 const sy=Y(L.sh)+bob,wy=Y(L.wa)+bob;
 if(T==='trench'||T==='jacket'){r(cx-L.wW,wy,L.wW*2+1,1,T==='trench'?cDk:coat);if(T==='trench')r(cx+2,wy,2,1,'#c8a868');for(let k=0;k<6;k++){r(cx+1,sy+k,1,1,cDk);r(cx+2+(k>3?1:0),sy+k,1,1,cHi)}if(o.shirt){r(cx+2,sy,2,3,o.shirt);if(o.tie)r(cx+3,sy+1,1,5,o.tie)}r(cx-4,sy-1,4,2,coat);r(cx-L.sW,sy,3,1,cDk);r(cx+3,wy+3,1,1,cDk);r(cx+3,wy+7,1,1,cDk);if(T==='trench'){r(cx-1,wy+3,1,1,cDk);r(cx-1,wy+7,1,1,cDk)}}
 if(T==='vest'){for(let yy=L.sh+1;yy<=L.wa+2;yy++){const y=Y(yy)+bob;r(cx-L.wW+1,y,L.wW*2-1,1,coat);r(cx-L.wW+1,y,2,1,cSh)}r(cx+1,sy+1,2,6,o.shirt);r(cx+2,sy+1,1,7,o.tie||'#8a2e2a');r(cx+3,wy-2,1,1,cHi);r(cx+3,wy-5,1,1,cHi);for(let yy=L.wa+3;yy<=L.hip;yy++)r(cx-L.wW,Y(yy)+bob,L.wW*2+1,1,pants)}
 if(T==='overalls'){for(let yy=L.sh+4;yy<=L.wa;yy++)r(cx-2,Y(yy)+bob,6,1,coat);r(cx-1,Y(L.sh+6)+bob,4,2,sh(coat,-.2));r(cx-2,sy+1,1,3,coat);r(cx+3,sy+1,1,3,coat);for(let yy=L.wa;yy<=L.hip+1;yy++)r(cx-L.wW,Y(yy)+bob,L.wW*2+1,1,coat);r(cx-L.wW,Y(L.wa)+bob,2,L.hip-L.wa,cSh)}
 if(T==='dress'){r(cx-L.wW,wy,L.wW*2+1,1,cDk);if(o.neck)r(cx-1,sy,4,2,o.neck);if(o.apron){for(let yy=L.wa-5;yy<hem-3;yy++)r(cx-1,Y(yy)+bob,L.wW+1+(yy>L.wa?1:0),1,o.apron);r(cx-1,Y(L.wa-5)+bob,1,hem-L.wa+2,sh(o.apron,-.15))}}
 if(o.messy)for(let i=0;i<4;i++)r(cx-L.wW+i*3,Y(hem)+bob,1,2,cDk);
 arm(sw,true);
 const h0=Y(L.h0)+bob,h1=Y(L.h1)+bob;r(cx-1,h1,3,sy-h1+1,sSh);
 if(o.hat==='veil')r(cx-5,h0-1,7,(L.sh-L.h0)+5,o.hatC);
 for(let k=0;k<=L.h1-L.h0;k++){let x0=cx-3,x1=cx+3;if(k===0){x0=cx-2;x1=cx+2}if(k===L.h1-L.h0){x0=cx-1;x1=cx+2}if(o.hat==='veil')x0=Math.max(x0,cx);r(x0,h0+k,x1-x0+1,1,skin);if(o.hat!=='veil')r(x0,h0+k,1,1,sSh)}
 r(cx+2,h0+4,1,1,'#1a1210');r(cx+1,h0+3,2,1,sh(hair,-.1));r(cx+4,h0+4,1,2,skin);r(cx+4,h0+5,1,1,sSh);r(cx+2,h0+6,2,1,sh(skin,-.3));if(o.hat!=='veil')r(cx-1,h0+3,1,2,sSh);r(cx-1,h1-1,3,1,sSh);
 if(o.beard){r(cx-1,h0+5,5,L.h1-L.h0-4,o.beard);r(cx+2,h0+6,2,1,sh(o.beard,-.3))}if(o.stache)r(cx+2,h0+5,3,1,o.stache);
 if(o.hat==='fedora'){const hc=o.hatC;r(cx-5,h0+1,12,1,hc);r(cx-6,h0+2,2,1,hc);r(cx+6,h0+1,2,1,sh(hc,-.2));r(cx-3,h0-3,7,4,hc);r(cx-2,h0-4,5,1,hc);r(cx-3,h0,7,1,sh(hc,-.45));r(cx,h0-4,1,1,sh(hc,-.3));r(cx+1,h0-3,2,1,sh(hc,.2));r(cx-3,h0-3,1,3,sh(hc,-.25));r(cx-1,h0+2,5,1,sSh)}
 else if(o.hat==='straw'){const hc=o.hatC;r(cx-7,h0+1,15,1,hc);r(cx-8,h0+2,1,1,hc);r(cx+8,h0+2,1,1,hc);r(cx-3,h0-3,7,4,hc);r(cx-2,h0-4,5,1,hc);r(cx-3,h0,7,1,'#7a3a2a');for(let i=-7;i<8;i+=2)r(cx+i,h0+1,1,1,sh(hc,-.18));r(cx-3,h0-3,1,3,sh(hc,-.2));r(cx-1,h0+2,5,1,sSh)}
 else if(o.hat==='veil'){r(cx-1,h0-1,5,1,o.neck);r(cx-1,h0-1,1,L.h1-L.h0+2,o.neck);r(cx-5,h0-1,1,L.sh-L.h0+5,sh(o.hatC,.15))}
 else{r(cx-3,h0-1,6,2,hair);r(cx-3,h0+1,2,4,hair);r(cx-1,h0-1,2,1,sh(hair,.2));if(o.messy){r(cx-4,h0-2,1,2,hair);r(cx-1,h0-2,1,1,hair);r(cx+2,h0-2,1,1,hair);r(cx-4,h0+2,1,3,hair)}if(o.long){r(cx-4,h0+1,2,L.sh-L.h0+3,hair);r(cx-4,h0+1,1,L.sh-L.h0+3,sh(hair,-.3))}if(o.bun){r(cx-6,h0,3,3,hair);r(cx-6,h0,1,1,sh(hair,.2))}}
 return outline(c)}
const FC={};
function fig(o,fr){const k=JSON.stringify(o)+fr;return FC[k]||(FC[k]=paintFig(o,fr))}
G.person=(X,x,foot,o,t)=>{x=Math.round(x);const fr=o.walk?1+((t/7|0)%4):0;const vis={};for(const k in o)if(k!=='walk'&&k!=='face'&&k!=='dim')vis[k]=o[k];const s=fig(vis,fr);
 X.fillStyle='rgba(0,0,0,.45)';X.beginPath();X.ellipse(x,foot,o.child?6:9,2,0,0,Math.PI*2);X.fill();
 if((o.face||1)<0){X.save();X.translate(x,0);X.scale(-1,1);X.drawImage(s,-20,foot-70);X.restore()}else X.drawImage(s,x-20,foot-70);
 if(o.walk&&G.A&&o.sound&&(t%14===0))G.A.sfx('step',.8)};
G.down=(X,x,foot,o)=>{const s=fig(o,0);X.save();X.translate(x+27,foot-3);X.rotate(-Math.PI/2);X.drawImage(s,-20,-70+20);X.restore()};
function paintSit(o,front){const c=mk(44,60),g=c.getContext('2d'),r=(x,y,w,h,col)=>rect(g,x,y,w,h,col);const cx=22,st=40,skin=o.skin,sSh=sh(skin,-.22),ov=o.coat;
 r(cx-6,st-2,5,5,ov);r(cx+1,st-2,5,5,ov);r(cx-6,st+3,5,10,sh(ov,-.25));r(cx+1,st+3,5,10,sh(ov,-.25));r(cx-7,st+13,6,3,o.shoe);r(cx+1,st+13,6,3,o.shoe);
 r(cx-7,st-18,15,17,o.shirt);r(cx-7,st-18,2,17,sh(o.shirt,-.3));r(cx-4,st-12,9,11,ov);r(cx-4,st-12,9,1,sh(ov,.2));r(cx-2,st-9,5,3,sh(ov,-.2));r(cx-4,st-18,1,6,ov);r(cx+4,st-18,1,6,ov);
 r(cx-10,st-16,3,12,sh(o.shirt,-.15));r(cx+8,st-16,3,12,sh(o.shirt,-.15));r(cx-10,st-4,3,3,skin);r(cx+8,st-4,3,3,skin);
 r(cx-1,st-20,3,3,sSh);r(cx-4,st-29,9,10,skin);r(cx-4,st-29,1,10,sSh);r(cx+4,st-29,1,10,sSh);r(cx-4,st-30,9,3,o.hair);r(cx-5,st-28,1,5,o.hair);r(cx+5,st-28,1,5,o.hair);
 if(front){r(cx-2,st-25,1,1,'#1a1210');r(cx+2,st-25,1,1,'#1a1210');r(cx-2,st-26,2,1,sh(o.hair,-.2));r(cx+1,st-26,2,1,sh(o.hair,-.2))}else{r(cx-3,st-25,1,1,'#1a1210');r(cx+1,st-25,1,1,'#1a1210')}
 r(cx,st-24,1,2,sSh);r(cx-3,st-22,7,4,o.beard);r(cx-1,st-21,3,1,sh(o.beard,-.35));return outline(c)}
const SC={};G.sit=(X,x,seat,o,front)=>{const k=front?1:0;const s=SC[k]||(SC[k]=paintSit(o,front));X.drawImage(s,Math.round(x)-22,seat-40)};
function paintCat(){const c=mk(18,12),g=c.getContext('2d'),r=(x,y,w,h,col)=>rect(g,x,y,w,h,col);r(2,5,12,6,'#ece8e0');r(2,9,12,2,'#c0bcb4');r(11,1,6,6,'#f4f0e8');r(11,0,1,2,'#f4f0e8');r(16,0,1,2,'#f4f0e8');r(12,3,1,1,'#6ab04a');r(15,3,1,1,'#6ab04a');r(13,5,2,1,'#d8a0a0');r(0,4,2,1,'#ece8e0');r(0,2,1,3,'#ece8e0');return outline(c)}
let CAT=null;G.cat=(X,x,y)=>{CAT=CAT||paintCat();X.drawImage(CAT,Math.round(x)-9,y-11)};

/* ---------- iluminação ---------- */
const LC=mk(W,H),lg=LC.getContext('2d'),PC=mk(W,H),pg=PC.getContext('2d');G.PC=PC;
function shape(c,l,cx){const x=l.x-cx,y=l.y;
 if(l.t==='p'){const gr=c.createRadialGradient(x,y,0,x,y,l.r);gr.addColorStop(0,`rgba(${l.c},${l.i})`);gr.addColorStop(.45,`rgba(${l.c},${l.i*.42})`);gr.addColorStop(1,`rgba(${l.c},0)`);c.fillStyle=gr;c.fillRect(x-l.r,y-l.r,l.r*2,l.r*2)}
 else if(l.t==='cone'){for(let k=0;k<3;k++){const e=k*7,a=l.i/(1+k*.9);const gr=c.createLinearGradient(0,y,0,l.y2);gr.addColorStop(0,`rgba(${l.c},${a})`);gr.addColorStop(1,`rgba(${l.c},${a*.35})`);c.fillStyle=gr;c.beginPath();c.moveTo(x-l.w0-e*.15,y);c.lineTo(x+l.w0+e*.15,y);c.lineTo(x+l.br+e,l.y2);c.lineTo(x+l.bl-e,l.y2);c.closePath();c.fill()}
  if(l.pool!==false){const px=x+(l.bl+l.br)/2,pr=(l.br-l.bl)/2;c.save();c.translate(px,l.y2);c.scale(1,.16);const gr=c.createRadialGradient(0,0,0,0,0,pr*1.2);gr.addColorStop(0,`rgba(${l.c},${l.i*.75})`);gr.addColorStop(1,`rgba(${l.c},0)`);c.fillStyle=gr;c.fillRect(-pr*1.3,-pr*1.3,pr*2.6,pr*2.6);c.restore()}}
 else if(l.t==='poly'){const gr=c.createLinearGradient(0,l.ya,0,l.yb);gr.addColorStop(0,`rgba(${l.c},${l.i})`);gr.addColorStop(1,`rgba(${l.c},${l.i2||0})`);c.fillStyle=gr;c.beginPath();l.pts.forEach((p,i)=>i?c.lineTo(p[0]-cx,p[1]):c.moveTo(p[0]-cx,p[1]));c.closePath();c.fill()}
 else if(l.t==='r'){c.fillStyle=`rgba(${l.c},${l.i})`;c.fillRect(x,y,l.w,l.h)}}
function quant(c,lv,alpha){const id=c.getImageData(0,0,W,H),d=id.data;for(let y=0;y<H;y++){const row=y*W;for(let x=0;x<W;x++){const k=(row+x)*4,b=BY[(x&3)+((y&3)<<2)]/16-.47;const n=alpha?4:3;for(let j=0;j<n;j++){let v=Math.round(d[k+j]*lv/255+b);d[k+j]=(v<0?0:v>lv?lv:v)*255/lv}}}c.putImageData(id,0,0)}
G.light=(X,scene,cx,t,fl,S)=>{const f=G.LIGHT[scene];if(!f)return null;const cfg=f(cx,t,fl,S);
 lg.globalCompositeOperation='source-over';lg.fillStyle=cfg.amb;lg.fillRect(0,0,W,H);lg.globalCompositeOperation='lighter';for(const l of cfg.L||[])shape(lg,l,cx);quant(lg,22,false);
 X.globalCompositeOperation='multiply';X.drawImage(LC,0,0);
 pg.globalCompositeOperation='source-over';pg.clearRect(0,0,W,H);pg.globalCompositeOperation='lighter';for(const l of cfg.P||[])shape(pg,l,cx);quant(pg,18,true);
 X.globalCompositeOperation='lighter';X.drawImage(PC,0,0);X.globalCompositeOperation='source-over';return cfg};
const warm='255,226,170',lampC='255,236,190',cool='150,180,230',fireC='255,140,60';
const winL=(M,cx)=>{const L=[],P=[];for(const w of(M&&M.lit)||[]){L.push({t:'p',x:w[0],y:w[1],r:12,c:w[2],i:.55});P.push({t:'p',x:w[0],y:w[1],r:5,c:w[2],i:.3})}return[L,P]};
const lampLight=(x,f,L,P)=>{L.push({t:'cone',x,y:31,w0:5,bl:-84,br:60,y2:152,c:lampC,i:.95*f});P.push({t:'cone',x,y:31,w0:4,bl:-72,br:50,y2:150,c:lampC,i:.15*f,pool:false},{t:'p',x,y:30,r:16,c:'255,240,210',i:.9*f})};
const refl=(x,y,f,P,t)=>{for(let k=0;k<5;k++)P.push({t:'r',x:x-6+Math.sin(t/9+k)*2,y:y+k*3,w:12-k*2,h:1,c:lampC,i:.22*f})};
G.LIGHT={
 street:(cx,t,fl,S)=>{const[L,P]=winL(META.street,cx);if(!S.fire){const f=S.burnt?.45:fl;lampLight(271,f,L,P);refl(271,162,f,P,t)}
  if(S.fire){const fz=.85+Math.random()*.25;L.push({t:'p',x:110,y:60,r:230,c:fireC,i:.9*fz},{t:'p',x:112,y:110,r:110,c:'255,190,90',i:.7*fz});P.push({t:'p',x:110,y:40,r:90,c:fireC,i:.35*fz},{t:'p',x:112,y:100,r:40,c:'255,200,120',i:.4*fz})}
  return{amb:S.burnt?'#30343c':S.fire?'#4a3a40':'#3e4e60',L,P}},
 room:(cx,t,fl)=>({amb:'#3c3444',L:[{t:'p',x:286,y:92,r:120,c:warm,i:.95*fl},{t:'p',x:190,y:16,r:100,c:warm,i:.45},{t:'poly',pts:[[30,38],[72,38],[110,150],[60,150]],ya:38,yb:150,c:cool,i:.35,i2:.12}],P:[{t:'p',x:286,y:92,r:18,c:'255,230,180',i:.5*fl},{t:'p',x:190,y:12,r:14,c:'255,230,180',i:.4},{t:'p',x:58,y:50,r:12,c:'230,230,210',i:.3}]}),
 office:(cx,t,fl,S)=>{const L=[{t:'p',x:197,y:100,r:90,c:'235,235,170',i:.95*fl},{t:'cone',x:197,y:97,w0:8,bl:-30,br:30,y2:112,c:'240,240,180',i:.6*fl,pool:false}],P=[{t:'p',x:197,y:94,r:14,c:'200,255,200',i:.3*fl}];for(let k=0;k<7;k++){const y=30+k*8;L.push({t:'poly',pts:[[16,y],[80,y],[150,150+k*2],[86,150+k*2]],ya:y,yb:150,c:cool,i:.12,i2:.05})}if(S.flags.ring&&(t>>4)%2)P.push({t:'p',x:140,y:104,r:10,c:'255,240,180',i:.4});return{amb:'#2e3644',L,P}},
 praca:(cx,t,fl)=>{const[L,P]=winL(META.praca,cx);for(const[x,f]of[[186,fl],[316,1]]){L.push({t:'cone',x,y:96,w0:34,bl:-80,br:58,y2:152,c:lampC,i:.85*f});P.push({t:'cone',x,y:31,w0:4,bl:-70,br:50,y2:150,c:lampC,i:.14*f,pool:false},{t:'p',x,y:30,r:16,c:'255,240,210',i:.9*f},{t:'p',x,y:34,r:40,c:lampC,i:.12*f})}refl(186,164,fl,P,t);refl(316,170,1,P,t);L.push({t:'p',x:94,y:96,r:50,c:warm,i:.6},{t:'p',x:451,y:86,r:40,c:warm,i:.6});P.push({t:'p',x:451,y:86,r:8,c:warm,i:.5},{t:'p',x:94,y:92,r:10,c:warm,i:.3});return{amb:'#36445a',L,P}},
 pensao:(cx,t,fl)=>{const nf=(t>>3)%11?1:.2;return{amb:'#2c262c',L:[{t:'p',x:160,y:30,r:150,c:warm,i:.95*fl},{t:'poly',pts:[[36,40],[80,40],[120,150],[40,150]],ya:40,yb:150,c:'255,70,60',i:.35*nf,i2:.08}],P:[{t:'p',x:160,y:28,r:16,c:'255,240,200',i:.85*fl},{t:'p',x:56,y:50,r:20,c:'255,60,50',i:.3*nf}]}},
 estrada:(cx,t,fl,S)=>{const L=[{t:'p',x:120,y:30,r:300,c:'120,140,190',i:.35}],P=[{t:'p',x:120,y:32,r:34,c:'220,220,200',i:.35}];if(!G.has('lanterna')){L.push({t:'p',x:362,y:144,r:44,c:warm,i:.85});P.push({t:'p',x:362,y:144,r:8,c:warm,i:.5})}return{amb:'#46567a',L,P}},
 orfanato:(cx,t,fl)=>{const[L,P]=winL(META.orfanato,cx);L.push({t:'cone',x:261,y:92,w0:3,bl:-30,br:30,y2:150,c:warm,i:.8*fl});P.push({t:'p',x:261,y:90,r:9,c:'255,230,180',i:.7*fl});return{amb:'#3a4458',L,P}},
 bosque:(cx,t)=>{const L=[],P=[];for(const x of[90,240,380,520]){L.push({t:'poly',pts:[[x,0],[x+10,0],[x-24,150],[x-40,150]],ya:0,yb:150,c:cool,i:.25,i2:.08});P.push({t:'poly',pts:[[x,0],[x+8,0],[x-26,150],[x-36,150]],ya:0,yb:150,c:cool,i:.04,i2:0})}for(let i=0;i<8;i++){const fx=(i*73+t*.2)%560,fy=90+Math.sin(t/40+i)*20;if((t+i*9)%60<40){P.push({t:'p',x:fx,y:fy,r:4,c:'220,240,120',i:.8});L.push({t:'p',x:fx,y:fy,r:14,c:'220,240,120',i:.3})}}L.push({t:'p',x:511,y:84,r:20,c:warm,i:.4});return{amb:'#46565c',L,P}},
 cozinha:(cx,t,fl)=>({amb:'#30343a',L:[{t:'p',x:159,y:26,r:150,c:warm,i:.95*fl},{t:'p',x:60,y:128,r:36,c:fireC,i:.6+Math.sin(t/7)*.1},{t:'poly',pts:[[102,30],[138,30],[160,150],[110,150]],ya:30,yb:150,c:cool,i:.18}],P:[{t:'p',x:159,y:24,r:14,c:'255,240,200',i:.8*fl},{t:'p',x:60,y:132,r:8,c:fireC,i:.4}]}),
 fazenda:(cx,t,fl,S)=>{const w=(t>>6)%3?1:.6;const L=[{t:'p',x:300,y:24,r:300,c:'110,130,180',i:.28},{t:'p',x:206,y:92,r:60,c:warm,i:.8*w},{t:'p',x:513,y:80,r:40,c:warm,i:.5}],P=[{t:'p',x:206,y:92,r:10,c:warm,i:.4*w},{t:'p',x:300,y:24,r:20,c:'220,220,200',i:.3}];if(S.flags.smoke)L.push({t:'p',x:0,y:80,r:80,c:fireC,i:.4});return{amb:'#2e3a50',L,P}},
 celeiro:(cx,t,fl)=>{const L=[{t:'p',x:160,y:24,r:150,c:warm,i:.95*fl}],P=[{t:'p',x:160,y:24,r:14,c:'255,220,150',i:.7*fl}];for(const x of[54,126,198,270])L.push({t:'poly',pts:[[x,0],[x+2,0],[x+30,148],[x+26,148]],ya:0,yb:148,c:cool,i:.3,i2:.1});return{amb:'#261e1c',L,P}},
 casaj:(cx,t,fl)=>{const tv=.7+Math.random()*.3;return{amb:'#3a3034',L:[{t:'p',x:376,y:92,r:100,c:warm,i:.85},{t:'p',x:410,y:122,r:80,c:'140,220,220',i:.5*tv},{t:'p',x:130,y:6,r:90,c:warm,i:.5}],P:[{t:'p',x:376,y:92,r:14,c:'255,230,180',i:.5},{t:'p',x:408,y:122,r:22,c:'160,240,240',i:.35*tv}]}}};

/* ---------- efeitos dinâmicos (antes da luz) ---------- */
const mark=(X,x,y,t,col)=>{if((t>>4)%3)rect(X,x,y,2,1,col||'#e8e0b0')};
G.FX={
 office:(X,cx,t,fl,S)=>{if(!S.coat){rect(X,90-cx,58,14,38,'#a87e54');rect(X,90-cx,58,2,38,'#7a5a3a');rect(X,96-cx,60,1,30,'#6e5038');rect(X,88-cx,54,18,2,'#4e4036');rect(X,92-cx,50,10,4,'#4e4036')}for(let i=0;i<5;i++)rect(X,20+((t*.6+i*13)%56)-cx,30+((t*1.6+i*29)%58),1,3,'rgba(160,190,220,.6)')},
 street:(X,cx,t,fl,S)=>{if(S.ch===1){if(!G.has('bota')){rect(X,326-cx,147,6,2,'#6a2a20');rect(X,327-cx,145,4,2,'#6a2a20');rect(X,334-cx,149,5,2,'#6a2a20')}if(!G.has('jornal')){rect(X,384-cx,146,11,4,'#c8c2b0');rect(X,385-cx,147,8,1,'#7a7668');rect(X,385-cx,149,6,1,'#7a7668')}if(!G.has('coleira')){rect(X,458-cx,142,5,2,(t>>4)%2?'#d03a30':'#902a24');rect(X,462-cx,142,1,1,'#e8d070')}}},
 room:(X,cx,t,fl,S)=>{if(S.ch>=3){for(let i=0;i<5;i++)rect(X,240+i*4-cx,112-(i%2),3,3,['#d8c8e0','#e8d8a0','#c8b0d0'][i%3]);rect(X,244-cx,115,14,2,'#4a6a3a')}},
 praca:(X,cx,t)=>{for(let i=0;i<6;i++)rect(X,231+i*3-cx,102+((t/2+i*5)%24),1,2,'#a8c8e0');for(let i=0;i<9;i++)rect(X,208+((t*.5+i*8)%62)-cx,128,3,1,'#6a9ab0')},
 estrada:(X,cx,t)=>{if(!G.has('lanterna')){rect(X,357-cx,141,9,5,'#3a3a3a');rect(X,359-cx,142,5,3,'#f0d890');rect(X,366-cx,142,2,2,'#3a3a3a')}const s='EU NUNCA EXISTI';text(X,250-cx,158,s,'#c8805a');if(!G.has('gravador'))mark(X,452-cx,116,t)},
 orfanato:(X,cx,t,fl,S)=>{const sw=Math.sin(t/25)*6;G.line(X,440-cx,91,440+sw-cx,126,'#7a7a7a');G.line(X,456-cx,91,456+sw-cx,126,'#7a7a7a');rect(X,437+sw-cx,126,22,2,'#7a4a2a');if(S.ch===4&&!G.has('fita'))rect(X,456+sw-cx,108,2,4,'#d03a30');
  const w='#ecece4';rect(X,94-cx,124,12,5,w);rect(X,104-cx,119,5,5,w);rect(X,104-cx,118,1,1,w);rect(X,108-cx,118,1,1,w);rect(X,92-cx,118,1,6,w);rect(X,95-cx,112,14,1,w);rect(X,98-cx,109,8,3,w);G.line(X,110-cx,126,118-cx,126,w);G.line(X,116-cx,124,118-cx,126,w);G.line(X,116-cx,128,118-cx,126,w)},
 bosque:(X,cx,t)=>{G.blades(X,511-cx,64,20,t/90,'#5a5048');for(const[id,x]of[['mapa1',120],['mapa2',250],['mapa3',366]])if(!G.has(id)){rect(X,x-cx,145,5,4,'#e0d8c0');rect(X,x+1-cx,146,3,1,'#c04030')}},
 cozinha:(X,cx,t,fl,S)=>{for(let i=0;i<4;i++)rect(X,148+i*4-cx,98-((t/3+i*7)%16),1,2,'rgba(230,230,230,.5)');if(S.ch===5){rect(X,124-cx,40,10,10,'#b88a66');rect(X,121-cx,38,16,2,'#d0b064');rect(X,124-cx,35,10,3,'#d0b064');rect(X,131-cx,44,1,1,'#111')}},
 fazenda:(X,cx,t,fl,S)=>{G.blades(X,100-cx,44,24,t/60,'#8a8a8a');if(!S.flags.scare){const x=330-cx;rect(X,x,92,3,56,'#6a5038');rect(X,x-14,102,31,3,'#6a5038');rect(X,x-6,102,15,22,'#8a4a34');rect(X,x-6,102,2,22,'#6a3424');rect(X,x-4,92,11,10,'#c8b080');rect(X,x-8,91,19,2,'#d0b064');rect(X,x-4,86,11,5,'#d0b064');rect(X,x-2,95,2,2,'#111');rect(X,x+3,95,2,2,'#111');rect(X,x-1,99,5,1,'#5a3a2a');for(let i=0;i<4;i++)rect(X,x-14+i*2,104,1,4,'#d0b064'),rect(X,x+12+i*2,104,1,4,'#d0b064')}else{rect(X,330-cx,100,3,48,'#6a5038');rect(X,316-cx,106,31,3,'#6a5038')}},
 celeiro:(X,cx,t)=>{rect(X,156-cx,18,8,10,'#3a3a3a');rect(X,157-cx,20,6,6,'#ffd27a');for(const[x,y]of[[236,52],[252,66],[270,48],[284,72]])rect(X,x-cx,y,2,2,'#c03a2e');rect(X,297-cx,44,3,3,(t>>4)%2?'#ff5040':'#c03a2e')},
 casaj:(X,cx,t,fl,S)=>{for(let i=0;i<60;i++)rect(X,394+Math.random()*28-cx,112+Math.random()*20,1,1,Math.random()<.5?'#d8f0e8':'#6a8a80');if(S.flags.hatOff){rect(X,228-cx,63,15,1,'#d0b064');rect(X,232-cx,59,7,4,'#d0b064');rect(X,232-cx,62,7,1,'#7a3a2a')}if(S.sit){G.sit(X,346-cx,128,P.FARMNH,S.front);if(S.catLap)G.cat(X,347-cx,124)}}};
const embers=Array.from({length:50},()=>({x:Math.random()*260,y:Math.random()*140,v:.3+Math.random()*.9}));
G.POST={street:(X,cx,t,S)=>{if(!S.fire)return;for(const[x,y,w,h]of[[16,6,30,26],[76,6,30,26],[140,6,30,26],[198,6,30,26],[92,70,40,58]]){for(let i=0;i<16;i++){const fx=x+Math.random()*w,fh=4+Math.random()*h*.9;rect(X,fx-cx,y+h-fh,2,fh,['#ff9a3a','#ffe08a','#d8501a','#ff7a2a'][(Math.random()*4)|0])}}
 for(let i=0;i<26;i++)rect(X,Math.random()*252-cx,-2+Math.random()*8,3,5+Math.random()*10,Math.random()<.5?'#ff9a3a':'#ffe08a');
 for(const e of embers){e.y-=e.v;e.x+=Math.sin((t+e.y)/20)*.4;if(e.y<0){e.y=140;e.x=Math.random()*260}rect(X,e.x-cx,e.y,1,1,'#ffc060')}
 X.fillStyle='rgba(30,24,24,.4)';for(let i=0;i<7;i++){const sx=(i*44+t*.3)%300;X.fillRect(sx-cx,0,46,14+Math.sin(t/30+i)*5)}},
 bosque:(X,cx,t)=>{for(let i=0;i<4;i++){X.fillStyle='rgba(170,190,190,.06)';X.fillRect(((t*.15*(i+1))%640)-200-cx*.5,96+i*12,340,10)}},
 estrada:(X,cx,t)=>{X.fillStyle='rgba(160,170,200,.04)';X.fillRect(0,120,320,30)}};
G.rain=(X,drops,cfg,cx,ts)=>{ts=ts||1;const cones=(cfg&&cfg.L||[]).filter(l=>l.t==='cone');for(const r of drops){r.y+=r.v*ts;r.x-=.5*ts;if(r.y>H){r.y=-4;r.x=Math.random()*W+20}let lit=false;for(const c of cones){const lx=c.x-cx;if(r.y>c.y&&r.y<c.y2){const f=(r.y-c.y)/(c.y2-c.y);if(r.x>lx+c.bl*f-4&&r.x<lx+c.br*f+4){lit=true;break}}}X.fillStyle=lit?'rgba(255,240,200,.75)':'rgba(140,160,180,.35)';X.fillRect(r.x|0,r.y|0,1,lit?4:3);if(r.y>150&&Math.random()<.04){X.fillRect((r.x|0)-1,152+Math.random()*20,3,1)}}};
G.qobj=(X,k,x,y,a,from)=>{x=Math.round(x);y=Math.round(y);X.save();X.translate(x,y);
 if(k==='bottle'){X.rotate(a);rect(X,-2,-5,4,9,'#3a7a4a');rect(X,-1,-8,2,3,'#3a7a4a');rect(X,-1,-4,1,6,'#8ac89a')}
 else if(k==='beam'||k==='fire'){X.rotate(Math.sin(a*.3)*.4+.3);rect(X,-16,-3,32,6,'#6a4228');rect(X,-16,-3,32,1,'#8a5a38');rect(X,-16,2,32,1,'#3a2214');if(k==='fire')for(let i=0;i<10;i++)rect(X,-16+Math.random()*32,-3-Math.random()*8,2,4+Math.random()*5,Math.random()<.5?'#ff9a3a':'#ffe08a')}
 else if(k==='fork'){X.rotate(.5+Math.sin(a*.2)*.2);rect(X,-1,-16,2,26,'#7a5a3a');rect(X,-4,10,8,2,'#9a9a9a');for(const d of[-4,-1,2])rect(X,d,12,2,6,'#b0b0b0')}
 else if(k==='branch'){X.rotate(a*.15);rect(X,-14,-1,28,3,'#4a3420');rect(X,-6,-6,2,6,'#4a3420');rect(X,6,1,2,6,'#4a3420');for(let i=0;i<6;i++)rect(X,-14+i*5,-4,4,3,'#3a5030')}
 else if(k==='dog'){const leg=(Math.floor(a)%2);if(from==='right')X.scale(-1,1);rect(X,-10,-12,18,8,'#2a2420');rect(X,6,-16,8,7,'#2a2420');rect(X,12,-13,4,3,'#2a2420');rect(X,8,-17,2,2,'#2a2420');rect(X,11,-15,1,1,'#ff4030');rect(X,-13,-12,4,2,'#2a2420');rect(X,-9,-4,2,4+leg,'#2a2420');rect(X,-4,-4,2,4-leg,'#2a2420');rect(X,2,-4,2,4+leg,'#2a2420');rect(X,6,-4,2,4-leg,'#2a2420');rect(X,13,-10,3,1,'#e8e0d0')}
 X.restore()};
G.blades=(X,x,y,r,a,col)=>{for(let k=0;k<4;k++){const an=a+k*Math.PI/2;thick(X,x,y,x+Math.cos(an)*r,y+Math.sin(an)*r,2,col);rect(X,x+Math.cos(an)*r*.6,y+Math.sin(an)*r*.6,3,3,col)}rect(X,x-1,y-1,3,3,'#3a3a3a')};
G.vig=(()=>{const c=mk(W,H),g=c.getContext('2d'),gr=g.createRadialGradient(160,90,50,160,90,190);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,.55)');g.fillStyle=gr;g.fillRect(0,0,W,H);return c})();
})();
