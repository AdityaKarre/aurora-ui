import Experience from "./layout/Experience";
import { MusicProvider } from "./context/MusicContext";

function App() {
  return (
    <MusicProvider>
      <Experience />
    </MusicProvider>
  );
}

export default App;