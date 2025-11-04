import "bootstrap";
import "./style.css";


import "./assets/img/rigo-baby.jpg";
import "./assets/img/4geeks.ico";



(() => {
  const SUITS = [
    { key: '♠', color: 'black', name: 'spades' },
    { key: '♥', color: 'red', name: 'hearts' },
    { key: '♦', color: 'red', name: 'diamonds' },
    { key: '♣', color: 'black', name: 'clubs' }
  ];
  const RANKS = [
    { key: 'A', value: 14 }, { key: 'K', value: 13 }, { key: 'Q', value: 12 }, { key: 'J', value: 11 },
    { key: '10', value: 10 }, { key: '9', value: 9 }, { key: '8', value: 8 }, { key: '7', value: 7 },
    { key: '6', value: 6 }, { key: '5', value: 5 }, { key: '4', value: 4 }, { key: '3', value: 3 }, { key: '2', value: 2 }
  ];

  // crea una carta aleatoria
  function randomCard() {
    const s = SUITS[Math.floor(Math.random() * SUITS.length)];
    const r = RANKS[Math.floor(Math.random() * RANKS.length)];
    return { rank: r.key, value: r.value, suit: s.key, color: s.color };
  }

  // genera N cartas aleatorias
  function generateCards(n) {
    const out = [];
    for (let i = 0; i < n; i++) out.push(randomCard());
    return out;
  }

  // renderiza un array de cartas dentro de un contenedor (grid bootstrap)
  function renderCards(container, cards, { mini = false } = {}) {
    container.innerHTML = '';
    const row = document.createDocumentFragment();
    cards.forEach(c => {
      const col = document.createElement('div');
      col.className = 'col';
      col.innerHTML = `
        <div class="poker ${c.color} ${mini ? 'miniRow' : ''}">
          <div class="suit  text-start ps-2 pt-2">${c.suit}</div>
          <div class="rank">${c.rank}</div>
          <div class="suit text-end pe-2 pb-2 rotate" >${c.suit}</div>
        </div>`;
      row.appendChild(col);
    });
    container.appendChild(row);
  }

  // clona profundamente un array de cartas 
  const cloneCards = (arr) => arr.map(c => ({ ...c }));

  // selection sort que guarda cada intercambio
  function selectionSortWithLog(cards) {
    const a = cloneCards(cards);
    const steps = []; // cada elemento será una snapshot del array tras un swap

    for (let i = 0; i < a.length - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < a.length; j++) {
        if (a[j].value < a[minIdx].value) minIdx = j;
      }
      if (minIdx !== i) {
        // swap
        [a[i], a[minIdx]] = [a[minIdx], a[i]];
        steps.push(cloneCards(a));
      }
    }
    return { sorted: a, steps };
  }

  const qtyInput = document.getElementById('qty');
  const btnDraw = document.getElementById('btnDraw');
  const btnSort = document.getElementById('btnSort');
  const currentEl = document.getElementById('current');
  const logEl = document.getElementById('log');

  let currentCards = [];

  // Draw
  btnDraw.addEventListener('click', () => {
    const n = Math.max(1, Math.min(52, parseInt(qtyInput.value || '0', 10)));
    currentCards = generateCards(n);
    renderCards(currentEl, currentCards);
    logEl.innerHTML = ''; // limpiamos el registro
  });

  // Sort (selection) + log
  btnSort.addEventListener('click', () => {
    if (!currentCards.length) return;

    const { sorted, steps } = selectionSortWithLog(currentCards);

    // Mostrar “estado actual” como el arreglo ya ordenado
    currentCards = sorted;
    renderCards(currentEl, currentCards);

    // Mostrar el registro completo de cambios (cada swap en una fila)
    logEl.innerHTML = '';
    if (steps.length === 0) {
      logEl.innerHTML = '<div class="text-muted">No swaps needed (already sorted).</div>';
      return;
    }
    steps.forEach((snapshot, idx) => {
      const wrap = document.createElement('div');
      wrap.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <span class="badge-step">Step ${idx + 1}</span>
        </div>
        <div class="row row-cols-2 row-cols-md-4 row-cols-xl-8 g-2 mt-1"></div>
      `;
      const row = wrap.querySelector('.row');
      renderCards(row, snapshot, { mini: true });
      logEl.appendChild(wrap);
    });
  });

  // arranque con algo
  btnDraw.click();
})();

window.onload = function () {
  //write your code here
  console.log("Hello Rigo from the console!");
};
