// Fallback SVG generators and handlers for any failed image loads
export const createSvgPlaceholder = (title = 'GMC Product', category = 'phone') => {
  const bg = category === 'accessories' ? '#0f172a' : '#090d16';
  const accent = '#00f0ff';
  const iconSvg = category === 'accessories' 
    ? `<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" fill="${accent}"/>`
    : `<rect x="7" y="4" width="10" height="16" rx="2" stroke="${accent}" stroke-width="1.5" fill="none"/><circle cx="12" cy="17" r="0.75" fill="${accent}"/>`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
      <rect width="400" height="400" fill="${bg}"/>
      <circle cx="200" cy="180" r="110" fill="${accent}" opacity="0.06"/>
      <g transform="translate(160, 120) scale(3.5)">
        ${iconSvg}
      </g>
      <text x="200" y="270" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#94a3b8" text-anchor="middle" letter-spacing="1">
        GAGAN MOBILE CARE
      </text>
      <text x="200" y="295" font-family="system-ui, -apple-system, sans-serif" font-size="12" fill="#64748b" text-anchor="middle">
        ${title.length > 28 ? title.slice(0, 26) + '...' : title}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

export const DEFAULT_AVATAR = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <rect width="100" height="100" fill="#1e293b"/>
    <circle cx="50" cy="38" r="20" fill="#00f0ff" opacity="0.8"/>
    <ellipse cx="50" cy="85" rx="35" ry="25" fill="#00f0ff" opacity="0.5"/>
  </svg>
`.trim())}`;

export const handleImageError = (e, fallbackTitle = 'GMC Genuine Product', category = 'phone') => {
  if (e.target.dataset.fallbackApplied) return;
  e.target.dataset.fallbackApplied = 'true';
  e.target.src = createSvgPlaceholder(fallbackTitle, category);
};
