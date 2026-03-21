uniform sampler2D uTexture;
uniform vec2      uResolution;
uniform vec2      uImageSize;
uniform float     uHover;
uniform float     uTime;
uniform vec2      uMouse;

varying vec2 vUv;

// ─── COVER FIT ───────────────────────────────────────
// Makes the image behave like CSS object-fit: cover
vec2 coverUv(vec2 uv, vec2 resolution, vec2 imageSize) {
  vec2 s = resolution;
  vec2 i = imageSize;
  float rs = s.x / s.y;
  float ri = i.x / i.y;
  vec2 new = rs < ri
    ? vec2(i.x * s.y / i.y, s.y)
    : vec2(s.x, i.y * s.x / i.x);
  vec2 offset = (new - s) / 2.0;
  return (uv * s + offset) / new;
}

void main() {
  vec2 uv = vUv;

  // Cover fit
  vec2 cUv = coverUv(uv, uResolution, uImageSize);

  // ─── WAVE DISTORTION ──────────────────────────────
  float wave = sin(cUv.x * 10.0 + uTime * 1.5) * 0.004
             + sin(cUv.y * 8.0  + uTime * 1.2) * 0.003;

  vec2 distortedUv = cUv + vec2(wave, wave) * uHover;

  // ─── MOUSE RIPPLE ─────────────────────────────────
  vec2 mouseVec = uv - uMouse;
  float dist    = length(mouseVec);
  float ripple  = sin(dist * 25.0 - uTime * 3.0) * 0.012;
  float falloff = smoothstep(0.5, 0.0, dist);
  distortedUv  += normalize(mouseVec) * ripple * falloff * uHover;

  // ─── RGB SPLIT ────────────────────────────────────
  float split = uHover * 0.008;
  vec2  rOff  = distortedUv + vec2( split, 0.0);
  vec2  gOff  = distortedUv;
  vec2  bOff  = distortedUv - vec2( split, 0.0);

  float r = texture2D(uTexture, rOff).r;
  float g = texture2D(uTexture, gOff).g;
  float b = texture2D(uTexture, bOff).b;
  float a = texture2D(uTexture, distortedUv).a;

  vec4 color = vec4(r, g, b, a);

  // ─── VIGNETTE ─────────────────────────────────────
  vec2  vigUv  = uv * (1.0 - uv.yx);
  float vig    = vigUv.x * vigUv.y * 15.0;
  vig          = pow(vig, 0.25);
  color.rgb   *= mix(1.0, vig, 0.35);

  gl_FragColor = color;
}