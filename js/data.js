let _cache = null;

function parseCSVLine(line) {
  const result = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') { inQuotes = !inQuotes; continue; }
    if (ch === ',' && !inQuotes) { result.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  result.push(cur.trim());
  return result;
}

async function fetchProdutos() {
  if (_cache) return _cache;
  try {
    const res = await fetch(CONFIG.CSV_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const lines = text.trim().split('\n').filter(l => l.trim());
    const headers = parseCSVLine(lines[0]);
    const produtos = lines.slice(1).map(line => {
      const vals = parseCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
      return obj;
    }).filter(p => p.id && p.nome);
    _cache = produtos;
    return produtos;
  } catch (e) {
    console.error('Erro ao carregar CSV:', e);
    return [];
  }
}

function isDisponivel(p) {
  return String(p.disponivel).trim().toUpperCase() === 'TRUE';
}

function getImagens(p) {
  return [p.imagem1, p.imagem2, p.imagem3].filter(s => s && s.trim());
}

function formatPreco(valor) {
  const n = parseFloat(String(valor).replace(',', '.'));
  if (isNaN(n)) return 'Sob consulta';
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function montarLinkWpp(produto) {
  const msg = `Olá! Vi o *Bazar Emicida* e tenho interesse em:\n\n*${produto.nome}*\nPreço: ${formatPreco(produto.preco)}\n\nAinda está disponível?`;
  return `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

function getNomeCategoria(id) {
  return CONFIG.CATEGORIAS.find(c => c.id === id)?.nome ?? id ?? '';
}
