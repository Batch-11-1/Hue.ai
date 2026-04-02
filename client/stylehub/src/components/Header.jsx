import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <div>
        <img src="" alt="Logo" />
        <h1>StyleHub</h1>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/input">Input</Link>
          <Link to="/aboutus">About Us</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;