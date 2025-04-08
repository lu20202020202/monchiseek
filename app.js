let catalog = [];
let collection = JSON.parse(localStorage.getItem('monchhichiCollection')) || [];
let wishlist = JSON.parse(localStorage.getItem('monchhichiWishlist')) || [];

function showTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabName).style.display = 'block';

  if (tabName === 'catalog') renderCatalog();
  else if (tabName === 'collection') renderList('collection', collection);
  else if (tabName === 'wishlist') renderList('wishlist', wishlist);
}

async function fetchCatalog() {
  const res = await fetch('monchhichis.json');
  catalog = await res.json();
  renderCatalog();
}

function renderCatalog() {
  const container = document.getElementById('catalog');
  container.innerHTML = '';
  catalog.forEach(item => {
    const card = createCard(item, true);
    container.appendChild(card);
  });
}

function renderList(type, list) {
  const container = document.getElementById(type);
  container.innerHTML = '';
  if (list.length === 0) {
    container.innerHTML = `<p>No Monchhichis here yet!</p>`;
    return;
  }
  list.forEach(id => {
    const item = catalog.find(c => c.id === id);
    if (item) {
      const card = createCard(item, false, type);
      container.appendChild(card);
    }
  });
}

function createCard(item, showAddButtons = false, context = '') {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${item.image}" alt="${item.name}" />
    <h3>${item.name}</h3>
    <p>Released: ${item.year}</p>
  `;

  if (showAddButtons) {
    const btnAddCol = document.createElement('button');
    btnAddCol.innerText = 'Add to Collection';
    btnAddCol.onclick = () => {
      if (!collection.includes(item.id)) {
        collection.push(item.id);
        localStorage.setItem('monchhichiCollection', JSON.stringify(collection));
      }
    };

    const btnAddWish = document.createElement('button');
    btnAddWish.innerText = 'Add to Wishlist';
    btnAddWish.onclick = () => {
      if (!wishlist.includes(item.id)) {
        wishlist.push(item.id);
        localStorage.setItem('monchhichiWishlist', JSON.stringify(wishlist));
      }
    };

    card.appendChild(btnAddCol);
    card.appendChild(btnAddWish);
  }

  if (!showAddButtons) {
    const btnRemove = document.createElement('button');
    btnRemove.innerText = 'Remove';
    btnRemove.onclick = () => {
      if (context === 'collection') {
        collection = collection.filter(i => i !== item.id);
        localStorage.setItem('monchhichiCollection', JSON.stringify(collection));
        renderList('collection', collection);
      } else if (context === 'wishlist') {
        wishlist = wishlist.filter(i => i !== item.id);
        localStorage.setItem('monchhichiWishlist', JSON.stringify(wishlist));
        renderList('wishlist', wishlist);
      }
    };
    card.appendChild(btnRemove);
  }

  return card;
}

fetchCatalog();
showTab('catalog');
