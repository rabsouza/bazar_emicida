let _cache = null;

async function fetchProdutos() {
  if (_cache) return _cache;

  const url = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:json&sheet=produtos`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\)/);
    if (!match) throw new Error('Formato inesperado da planilha.');

    const json = JSON.parse(match[1]);
    const cols = json.table.cols.map(c => c.label.trim());

    const produtos = json.table.rows
      .map(row => {
        const obj = {};
        row.c.forEach((cell, i) => {
          obj[cols[i]] = cell ? cell.v : null;
        });
        return obj;
      })
      .filter(p => p.id && p.nome);

    _cache = produtos;
    return produtos;
  } catch (e) {
    console.error('Erro ao buscar planilha:', e);
    return [];
  }
}

function getPorCategoria(produtos, categoriaId) {
  if (!categoriaId) return produtos;
  return produtos.filter(p => p.categoria === categoriaId);
}

function getImagens(produto) {
  return [produto.imagem1, produto.imagem2, produto.imagem3].filter(Boolean);
}

function formatPreco(valor) {
  if (!valor) return 'Sob consulta';
  return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function montarMensagemWhatsApp(produto) {
  const msg = `Olá! Vi o *Bazar Emicida* e tenho interesse em:\n\n*${produto.nome}*\nPreço: ${formatPreco(produto.preco)}\n\nAinda está disponível?`;
  return `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`;
}
