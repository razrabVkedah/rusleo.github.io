import { clamp01, loadText, makeUrl, setFallbackBackground } from './utils.js';
import { createGL, createProgram, getDerivativesHeader, setupFullscreenQuad } from './webgl.js';

export const initBackground = async (selector = '.proc-bg') => {
    const canvas = document.querySelector(selector);
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const gl = createGL(canvas);
    if (!gl) {
        canvas.style.display = 'none';
        setFallbackBackground();
        return;
    }

    const vsUrl = makeUrl('./shaders/vertex.glsl');
    const fsUrl = makeUrl('./shaders/fragment.glsl');

    let vertexSrc = '';
    let fragSrc = '';

    try {
        vertexSrc = await loadText(vsUrl);
        fragSrc = await loadText(fsUrl);
    } catch (e) {
        console.warn(e);
        canvas.style.display = 'none';
        setFallbackBackground();
        return;
    }

    const derivativesHeader = getDerivativesHeader(gl);
    const fragFinal = derivativesHeader + fragSrc;

    const program = createProgram(gl, vertexSrc, fragFinal);
    if (!program) {
        canvas.style.display = 'none';
        setFallbackBackground();
        return;
    }

    gl.useProgram(program);
    setupFullscreenQuad(gl, program);

    const uResLoc = gl.getUniformLocation(program, 'u_res');
    const uTimeLoc = gl.getUniformLocation(program, 'u_time');
    const uMouseLoc = gl.getUniformLocation(program, 'u_mouse');
    const uIntLoc = gl.getUniformLocation(program, 'u_intensity');

    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;

    const mouse = { x: 0.5, y: 0.5 };
    const mouseTarget = { x: 0.5, y: 0.5 };

    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        const cw = Math.floor(window.innerWidth * dpr);
        const ch = Math.floor(window.innerHeight * dpr);

        if (cw === w && ch === h) return;

        w = cw;
        h = ch;

        canvas.width = w;
        canvas.height = h;
        canvas.style.width = '100%';
        canvas.style.height = '100%';

        gl.viewport(0, 0, w, h);
        if (uResLoc) gl.uniform2f(uResLoc, w, h);
    };

    const onPointerMove = (e) => {
        const x = e.clientX / Math.max(1, window.innerWidth);
        const y = 1.0 - e.clientY / Math.max(1, window.innerHeight);
        mouseTarget.x = clamp01(x);
        mouseTarget.y = clamp01(y);
    };

    const onTouchMove = (e) => {
        if (!e.touches || e.touches.length === 0) return;
        const t = e.touches[0];
        onPointerMove({ clientX: t.clientX, clientY: t.clientY });
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    let start = performance.now();
    let raf = 0;

    const tick = (now) => {
        const time = (now - start) * 0.001;

        const k = prefersReducedMotion ? 0.08 : 0.12;
        mouse.x += (mouseTarget.x - mouse.x) * k;
        mouse.y += (mouseTarget.y - mouse.y) * k;

        const intensity = prefersReducedMotion ? 0.25 : 1.0;

        gl.useProgram(program);
        if (uTimeLoc) gl.uniform1f(uTimeLoc, time);
        if (uMouseLoc) gl.uniform2f(uMouseLoc, mouse.x, mouse.y);
        if (uIntLoc) gl.uniform1f(uIntLoc, intensity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        raf = requestAnimationFrame(tick);
    };

    const onVisibilityChange = () => {
        if (document.hidden) {
            cancelAnimationFrame(raf);
            raf = 0;
            return;
        }
        if (!raf) raf = requestAnimationFrame(tick);
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    resize();
    raf = requestAnimationFrame(tick);
};