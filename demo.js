const skins = {
  cde: ['default', 'crimson'],
  redmond: ['95', '2000'],
};


const themeLink = document.getElementById('theme-link');
const skinLink = document.getElementById('skin-link');
const themeSelect = document.getElementById('theme-select');
const skinSelect = document.getElementById('skin-select');

let defaultTheme = 'cde';
let defaultSkin = 'crimson';
let activeTheme = defaultTheme;
let activeSkin = defaultSkin;

function setTheme(theme) {
  activeTheme = theme;
  activeSkin = null;
  themeLink.href = 'themes/' + theme + '/theme.css';
  themeSelect.value = theme;
  skinSelect.innerHTML = '';
  if (skins.hasOwnProperty(theme)) {
    skinSelect.disabled = false;
    for (let skin of skins[theme]) {
      const option = document.createElement('option');
      option.textContent = skin;
      skinSelect.add(option);
    }
    if (skins[theme].length) {
      setSkin(skins[theme][0]);
    } else {
      clearSkin();
    }
  } else {
    skinSelect.disabled = true;
    clearSkin();
  }
}

function clearSkin() {
  skinLink.href = 'themes/empty-skin.css';
}

function setSkin(skin) {
  if (!skins.hasOwnProperty(activeTheme)) {
    return;
  }
  if (skins[activeTheme].indexOf(skin) < 0) {
    return;
  }
  activeSkin = skin;
  skinSelect.value = activeSkin;
  skinLink.href = 'themes/' + activeTheme + '/skins/' + activeSkin + '.css';
}

function pushState() {
  let url = '?theme=' + activeTheme;
  if (activeSkin) {
    url += '&skin=' + activeSkin;
  }
  history.pushState({theme: activeTheme, skin: activeSkin}, document.title, url);
}

const params = new URL(location).searchParams;
if (params.has('theme')) {
  defaultTheme = params.get('theme');
  if (params.has('skin')) {
    defaultSkin = params.get('skin');
  }
}
setTheme(defaultTheme);
setSkin(defaultSkin);

themeSelect.addEventListener('change', () => {
  if (themeSelect.value) {
    setTheme(themeSelect.value);
    pushState();
  }
});

skinSelect.addEventListener('change', () => {
  if (skinSelect.value) {
    setSkin(skinSelect.value);
    pushState();
  }
});

window.addEventListener('popstate', e => {
  if (e.state && e.state.theme) {
    setTheme(e.state.theme);
    if (e.state.skin) {
      setSkin(e.state.skin);
    }
  } else {
    setTheme(defaultTheme);
    if (defaultSkin) {
      setSkin(defaultSkin);
    }
  }
});

const examples = document.getElementsByClassName('example');
for (let example of examples) {
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  const pre = document.createElement('pre');
  const code = document.createElement('code');
  pre.appendChild(code);
  summary.textContent = 'Show Code';
  details.appendChild(summary);
  details.appendChild(pre);
  let source = example.innerHTML;
  source = source.replace(/^\s*\n/, '');
  const indentation = '\n' + source.match(/^\s*/)[0];
  source = source.split('\n').map(line => ('\n' + line).replace(indentation, '')).join('\n');
  code.textContent = source.trim();
  example.appendChild(details);
}
