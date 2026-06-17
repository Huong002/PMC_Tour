/**
 * Tạo ảnh placeholder SVG dạng Data URL với giao diện gradient cao cấp.
 * Tránh phụ thuộc vào dịch vụ bên ngoài (như via.placeholder.com) có thể bị lỗi mạng.
 */
export function getPlaceholderImage(width: number, height: number, text: string = 'VietTour'): string {
  const fontSize = Math.max(10, Math.round(height * 0.12));
  const isSmall = width < 150;
  const textY = isSmall ? '50%' : `${Math.round(height * 0.48)}%`;
  const subTextY = `${Math.round(height * 0.64)}%`;
  
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
    <defs>
      <linearGradient id="grad-${width}-${height}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b" />
        <stop offset="50%" stop-color="#334155" />
        <stop offset="100%" stop-color="#0f172a" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad-${width}-${height})"/>
    <text x="50%" y="${textY}" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" font-weight="bold" fill="#3b82f6" text-anchor="middle" dominant-baseline="middle" letter-spacing="1">
      ${text.toUpperCase()}
    </text>
    ${isSmall ? '' : `
    <text x="50%" y="${subTextY}" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.max(8, Math.round(fontSize * 0.4))}" font-weight="500" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle">
      Hình ảnh Tour
    </text>
    `}
  </svg>`;
  
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
