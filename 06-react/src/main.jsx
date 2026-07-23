import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./router";
import "./styles.css";
import { Toaster } from "sonner";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

// provider : 그 안에 있는 모든 컴포넌트에게 값을 나눠주는 상자
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </QueryClientProvider>,
);
