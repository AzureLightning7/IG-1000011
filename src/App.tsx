import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VibeQuiz from "./pages/VibeQuiz";
import LoadingScreen from "./pages/LoadingScreen";
import ResultsPage from "./pages/ResultsPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0A0A0A] text-white selection:bg-teal-500/30">
        <Routes>
          <Route path="/" element={<VibeQuiz />} />
          <Route path="/loading" element={<LoadingScreen />} />
          <Route path="/results" element={<ResultsPage />} />
        </Routes>
      </div>
    </Router>
  );
}
