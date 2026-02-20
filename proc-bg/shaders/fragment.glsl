precision highp float;

varying vec2 v_uv;

uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_mouse;   // 0..1
uniform float u_intensity;

// Hash / Noise
float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, -1.2, 1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// Soft grid
float grid(vec2 uv, float scale, float thickness) {
  vec2 gv = fract(uv * scale);
  float lineX = step(gv.x, thickness) + step(1.0 - gv.x, thickness);
  float lineY = step(gv.y, thickness) + step(1.0 - gv.y, thickness);

  float line = clamp(lineX + lineY, 0.0, 1.0);

  #ifdef GL_OES_standard_derivatives
    vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
    line = 1.0 - min(min(g.x, g.y), 1.0);
    line = smoothstep(0.0, thickness, line);
  #endif

  return line;
}

void main() {
  // Aspect-correct UV in -1..1
  vec2 uv = v_uv * 2.0 - 1.0;
  float aspect = u_res.x / u_res.y;
  uv.x *= aspect;

  // Mouse parallax (subtle)
  vec2 m = (u_mouse * 2.0 - 1.0);
  m.x *= aspect;
  uv += 0.08 * m * u_intensity;

  // Base background
  vec3 base = vec3(0.03, 0.04, 0.06);

  // Flow field via fbm
  float t = u_time * 0.07;
  vec2 p = uv * 1.2;
  float n1 = fbm(p + vec2(t, -t));
  float n2 = fbm(p * 1.8 + vec2(-t * 1.3, t * 0.9));
  float flow = n1 * 0.65 + n2 * 0.35;

  // Soft vignette
  float r = length(uv);
  float vign = smoothstep(1.25, 0.35, r);

  // Grid overlay (tech vibe)
  float g1 = grid((uv + 0.04 * flow) * 0.5 + 0.5, 18.0, 0.65);
  float g2 = grid((uv - 0.02 * flow) * 0.5 + 0.5, 60.0, 0.40);
  float gridMix = (g1 * 0.55 + g2 * 0.22) * vign;

  // Two glow lobes (orange + blue), animated + mouse attract
  vec2 c1 = vec2(-0.55, 0.10) + 0.12 * vec2(sin(u_time * 0.25), cos(u_time * 0.22));
  vec2 c2 = vec2( 0.55,-0.20) + 0.10 * vec2(cos(u_time * 0.20), sin(u_time * 0.27));
  c1 += 0.18 * m;
  c2 -= 0.14 * m;

  float d1 = length(uv - c1);
  float d2 = length(uv - c2);
  float glow1 = pow(clamp(1.0 - d1, 0.0, 1.0), 3.2);
  float glow2 = pow(clamp(1.0 - d2, 0.0, 1.0), 3.0);

  vec3 orange = vec3(1.00, 0.45, 0.08);
  vec3 blue   = vec3(0.22, 0.58, 1.00);

  // Film-ish noise grain
  float grain = hash21(v_uv * u_res + fract(u_time) * 999.0);
  grain = (grain - 0.5) * 0.06;

  // Compose
  vec3 col = base;

  // Flow tinting
  col += vec3(0.08, 0.10, 0.14) * (flow - 0.45) * vign * 0.9;

  // Glows
  col += orange * glow1 * 0.55 * u_intensity;
  col += blue   * glow2 * 0.45 * u_intensity;

  // Grid (subtle)
  col += vec3(0.10, 0.13, 0.18) * gridMix * 0.9;

  // Vignette
  col *= (0.55 + 0.45 * vign);

  // Grain
  col += grain;

  gl_FragColor = vec4(col, 0.98);
}