import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.resolve(__dirname, '.sound-cache');
const OUT_DIR = path.resolve(__dirname, '../../frontend/public/sounds');

const SOURCES = {
  ekleeZip:
    'https://opengameart.org/sites/default/files/eklee-KeyPresses-cc0-opengameart.zip',
  mechanical01:
    'https://opengameart.org/sites/default/files/keyboard01.ogg',
  mechanical02:
    'https://opengameart.org/sites/default/files/keyboard02.ogg',
  laptopKey01:
    'https://opengameart.org/sites/default/files/keyboard_key_press_01.ogg',
  laptopKey02:
    'https://opengameart.org/sites/default/files/keyboard_key_press_02.ogg',
  laptopKey03:
    'https://opengameart.org/sites/default/files/keyboard_key_press_03.ogg',
  laptopBackspace:
    'https://opengameart.org/sites/default/files/keyboard_key_press_05.ogg',
  laptopError:
    'https://opengameart.org/sites/default/files/keyboard_key_press_04.ogg',
};

const EKLEE_WAV_DIR = path.join(
  CACHE_DIR,
  'eklee',
  'eklee-KeyPresses-cc0-opengameart',
  'wav44100'
);

const PACK_LAYOUT = {
  mechanical: {
    'key-1.ogg': () => path.join(CACHE_DIR, 'keyboard01.ogg'),
    'key-2.ogg': () => path.join(CACHE_DIR, 'keyboard02.ogg'),
    'spacebar.ogg': () => path.join(CACHE_DIR, 'keyboard02.ogg'),
    'backspace.ogg': () => path.join(CACHE_DIR, 'keyboard01.ogg'),
    'error.ogg': () => path.join(CACHE_DIR, 'keyboard02.ogg'),
  },
  typewriter: {
    'key-1.wav': () => path.join(EKLEE_WAV_DIR, 'eklee-KeyPressOld01.wav'),
    'key-2.wav': () => path.join(EKLEE_WAV_DIR, 'eklee-KeyPressOld02.wav'),
    'key-3.wav': () => path.join(EKLEE_WAV_DIR, 'eklee-KeyPressOld03.wav'),
    'spacebar.wav': () => path.join(EKLEE_WAV_DIR, 'eklee-KeyPressOld04.wav'),
    'backspace.wav': () => path.join(EKLEE_WAV_DIR, 'eklee-KeyPressOld05.wav'),
    'error.wav': () => path.join(EKLEE_WAV_DIR, 'eklee-KeyPressOldEffect01.wav'),
  },
  laptop: {
    'key-1.ogg': () => path.join(CACHE_DIR, 'keyboard_key_press_01.ogg'),
    'key-2.ogg': () => path.join(CACHE_DIR, 'keyboard_key_press_02.ogg'),
    'key-3.ogg': () => path.join(CACHE_DIR, 'keyboard_key_press_03.ogg'),
    'spacebar.ogg': () => path.join(CACHE_DIR, 'keyboard_key_press_03.ogg'),
    'backspace.ogg': () => path.join(CACHE_DIR, 'keyboard_key_press_05.ogg'),
    'error.ogg': () => path.join(CACHE_DIR, 'keyboard_key_press_04.ogg'),
  },
};

const download = async (url, dest) => {
  if (fs.existsSync(dest)) return;

  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url} (${response.status})`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(dest, buffer);
};

const ensureCache = async () => {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const ekleeZipPath = path.join(CACHE_DIR, 'eklee.zip');
  await download(SOURCES.ekleeZip, ekleeZipPath);

  if (!fs.existsSync(EKLEE_WAV_DIR)) {
    if (process.platform === 'win32') {
      execSync(
        `powershell -NoProfile -Command "Expand-Archive -Path '${ekleeZipPath.replace(/'/g, "''")}' -DestinationPath '${path.join(CACHE_DIR, 'eklee').replace(/'/g, "''")}' -Force"`,
        { stdio: 'inherit' }
      );
    } else {
      execSync(`unzip -o "${ekleeZipPath}" -d "${path.join(CACHE_DIR, 'eklee')}"`, {
        stdio: 'inherit',
      });
    }
  }

  await Promise.all(
    Object.entries(SOURCES)
      .filter(([key]) => key !== 'ekleeZip')
      .map(([key, url]) => download(url, path.join(CACHE_DIR, `${key}${path.extname(url)}`)))
  );

  const renameMap = {
    mechanical01: 'keyboard01.ogg',
    mechanical02: 'keyboard02.ogg',
    laptopKey01: 'keyboard_key_press_01.ogg',
    laptopKey02: 'keyboard_key_press_02.ogg',
    laptopKey03: 'keyboard_key_press_03.ogg',
    laptopBackspace: 'keyboard_key_press_05.ogg',
    laptopError: 'keyboard_key_press_04.ogg',
  };

  for (const [key, filename] of Object.entries(renameMap)) {
    const ext = path.extname(filename);
    const downloaded = path.join(CACHE_DIR, `${key}${ext}`);
    const target = path.join(CACHE_DIR, filename);
    if (fs.existsSync(downloaded) && !fs.existsSync(target)) {
      fs.renameSync(downloaded, target);
    }
  }
};

const copyPackFiles = () => {
  for (const [pack, files] of Object.entries(PACK_LAYOUT)) {
    const packDir = path.join(OUT_DIR, pack);
    fs.mkdirSync(packDir, { recursive: true });

    for (const [filename, resolveSource] of Object.entries(files)) {
      const source = resolveSource();
      if (!fs.existsSync(source)) {
        throw new Error(`Missing source for ${pack}/${filename}: ${source}`);
      }
      fs.copyFileSync(source, path.join(packDir, filename));
    }
  }
};

const writeAttribution = () => {
  const text = `# Keyboard sound attribution

Realistic keystroke samples used in this app:

## Mechanical Keyboard pack
- **keyboard01.ogg**, **keyboard02.ogg** — bluszcz, [Mechanical keyboard sound](https://opengameart.org/content/mechanical-keyboard-sound) (CC0)

## Typewriter pack
- **eklee-KeyPressOld\*.wav** — eklee & qubodup, [Single Key Press Sounds](https://opengameart.org/content/single-key-press-sounds) (CC-BY 3.0)

## Laptop Keyboard pack
- **keyboard_key_press_\*.ogg** — Wandering Door Games, [Keyboard Typing](https://opengameart.org/content/keyboard-typing) (CC-BY-SA 4.0)

Re-run \`node backend/scripts/download-keyboard-sounds.mjs\` to refresh assets.
`;

  fs.writeFileSync(path.join(OUT_DIR, 'ATTRIBUTION.md'), text);
};

await ensureCache();
copyPackFiles();
writeAttribution();

console.log('Installed realistic keyboard sounds to', OUT_DIR);
