# Bazar Emicida — Guia de Setup

## Passo 1 — Google Sheets

1. Acessa [sheets.google.com](https://sheets.google.com) e cria uma planilha nova
2. Renomeia a aba para `produtos`
3. Na primeira linha, coloca exatamente esses cabeçalhos (sem acento, sem espaço):

```
id | nome | categoria | preco | descricao | imagem1 | imagem2 | imagem3 | disponivel
```

4. Preenche os dados. Exemplos de `categoria` aceitos:
   - `motos`
   - `eletronicos`
   - `jogos-tabuleiro`
   - `moveis`
   - `casa`
   - `outros`

5. Na coluna `disponivel`, usa `TRUE` ou `FALSE`

6. Vai em **Arquivo > Compartilhar > Publicar na web**
   - Seleciona a aba `produtos`
   - Formato: `Página da Web`
   - Clica em **Publicar**

7. Pega o ID da planilha na URL:
   `https://docs.google.com/spreadsheets/d/**ESTE_TRECHO**/edit`

8. Abre o arquivo `js/config.js` e substitui:
   ```js
   SHEET_ID: 'SEU_ID_AQUI',
   ```
   pelo ID que você copiou.

---

## Passo 2 — Imagens

Coloca as fotos dos produtos dentro da pasta `imagens/`:

```
imagens/
  produto-001/
    foto1.jpg
    foto2.jpg
    foto3.jpg
  produto-002/
    foto1.jpg
```

Na planilha, coloca o caminho relativo:
- `imagem1` → `imagens/produto-001/foto1.jpg`
- `imagem2` → `imagens/produto-001/foto2.jpg`

---

## Passo 3 — GitHub Pages

1. Cria uma conta no [github.com](https://github.com) se não tiver
2. Cria um repositório novo (pode ser `bazar-emicida`)
3. Sobe todos os arquivos desse projeto pro repositório
4. Vai em **Settings > Pages**
5. Em **Source**, seleciona `Deploy from a branch` → `main` → `/ (root)`
6. Salva. Em alguns minutos o site vai estar em:
   `https://SEU_USUARIO.github.io/bazar-emicida`

---

## Estrutura de arquivos

```
bazar-emicida/
├── index.html          → Home
├── categorias.html     → Categorias
├── produtos.html       → Produtos (filtra por ?categoria=)
├── contato.html        → Falar com o admin
├── css/
│   └── style.css
├── js/
│   ├── config.js       → Configurações (SHEET_ID, WhatsApp, categorias)
│   ├── sheets.js       → Lê a planilha
│   └── ui.js           → Navbar, footer, cards, modal
└── imagens/
    └── produto-xxx/
```
