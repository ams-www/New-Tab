const LS_KEY = 'my_shortcuts_img_v1';

function getShortcuts() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || [];
  } catch {
    return [];
  }
}
function setShortcuts(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
}

function renderShortcuts() {
  const grid = document.getElementById('linksGrid');
  grid.innerHTML = '';
  const shortcuts = getShortcuts();
  shortcuts.forEach((item, idx) => {
    const iconUrl = item.imgUrl && item.imgUrl.trim() ? item.imgUrl : 'default.png';
    const a = document.createElement('a');
    a.className = 'shortcut';
    a.href = item.url;
    a.target = '_blank';
    a.innerHTML = `
      <button class="deleteBtn" title="Delete" data-idx="${idx}">×</button>
      <img src="${iconUrl}" class="shortcut-icon" onerror="this.src='default.png'">
      <span>${item.name}</span>
    `;
    grid.appendChild(a);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderShortcuts();

  document.getElementById('searchForm').addEventListener('submit', function(e){
    e.preventDefault();
    const q = document.getElementById('searchInput').value.trim();
    if(q) window.location.href = 'https://www.bing.com/search?q=' + encodeURIComponent(q);
  });

  document.getElementById('linksGrid').addEventListener('click', e => {
    if(e.target.classList.contains('deleteBtn')) {
      const idx = e.target.getAttribute('data-idx');
      const shortcuts = getShortcuts();
      shortcuts.splice(idx, 1);
      setShortcuts(shortcuts);
      renderShortcuts();
    }
  });

  const modal = document.getElementById('modal');
  document.getElementById('addBtn').onclick = () => {
    modal.style.display = 'flex';
    document.getElementById('newName').value = '';
    document.getElementById('newUrl').value = '';
    document.getElementById('newImgUrl').value = '';
  };
  document.getElementById('closeModal').onclick = () => {
    modal.style.display = 'none';
  };

  document.getElementById('saveBtn').onclick = () => {
    const name = document.getElementById('newName').value.trim();
    const url = document.getElementById('newUrl').value.trim();
    const imgUrl = document.getElementById('newImgUrl').value.trim();
    if(name && url) {
      const shortcuts = getShortcuts();
      shortcuts.push({ name, url, imgUrl });
      setShortcuts(shortcuts);
      renderShortcuts();
      modal.style.display = 'none';
    } else {
      alert('Site name and URL are required.');
    }
  };

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
});