/* ─── NAVBAR ─────────────────────────────────────────────── */
function renderNavbar() {
  const cur = window.location.pathname.split('/').pop() || 'index.html';
  const links = [
    { href: 'index.html',      label: 'Home' },
    { href: 'categorias.html', label: 'Categorias' },
    { href: 'produtos.html',   label: 'Produtos' },
    { href: 'contato.html',    label: 'Falar com Admin' },
  ];

  const nav = document.createElement('nav');
  nav.className = 'navbar';
  nav.innerHTML = `
    <div class="container navbar-inner">
      <a href="index.html" class="brand">
        <span class="brand-dot">·</span>Bazar Emicida
      </a>
      <button class="nav-toggle" id="navToggle" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="navLinks">
        ${links.map(l => `<li><a href="${l.href}" class="${cur === l.href ? 'active' : ''}">${l.label}</a></li>`).join('')}
      </ul>
    </div>
  `;
  document.body.prepend(nav);

  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('navLinks');
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.classList.toggle('open');
  });
  document.addEventListener('click', e => {
    if (!nav.contains(e.target)) { menu.classList.remove('open'); toggle.classList.remove('open'); }
  });
}

/* ─── FOOTER ─────────────────────────────────────────────── */
function renderFooter() {
  const f = document.createElement('footer');
  f.className = 'footer';
  f.innerHTML = `
    <div class="container footer-inner">
      <p class="footer-brand">· Bazar <em>Emicida</em></p>
      <p class="footer-sub">Dúvidas? <a href="contato.html">Fala comigo no WhatsApp</a>.</p>
      <p class="footer-copy">&copy; ${new Date().getFullYear()} — todos os itens são pessoais, vendidos por mudança.</p>
    </div>
  `;
  document.body.appendChild(f);
}

/* ─── MODAL ──────────────────────────────────────────────── */
let _overlay = null;

function abrirModal(produto) {
  fecharModal();
  const imgs = getImagens(produto);
  const disp = isDisponivel(produto);
  let cur  = 0;

  const el = document.createElement('div');
  el.className = 'overlay';
  el.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <button class="modal-close" title="Fechar">&times;</button>
      <div class="modal-grid">
        <div class="mgallery">
          <div class="mgallery-track">
            ${imgs.length
              ? imgs.map((s,i) => `<img src="${s}" class="mgallery-img${i===0?' on':''}" alt="Foto ${i+1}" loading="lazy">`).join('')
              : `<div class="mgallery-empty">Sem foto</div>`}
          </div>
          ${imgs.length > 1 ? `
            <button class="mgallery-btn prev" aria-label="Anterior">&#8249;</button>
            <button class="mgallery-btn next" aria-label="Próxima">&#8250;</button>
            <div class="mgallery-dots">${imgs.map((_,i) => `<span class="mdot${i===0?' on':''}" data-i="${i}"></span>`).join('')}</div>
          ` : ''}
        </div>
        <div class="minfo">
          <span class="minfo-cat label-sm">${getNomeCategoria(produto.categoria)}</span>
          <h2 class="minfo-nome display">${produto.nome}</h2>
          <p class="minfo-preco display">${formatPreco(produto.preco)}</p>
          ${produto.descricao ? `<p class="minfo-desc">${produto.descricao}</p>` : ''}
          <div class="minfo-status ${disp ? 'ok' : 'no'}">
            <span class="status-dot"></span>${disp ? 'Disponível' : 'Vendido'}
          </div>
          ${disp
            ? `<a href="${montarLinkWpp(produto)}" target="_blank" rel="noopener" class="btn btn-wpp">
                ${iconWpp(22)} Quero comprar
               </a>`
            : `<button class="btn-disabled">Item vendido</button>`}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(el);
  document.body.style.overflow = 'hidden';
  _overlay = el;
  requestAnimationFrame(() => el.classList.add('show'));

  el.querySelector('.modal-close').onclick = fecharModal;
  el.addEventListener('click', e => { if (e.target === el) fecharModal(); });
  document.addEventListener('keydown', _onEsc);

  if (imgs.length > 1) {
    const track = el.querySelector('.mgallery-track');
    const dots  = el.querySelectorAll('.mdot');
    const go = i => {
      track.querySelectorAll('.mgallery-img').forEach((im, idx) => im.classList.toggle('on', idx === i));
      dots.forEach((d, idx) => d.classList.toggle('on', idx === i));
      cur = i;
    };
    el.querySelector('.mgallery-btn.prev').onclick = () => go((cur - 1 + imgs.length) % imgs.length);
    el.querySelector('.mgallery-btn.next').onclick = () => go((cur + 1) % imgs.length);
    dots.forEach(d => d.onclick = () => go(+d.dataset.i));
  }
}

function fecharModal() {
  if (!_overlay) return;
  _overlay.classList.remove('show');
  const el = _overlay; _overlay = null;
  setTimeout(() => { el.remove(); document.body.style.overflow = ''; }, 260);
  document.removeEventListener('keydown', _onEsc);
}
function _onEsc(e) { if (e.key === 'Escape') fecharModal(); }

/* ─── CARD PRODUTO ───────────────────────────────────────── */
function renderCardProduto(produto) {
  const imgs = getImagens(produto);
  const disp = isDisponivel(produto);
  const thumb = imgs[0] || null;

  const card = document.createElement('article');
  card.className = `card-produto${!disp ? ' esgotado' : ''}`;
  card.innerHTML = `
    <div class="card-thumb">
      ${thumb
        ? `<img src="${thumb}" alt="${produto.nome}" loading="lazy">`
        : `<div class="thumb-empty">📦</div>`}
      ${!disp ? `<div class="badge-esgotado"><span>Vendido</span></div>` : ''}
      ${imgs.length > 1 ? `<span class="badge-fotos">${imgs.length} fotos</span>` : ''}
    </div>
    <div class="card-body">
      <span class="card-cat-tag label-sm">${getNomeCategoria(produto.categoria)}</span>
      <p class="card-nome">${produto.nome}</p>
      <p class="card-preco display">${formatPreco(produto.preco)}</p>
    </div>
  `;
  card.addEventListener('click', () => abrirModal(produto));
  return card;
}

/* ─── ESTADOS ────────────────────────────────────────────── */
function renderLoading(el) {
  el.innerHTML = `<div class="state"><div class="spinner"></div><p class="state-msg">Carregando...</p></div>`;
}
function renderVazio(el, msg = 'Nenhum item encontrado.') {
  el.innerHTML = `<div class="state"><div class="state-icon">📦</div><p class="state-msg">${msg}</p></div>`;
}

/* ─── ÍCONE WHATSAPP ─────────────────────────────────────── */
function iconWpp(s = 20) {
  return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;
}
