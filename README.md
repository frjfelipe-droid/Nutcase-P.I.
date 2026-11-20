# Nutcase P.I.

Jogo de investigação noir em pixel art, feito para o navegador.

Vila Serena, novembro. O gato da família Valente sumiu, e desde então as pessoas da cidade começaram a acreditar que não existem. Você é a voz na cabeça do detetive Otávio Brandão: examina cenas de crime, conversa com suspeitos, ganha a confiança deles e monta teorias. São 30 dias e 5 casos até o final.

## Como jogar

Abra `index.html` no navegador. Outra opção é `nutcase-pi-arquivo-unico.html`, que é o jogo inteiro num arquivo só e funciona sem internet. O primeiro toque na tela liga o som.

- **◀ ▶ ou setas / A-D:** andar
- **Examinar (E):** examinar perto do “!”
- **Pensar (T):** conversar com o detetive
- **Carteira, Caderno, Teoria:** distintivo, pistas e conclusões
- Quando aparecer **DESVIE!**, aperte a direção indicada a tempo

## Estrutura

| Arquivo | O que faz |
|---|---|
| `index.html` | Página, layout e estilos |
| `art.js` | Cenários em pixel art, personagens, iluminação |
| `audio.js` | Música noir composta e efeitos sonoros (WebAudio) |
| `engine.js` | Motor: diálogos, cutscenes, conversas, puzzles, câmera lenta, desvios, save |
| `story.js` | História: pistas, personagens, cenas, capítulos e finais |

## Observação

Fora do Claude, os personagens respondem num modo simples, por palavras-chave. As conversas livres com IA só funcionam quando o jogo é aberto pelo Claude.
