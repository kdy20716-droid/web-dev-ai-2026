import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import RegisterPage from "./pages/RegisterPage";
import RecipeDetailPage from "./pages/RecipeDetailPage";
import BarsPage from "./pages/BarsPage";

// 라우터 : url에 따라 어떤 페이지를 보여줄지 결정하는 역할
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <MainPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/signup", element: <RegisterPage /> },
      { path: "/recipe/:id", element: <RecipeDetailPage /> },
      { path: "/bars", element: <BarsPage /> },
    ],
  },
]);

export default router;
