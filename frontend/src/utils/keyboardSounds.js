let audioContext = null;
const bufferCache = new Map();
const loadingPromises = new Map();
const warmedPacks = new Map();
const keyRoundRobin = {};

const PACK_ALIASES = {
  scifi: 'laptop',
  retro: 'typewriter',
};

const PACK_SOUNDS = {
  mechanical: {
    keys: [
      '/sounds/mechanical/key-1.ogg',
      '/sounds/mechanical/key-2.ogg',
    ],
    spacebar: '/sounds/mechanical/spacebar.ogg',
    backspace: '/sounds/mechanical/backspace.ogg',
    error: '/sounds/mechanical/error.ogg',
  },
  typewriter: {
    keys: [
      '/sounds/typewriter/key-1.wav',
      '/sounds/typewriter/key-2.wav',
      '/sounds/typewriter/key-3.wav',
    ],
    spacebar: '/sounds/typewriter/spacebar.wav',
    backspace: '/sounds/typewriter/backspace.wav',
    error: '/sounds/typewriter/error.wav',
  },
  laptop: {
    keys: [
      '/sounds/laptop/key-1.ogg',
      '/sounds/laptop/key-2.ogg',
      '/sounds/laptop/key-3.ogg',
    ],
    spacebar: '/sounds/laptop/spacebar.ogg',
    backspace: '/sounds/laptop/backspace.ogg',
    error: '/sounds/laptop/error.ogg',
  },
};

const PACK_TRIM_SECONDS = {};

const STRIKE_EXTRACT = {
  mechanical: {
    key: { scanSeconds: 0.4, strikeSeconds: 0.11, preRollSeconds: 0.003, threshold: 0.045 },
    spacebar: { scanSeconds: 0.4, strikeSeconds: 0.13, preRollSeconds: 0.003, threshold: 0.04 },
    backspace: { scanSeconds: 0.4, strikeSeconds: 0.1, preRollSeconds: 0.003, threshold: 0.045 },
    error: { scanSeconds: 0.4, strikeSeconds: 0.11, preRollSeconds: 0.003, threshold: 0.04 },
  },
};

const PACK_TUNING = {
  mechanical: {
    key: { volume: 0.5, rate: 1, duration: null },
    spacebar: { volume: 0.56, rate: 1, duration: null },
    backspace: { volume: 0.48, rate: 1, duration: null },
    error: { volume: 0.46, rate: 1, duration: null },
    roundRobin: true,
  },
  typewriter: {
    key: { volume: 0.52, rate: 1, duration: 0.09 },
    spacebar: { volume: 0.62, rate: 1, duration: 0.14 },
    backspace: { volume: 0.52, rate: 1, duration: 0.1 },
    error: { volume: 0.5, rate: 1, duration: 0.12 },
  },
  laptop: {
    key: { volume: 0.5, rate: 1, duration: null },
    spacebar: { volume: 0.58, rate: 1, duration: null },
    backspace: { volume: 0.48, rate: 1, duration: null },
    error: { volume: 0.46, rate: 1, duration: null },
  },
};

const DEFAULT_TUNING = {
  key: { volume: 0.52, rate: 1, duration: null },
  spacebar: { volume: 0.62, rate: 1, duration: null },
  backspace: { volume: 0.52, rate: 1, duration: null },
  error: { volume: 0.5, rate: 1, duration: null },
  roundRobin: false,
};

const getTuning = (packType) => ({
  ...DEFAULT_TUNING,
  ...(PACK_TUNING[packType] ?? {}),
});

const getContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)({
      latencyHint: 'interactive',
    });
  }
  return audioContext;
};

const resumeContext = () => {
  const ctx = getContext();
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
  return ctx;
};

const trimBuffer = (ctx, buffer, maxSeconds) => {
  const maxSamples = Math.floor(buffer.sampleRate * maxSeconds);
  if (maxSamples >= buffer.length) return buffer;

  const trimmed = ctx.createBuffer(
    buffer.numberOfChannels,
    maxSamples,
    buffer.sampleRate
  );

  for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
    trimmed
      .getChannelData(channel)
      .set(buffer.getChannelData(channel).subarray(0, maxSamples));
  }

  return trimmed;
};

const extractFirstStrike = (
  ctx,
  buffer,
  { scanSeconds = 0.35, strikeSeconds = 0.1, preRollSeconds = 0.004, threshold = 0.05 } = {}
) => {
  const sampleRate = buffer.sampleRate;
  const channel = buffer.getChannelData(0);
  const scanSamples = Math.min(channel.length, Math.floor(sampleRate * scanSeconds));
  const preRoll = Math.floor(sampleRate * preRollSeconds);
  const strikeSamples = Math.floor(sampleRate * strikeSeconds);

  let strikeStart = 0;
  for (let i = 0; i < scanSamples; i += 1) {
    if (Math.abs(channel[i]) >= threshold) {
      strikeStart = Math.max(0, i - preRoll);
      break;
    }
  }

  const end = Math.min(buffer.length, strikeStart + strikeSamples);
  const length = Math.max(1, end - strikeStart);

  const trimmed = ctx.createBuffer(buffer.numberOfChannels, length, sampleRate);
  for (let ch = 0; ch < buffer.numberOfChannels; ch += 1) {
    trimmed.getChannelData(ch).set(buffer.getChannelData(ch).subarray(strikeStart, end));
  }

  return trimmed;
};

const getBufferCacheKey = (url, { packType = null, role = 'key', trimSeconds = null } = {}) => {
  const extract = packType ? STRIKE_EXTRACT[packType]?.[role] : null;
  if (extract) return `${url}#strike-${packType}-${role}`;
  if (trimSeconds) return `${url}#${trimSeconds}`;
  return url;
};

const loadBuffer = async (url, { packType = null, role = 'key', trimSeconds = null } = {}) => {
  const cacheKey = getBufferCacheKey(url, { packType, role, trimSeconds });

  if (!trimSeconds && !STRIKE_EXTRACT[packType]?.[role]) {
    for (const key of bufferCache.keys()) {
      if (key.startsWith(`${url}#`)) {
        bufferCache.delete(key);
        loadingPromises.delete(key);
      }
    }
  }

  if (bufferCache.has(cacheKey)) {
    return bufferCache.get(cacheKey);
  }

  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }

  const promise = (async () => {
    const ctx = resumeContext();
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load sound: ${url}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    let audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const extract = packType ? STRIKE_EXTRACT[packType]?.[role] : null;
    if (extract) {
      audioBuffer = extractFirstStrike(ctx, audioBuffer, extract);
    } else if (trimSeconds) {
      audioBuffer = trimBuffer(ctx, audioBuffer, trimSeconds);
    }

    bufferCache.set(cacheKey, audioBuffer);
    loadingPromises.delete(cacheKey);
    return audioBuffer;
  })();

  loadingPromises.set(cacheKey, promise);
  return promise;
};

const rebuildWarmCache = (packType) => {
  const pack = PACK_SOUNDS[packType];
  if (!pack) return;

  const resolve = (url, role) =>
    bufferCache.get(getBufferCacheKey(url, { packType, role })) ??
    bufferCache.get(url) ??
    null;

  warmedPacks.set(packType, {
    keys: pack.keys.map((url) => resolve(url, 'key')).filter(Boolean),
    spacebar: resolve(pack.spacebar, 'spacebar'),
    backspace: resolve(pack.backspace, 'backspace'),
    error: resolve(pack.error, 'error'),
  });
};

const preloadPack = async (packType) => {
  const pack = PACK_SOUNDS[packType];
  if (!pack) return;

  const trimSeconds = PACK_TRIM_SECONDS[packType] ?? null;

  await Promise.all([
    ...pack.keys.map((url) =>
      loadBuffer(url, { packType, role: 'key', trimSeconds }).catch(() => null)
    ),
    loadBuffer(pack.spacebar, { packType, role: 'spacebar', trimSeconds }).catch(() => null),
    loadBuffer(pack.backspace, { packType, role: 'backspace', trimSeconds }).catch(() => null),
    loadBuffer(pack.error, { packType, role: 'error', trimSeconds }).catch(() => null),
  ]);
  rebuildWarmCache(packType);
};

const playBuffer = (ctx, buffer, { volume = 0.55, rate = 1, duration = null } = {}) => {
  if (!buffer) return;

  const source = ctx.createBufferSource();
  const gainNode = ctx.createGain();

  source.buffer = buffer;
  source.playbackRate.value = rate;
  gainNode.gain.value = volume;

  source.connect(gainNode);
  gainNode.connect(ctx.destination);

  const when = ctx.currentTime;
  if (duration != null && duration > 0) {
    source.start(when, 0, Math.min(duration, buffer.duration));
  } else {
    source.start(when, 0);
  }
};

const pickKeyBuffer = (packType, keys) => {
  if (!keys.length) return null;

  const tuning = getTuning(packType);
  if (tuning.roundRobin) {
    const index = keyRoundRobin[packType] ?? 0;
    keyRoundRobin[packType] = (index + 1) % keys.length;
    return keys[index];
  }

  return keys[Math.floor(Math.random() * keys.length)];
};

const playFromWarmCache = (ctx, packType, warmed, { isError, isBackspace, char }) => {
  const tuning = getTuning(packType);

  if (isError) {
    playBuffer(ctx, warmed.error, tuning.error);
    return;
  }

  if (isBackspace) {
    playBuffer(ctx, warmed.backspace, tuning.backspace);
    return;
  }

  if (char === ' ') {
    playBuffer(ctx, warmed.spacebar, tuning.spacebar);
    return;
  }

  playBuffer(ctx, pickKeyBuffer(packType, warmed.keys), tuning.key);
};

const playKeystrokeCold = async (soundPackId, options) => {
  const packType = resolveSoundPackType(soundPackId);
  if (!packType) return;

  try {
    const ctx = resumeContext();
    await preloadPack(packType);

    const warmed = warmedPacks.get(packType);
    if (warmed?.keys?.length) {
      playFromWarmCache(ctx, packType, warmed, options);
    }
  } catch {
    // Audio may be blocked until user gesture; ignore silently.
  }
};

export const resolveSoundPackType = (soundPackId) => {
  if (!soundPackId || soundPackId === 'sound-none') return null;
  const packType = soundPackId.replace(/^sound-/, '');
  return PACK_ALIASES[packType] ?? packType;
};

export const warmSoundPack = (soundPackId) => {
  const packType = resolveSoundPackType(soundPackId);
  if (!packType) return Promise.resolve();

  warmedPacks.delete(packType);
  resumeContext();
  return preloadPack(packType);
};

export const playKeystrokeSound = (
  soundPackId,
  { isError = false, isBackspace = false, char = '' } = {}
) => {
  const packType = resolveSoundPackType(soundPackId);
  if (!packType) return;

  const ctx = resumeContext();
  const warmed = warmedPacks.get(packType);

  if (warmed?.keys?.length) {
    playFromWarmCache(ctx, packType, warmed, { isError, isBackspace, char });
    return;
  }

  void playKeystrokeCold(soundPackId, { isError, isBackspace, char });
};

export const previewSoundPack = (soundPackId) =>
  playKeystrokeSound(soundPackId, { isError: false, char: 'a' });

export const previewSpacebarSound = (soundPackId) =>
  playKeystrokeSound(soundPackId, { isError: false, char: ' ' });

export const previewBackspaceSound = (soundPackId) =>
  playKeystrokeSound(soundPackId, { isBackspace: true });
