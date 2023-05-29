import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-white drop-shadow-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
        <div className="flex lg:flex-1 cursor-pointer" onClick={() => navigate('/')}>
          <img className="h-8 w-auto" src={logo} alt="logo" />
        </div>
      </nav>
    </header>
  );
}
