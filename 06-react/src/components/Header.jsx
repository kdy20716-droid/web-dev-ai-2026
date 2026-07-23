import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { token, name, logout } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-gray-300 bg-white">
      <div>
        <Link to="/" className="text-2xl font-bold">
          칵테일 레시피
        </Link>
      </div>
      <nav className="flex items-center gap-5 text-base">
        <Link className="text-[#7b2d43]" to="/bars">
          칵테일바 찾기
        </Link>
        {token ? (
          <>
            <span>{name}님, 환영합니다!</span>
            <button onClick={logout}>로그아웃</button>
          </>
        ) : (
          <Link className="text-[#7b2d43]" to="/login">
            로그인
          </Link>
        )}
      </nav>
    </header>
  );
};
export default Header;
