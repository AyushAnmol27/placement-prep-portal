import { useEffect, useRef } from 'react';

/**
 * Minimal custom cursor — dot only.
 * Snaps directly to raw mouse position via transform (no layout cost).
 */
const CustomCursor = () => {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;

    /* ── Theme-aware dot color ── */
    const applyTheme = () => {
      const dark = document.documentElement.getAttribute('data-theme') !== 'light';
      const color = dark ? '#6366f1' : '#4f46e5';
      dot.style.background = color;
      dot.style.boxShadow = dark
        ? `0 0 8px ${color}, 0 0 18px rgba(99,102,241,0.5)`
        : `0 0 6px ${color}`;
    };
    applyTheme();

    const themeObserver = new MutationObserver(applyTheme);
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    /* ── Mouse listeners ── */
    let hidden = false;

    const onMove = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (hidden) {
        hidden = false;
        dot.style.opacity = '1';
      }
    };

    const onLeaveWindow = () => {
      hidden = true;
      dot.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeaveWindow);

    return () => {
      themeObserver.disconnect();
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeaveWindow);
    };
  }, []);

  return (
    <div ref={dotRef} style={{
      position: 'fixed', pointerEvents: 'none', zIndex: 99999,
      width: 7, height: 7,
      background: '#6366f1',
      borderRadius: '50%',
      transform: 'translate(0,0)',
      willChange: 'transform',
      top: '-3.5px', left: '-3.5px',
      transition: 'opacity 0.2s ease',
    }} />
  );
};

export default CustomCursor;
