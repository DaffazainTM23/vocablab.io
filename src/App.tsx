import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Home } from './pages/Home';
import { Topics } from './pages/Topics';
import { TopicDetail } from './pages/TopicDetail';
import { Games } from './pages/Games';
import { GamePlay } from './pages/GamePlay';
import { QuickTest } from './pages/QuickTest';
import { Contact } from './pages/Contact';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/topics/:slug" element={<TopicDetail />} />
              <Route path="/games" element={<Games />} />
              <Route path="/games/:gameId" element={<GamePlay />} />
              <Route path="/quick-test" element={<QuickTest />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
