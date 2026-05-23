import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo">🎬</span>
        <div>
          <h1>WeLoveMovies</h1>
          <p>Browse films, theaters, and reviews</p>
        </div>
      </div>
      <nav className="navbar__links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Movies
        </NavLink>
        <NavLink to="/theaters" className={({ isActive }) => (isActive ? "active" : "")}>
          Theaters
        </NavLink>
      </nav>
    </header>
  );
}
