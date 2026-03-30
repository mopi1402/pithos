/**
 * Web Audio API engine — loads, plays, pauses, seeks audio tracks.
 * Independent from the visualizer (that's the bridge).
 */

import type { AudioFrame } from "./types";

let audioCtx: AudioContext | null = null;
let analyser: AnalyserNode | null = null;
let gainNode: GainNode | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let currentBuffer: AudioBuffer | null = null;
let startOffset = 0;
let startTime = 0;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.82;
    gainNode = audioCtx.createGain();
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  }
  return audioCtx;
}

const bufferCache = new Map<string, AudioBuffer>();
let loadVersion = 0;

export async function loadAndPlay(url: string): Promise<void> {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") await ctx.resume();
  if (currentSourceNode) { currentSourceNode.stop(); currentSourceNode.disconnect(); currentSourceNode = null; }
  const version = ++loadVersion;
  let buffer = bufferCache.get(url);
  if (!buffer) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    buffer = await ctx.decodeAudioData(arrayBuffer);
    bufferCache.set(url, buffer);
  }
  if (version !== loadVersion) return;
  currentBuffer = buffer;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.connect(analyser as AnalyserNode);
  source.start(0);
  startOffset = 0;
  startTime = ctx.currentTime;
  currentSourceNode = source;
}

export function stopPlayback(): void {
  if (currentSourceNode) { currentSourceNode.stop(); currentSourceNode.disconnect(); currentSourceNode = null; }
}

export function pausePlayback(): void {
  if (audioCtx?.state === "running") audioCtx.suspend();
}

export function resumePlayback(): void {
  if (audioCtx?.state === "suspended") audioCtx.resume();
}

export function setVolume(v: number): void {
  if (gainNode) gainNode.gain.value = v;
}

export function getVolume(): number {
  return gainNode ? gainNode.gain.value : 1;
}

export function isPlaying(): boolean {
  return currentSourceNode !== null && audioCtx !== null && audioCtx.state === "running";
}

export function getCurrentTime(): number {
  if (!audioCtx || !currentBuffer) return 0;
  const elapsed = audioCtx.currentTime - startTime + startOffset;
  return elapsed % currentBuffer.duration;
}

export function seekTo(time: number): void {
  if (!audioCtx || !currentBuffer || !analyser) return;
  if (currentSourceNode) { currentSourceNode.stop(); currentSourceNode.disconnect(); }
  const source = audioCtx.createBufferSource();
  source.buffer = currentBuffer;
  source.loop = true;
  source.connect(analyser);
  source.start(0, time);
  startOffset = time;
  startTime = audioCtx.currentTime;
  currentSourceNode = source;
}

export function getDuration(): number {
  return currentBuffer?.duration ?? 0;
}

export function readFrame(): AudioFrame {
  if (!analyser) return new Uint8Array(256);
  const data = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(data);
  return data;
}
