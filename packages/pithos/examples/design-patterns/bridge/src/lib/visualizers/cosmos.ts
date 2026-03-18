/**
 * Cosmos — WebGL feedback-loop visualizer with warp, zoom, rotation,
 * and audio-reactive energy injection. Ping-pong framebuffers.
 */

import type { Visualizer } from "../types";
import { bandAmp } from "./helpers";

let glCanvas: HTMLCanvasElement | null = null;
let gl: WebGLRenderingContext | null = null;
let glProg: WebGLProgram | null = null;
let glTexA: WebGLTexture | null = null;
let glTexB: WebGLTexture | null = null;
let glFbA: WebGLFramebuffer | null = null;
let glFbB: WebGLFramebuffer | null = null;
let glPing = true;
let glW = 0;
let glH = 0;
let glU: Record<string, WebGLUniformLocation | null> = {};

const VS = `attribute vec2 p;varying vec2 uv;void main(){uv=p*.5+.5;gl_Position=vec4(p,0,1);}`;

const FS = `precision mediump float;
varying vec2 uv;
uniform sampler2D tex;
uniform float time,beat,bass,mid,hi,depth;
uniform vec2 resolution;
vec3 pal(float t){return .5+.5*cos(6.28*(t+vec3(.0,.15,.45)));}
void main(){
  vec2 c=uv-0.5;float r=length(c);float a=atan(c.y,c.x);
  float warp=0.012*(1.0+bass*depth*3.0);
  float zm=0.997-(bass*depth*.004);
  float rot=0.002+mid*depth*.008;
  vec2 tc=c*zm;float wa=a+sin(r*8.0-time*2.0)*warp+rot;
  tc=vec2(cos(wa),sin(wa))*length(tc);
  vec4 prev=texture2D(tex,tc+0.5);prev.rgb*=0.92;
  float ring=smoothstep(.02,.0,abs(r-fract(time*.3+bass*.3)*.5))*bass*depth;
  float center=exp(-r*r*8.0)*beat*.4*depth;
  float wave2=sin(a*3.0+time*2.0+r*8.0)*.5+.5;
  wave2*=smoothstep(.5,.2,r)*mid*depth*.5;
  float hiPat=sin(a*8.0+time*4.0)*sin(r*20.0-time*6.0);
  hiPat=max(0.0,hiPat)*hi*depth*.3*smoothstep(.6,.3,r);
  float energy=ring+center+wave2+hiPat;
  vec3 col=pal(time*0.001+r*.5+a*.15+energy*.3)*energy;
  gl_FragColor=vec4(clamp(prev.rgb+col,0.0,1.0),1.0);
}`;

function compile(g: WebGLRenderingContext, src: string, type: number): WebGLShader {
  const s = g.createShader(type);
  if (!s) throw new Error("shader"); g.shaderSource(s, src); g.compileShader(s); return s;
}

function makeTex(g: WebGLRenderingContext, w: number, h: number): WebGLTexture {
  const t = g.createTexture(); if (!t) throw new Error("tex");
  g.bindTexture(g.TEXTURE_2D, t);
  g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR);
  g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR);
  g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE);
  g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE);
  g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, w, h, 0, g.RGBA, g.UNSIGNED_BYTE, null);
  return t;
}

function makeFb(g: WebGLRenderingContext, tex: WebGLTexture): WebGLFramebuffer {
  const fb = g.createFramebuffer(); if (!fb) throw new Error("fb");
  g.bindFramebuffer(g.FRAMEBUFFER, fb);
  g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tex, 0);
  return fb;
}

function init(w: number, h: number): void {
  glCanvas = document.createElement("canvas"); glCanvas.width = w; glCanvas.height = h;
  gl = glCanvas.getContext("webgl", { alpha: false, preserveDrawingBuffer: true });
  if (!gl) return;
  const prog = gl.createProgram(); if (!prog) return;
  gl.attachShader(prog, compile(gl, VS, gl.VERTEX_SHADER));
  gl.attachShader(prog, compile(gl, FS, gl.FRAGMENT_SHADER));
  gl.linkProgram(prog); gl.useProgram(prog); glProg = prog;
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
  const pLoc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(pLoc); gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);
  glTexA = makeTex(gl, w, h); glTexB = makeTex(gl, w, h);
  glFbA = makeFb(gl, glTexA); glFbB = makeFb(gl, glTexB);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  glU = {};
  for (const n of ["tex","time","beat","bass","mid","hi","depth","resolution"])
    glU[n] = gl.getUniformLocation(prog, n);
  glW = w; glH = h; glPing = true;
}

function ensureSize(w: number, h: number): void {
  const tw = Math.floor(w * 0.5), th = Math.floor(h * 0.5);
  if (tw === glW && th === glH && gl) return;
  if (!gl) { init(tw, th); return; }
  if (glCanvas) { glCanvas.width = tw; glCanvas.height = th; }
  [glTexA, glTexB].forEach(tex => {
    if (!gl || !tex) return;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, tw, th, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  });
  glW = tw; glH = th;
}

export const cosmosVisualizer: Visualizer = (ctx, frame, w, h, _accent, t) => {
  ensureSize(w, h);
  if (!gl || !glCanvas || !glProg) return;

  const bass = bandAmp(frame, 0, 0.1);
  const mid = bandAmp(frame, 0.1, 0.5);
  const hi = bandAmp(frame, 0.5, 1);

  gl.useProgram(glProg);
  const readTex = glPing ? glTexA : glTexB;
  const writeFb = glPing ? glFbB : glFbA;

  gl.bindFramebuffer(gl.FRAMEBUFFER, writeFb);
  gl.viewport(0, 0, glW, glH);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, readTex);
  gl.uniform1i(glU.tex, 0);
  gl.uniform1f(glU.time, t); gl.uniform1f(glU.beat, bass);
  gl.uniform1f(glU.bass, bass); gl.uniform1f(glU.mid, mid); gl.uniform1f(glU.hi, hi);
  gl.uniform1f(glU.depth, 1.0); gl.uniform2f(glU.resolution, glW, glH);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.viewport(0, 0, glW, glH);
  gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, glPing ? glTexB : glTexA);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  glPing = !glPing;

  ctx.drawImage(glCanvas, 0, 0, w, h);
};
