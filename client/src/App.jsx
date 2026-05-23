import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import MovieDetailPage from "./pages/MovieDetailPage";
import MoviesPage from "./pages/MoviesPage";
import TheatersPage from "./pages/TheatersPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="app__main">
          <Routes>
            <Route path="/" element={<MoviesPage />} />
            <Route path="/movies/:movieId" element={<MovieDetailPage />} />
            <Route path="/theaters" element={<TheatersPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
