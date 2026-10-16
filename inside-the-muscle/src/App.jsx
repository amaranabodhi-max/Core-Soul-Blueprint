import Stage from './three/Stage';
import Overlay from './ui/Overlay';
import { useStore, CAPTURE } from './store';

// A fixed 9:16 "phone frame": fills a phone screen, letterboxed on desktop.
export default function App() {
  const film = useStore((s) => s.film);
  return (
    <div className="shell">
      <main className={`frame ${film ? 'is-film' : ''} ${CAPTURE ? 'is-capture' : ''}`} id="frame">
        <Stage />
        <Overlay />
      </main>
    </div>
  );
}
