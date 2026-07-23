import { createContext, useState, useContext } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [name, setName] = useState(localStorage.getItem("name"));
  const [userId, setUserId] = useState(localStorage.getItem("id"));

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    localStorage.setItem("id", data.id);
    setToken(data.token);
    setName(data.name);
    setUserId(data.id);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("id");
    setToken(null);
    setName(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ login, token, name, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
