/* Nutcase P.I. · história: pistas, personagens, cenas, capítulos e finais */
(()=>{
const G=window.G,S=G.S,P=G.P,rect=G.rect;
const say=(l,cb)=>G.say(l,cb),run=(s,cb)=>G.run(s,cb),found=(...a)=>G.found(...a),go=(...a)=>G.go(...a);
const ch=n=>()=>S.ch===n,chs=(...n)=>()=>n.includes(S.ch);
const B=t=>['Brandão',t];

/* ---------- pistas [título, descrição, capítulo] ---------- */
G.CLUE={
 grafite:['Pichação “QUEM TE VÊ?”','Tinta fresca na parede dos Valente, feita depois do sumiço. Escrita pra ser lida.',1],
 bota:['Pegada de bota com terra vermelha','Bota 43. Terra vermelha não existe na cidade, só nas fazendas da estrada velha.',1],
 coleira:['Coleira do Mingau','Plaquinha: “MINGAU · 0714”. O fecho foi aberto com cuidado, não arrebentado.',1],
 jornal:['Jornal de hoje','“Gato dos Valente sumido há 7 dias.” Alguém circulou a palavra “família” à caneta.',1],
 janela:['Arranhões por fora da janela','Os arranhões estão do lado de fora. Alguém tirou o gato pela janela.',1],
 tigela:['Tigela com ração fresca','A família jura que ninguém mexe nela desde o sumiço. A ração é de hoje.',1],
 retrato:['Retrato raspado','Os olhos de Augusto e Helena foram raspados da foto. Os das crianças, não.',1],
 bilhete:['Bilhete com feno','“Vocês só existem enquanto alguém olha.” Dobrado em volta de um punhado de feno.',1],
 helena:['Depoimento de Helena','Na noite do sumiço, um homem de chapéu de palha encheu a tigela do Mingau pela janela e disse: “nada aqui é de verdade”.',1],
 jornal2:['Manchete: Valente morto','“Augusto Valente encontrado morto na estrada velha.” Sem sinais de violência.',2],
 cartaz:['Cartaz do Mingau','“Procura-se.” Alguém escreveu embaixo, a lápis: “ELE ESTÁ BEM ALIMENTADO”.',2],
 panfleto:['Panfleto da feira','“Verduras da Fazenda Boa Vista. Parte da colheita doada ao Orfanato Santa Luzia aos domingos.”',2],
 seb:['Depoimento de Sebastião','Ex-peão da Boa Vista. O patrão conversa com os peões toda noite até concordarem que não existem. Augusto comprou terra dele e levou um gato branco do celeiro.',2],
 parede:['A parede do quarto 3','Um acróstico escrito por Sebastião pra não esquecer: B-O-A-V-I-S-T-A.',2],
 foto:['Foto dos peões','Peões da Boa Vista, 1971. O rosto do homem de chapéu, no centro, foi raspado. No verso: “Rádio da fazenda, 93.5”.',2],
 radio:['Voz no rádio','Na 93.5, uma voz calma e gravada: “Você já reparou que ninguém te olha de verdade?”',2],
 botas2:['Botas de Sebastião','Terra vermelha seca. Sebastião também andou na Boa Vista.',2],
 inscricao:['“EU NUNCA EXISTI”','Escrito na terra com um graveto. Letras retas e calmas demais para um homem desesperado. A mesma mão do bilhete.',3],
 carroca:['Marcas de carroça','Rodas finas, ida e volta pela estrada velha. Ninguém mais anda de carroça na cidade.',3],
 palha:['Fios de palha trançada','Presos no arame da cerca. Palha de chapéu.',3],
 lanterna:['Lanterna do Augusto','Ainda com pilha. Ele não fugia: procurava alguém.',3],
 gravador:['A fita do milharal','Uma voz calma convence Augusto, frase por frase, de que ele é só uma história que acabou.',3],
 davi:['Depoimento de Davi','O moço do chapéu se chama Joaquim. Contava histórias na janela à noite. Disse que com as crianças “não adianta”.',3],
 giz:['Desenho de giz','No muro: um gato branco, um chapéu de palha e uma seta apontando para os fundos.',4],
 fita:['Fita de cabelo','A fita vermelha da Nina presa na corrente do balanço. Ela saiu brincando, não fugindo.',4],
 caixas:['Caixotes de domingo','Carimbo: “FAZENDA BOA VISTA — DOAÇÃO DE DOMINGO”.',4],
 clara:['Depoimento da Irmã Clara','Nina falava de um gato branco que o moço das verduras prometeu mostrar. Debaixo do colchão: um desenho de moinho com um gato.',4],
 mapa1:['Mapa, pedaço 1','Desenho de criança: uma árvore torta com a palavra “NÃO”.',4],
 mapa2:['Mapa, pedaço 2','Um rio riscado com um X grande.',4],
 mapa3:['Mapa, pedaço 3','Um moinho com um gato em cima e um coração.',4],
 nina:['Nina','Achada viva no moinho, com uma boneca de palha. “Eu sei que eu sou de verdade. Criança sabe.”',4],
 carimbo:['Data no caixote','Colheita de 13/11: a noite em que o Mingau sumiu.',5],
 podre:['Verdura podre por dentro','Perfeita por fora, preta por dentro. Não é veneno: é tempo. Guardada de propósito.',5],
 ledger:['Caderno de entregas','Primeira entrega da Boa Vista: 13/11. Assinado só com um “J.”',5],
 rosa:['Depoimento de Dona Rosa','Seu Joaquim guarda os caixotes no armário dele uma semana inteira e pediu segredo. Fica conversando com as panelas.',5],
 caderno:['Caderno de conversas','Augusto ✓. Helena ✓. Sebastião ✗. Rosa —. Brandão: ? Última linha, letra tremida: “quem está olhando”.',5],
 placa:['Placa da fazenda','“FAZENDA BOA VISTA — DESDE 1931.”',6],
 roda:['A carroça','As rodas batem com as marcas da estrada velha.',6],
 ferramentas:['A bancada','Máquina de escrever com o tipo dos bilhetes, tinta vermelha e preta da pichação, um gravador.',6],
 gaiola:['Gaiola aberta','Pelo branco, tigela limpa. Mingau esteve aqui, bem cuidado.',6],
 bota43:['Botas 43','Terra vermelha. Iguais à pegada da rua dos Valente.',6],
 mapa:['Mapa com alfinetes','Casa Valente, pensão, orfanato, delegacia. Um alfinete fora do papel, na moldura: “quem joga”.',6]};

G.SHOCK={tigela:'MENTIRA',janela:'NÃO FUGIU',inscricao:'NÃO FOI ELE',gravador:'CONVENCIDO',podre:'MENTIRA',caderno:'MEU NOME',gaiola:'ESTÁ VIVO',mapa:'ELE SABE DE VOCÊ',helena:'ELA VIU',seb:'ELE ESCAPOU',davi:'JOAQUIM',rosa:'MENTIRA',clara:'O MOÇO DO DOMINGO'};
/* respostas simples do detetive sem IA */
G.FB=[['gato','O Mingau é a ponta do fio. Quem leva um gato não quer o gato: quer atenção.'],['mingau','Mingau. Até o nome é de quem cuida. Alguém cuida dele.'],['coleira','Coleira aberta com cuidado. Quatro números numa plaquinha. Número assim abre coisa.'],['feno','Feno é coisa de fazenda, não de mansão.'],['bota','Terra vermelha. Estrada velha. Fazendas.'],['helena','Helena sabe mais do que diz. Mas ninguém conta segredo pra estranho. Conversa com calma.'],['janela','Arranhão por fora. Alguém esteve do lado de fora daquela janela.'],['fazend','Fazenda de novo. Tudo nessa cidade cheira a terra vermelha.'],['chapéu','Chapéu de palha… eu vejo um em toda cena. Isso me incomoda.'],['real','Gente que acha que não existe. Alguém convenceu. Convencer exige conversa — e paciência.'],['exist','Existir é ser olhado, dizia minha avó. Talvez ela tivesse razão demais.'],['sebasti','Sebastião não é louco. É alguém que quase acreditou.'],['joaquim','Joaquim. Um nome comum demais pra um homem desses.'],['nina','Criança some atrás de história. Ache a história, ache a menina.'],['sopa','Sopa estraga por descuido. Ou por paciência.'],['crianç','As crianças não caem nisso. Por quê? Essa é a pergunta.'],['davi','O Davi protege a irmã como um homem. Doze anos.'],['lia','A Lia fala como quem sabe de coisas que não deveria.'],['rádio','Uma rádio de fazenda. Quem fala sozinho no ar está falando pra alguém.'],['carroça','Carroça na estrada velha. Lenta, silenciosa, ninguém repara.'],['quem','Quem? Ainda não sei. Mas sei como: conversando.']];

/* ---------- personagens com barra de confiança ---------- */
G.NPC={
 helena:{name:'Helena Valente',opts:[['Como a senhora está?','Como a senhora está, de verdade? Estou aqui pra ajudar.'],['Os seus filhos','Os seus filhos estão bem? Quero proteger vocês.'],['Sinto muito','Sinto muito pelo que a senhora está passando. Pode confiar em mim.'],['Naquela noite…','O que a senhora viu na noite em que o Mingau sumiu?','keep'],['Pressionar','A senhora está mentindo pra mim.','bad']],persona:'Elegante, fria, assustada; há uma semana acredita que ela e o marido não são reais, que são “desenhos sendo olhados”. Ama os filhos. Fala com frases bonitas e cansadas.',
  secret:'na noite em que o gato Mingau sumiu, ela viu pela janela um homem de chapéu de palha encher a tigela do gato e dizer “nada aqui é de verdade”.',
  topics:/gato|mingau|noite|janela|quem|viu|homem|chapéu|sumi/,clue:'helena',
  reveal:'Naquela noite… um homem de chapéu de palha encheu a tigela do Mingau pela janela. Olhou pra mim e disse: “nada aqui é de verdade”. Desde então eu acredito.',
  intro:'Sente-se, se quiser. Ou não. Nada nesta sala parece ser nosso de verdade.',
  good:['Ninguém pergunta por nós desde que o Mingau sumiu. Só por ele.','O senhor fala como quem olha. Faz tempo que ninguém me olha.'],
  bad:['O senhor entrou na minha casa para me acusar? Desenhos não matam ninguém, detetive.','Saia daqui com essa voz de delegacia.'],
  low:['Não sei de nada. Ou não deveria saber. O senhor ainda é um estranho.'],
  neutral:['Às vezes eu falo e parece que alguém escreveu a frase antes de mim.','O Augusto não sai do quarto. Diz que o espelho não o reconhece.','Os meninos estão bem. Crianças sempre estão bem. É isso que me assusta.']},
 seb:{name:'Sebastião',opts:[['Acalmar','Calma, Sebastião. Eu não vou te machucar, quero ajudar.'],['Eu acredito','Eu acredito em você. Você não é louco.'],['Você está seguro','Você está seguro comigo. Obrigado por falar.'],['De onde você veio?','Onde você trabalhava antes? Quem é esse homem?','keep'],['Pressionar','Você é louco ou mentiroso?','bad']],persona:'Ex-peão de fazenda, 50 anos, barba por fazer, fala aos trancos, grita que a cidade é inventada, mas por baixo é lúcido e apavorado. Desconfia de polícia. Acalma-se com paciência e com quem não o chama de louco.',
  secret:'trabalhou na Fazenda Boa Vista; o patrão conversa com os peões toda noite, com voz mansa, até eles concordarem que não existem; Sebastião fugiu antes de acreditar de vez; Augusto Valente comprou terra do patrão e levou um gato branco do celeiro.',
  topics:/fazenda|trabalh|onde|quem|patrão|homem|valente|augusto|gato|por que|porque|fugi/,clue:'seb',
  reveal:'Eu era peão na Boa Vista. O patrão senta com a gente toda noite e conversa, conversa, com aquela voz mansa, até a gente concordar que não existe. Eu fugi antes. O Augusto comprou terra dele… e levou um gato branco do celeiro.',
  intro:'NÃO CHEGA PERTO! …Você é de verdade? Prova. Fala alguma coisa que ninguém escreveu antes.',
  good:['…Faz tempo que alguém fala comigo sem rir.','Tá bom. Respira, Sebastião. Ele parece de verdade.'],
  bad:['Louco é quem acredita em tudo! Sai! SAI!','Polícia só escuta o que já decidiu ouvir.'],
  low:['Não conto. Ele escuta. Ele SEMPRE escuta.'],
  neutral:['A cidade é cenário, moço. Repara nas janelas: ninguém mora atrás delas.','Eu escrevi na parede do quarto pra não esquecer quem eu sou.','Você já reparou que o poste pisca igual respiração?'],
  at2:()=>{if(!S.flags.key){S.flags.key=1;return'Sebastião enfia uma chave enferrujada na mão de Brandão: “Quarto 3 da pensão. Lê a parede. Eu escrevi pra não esquecer.”'}}},
 davi:{name:'Davi Valente',opts:[['Vocês estão bem?','Você e a Lia estão bem? Quero proteger vocês.'],['Sinto muito','Sinto muito pela sua mãe. De verdade.'],['Você é corajoso','Você está cuidando da sua irmã como um homem. Obrigado por confiar em mim.'],['O moço da janela','Quem é o moço do chapéu que aparece na janela à noite?','keep'],['Pressionar','Fala logo o que você sabe, garoto.','bad']],persona:'Menino de 12 anos, sério, perdeu os pais, protege a irmã Lia, desconfia de adultos, fala pouco e direto. Não acredita que não existe.',
  secret:'o moço do chapéu se chama Joaquim; aparecia na janela à noite contando histórias; disse que papai e mamãe eram personagens que tinham acabado, mas que com as crianças não adianta porque criança já sabe que é de verdade.',
  topics:/moço|chapéu|homem|quem|janela|noite|pai|mãe|história|nome/,clue:'davi',
  reveal:'O nome dele é Joaquim. Ele vinha na janela de noite contar história. Disse que o papai e a mamãe eram personagens que tinham acabado. E que comigo e com a Lia não adianta, porque criança já sabe que é de verdade.',
  intro:'Você é o detetive que não salvou minha mãe.',
  good:['…Tá. Você pode ficar.','A Lia gosta de você. Ela não gosta de quase ninguém.'],
  bad:['Sai daqui. Adulto só sabe perguntar.','Eu não vou chorar na sua frente.'],
  low:['Eu não falo com estranho. Minha mãe ensinou.'],
  neutral:['Eu cuido da Lia agora.','A casa ficou grande demais.','A tia dorme o dia inteiro. Eu faço o café.']},
 clara:{name:'Irmã Clara',opts:[['As crianças','Como estão as crianças, irmã? Sinto muito por tudo.'],['Não é culpa sua','A senhora não tem culpa. Estou aqui pra ajudar a achar a Nina.'],['Com licença','Com licença, irmã. Obrigado por me receber.'],['A Nina e o gato','A Nina falava de alguém? De um gato? De um moço?','keep'],['Pressionar','A senhora deixou uma criança sumir.','bad']],persona:'Freira de 60 anos, firme, protetora das crianças, culpada por não ter visto Nina sair; desconfia de homens que fazem perguntas demais, mas cede a quem demonstra cuidado genuíno com as crianças.',
  secret:'Nina vivia falando de um gato branco que “o moço do domingo” prometeu mostrar; o moço é o fornecedor de verduras que conta histórias às crianças; Nina escondeu um desenho de moinho com um gato debaixo do colchão.',
  topics:/nina|gato|domingo|moço|desenho|quem|história|verdura|visita/,clue:'clara',
  reveal:'Nina só falava de um gato branco que o moço do domingo prometeu mostrar. O moço das verduras, que conta histórias pras crianças. Debaixo do colchão dela achei isto: um moinho com um gato em cima.',
  intro:'O senhor é o detetive? Fale baixo. As crianças estão assustadas, e eu também.',
  good:['Obrigada por perguntar das crianças primeiro.','Deus manda cada pessoa na hora certa. Talvez o senhor seja uma delas.'],
  bad:['Não admito esse tom nesta casa.','O senhor quer culpados. Eu quero a Nina.'],
  low:['Há coisas que eu só conto a quem eu confio, detetive.'],
  neutral:['Nina tem sete anos e uma imaginação do tamanho do céu.','Rezo por ela a cada hora.']},
 rosa:{name:'Dona Rosa',opts:[['Elogiar','O cheiro dessa cozinha lembra a da minha avó. A senhora cozinha muito bem, obrigado pelo café.'],['Acalmar','Calma, dona Rosa. Ninguém está acusando a senhora, quero ajudar.'],['Os netos','A senhora tem filhos? Netos? Deve sentir muito pelas crianças.'],['As verduras','Quem entrega as verduras e onde elas ficam guardadas?','keep'],['Pressionar','A senhora envenenou a sopa?','bad']],persona:'Cozinheira do orfanato há 30 anos, falante, nervosa, culpada pelas crianças doentes; tem medo de perder o emprego; gosta de quem elogia a comida ou pergunta da família dela.',
  secret:'as verduras da Boa Vista chegam bonitas por fora e podres por dentro; o seu Joaquim guarda os caixotes no armário dele, na cozinha, uma semana, e pediu pra ela não contar às irmãs; ele fica conversando sozinho com as panelas.',
  topics:/verdura|caixote|armário|joaquim|quem|entrega|fornecedor|sopa|estrag|podre/,clue:'rosa',
  reveal:'As verduras da Boa Vista chegam bonitas por fora e pretas por dentro. O seu Joaquim guarda os caixotes naquele armário uma semana inteira e me pediu pra não contar às irmãs. E ele fica aqui, conversando com as panelas…',
  intro:'Ai, meu Deus, polícia. Eu não pus nada na sopa, eu juro pela minha mãe!',
  good:['O senhor é um amor. Quer um café? Pelo menos o café ninguém estraga.','Trinta anos nessa cozinha e nunca uma criança passou mal. Nunca!'],
  bad:['Eu? Envenenar criança? O senhor tá doido!','Vou chamar a Irmã Clara!'],
  low:['Não sei de nada não, senhor. Eu só cozinho.'],
  neutral:['A sopa de domingo leva verdura da fazenda. Sempre levou.','Minha mãe dizia: comida boa é comida olhada.','Tenho três netos. O mais novo quer ser detetive, acredita?']}};

/* ---------- o homem de chapéu, em toda cena ---------- */
const FARMER={1:['Noite fria, detetive. Gato sempre volta pra quem dá de comer.','Eu? Só passando. Trouxe verdura pra feira de amanhã.','O senhor acredita em tudo que vê? Eu acredito no que me contam direito.'],
 2:['Verdura fresca, detetive? Da Boa Vista. Faz bem pra cabeça.','O moço ali grita porque ninguém conversa com ele direito.'],
 3:['Boa noite. Estrada perigosa pra quem anda pensando demais.'],
 4:['Trago as verduras de domingo. As crianças gostam das minhas histórias.','Nina? Menina esperta. Essa sabe que existe.'],
 5:['Sopa boa é sopa olhada, como dizia a mãe da dona Rosa.']};
const FB2=['Já vi esse rosto. Não lembro onde. Isso me incomoda mais que o caso.','Some no escuro como se fizesse parte do cenário.','Terra vermelha nas botas. Ou é a luz.'];
function farmer(){const L=FARMER[S.ch]||['…'];const i=S.flags['f'+S.ch]=(S.flags['f'+S.ch]||0)+1;say([['Homem de chapéu',L[(i-1)%L.length]],B(FB2[(i-1)%FB2.length])])}
const farm=(x,dim)=>({x,o:P.FARM,dim:dim||.5});

/* ---------- cenas ---------- */
G.SC={
office:{name:'Delegacia',w:320,
 npcs:()=>S.flags.paiva?[{x:226,o:P.PAIVA}]:[],
 fx:(X,cx,t,fl)=>{G.glow(X,197-cx,96,46,'220,230,150',.28*fl+.05);for(let i=0;i<6;i++)rect(X,20+((t*.7+i*13)%56)-cx,28+((t*1.7+i*29)%54),1,3,'rgba(140,170,200,.6)');
  if(!S.coat){rect(X,91-cx,64,10,30,'#8a6a4c');rect(X,90-cx,60,12,2,'#3a2e24');rect(X,93-cx,57,6,3,'#3a2e24')}
  if(S.flags.ring&&(t>>3)%2)rect(X,138-cx,98,6,2,'#e8d9a0')},
 hot:[
  {x:141,l:'Telefone',when:ch(0),a:()=>{if(S.flags.phone)return say([B('Silêncio. Ele sempre toca na pior hora.')]);S.flags.ring=0;S.flags.phone=1;
   run([['Telefone','Trrrim. Trrrim.'],['Delegado Paiva','Brandão. Os Valente. Família importante, você sabe. O gato deles sumiu faz uma semana.'],B('Um gato, delegado?'),
    ['Delegado Paiva','Desde que o bicho sumiu, os quatro estão estranhos. O pai não sai do quarto. A mãe diz pra empregada que é um desenho. As crianças… normais. Normais demais.'],
    ['Delegado Paiva','Vai lá hoje. Rua dos Valente, a casa da pichação. E Brandão… sem escândalo.'],B('Clique. Ninguém chama detetive por causa de gato. Vamos, {nome}. Casaco primeiro.')])}},
  {x:96,l:'Casaco no cabide',when:()=>!S.coat,a:()=>run([B('O casaco. Pesa mais do que parece: tem vinte anos de bolso aqui dentro.'),()=>{S.coat=true;S.actor='DET'},{wait:500},B('Chapéu. Carteira. Distintivo. O bilhete da M. Pode olhar, {nome}. Eu não escondo nada de você.')],()=>G.openPan('pWallet'))},
  {x:284,l:'Quadro de casos',a:()=>say([['Quadro','Caso 1 · Família Valente — aberto.'],['Quadro',`Caso 2 · O homem que gritava — ${S.ch>2?'resolvido':'sem ficha ainda'}.`],['Quadro',`Caso 3 · Criança desaparecida — ${S.ch>4?'resolvido':'sem ficha ainda'}.`],['Quadro',`Caso 4 · Comida do orfanato — ${S.ch>5?'resolvido':'sem ficha ainda'}.`],['Quadro','Arquivo #5 · Sem registro. Sem foto. Só uma anotação minha, que eu não lembro de ter escrito: “alguém está sempre olhando”.'],B('…Eu não lembro de ter escrito isso, {nome}.')])},
  {x:48,l:'Janela',a:()=>say([B('Vila Serena chove como quem pede desculpa. Lá embaixo, ninguém olha pra cima.')])},
  {x:248,l:'Arquivo de aço',a:()=>say([B('Vinte e dois anos de casos. Todos com começo, meio e fim. Esse aqui não parece ter fim. Parece ter plateia.')])},
  {x:308,l:'Porta',a:()=>{if(S.ch!==0)return say([B('Agora não. O caso está lá fora.')]);if(!S.flags.phone)return say([B('Ainda não. O telefone.')]);if(!S.coat)return say([B('Lá fora chove. E eu não saio sem casaco.')]);G.startCh(1)}}]},
street:{name:'Rua dos Valente',w:520,rain:true,
 npcs:()=>{if(S.ch===1)return[farm(506)];if(S.ch===7&&!S.burnt){const a=[{x:S.flags.liaOut?185:300,o:P.DAVI},{x:214,o:P.VIZ},{x:236,o:{...P.VIZ,coat:'#3a4a3a',hair:'#8a8a8a'}},farm(478,.45)];if(S.flags.liaOut)a.push({x:170,o:P.LIA});return a}return[]},
 fx:(X,cx,t,fl)=>{if(!S.fire)G.cone(X,271-cx,S.burnt?.5:fl);
  if(S.ch===1){if(!G.has('bota')){rect(X,327-cx,146,6,2,'#5a221c');rect(X,328-cx,144,4,2,'#5a221c')}if(!G.has('jornal')){rect(X,386-cx,147,9,3,'#b8b2a0');rect(X,387-cx,148,6,1,'#6a6658')}if(!G.has('coleira'))rect(X,460-cx,141,4,2,(t>>4)%2?'#c03028':'#80201c')}},
 over:(X,cx,t)=>{if(S.fire)G.fire(X,cx,t);if(S.burnt&&!S.fire){X.fillStyle='rgba(10,8,6,.55)';X.fillRect(0-cx,0,252,140)}},
 hot:[
  {x:112,l:'Porta dos Valente',when:ch(1),a:()=>go('room',292,null,{face:-1})},
  {x:192,l:'Pichação',when:ch(1),a:()=>found('grafite',[B('“QUEM TE VÊ?”… Tinta ainda grudando no dedo. Foi feita depois do sumiço.'),B('Não é ameaça. É pergunta. Pergunta é pior: a gente leva pra casa.')])},
  {x:256,l:'Poste',when:ch(1),a:()=>say([B('Esse poste pisca no mesmo ritmo há uma semana. Parece uma respiração. Ninguém da prefeitura veio.')])},
  {x:330,l:'Marca no chão',when:ch(1),a:()=>found('bota',[B('Bota número 43. Terra vermelha, ainda úmida. Isso não é poeira de cidade.')])},
  {x:390,l:'Jornal molhado',when:ch(1),a:()=>found('jornal',[B('O jornal de hoje. Circularam “família”. Não “gato”. Família.')])},
  {x:458,l:'Sacos de lixo',when:ch(1),a:()=>found('coleira',[B('Debaixo dos sacos… uma coleira. MINGAU, 0714. Quatro números numa plaquinha de gato. Guardei.')])},
  {x:506,l:'Homem de chapéu',when:ch(1),a:farmer}]},
room:{name:'Casa dos Valente',w:320,
 npcs:()=>S.ch===1?[{x:92,o:P.LIA},{x:248,o:P.HEL,face:-1}]:S.ch===3?[{x:92,o:P.LIA},{x:170,o:P.DAVI}]:[],
 fx:(X,cx,t,fl)=>{G.glow(X,288-cx,86,90,'255,210,140',.33*fl);if(S.ch>=3){rect(X,244-cx,108,3,4,'#c8c0d8');rect(X,248-cx,107,3,4,'#e8d8a0');rect(X,252-cx,108,3,4,'#c8c0d8');rect(X,247-cx,111,6,6,'#3a5a3a')}},
 enter:()=>{if(S.ch===1)say([B('Casa grande, silêncio caro. Repara: ninguém olha pra gente. Olham através da gente.'),['Helena','Detetive. O senhor veio pelo gato… ou por nós?']]);
  else if(S.ch===3)say([B('A poltrona da Helena ficou com flores. As crianças não sentam nela.'),['Davi','…Você de novo.']])},
 hot:[
  {x:304,l:'Sair para a rua',when:ch(1),a:()=>go('street',112)},
  {x:304,l:'Voltar à estrada velha',when:ch(3),a:()=>go('estrada',30,null,{face:1})},
  {x:50,l:'Janela',when:ch(1),a:()=>found('janela',[B('Arranhões… do lado de fora do vidro. Gato que foge arranha por dentro.')])},
  {x:64,l:'Tigela do gato',when:ch(1),a:()=>found('tigela',[B('Ração fresca. Disseram que ninguém toca nisso há sete dias. Alguém está mentindo — ou alguém de fora entra aqui.')])},
  {x:92,l:'Lia, a filha',when:chs(1,3),a:lia},
  {x:131,l:'Retrato da família',when:ch(1),a:()=>found('retrato',[B('Augusto, Helena, Davi e Lia. Rasparam os olhos dos pais. Só dos pais. Isso não é vandalismo, é escolha.')])},
  {x:131,l:'Retrato da família',when:ch(3),a:()=>say([B('Os olhos raspados agora parecem uma previsão. Faltam duas pessoas nessa casa.')])},
  {x:170,l:'Davi',when:ch(3),a:()=>G.openNpc('davi')},
  {x:248,l:'Helena Valente',when:ch(1),a:()=>G.openNpc('helena')},
  {x:252,l:'Poltrona da Helena',when:ch(3),a:()=>say([B('Flores secas. Ainda tem o cheiro dela. Eu devia ter voltado, {nome}.')])},
  {x:288,l:'Cômoda trancada',when:ch(1),a:()=>G.has('bilhete')?say([B('Gaveta vazia agora. Só o cheiro de feno ficou.')]):G.codeLock({title:'Cômoda trancada',desc:'Cadeado de 4 números, arranhado de tanto tentarem.',code:'0714',ok:()=>found('bilhete',[B('Zero, sete, um, quatro. A plaquinha do gato abriu a gaveta da família. Dentro: feno… e um bilhete.'),['Bilhete','“Vocês só existem enquanto alguém olha.”']])})}]},
praca:{name:'Praça da Matriz',w:480,rain:true,
 npcs:()=>S.ch===2?[{x:240,o:P.SEB},farm(380)]:[],
 fx:(X,cx,t,fl)=>{G.cone(X,186-cx,fl);G.cone(X,316-cx,1);for(let i=0;i<5;i++)rect(X,232+i*4-cx,104+((t/2+i*5)%22),1,2,'#7a9ab0');for(let i=0;i<8;i++)rect(X,212+((t*.5+i*8)%56)-cx,129,3,1,'#5a7a90')},
 enter:()=>{},
 hot:[
  {x:94,l:'Banca de jornal',when:ch(2),a:()=>found('jornal2',[B('“Augusto Valente encontrado morto na estrada velha.” Sem violência, diz o legista. Só um homem que andou até parar.')])},
  {x:172,l:'Cartaz no poste',when:ch(2),a:()=>found('cartaz',[B('O cartaz do Mingau. E embaixo, a lápis: “ELE ESTÁ BEM ALIMENTADO”. Alguém está brincando com a gente.')])},
  {x:240,l:'Sebastião',when:ch(2),a:()=>{if(S.flags.qSeb)return G.openNpc('seb');S.flags.qSeb=1;run([['Sebastião','ELE TE MANDOU! SAI DAQUI!'],{qte:{from:'upright',kind:'bottle',dodge:-1,ok:'Uma garrafa passou zunindo do lado da minha orelha. Calma, Sebastião.',fail:'A garrafa estourou no meu ombro. Calma, Sebastião. Calma.'}},['Sebastião','…Você desviou. Ele nunca desvia. Você… é de verdade?']],()=>G.openNpc('seb'))}},
  {x:336,l:'Banco da praça',when:ch(2),a:()=>found('panfleto',[B('Um panfleto molhado: verduras da Fazenda Boa Vista, parte doada ao Orfanato Santa Luzia aos domingos.'),B('Boa Vista. Guarda esse nome, {nome}.')])},
  {x:380,l:'Vendedor de verduras',when:ch(2),a:farmer},
  {x:451,l:'Porta da pensão',when:ch(2),a:()=>S.flags.key?go('pensao',30,null,{face:1}):say([B('Trancada. O dono disse que só o Sebastião tem a chave do quarto dele.'),B('Ganhar a chave vai exigir ganhar ele.')])}]},
pensao:{name:'Pensão · Quarto 3',w:320,
 fx:(X,cx,t,fl)=>{G.glow(X,160-cx,34,70,'255,230,160',.35*fl);rect(X,158-cx,30,3,4,fl>.5?'#fff3c4':'#6a6040')},
 enter:()=>say([B('Quarto 3. As paredes são um caderno. Um homem escreveu aqui pra não se perder de si mesmo.')]),
 hot:[
  {x:12,l:'Voltar à praça',a:()=>go('praca',451,null,{face:-1})},
  {x:90,l:'Parede escrita',a:()=>G.has('parede')?say([B('B-O-A-V-I-S-T-A. Ele escreveu o nome do lugar de onde fugiu.')]):G.wordPuz({title:'A parede',desc:'Entre centenas de rabiscos, oito linhas foram escritas com cuidado. Algumas letras estão em vermelho. Qual palavra elas formam?',
   html:'<div class="wall"><em>B</em>ate na porta toda noite<br><em>O</em>lha nos olhos e sorri<br><em>A</em> voz é mansa, nunca grita<br><em>V</em>ai dizendo que a gente é sonho<br><em>I</em>nsiste até a gente concordar<br><em>S</em>ebastião, não esquece quem você é<br><em>T</em>erra vermelha na bota dele<br><em>A</em>corda. Você existe.</div>',answer:'BOAVISTA',
   ok:()=>found('parede',[B('Boa Vista. A fazenda do panfleto. Ele escreveu o nome em pedaços, pra ninguém ler de uma vez.')])})},
  {x:125,l:'Rádio velho',a:()=>G.has('radio')?say([B('Desliguei. Prefiro o silêncio a essa voz.')]):G.pathPuz({title:'Rádio velho',desc:'O dial está solto. Em qual estação sintonizar?',opts:['88.1','93.5','101.3'],correct:1,
   ok:()=>found('radio',[['Rádio','…você já reparou que ninguém te olha de verdade? Que as pessoas falam com você como quem lê um papel…'],B('Uma voz calma. Gravada. Repetindo sem parar numa rádio que não existe no jornal.')]),
   bad:()=>say([['Rádio','Chhhhhhhh…'],B('Só chiado. E por baixo, alguém respirando? Não. Só chiado.')])})},
  {x:161,l:'Foto na parede',a:()=>found('foto',[B('Peões da Boa Vista, 1971. O homem de chapéu no centro teve o rosto raspado com unha.'),B('No verso, a lápis: “Rádio da fazenda, 93.5”.')])},
  {x:230,l:'Cama',a:()=>say([B('Lençol esticado demais. Quem tem medo arruma a cama pra provar que ainda manda em alguma coisa.')])},
  {x:272,l:'Botas debaixo da cama',a:()=>found('botas2',[B('Terra vermelha seca. Sebastião também andou na Boa Vista. Ele não é suspeito, {nome}: é sobrevivente.')])}]},
estrada:{name:'Estrada Velha',w:560,
 npcs:()=>S.ch===3?[farm(530,.3)]:[],
 fx:(X,cx,t)=>{if(!G.has('lanterna'))G.glow(X,360-cx,146,24,'255,230,150',.35);rect(X,357-cx,144,6,3,'#3a3a3a');
  for(const[a,b]of[[256,160],[262,159],[268,161],[274,160],[280,159],[286,161],[292,160]]){rect(X,a-cx,b,4,1,'#9a5a3a');rect(X,a+1-cx,b-2,1,3,'#9a5a3a')}
  if(!G.has('gravador')&&(t>>5)%2)rect(X,452-cx,118,2,1,'#e8d9a0')},
 hot:[
  {x:10,l:'Voltar para a cidade',when:ch(3),a:()=>go('room',290,null,{face:-1})},
  {x:142,l:'Cerca de arame',when:ch(3),a:()=>found('palha',[B('Fios de palha trançada presos no arame. Palha de chapéu. Alguém ficou parado aqui, encostado, olhando.')])},
  {x:205,l:'Marcas na terra',when:ch(3),a:()=>found('carroca',[B('Rodas finas. Carroça. Ida e volta. Ninguém mais anda de carroça na cidade, {nome}.')])},
  {x:274,l:'Inscrição no chão',when:ch(3),a:()=>found('inscricao',[B('“EU NUNCA EXISTI.” Escrito com graveto.'),B('As letras são retas, calmas. Um homem desesperado não escreve assim. A mesma mão do bilhete da gaveta.')])},
  {x:360,l:'Lanterna caída',when:ch(3),a:()=>found('lanterna',[B('A lanterna do Augusto. Ainda acende. Ele não estava fugindo. Estava procurando alguém.')])},
  {x:452,l:'Brilho no milharal',when:ch(3),a:()=>G.has('gravador')?say([B('A fita ainda está no bolso. Pesa como uma confissão.')]):G.orderPuz({title:'Gravador no milharal',desc:'A fita se partiu em quatro trechos. Monte na ordem em que a conversa aconteceu.',
   items:['Augusto… você já reparou que ninguém te olha nos olhos?','Sua mulher fala com você como quem lê um papel.','Talvez vocês sejam só uma história que alguém está contando.','E histórias acabam, Augusto. Venha até a estrada ver.'],
   ok:()=>found('gravador',[['Fita','“…E histórias acabam, Augusto. Venha até a estrada ver.”'],B('Ninguém empurrou o Augusto. Ele veio andando. Convencido.')])})},
  {x:530,l:'Vulto no milharal',when:ch(3),a:()=>{farmer();S.flags.vulto=1}}]},
orfanato:{name:'Orfanato Santa Luzia',w:480,
 npcs:()=>S.ch===4?[{x:230,o:P.CLARA},farm(338)]:S.ch===5?[{x:230,o:P.CLARA}]:[],
 fx:(X,cx,t,fl)=>{for(const[x,y]of[[148,96],[308,56],[348,96]])G.glow(X,x+8-cx,y,14,'255,220,150',.25*fl);
  const sw=Math.sin(t/25)*6;G.line(X,440-cx,90,440+sw-cx,124,'#5a5a5a');G.line(X,456-cx,90,456+sw-cx,124,'#5a5a5a');rect(X,438+sw-cx,124,20,2,'#5a3a22');
  if(S.ch===4&&!G.has('fita'))rect(X,456+sw-cx,108,2,3,'#c03028');
  const w='#e8e4dc';rect(X,96-cx,118,10,4,w);rect(X,104-cx,114,4,4,w);rect(X,104-cx,113,1,1,w);rect(X,107-cx,113,1,1,w);rect(X,94-cx,114,1,4,w);rect(X,98-cx,108,12,1,w);rect(X,101-cx,106,6,2,w);G.line(X,112-cx,120,118-cx,120,w);rect(X,116-cx,119,1,3,w)},
 enter:()=>{if(S.ch===5)say([B('O pátio vazio. As crianças estão na enfermaria. A cozinha fica pela porta principal.')])},
 hot:[
  {x:230,l:'Irmã Clara',when:ch(4),a:()=>G.openNpc('clara')},
  {x:230,l:'Irmã Clara',when:ch(5),a:()=>say([['Irmã Clara','Vá à cozinha, detetive. Dona Rosa está desesperada.']])},
  {x:106,l:'Desenho no muro',when:ch(4),a:()=>found('giz',[B('Giz branco: um gato, um chapéu de palha e uma seta apontando pros fundos.'),B('Criança desenha o que quer que alguém veja.')])},
  {x:448,l:'Balanço',when:ch(4),a:()=>found('fita',[B('Uma fita vermelha presa na corrente. Ela saiu brincando, {nome}. Não fugindo.')])},
  {x:305,l:'Caixotes',when:ch(4),a:()=>found('caixas',[B('“FAZENDA BOA VISTA — DOAÇÃO DE DOMINGO.” Domingo. O dia em que ela sumiu.')])},
  {x:338,l:'Entregador',when:ch(4),a:farmer},
  {x:261,l:'Porta principal',when:ch(4),a:()=>say([B('As irmãs pediram pra eu não assustar as crianças lá dentro. O que eu procuro está aqui fora.')])},
  {x:261,l:'Porta da cozinha',when:ch(5),a:()=>go('cozinha',22,null,{face:1})},
  {x:474,l:'Portão dos fundos',when:ch(4),a:()=>G.has('giz')?go('bosque',14,null,{face:1}):say([B('Os fundos dão pro bosque. Ainda não tenho motivo pra entrar ali.')])}]},
bosque:{name:'Bosque',w:560,zones:[{id:'qBranch',x:300,when:ch(4),a:()=>run([B('…Ouviu isso? Lá em cima.'),{qte:{from:'up',kind:'branch',dodge:1,ok:'Um galho podre, do tamanho de um homem. Esse bosque não quer visita.',fail:'O galho me pegou de raspão. Tô bem. Acho.'}}])}],
 npcs:()=>S.ch===4&&S.flags.path&&!S.flags.ninaOk?[{x:532,o:P.NINA,face:-1}]:[],
 fx:(X,cx,t)=>{G.blades(X,511-cx,62,16,t/90,'#3a3430');for(let i=0;i<8;i++){const fx=(i*73+t*.2)%560-cx,fy=90+Math.sin(t/40+i)*20;if((t+i*9)%60<40)rect(X,fx,fy,1,1,'#c8d070')}
  for(const[id,x]of[['mapa1',120],['mapa2',250],['mapa3',366]])if(!G.has(id))rect(X,x-cx,146,4,3,'#d8d0b8')},
 over:(X,cx,t)=>{for(let i=0;i<4;i++){X.fillStyle='rgba(180,190,190,.07)';X.fillRect(((t*.15*(i+1))%640)-200-cx*.5,96+i*12,320,10)}},
 enter:()=>say([B('Bosque. A neblina apaga o caminho a três passos. Se a Nina deixou rastro, foi de criança: no chão.')]),
 hot:[
  {x:8,l:'Voltar ao pátio',a:()=>go('orfanato',470,null,{face:-1})},
  {x:120,l:'Papel no chão',when:()=>!G.has('mapa1'),a:()=>found('mapa1',[B('Pedaço de um mapa desenhado a giz de cera. Uma árvore torta com “NÃO” escrito em cima.')])},
  {x:250,l:'Papel na raiz',when:()=>!G.has('mapa2'),a:()=>found('mapa2',[B('Outro pedaço: um rio riscado com um X enorme.')])},
  {x:366,l:'Papel no galho',when:()=>!G.has('mapa3'),a:()=>found('mapa3',[B('O último: um moinho, um gato em cima e um coração. Ela sabia pra onde ia.')])},
  {x:430,l:'Bifurcação',when:()=>!S.flags.path,a:()=>{const all=['mapa1','mapa2','mapa3'].every(G.has);
   G.pathPuz({title:'Bifurcação',desc:all?'Três trilhas somem na neblina. O mapa da Nina está inteiro no seu bolso.':'Três trilhas. Sem o mapa inteiro, é chute — e chute custa tempo.',opts:['Pela árvore torta','Pela beira do rio','Pela trilha do moinho'],correct:2,
    ok:()=>{S.flags.path=1;say([B('O moinho. Gira sem vento. Tem uma silhueta pequena lá embaixo.')])},
    bad:()=>{S.wrong++;G.addDay(1);say([B('A trilha dá voltas e me devolve pro mesmo lugar. Perdi a noite inteira.'),['Caderno',`Dia ${S.day} de 30.`]])}})}},
  {x:532,l:'Nina',when:()=>S.flags.path&&!S.flags.ninaOk,a:()=>{found('nina',[['Nina','Oi, moço. Você também veio ver o gato?'],B('Nina. Tá tudo bem. Você tá com frio?'),['Nina','O moço do chapéu disse que o gato branco ia me esperar aqui. Mas ele não veio.'],['Nina','Ele disse que eu não existo. Que eu sou desenho. Eu ri.'],['Nina','Eu sei que eu sou de verdade. Criança sabe.'],B('Ela tem uma boneca de palha no colo. Trançada igual a um chapéu. Vamos pra casa, Nina.')],()=>{S.flags.ninaOk=1})}}]},
cozinha:{name:'Cozinha do orfanato',w:320,
 npcs:()=>S.ch===5?[{x:150,o:P.ROSA}]:[],
 fx:(X,cx,t,fl)=>{G.glow(X,160-cx,40,90,'255,240,200',.22*fl);for(let i=0;i<3;i++)rect(X,150+i*5-cx,100-((t/3+i*7)%14),1,2,'rgba(220,220,220,.5)');
  if(S.ch===5){X.globalAlpha=.6;rect(X,126-cx,40,8,8,'#9a7a5a');rect(X,123-cx,38,14,2,'#a88a48');rect(X,126-cx,36,8,2,'#a88a48');X.globalAlpha=1}},
 hot:[
  {x:10,l:'Voltar ao pátio',a:()=>go('orfanato',261,null,{face:1})},
  {x:120,l:'Janela',when:ch(5),a:()=>{say([['Homem de chapéu','…'],B('Um rosto na janela, de chapéu. Pisquei e sumiu. Só ficou o vapor da sopa no vidro.')])}},
  {x:150,l:'Dona Rosa',when:ch(5),a:()=>G.openNpc('rosa')},
  {x:197,l:'Caderno sobre a mesa',when:ch(5),a:()=>found('ledger',[B('Caderno de entregas. Primeira entrega da Boa Vista: 13 de novembro. Assinado só com um J.'),B('Treze, onze. Dia e mês.')])},
  {x:233,l:'Caixotes',when:ch(5),a:()=>found('carimbo',[B('Carimbo de colheita: 13/11. A noite em que o Mingau sumiu.')])},
  {x:270,l:'Despensa',when:ch(5),a:()=>found('podre',[B('Repolhos perfeitos por fora. Abro um: preto por dentro.'),B('Não é veneno, {nome}. É tempo. Alguém deixou apodrecer de propósito, bonito por fora.')])},
  {x:302,l:'Armário trancado',when:ch(5),a:()=>G.has('caderno')?say([B('Vazio. Só o cheiro de terra.')]):G.codeLock({title:'Armário do seu Joaquim',desc:'Cadeado de 4 números. Riscado na madeira: “dia e mês”.',code:'1311',
   ok:()=>found('caderno',[B('Dentro: terra vermelha em vidros… e um caderno.'),['Caderno de conversas','Augusto ✓. Helena ✓. Sebastião ✗ (fugiu). Rosa —.'],['Caderno de conversas','Brandão: ?'],['Caderno de conversas','E na última linha, a letra tremida: “quem está olhando”.']])})}]},
fazenda:{name:'Fazenda Boa Vista',w:560,zones:[{id:'qDog',x:420,when:ch(6),a:()=>run([['Caderno','Um rosnado, vindo do escuro do celeiro.'],{qte:{from:'right',kind:'dog',dodge:-1,ok:'Um cão de guarda. Passou reto e sumiu atrás do poço. Alguém soltou ele de propósito.',fail:'O cão me derrubou e sumiu no escuro. Alguém soltou ele de propósito.'}}])}],
 fx:(X,cx,t,fl)=>{G.blades(X,100-cx,48,22,t/60,'#5a5a5a');if((t>>6)%3)G.glow(X,208-cx,93,18,'255,210,120',.3);
  if(!S.flags.scare){const sx=330-cx;rect(X,sx,96,2,44,'#4a3a26');rect(X,sx-12,104,26,2,'#4a3a26');rect(X,sx-5,104,12,16,'#6a3a2a');rect(X,sx-3,96,8,8,'#b8a070');rect(X,sx-6,95,14,1,'#a88a48');rect(X,sx-3,92,8,3,'#a88a48');rect(X,sx-1,99,1,1,'#111');rect(X,sx+2,99,1,1,'#111')}
  else{rect(X,330-cx,104,2,36,'#4a3a26');rect(X,318-cx,108,26,2,'#4a3a26')}
  if(S.ch===6&&S.flags.smoke){X.fillStyle='rgba(255,120,40,.18)';X.fillRect(0,60,40,40)}},
 enter:()=>{},
 hot:[
  {x:36,l:'Porteira',when:ch(6),a:()=>found('placa',[B('“Fazenda Boa Vista — desde 1931.” Quase cem anos de gente conversando aqui dentro.')])},
  {x:100,l:'Moinho',a:()=>say([B('O moinho gira. Não tem vento. Eu molho o dedo e levanto: nada.')])},
  {x:238,l:'Casa da fazenda',a:()=>say([B('Trancada, luz quase apagada. Na varanda, uma cadeira de balanço ainda balança.'),B('Ele não está em casa. Ou quer que eu pense isso.')])},
  {x:330,l:'Espantalho',when:()=>!S.flags.scare,a:()=>{S.flags.scare=1;say([B('Um espantalho com chapéu de palha novinho. Os outros espantalhos da estrada não têm chapéu.'),B('Por um segundo achei que ele piscou.'),['Caderno','Quando Brandão vira as costas, alguma coisa range.']])}},
  {x:330,l:'Onde estava o espantalho',when:()=>!!S.flags.scare,a:()=>say([B('Só a cruz de madeira. E pegadas de bota 43, frescas, indo pro celeiro.'),B('Ele esteve aqui o tempo todo, {nome}. Do nosso lado.')])},
  {x:390,l:'Carroça',when:ch(6),a:()=>found('roda',[B('As rodas batem com as marcas da estrada velha. Terra vermelha seca nos raios.')])},
  {x:441,l:'Poço',a:()=>say([B('Fundo. Escuro. Ouço um miado lá embaixo? Não. É o vento. Tomara que seja o vento.')])},
  {x:512,l:'Celeiro',when:ch(6),a:()=>S.flags.barn?go('celeiro',300,null,{face:-1}):G.codeLock({title:'Celeiro',desc:'Cadeado novo, de 4 números. Gravado no metal: “o ano em que tudo começou”.',code:'1931',ok:()=>{S.flags.barn=1;go('celeiro',300,null,{face:-1})}})}]},
celeiro:{name:'Celeiro',w:320,zones:[{id:'qFork',x:230,a:()=>run([B('Tem alguma coisa presa no alto, na viga…'),{qte:{from:'up',kind:'fork',dodge:1,ok:'Um forcado, amarrado pra cair em quem entrasse. Uma armadilha. Ele esperava visita.',fail:'O cabo do forcado me acertou. Uma armadilha. Ele esperava visita.'}}])}],
 fx:(X,cx,t,fl)=>{G.glow(X,160-cx,26,80,'255,210,130',.32*fl);rect(X,157-cx,22,6,6,'#3a3a3a');rect(X,158-cx,23,4,4,fl>.5?'#ffd27a':'#8a6a30');
  for(const[x,y]of[[236,52],[252,66],[270,48],[284,72]])rect(X,x-cx,y,2,2,'#b23a2e');rect(X,297-cx,44,2,2,(t>>4)%2?'#ff5040':'#b23a2e')},
 enter:()=>say([B('O celeiro. Cheira a feno, tinta e uma coisa que eu não sei nomear. Paciência, talvez.')]),
 hot:[
  {x:308,l:'Sair',a:()=>go('fazenda',512,null,{face:-1})},
  {x:35,l:'Fardos de feno',a:()=>say([B('Feno. O mesmo do bilhete na gaveta dos Valente.')])},
  {x:100,l:'Bancada',a:()=>found('ferramentas',[B('Uma máquina de escrever. O “a” sai torto, igual ao do bilhete.'),B('Latas de tinta vermelha e preta: as cores da pichação. E um gravador, com fitas etiquetadas: AUGUSTO. HELENA. SEBASTIÃO.')])},
  {x:177,l:'Gaiola',a:()=>found('gaiola',[B('Gaiola aberta. Pelo branco nas grades. Uma tigela limpa, ração fresca.'),B('O Mingau esteve aqui. Bem cuidado. “Bem alimentado”, como dizia o cartaz.')])},
  {x:205,l:'Botas',a:()=>found('bota43',[B('Botas 43, terra vermelha. Iguais à pegada da rua dos Valente. O mesmo homem, em todas as cenas.')])},
  {x:258,l:'Mapa na parede',a:()=>found('mapa',[B('Mapa da cidade com alfinetes vermelhos: casa Valente, pensão, orfanato… delegacia.'),B('E um alfinete fora do papel, espetado na moldura. Etiqueta: “quem joga”.'),B('{nome}… ele sabe de você.')])}]},
casaj:{name:'Casa da fazenda',w:440,
 fx:(X,cx,t,fl)=>{G.glow(X,375-cx,98,70,'255,210,140',.3*fl);for(let i=0;i<30;i++)rect(X,394+Math.random()*28-cx,116+Math.random()*20,1,1,Math.random()<.5?'#c8e0d8':'#5a7a70');G.glow(X,408-cx,126,40,'160,220,210',.18);
  if(S.flags.hatOff){rect(X,229-cx,62,14,1,'#a88a48');rect(X,233-cx,58,6,4,'#a88a48')}
  if(S.sit){G.sit(X,346-cx,128,P.FARMNH,S.front);if(S.catLap)G.cat(X,347-cx,125,1)}}}};

function lia(){const L=S.ch===1?['Mamãe diz que a gente é desenho. Eu acho que a gente é sonho de alguém.','O moço do chapéu deu leite pro Mingau. Ele é legal. Ele sabe o seu nome.','Você tá sendo olhado também, sabia?']
 :['A mamãe virou céu. O Davi disse que é mentira, mas o céu tá mais bonito.','O moço do chapéu passou na janela ontem. Perguntou de você, detetive.','Eu sei que eu existo. Eu belisquei. Doeu.'];
 const i=S.flags['lia'+S.ch]=(S.flags['lia'+S.ch]||0)+1;say([['Lia',L[Math.min(i-1,L.length-1)].replace('o seu nome',S.facts.nome?'o nome de '+S.facts.nome:'o seu nome')]])}

/* ---------- capítulos ---------- */
G.CH=[
{title:'Prólogo · A voz na cabeça',day:1,brief:'Prólogo na delegacia, antes do caso dos Valente.',hint:'Atenda o telefone e vista o casaco antes de sair.',
 idle:['O telefone, {nome}. Ele não vai parar sozinho.','Meu casaco tá no cabide. Lá fora chove.'],
 intro:[{go:'office',x:150,face:1},()=>{S.actor='DETNC';S.coat=false;S.flags.ring=1},
  ['Narrador','Vila Serena. Novembro. Chove fino desde que um gato sumiu.'],
  ['Narrador','Nesta cidade ninguém tranca a porta. Mas, há uma semana, as pessoas começaram a trancar outra coisa: a certeza de que existem.'],
  B('Otávio Brandão. Detetive. Vinte e dois anos de casos, um casaco velho e o costume de conversar sozinho.'),
  B('Só que agora eu não falo sozinho. Falo com você.'),
  B('Você vai ser a voz na minha cabeça. Escreve o que você enxerga no botão Pensar. Eu enxergo o resto.'),
  B('E presta atenção: eu converso muito. Às vezes eu pergunto de você também. Faz parte.'),
  B('O telefone está tocando. Chega perto e examina.')],qs:null},
{title:'Caso 1 · O gato dos Valente',day:1,brief:'Caso Valente, parte 1: o gato Mingau sumiu há 7 dias; a família (pai Augusto, mãe Helena, filhos Davi e Lia) passou a agir como se não fosse real. Investigando a rua e a sala da casa.',
 hint:'Examine a rua e a casa, converse com Helena e abra a cômoda. Depois, Teoria.',
 idle:['A Helena não vai falar com um estranho. Conversa com ela com paciência.','Quatro números numa coleira. Quatro números num cadeado. Pensa nisso.','O homem de chapéu perto do lixo… você reparou nele?'],
 intro:[{go:'street',x:520,face:-1},()=>{S.actor='DET';S.coat=true},{walk:350},
  B('Rua dos Valente. O poste pisca como se a rua estivesse respirando.'),
  B('A casa da pichação. Família de dinheiro, de nome, de missa no domingo. E de repente, quatro pessoas que não acreditam que existem.'),
  B('Ande, examine tudo, escreva o que pensa. Se a pista for errada, a gente perde tempo. E tempo é o que essa família não tem.')],
 qs:[{q:'Como o Mingau saiu da casa?',o:['Fugiu pela porta da frente','Foi tirado pela janela, por alguém de fora','Nunca saiu, está escondido na casa'],a:1,need:['janela','coleira']},
  {q:'Quem continua indo até a casa?',o:['Augusto, o pai, à noite','Ninguém — a ração é velha','Alguém que vem do campo'],a:2,need:['tigela','bota']},
  {q:'Como convenceram os pais de que não existem?',o:['Com remédios na comida','Com palavras: bilhetes, pichação e conversa','Com ameaças por telefone'],a:1,need:['bilhete','grafite','helena']}],
 outro:[B('Alguém do campo. Um homem que conversa até a pessoa acreditar. Ele não roubou um gato. Roubou a certeza deles.'),
  {card:'Dia 3 · 03h12',ms:2600},{go:'office',x:150,face:1},['Telefone','Trrrim.'],
  ['Delegado Paiva','Brandão. Augusto Valente. Encontraram na estrada velha, perto das fazendas.'],
  {slow:4200,word:'EU NUNCA EXISTI'},['Delegado Paiva','Ao lado dele, escrito na terra: “EU NUNCA EXISTI”.'],
  B('{nome}… você ainda tá aí? Isso agora é morte. E ainda tem duas crianças naquela casa.')]},
{title:'Caso 2 · O homem que gritava',day:4,brief:'Caso 2: Sebastião grita na praça que a cidade é de papel. Augusto Valente foi achado morto na estrada velha com "EU NUNCA EXISTI" escrito na terra.',
 hint:'Ganhe a confiança de Sebastião. Ele tem a chave do quarto na pensão.',
 idle:['Ele grita pra cima, {nome}. Como se alguém estivesse olhando de lá.','Ninguém conta nada pra quem chama de louco.','A pensão fica à direita da praça.'],
 intro:[{go:'office',x:170,face:1},()=>{S.flags.paiva=1},
  ['Delegado Paiva','Brandão. “Parada cardíaca na estrada”, diz o legista sobre o Valente. Eu digo que é bom não falar em assassinato ainda.'],
  B('Ele andou até a estrada no meio da noite pra morrer acreditando que nunca existiu, delegado.'),
  ['Delegado Paiva','E agora tem um maluco na praça gritando a mesma coisa. Terceira noite. O povo está com medo. Resolve.'],
  B('Maluco não, delegado. Talvez a única pessoa que escapou.'),
  ()=>{S.flags.paiva=0},{go:'praca',x:20,face:1},{walk:150},
  ['Sebastião','A CIDADE É DE PAPEL! VOCÊS SÃO LIDOS! ALGUÉM TÁ LENDO A GENTE AGORA!'],
  B('{nome}, repara: ele não grita pra praça. Grita pra cima. Pra fora.')],
 qs:[{q:'Sebastião é perigoso?',o:['Sim: ele matou Augusto','Não: é outra vítima, que resistiu','Ele inventa tudo'],a:1,need:['seb','botas2']},
  {q:'Onde tudo começou?',o:['No Bar do Tonho','Na Fazenda Boa Vista','Na delegacia'],a:1,need:['parede','foto']},
  {q:'O que liga a fazenda à cidade?',o:['Entregas de verdura','Cartas anônimas pelo correio','A rádio da prefeitura'],a:0,need:['panfleto']}],
 outro:[B('Sebastião não é perigoso. É testemunha. A Boa Vista é o começo, e as verduras são o caminho até a cidade.'),
  ['Narrador','Naquela noite, uma ambulância leva Sebastião para o sanatório. Ele vai quieto.'],
  ['Sebastião','Detetive. Não deixa ele conversar com você. Ele fala até a gente concordar.'],
  {card:'Dia 7 · 02h40',ms:2400},{go:'office',x:150},['Telefone','Trrrim.'],
  {slow:4200,word:'HELENA'},['Delegado Paiva','Brandão… Helena Valente. A empregada encontrou no jardim. Sentada, olhando pro céu. Nenhuma marca.'],
  B('…'),B('Ela me disse que se sentia um desenho. Eu devia ter voltado lá, {nome}.'),
  B('Amanhã a gente vai até a estrada velha, onde acharam o Augusto. Dessa vez eu não chego atrasado.')]},
{title:'Caso 1 · A estrada velha',day:8,brief:'Caso Valente, parte 2: Helena também morreu, sem marcas. Investigando a estrada velha onde Augusto morreu e conversando com o filho Davi, 12 anos.',
 hint:'Examine a estrada. Depois converse com Davi na casa dos Valente (saída à esquerda).',
 idle:['Quem escreve “eu nunca existi” com letra tão calma?','O Davi viu coisa. Criança vê tudo.','Tem um brilho no milharal, mais pra direita.'],
 intro:[{go:'estrada',x:20,face:1},{walk:110},
  B('Estrada velha. Terra vermelha até onde a lua alcança.'),
  B('Foi aqui que o Augusto parou. Sem briga, sem ferida. Só ele, a noite e uma frase escrita no chão.'),
  B('Depois a gente volta pra casa dos Valente. As crianças estão sozinhas com uma tia que dorme o dia inteiro.')],
 qs:[{q:'Como Augusto morreu?',o:['Foi atacado na estrada','Andou até ali convencido, e alguém escreveu a frase depois','Caiu da carroça'],a:1,need:['inscricao','gravador']},
  {q:'Quem gravou a fita?',o:['Sebastião','Um homem calmo que visita à noite: Joaquim','Helena'],a:1,need:['gravador','davi']},
  {q:'Como ele chega até a casa?',o:['De carroça, pela estrada velha','No carro da prefeitura','A pé, pela praça'],a:0,need:['carroca','palha']}],
 outro:[B('Augusto andou até a estrada convencido. Alguém escreveu a frase depois, com letra calma. Joaquim, de carroça, pela estrada velha.'),
  {card:'Dia 12',ms:2000},{go:'office',x:150},()=>{S.flags.paiva=1},
  ['Delegado Paiva','Joaquim da Boa Vista? Brandão, o homem doa verdura pro orfanato há quarenta anos. Sem prova, ninguém entra naquela fazenda.'],
  B('Uma fita, uma carroça e duas crianças órfãs não são prova?'),
  ['Delegado Paiva','São histórias. E história não entra em tribunal.'],['Telefone','Trrrim.'],
  ['Delegado Paiva','…Sim. Entendi. Brandão: Orfanato Santa Luzia. Uma menina sumiu. Nina, sete anos.'],()=>{S.flags.paiva=0},
  B('O orfanato que recebe verdura da Boa Vista. {nome}, tudo está ligado. Tudo.')]},
{title:'Caso 3 · A menina que seguiu o gato',day:13,brief:'Caso 3: Nina, 7 anos, sumiu do Orfanato Santa Luzia depois da entrega de verduras de domingo.',
 hint:'Converse com a Irmã Clara e ache a pista que leva aos fundos.',
 idle:['Criança desenha o que quer que alguém veja. Olha os muros.','No bosque, procura papel no chão.','Três pedaços de mapa, {nome}. Ela deixou rastro.'],
 intro:[{go:'orfanato',x:20,face:1},{walk:170},
  ['Irmã Clara','Detetive. Ela sumiu depois do almoço de domingo. Não levou casaco, não levou nada.'],
  B('Domingo. Dia da entrega de verdura.'),
  B('{nome}, aqui a pressa mata. Conversa com a irmã com cuidado. E olha o pátio inteiro.')],
 qs:[{q:'Por que Nina foi pro bosque?',o:['Fugiu de um castigo','Seguiu a história do gato que o moço contou','Foi levada à força'],a:1,need:['giz','clara']},
  {q:'Por que as crianças não acreditam que não existem?',o:['São novas demais pra entender','Elas já sabem que a imaginação também é de verdade','Ninguém tentou convencê-las'],a:1,need:['nina']},
  {q:'O que o moço leva ao orfanato?',o:['Brinquedos','Verduras e histórias aos domingos','Dinheiro'],a:1,need:['caixas','clara']}],
 outro:[B('Nina seguiu uma história. E as crianças não caem nessa porque sabem que imaginação também é de verdade. Com elas, ele não consegue.'),
  ['Irmã Clara','Obrigada, detetive. Que Deus o guarde. E que guarde o senhor de quem conta histórias demais.'],
  {card:'Dia 18',ms:2000},{go:'office',x:150},['Telefone','Trrrim.'],
  ['Irmã Clara','Detetive? As crianças… estão todas passando mal. Todas tomaram a sopa de domingo.'],B('Estou indo, irmã.')]},
{title:'Caso 4 · A sopa do orfanato',day:18,brief:'Caso 4: as crianças do orfanato passaram mal com a sopa de domingo; investigando a cozinha e a cozinheira Dona Rosa.',
 hint:'Converse com Dona Rosa e descubra o código do armário.',
 idle:['“Dia e mês”, riscado na madeira. Que data importa aqui?','A Rosa fala muito quando está à vontade. Deixa ela à vontade.','Verdura bonita por fora… abre uma.'],
 intro:[{go:'cozinha',x:20,face:1},{walk:100},
  ['Dona Rosa','Polícia na minha cozinha… meu Deus do céu.'],
  B('Ninguém morreu, {nome}. Ainda. Mas alguém quer que essa cozinha pareça culpada.')],
 qs:[{q:'Foi envenenamento?',o:['Sim, puseram veneno na sopa','Não: verdura guardada de propósito, bonita por fora e podre por dentro','A Rosa errou a receita'],a:1,need:['podre','rosa']},
  {q:'Quem está na lista do caderno?',o:['Só os Valente','Todos com quem ele conversou, inclusive Brandão','Só as crianças'],a:1,need:['caderno']},
  {q:'De onde vem tudo isso?',o:['Da pensão','Da Fazenda Boa Vista','Da delegacia'],a:1,need:['carimbo','ledger']}],
 outro:[B('Não foi veneno. Foi tempo: verdura guardada de propósito, bonita por fora, podre por dentro. Igual às conversas dele.'),
  {slow:3800,word:'BRANDÃO ?'},B('E no caderno… o meu nome. Brandão, com um ponto de interrogação.'),B('E a última linha: “quem está olhando”.'),B('{nome}. Isso é você?'),{wait:1500},
  B('Não responde. Amanhã a gente vai até a Boa Vista. Sem mandado. Sem delegado. Só nós dois.')]},
{title:'Caso 1 · Fazenda Boa Vista',day:22,brief:'Caso Valente, parte 3: na Fazenda Boa Vista, sem mandado, procurando provas contra Joaquim, o fazendeiro que conversa até as pessoas acreditarem que não existem.',
 hint:'Examine a fazenda e descubra o código do celeiro.',
 idle:['“O ano em que tudo começou.” Olha a porteira.','Aquele espantalho… não gosto dele.','Fala baixo comigo. Aqui até as paredes escutam.'],
 intro:[{go:'fazenda',x:20,face:1},{walk:70},
  B('Fazenda Boa Vista. O moinho gira e não tem vento.'),
  B('Fala baixo comigo, {nome}. Aqui, até as paredes escutam.')],
 qs:[{q:'Quem é o homem que conversa?',o:['Sebastião','Joaquim, dono da Boa Vista','O delegado Paiva'],a:1,need:['ferramentas','bota43']},
  {q:'Como ele mata?',o:['Com as próprias mãos','Não toca em ninguém: convence, e a pessoa faz o resto','Com veneno'],a:1,need:['ferramentas','mapa']},
  {q:'Onde está o Mingau?',o:['Morto, no poço','Com ele, bem cuidado','De volta à casa dos Valente'],a:1,need:['gaiola']}],
 outro:[B('Joaquim. Ele nunca tocou em ninguém. Conversa, deixa um bilhete, pinta uma pergunta, e a pessoa faz o resto.'),
  B('E o Mingau está com ele. Bem alimentado. Como dizia o cartaz.'),
  {go:'fazenda',x:470,face:-1},()=>{S.flags.smoke=1},{slow:3000,word:'FUMAÇA'},B('…Fumaça. Lá longe, pros lados da cidade.'),B('Rua dos Valente. As crianças!')]},
{title:'Noite 27 · Fogo',day:27,music:'tense',brief:'Clímax: a casa dos Valente pega fogo com Lia lá dentro.',
 intro:[()=>{S.fire=true},{go:'street',x:440,face:-1},{walk:330,spd:1},
  ['Davi','DETETIVE! A Lia tá lá dentro! Ela disse que ia ver se a casa era de verdade!'],
  ['Vizinho','Os bombeiros ainda tão longe! O telhado vai cair!'],
  {qte:{from:'up',kind:'fire',dodge:-1,ok:'Uma viga em chamas caiu onde eu estava.',fail:'A viga em chamas raspou meu braço. Eu ainda consigo andar.'}},B('{nome}. Agora não é pra pensar. É pra decidir.'),{slow:3600,word:'DECIDA'},{card:'',ms:3500},
  {choice:'O que Brandão faz?',opts:['Entrar na casa e salvar Lia','Aceitar: o que aconteceu, aconteceu. Deixar ir.'],then:i=>G.ending(i)}],qs:null}];

/* ---------- finais ---------- */
G.ending=i=>{G.A&&G.A.music('none');if(i===0)run([()=>{S.ending='salvar'},B('Cuida da porta, Davi. Eu volto.'),{walk:112,spd:1},()=>{S.hideP=true},
  {card:'O fogo não faz barulho de filme.\nFaz barulho de casa velha desistindo.',ms:4500},
  ()=>{S.hideP=false;S.p.x=150;S.flags.liaOut=1},{wait:700},
  ['Narrador','Ele sai pela porta com Lia nos braços. Coloca a menina ao lado do irmão.'],
  B('Ela existe, {nome}. Eu senti o peso.'),{slow:5000},()=>{S.actor='down'},{wait:3000},
  {card:'',ms:3500},()=>{S.fire=false;S.burnt=true;S.hideP=true;S.flags.liaOut=0;G.aside('','');G.A&&G.A.music('sad')},
  {go:'praca',x:240},{wait:3200},{go:'orfanato',x:240},{wait:3200},
  {paper:'DETETIVE MORRE AO SALVAR MENINA EM INCÊNDIO',sub:'Otávio Brandão, matrícula 0451, entrou na casa em chamas da família Valente e retirou Lia Valente, 6 anos, com vida. O detetive não resistiu à fumaça. Davi Valente, 12, disse apenas: “ele acreditou na gente”. Os irmãos foram acolhidos pelo Orfanato Santa Luzia.'},
  ['Narrador','Dizem que ele foi um herói. Heróis são histórias que uma cidade conta pra conseguir dormir.'],
  ['Narrador','O delegado Paiva arquivou o caso dos Valente como “fatalidades”. Ninguém foi até a Boa Vista.']],G.epilogue);
 else run([()=>{S.ending='deixar'},B('…'),{wait:2500},B('O que aconteceu, aconteceu. Eu não posso salvar todo mundo de uma história que não é minha.'),['Davi','LIA!'],
  {card:'Os bombeiros chegam às 23h31.\nO teto cede às 23h40.',ms:4500},()=>{S.fire=false;S.burnt=true;S.hideP=true;G.aside('','');G.A&&G.A.music('sad')},{card:'',ms:3000},
  {go:'praca',x:240},{wait:3200},{go:'orfanato',x:240},{wait:3200},
  {paper:'INCÊNDIO DESTRÓI CASA DOS VALENTE — NENHUM CORPO ENCONTRADO',sub:'Bombeiros vasculharam os escombros por dois dias. Nenhum sinal de Lia Valente, 6 anos. O irmão, Davi, afirma que ela “está bem, num lugar onde alguém olha por ela”. O detetive Otávio Brandão, que assistiu ao incêndio da calçada, pediu afastamento.'},
  ['Narrador','Dizem que ele foi covarde. Outros, que foi sensato. Depende de quem conta a história.'],
  ['Narrador','Talvez a menina nunca tenha estado lá dentro. Talvez nunca tenha estado em lugar nenhum.']],G.epilogue)};
G.epilogue=()=>run([()=>{G.A&&G.A.music('box');S.actor='FARM';S.hideP=false;S.burnt=true},{go:'street',x:515,face:-1},{walk:360},
 ['Narrador','Uma pessoa acredita no que vê. Acredita mais no que escuta. E acredita de vez no que faz sentido.'],{walk:200},
 ['Narrador','Não precisa de faca. Não precisa de veneno. Basta uma conversa paciente, toda noite, até a dúvida virar casa.'],
 {go:'casaj',x:10,face:1},{walk:120},
 ['Narrador','Mostre a um homem que ninguém o olha nos olhos. Deixe um bilhete. Pinte uma pergunta na parede. Ele faz o resto.'],
 {walk:236},()=>{S.flags.hatOff=1;S.actor='FARMNH'},{wait:1000},
 ['Narrador','As crianças, não. Criança sabe que imaginação também é de verdade. Com elas não adianta conversar.'],
 {walk:346},()=>{S.hideP=true;S.sit=true},{wait:2000},
 ['Narrador','Será mesmo que existimos?'],['Narrador','Será que a solução está em ver as coisas de outro jeito?'],
 ['Narrador','Somos reais… ou até mesmo eu estou sendo manipulado por alguém de fora?'],['Narrador','Ou até mesmo…'],
 ()=>{S.catLap=true;G.A&&G.A.sfx('meow')},{wait:2400},()=>{S.front=true;G.zoom(346,106)},{wait:2000},['Narrador','Você.'],{wait:900}],()=>G.tvoff(G.credits));

const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
G.credits=()=>{G.tvon();G.A&&G.A.music('sad');G.unzoom();const e=document.getElementById('end');e.style.display='flex';const min=Math.max(1,Math.round(S.play/60));const ok=Object.keys(S.facts).length>=4&&S.talks>=6;G.wipe();
 e.innerHTML=`<div class="cred"><h1>NUTCASE P.I.</h1><p>Final: <b>${S.ending==='salvar'?'O peso da menina':'Deixar ir'}</b></p>
 <p>Ideia e roteiro<br><b>você</b></p><p>Pixel art, código e conversas<br><b>Claude</b></p>
 <p>Elenco<br><b>Otávio Brandão · Augusto e Helena Valente · Davi e Lia · Sebastião · Irmã Clara · Dona Rosa · Nina · Delegado Paiva · Mingau</b><br>e o Narrador, que esteve em todas as cenas</p>
 <p>Tempo de jogo: ${min} min · Teorias erradas: ${S.wrong} · Dias usados: ${S.day}/30</p>
 ${ok?'<p class="blink">…a TV ainda está quente.</p><button class="go" id="again">Ligar a TV de novo</button>':'<div class="file"><b>ARQUIVO #5 — INCOMPLETO</b><br>Ele ainda não sabe o bastante sobre você. Na próxima vez, converse mais com o detetive. Conte quem você é.</div><button class="go" id="again">Jogar de novo</button>'}</div>`;
 document.getElementById('again').onclick=ok?G.secret:()=>location.reload()};
G.secret=()=>{G.A&&G.A.music('none');document.getElementById('end').style.display='none';G.tvon();G.unzoom();Object.assign(S,{fire:false,burnt:false,hideP:false,sit:false,catLap:false,front:false,actor:'DET',coat:true});S.flags.paiva=0;S.flags.ring=0;
 const f=S.facts,now=new Date(),min=Math.max(1,Math.round(S.play/60)),st=new Date(S.sess).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),hr=now.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),wd=now.toLocaleDateString('pt-BR',{weekday:'long'});
 const others=Object.keys(f).filter(k=>!['nome','idade','cidade'].includes(k)).map(k=>k+': '+f[k]);
 const qs=S.quotes.filter(q=>q.length>8);const q=qs.length?qs[(Math.random()*qs.length)|0].slice(0,90):null;
 const L=[{go:'office',x:170,face:1},{wait:800},
  B(S.ending==='salvar'?'Morto, dizem os jornais. Mas enquanto você olha, eu continuo aqui.':'Afastado, dizem. Mas pra você eu nunca saí desta sala.'),
  B('Arquivo número cinco. Homem sem registro. Que joga jogos.'),
  B(`Nome: ${f.nome||'?'}. Idade: ${f.idade||'?'}. Mora em ${f.cidade||'algum lugar fora do mapa'}.`)];
 if(others.length)L.push(B('Também anotei: '+others.join('; ')+'.'));
 L.push(B(`Você ligou essa TV às ${st}. Agora são ${hr} de ${wd}. ${min} minutos comigo.`),
  B(`Errou ${S.wrong} ${S.wrong===1?'teoria':'teorias'}. Decidiu por mim lá no fogo.`+(q?` E uma vez me disse: “${q}”.`:'')),
  B('Trinta dias eu achei que alguém estava convencendo essa cidade de que ela não existe.'),
  B('Mas quem conversou comigo todas as noites, quem viu tudo de fora, quem acreditou ou não em cada pista… foi você.'),
  B('Então me responde, de verdade.'));
 G.run(L,G.finalChat)};

G.boot();
})();
