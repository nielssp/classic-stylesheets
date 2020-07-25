const skins = {
  cde: [
    'default',

    'alpine-4', 'arizona-4', 'beige-rose-4', 'broica-4', 'cabernet-4',
    'camouflage-4', 'charcoal-4', 'chocolate-4', 'cinnamon-4', 'clay-4',
    'crimson-4', 'dark-gold-4', 'default-4', 'delphinium-4', 'desert-4',
    'golden-4', 'grass-4', 'gray-scale-4', 'lilac-4', 'mustard-4', 'neptune-4',
    'northern-sky-4', 'nutmeg-4', 'olive-4', 'orchid-4', 'pbnj-4', 'sand-4',
    'santa-fe-4', 'savannah-4', 'sea-foam-4', 'sky-red-4', 'soft-blue-4',
    'south-west-4', 'summer-4', 'tundra-4', 'urchin-4', 'wheat-4',

    'alpine-8', 'arizona-8', 'beige-rose-8', 'broica-8', 'cabernet-8',
    'camouflage-8', 'charcoal-8', 'chocolate-8', 'cinnamon-8', 'clay-8',
    'crimson-8', 'dark-gold-8', 'default-8', 'delphinium-8', 'desert-8',
    'golden-8', 'grass-8', 'gray-scale-8', 'lilac-8', 'mustard-8', 'neptune-8',
    'northern-sky-8', 'nutmeg-8', 'olive-8', 'orchid-8', 'pbnj-8', 'sand-8',
    'santa-fe-8', 'savannah-8', 'sea-foam-8', 'sky-red-8', 'soft-blue-8',
    'south-west-8', 'summer-8', 'tundra-8', 'urchin-8', 'wheat-8',

    'alpine-2', 'arizona-2', 'beige-rose-2', 'broica-2', 'cabernet-2',
    'camouflage-2', 'charcoal-2', 'chocolate-2', 'cinnamon-2', 'clay-2',
    'crimson-2', 'dark-gold-2', 'default-2', 'delphinium-2', 'desert-2',
    'golden-2', 'grass-2', 'gray-scale-2', 'lilac-2', 'mustard-2', 'neptune-2',
    'northern-sky-2', 'nutmeg-2', 'olive-2', 'orchid-2', 'pbnj-2', 'sand-2',
    'santa-fe-2', 'savannah-2', 'sea-foam-2', 'sky-red-2', 'soft-blue-2',
    'south-west-2', 'summer-2', 'tundra-2', 'urchin-2', 'wheat-2',

    'black', 'black-white', 'white', 'white-black',
  ],
  win9x: [
    '95', '98', '2000',

    'brick', 'desert', 'eggplant', 'lilac',
    'maple', 'marine', 'plum', 'pumpkin',
    'rainy-day', 'red-white-and-blue', 'rose',
    'slate', 'spruce', 'storm', 'teal', 'wheat',

    'brick-2000', 'desert-2000', 'eggplant-2000', 'lilac-2000',
    'maple-2000', 'marine-2000', 'plum-2000', 'pumpkin-2000',
    'rainy-day-2000', 'red-white-and-blue-2000', 'rose-2000',
    'slate-2000', 'spruce-2000', 'storm-2000', 'teal-2000', 'wheat-2000',
  ],
  win3x: [
    '3.1', '3.0', 'high-color',

    'arizona', 'black-leather-jacket', 'bordeaux', 'cinnamon', 'designer',
    'emerald-city', 'fluorescent', 'hotdog-stand', 'lcd', 'lcd-reversed-dark',
    'lcd-reversed-light', 'mahogany', 'monochrome', 'ocean', 'pastel',
    'patchwork', 'plasma-power-saver', 'rugby', 'the-blues', 'tweed',
    'valentine', 'wingtips',
  ],
};


const themeLink = document.getElementById('theme-link');
const skinLink = document.getElementById('skin-link');
const themeSelect = document.getElementById('theme-select');
const skinSelect = document.getElementById('skin-select');

let defaultTheme = 'cde';
let defaultSkin = 'crimson-4';
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
