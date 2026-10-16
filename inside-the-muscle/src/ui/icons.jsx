const P = {
  play: 'M8 5.5v13l11-6.5z',
  pause: 'M7 5h3.5v14H7zM13.5 5H17v14h-3.5z',
  prev: 'M7 6h2v12H7zM20 6v12l-9-6z',
  next: 'M15 6h2v12h-2zM4 6v12l9-6z',
  rotate: 'M12 4a8 8 0 1 1-7.4 5H2l3.5-4L9 9H6.7A6 6 0 1 0 12 6z',
  zoomIn: 'M10.5 4a6.5 6.5 0 0 1 5.2 10.4l4.3 4.3-1.4 1.4-4.3-4.3A6.5 6.5 0 1 1 10.5 4zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM9.5 8h2v1.5H13v2h-1.5V13h-2v-1.5H8v-2h1.5z',
  zoomOut: 'M10.5 4a6.5 6.5 0 0 1 5.2 10.4l4.3 4.3-1.4 1.4-4.3-4.3A6.5 6.5 0 1 1 10.5 4zm0 2a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9zM8 9.5h5v2H8z',
  layers: 'M12 3l9 5-9 5-9-5zm-9 9l2-1.1 7 3.9 7-3.9 2 1.1-9 5zm0 4l2-1.1 7 3.9 7-3.9 2 1.1-9 5z',
  split: 'M11 3h2v18h-2zM4 6h5v12H4zm11 0h5v12h-5z',
  film: 'M4 5h16v14H4zm2 2v2h2V7zm10 0v2h2V7zM6 11v2h2v-2zm10 0v2h2v-2zM6 15v2h2v-2zm10 0v2h2v-2zM10 8v8l5-4z',
  close: 'M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4z',
  target: 'M12 2v3a7 7 0 0 1 7 7h3v2h-3a7 7 0 0 1-7 7v3h-2v-3a7 7 0 0 1-7-7H0v-2h3a7 7 0 0 1 7-7V2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
};

export function Icon({ name, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d={P[name]} fill="currentColor" />
    </svg>
  );
}
