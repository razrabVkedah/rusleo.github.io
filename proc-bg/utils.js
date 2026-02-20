export const clamp01 = (v) => Math.min(1, Math.max(0, v));

export const setFallbackBackground = () => {
    document.documentElement.style.background =
        'radial-gradient(1200px 800px at 20% 10%, rgba(255,140,0,0.16), transparent 55%),' +
        'radial-gradient(900px 700px at 80% 30%, rgba(80,170,255,0.14), transparent 60%), #070a10';
    document.body.style.background = 'transparent';
};

export const loadText = async (url) => {
    const res = await fetch(url, { cache: 'force-cache' });
    if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
    return await res.text();
};

export const makeUrl = (relativePath) => new URL(relativePath, import.meta.url);