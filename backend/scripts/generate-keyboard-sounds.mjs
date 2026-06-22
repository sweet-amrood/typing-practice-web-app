#!/usr/bin/env node
/**
 * @deprecated Use download-keyboard-sounds.mjs for realistic recorded samples.
 * This script generates synthetic placeholder WAVs and is kept for offline fallback only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, '../../frontend/public/sounds');
const SAMPLE_RATE = 44100;

const writeWav = (filePath, samples) => {
  const numSamples = samples.length;
  const buffer = Buffer.alloc(44 + numSamples * 2);
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i += 1) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
};

const envelope = (t, attack, decay) => {
  if (t < attack) return t / attack;
  return Math.exp(-(t - attack) * decay);
};

const noise = () => Math.random() * 2 - 1;

const synthMechanicalKey = (seed = 0) => {
  const duration = 0.055;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);
  const baseFreq = 220 + seed * 18;

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.001, 90);
    const click = noise() * 0.55 * Math.exp(-t * 120);
    const body = Math.sin(2 * Math.PI * baseFreq * t) * 0.35 * env;
    const overtone = Math.sin(2 * Math.PI * baseFreq * 2.1 * t) * 0.12 * env;
    samples[i] = (click + body + overtone) * 0.7;
  }

  return samples;
};

const synthMechanicalSpacebar = () => {
  const duration = 0.1;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.002, 45);
    const thump = Math.sin(2 * Math.PI * 95 * t) * 0.55 * env;
    const rattle = noise() * 0.25 * Math.exp(-t * 35) * env;
    const plate = Math.sin(2 * Math.PI * 180 * t) * 0.15 * Math.exp(-t * 60);
    samples[i] = (thump + rattle + plate) * 0.85;
  }

  return samples;
};

const synthMechanicalError = () => {
  const duration = 0.09;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.001, 55);
    const tone = Math.sin(2 * Math.PI * 140 * t) * 0.4 * env;
    const buzz = noise() * 0.3 * env;
    samples[i] = (tone + buzz) * 0.65;
  }

  return samples;
};

const synthTypewriterKey = (seed = 0) => {
  const duration = 0.04;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);
  const metal = 680 + seed * 40;

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.0005, 110);
    const strike = noise() * 0.7 * Math.exp(-t * 150);
    const ring = Math.sin(2 * Math.PI * metal * t) * 0.25 * env;
    samples[i] = (strike + ring) * 0.75;
  }

  return samples;
};

const synthTypewriterSpacebar = () => {
  const duration = 0.07;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.001, 70);
    const clang = Math.sin(2 * Math.PI * 320 * t) * 0.35 * env;
    const snap = noise() * 0.5 * Math.exp(-t * 100);
    const carriage = Math.sin(2 * Math.PI * 120 * t) * 0.2 * Math.exp(-t * 40);
    samples[i] = (clang + snap + carriage) * 0.8;
  }

  return samples;
};

const synthScifiKey = (seed = 0) => {
  const duration = 0.08;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);
  const startFreq = 520 + seed * 30;
  const endFreq = 880 + seed * 20;

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const p = t / duration;
    const freq = startFreq + (endFreq - startFreq) * p;
    const env = envelope(t, 0.002, 35);
    const sweep = Math.sin(2 * Math.PI * freq * t) * 0.35 * env;
    const shimmer = Math.sin(2 * Math.PI * freq * 1.5 * t) * 0.12 * env;
    samples[i] = (sweep + shimmer) * 0.7;
  }

  return samples;
};

const synthScifiSpacebar = () => {
  const duration = 0.12;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const p = t / duration;
    const freq = 180 - p * 60;
    const env = envelope(t, 0.003, 28);
    const bass = Math.sin(2 * Math.PI * freq * t) * 0.45 * env;
    const pad = Math.sin(2 * Math.PI * (freq * 2.5) * t) * 0.15 * env;
    samples[i] = (bass + pad) * 0.75;
  }

  return samples;
};

const synthRetroKey = (seed = 0) => {
  const duration = 0.06;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);
  const freq = seed % 2 === 0 ? 523.25 : 659.25;

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.001, 50);
    const square = Math.sign(Math.sin(2 * Math.PI * freq * t)) * 0.22 * env;
    const blip = Math.sin(2 * Math.PI * freq * t) * 0.28 * env;
    samples[i] = (square + blip) * 0.65;
  }

  return samples;
};

const synthRetroSpacebar = () => {
  const duration = 0.09;
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);

  for (let i = 0; i < len; i += 1) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.002, 38);
    const low = Math.sign(Math.sin(2 * Math.PI * 196 * t)) * 0.28 * env;
    const mid = Math.sin(2 * Math.PI * 392 * t) * 0.18 * Math.exp(-t * 30);
    samples[i] = (low + mid) * 0.7;
  }

  return samples;
};

const synthErrorGeneric = (style = 'scifi') => {
  if (style === 'retro') {
    const duration = 0.1;
    const len = Math.floor(SAMPLE_RATE * duration);
    const samples = new Float32Array(len);
    for (let i = 0; i < len; i += 1) {
      const t = i / SAMPLE_RATE;
      const env = envelope(t, 0.001, 40);
      samples[i] = Math.sign(Math.sin(2 * Math.PI * 110 * t)) * 0.3 * env;
    }
    return samples;
  }

  return synthMechanicalError();
};

const packs = {
  mechanical: {
    keys: [0, 1, 2].map((seed) => synthMechanicalKey(seed)),
    spacebar: synthMechanicalSpacebar(),
    error: synthMechanicalError(),
  },
  typewriter: {
    keys: [0, 1, 2].map((seed) => synthTypewriterKey(seed)),
    spacebar: synthTypewriterSpacebar(),
    error: synthMechanicalError(),
  },
  scifi: {
    keys: [0, 1, 2].map((seed) => synthScifiKey(seed)),
    spacebar: synthScifiSpacebar(),
    error: synthErrorGeneric('scifi'),
  },
  retro: {
    keys: [0, 1, 2].map((seed) => synthRetroKey(seed)),
    spacebar: synthRetroSpacebar(),
    error: synthErrorGeneric('retro'),
  },
};

for (const [pack, sounds] of Object.entries(packs)) {
  const dir = path.join(OUT_DIR, pack);
  sounds.keys.forEach((samples, index) => {
    writeWav(path.join(dir, `key-${index + 1}.wav`), samples);
  });
  writeWav(path.join(dir, 'spacebar.wav'), sounds.spacebar);
  writeWav(path.join(dir, 'error.wav'), sounds.error);
}

console.log('Generated keyboard sounds in', OUT_DIR);
