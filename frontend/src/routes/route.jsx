import { createBrowserRouter } from "react-router-dom";
// import { Auth } from "../pages/auth.jsx";
import { RootLayout } from "../layouts/RootLayout.jsx";
import { PrivateRoute } from "../layouts/PrivateRoute.jsx";
import { Home } from "../pages/home.jsx";
// import { Dashboard } from "../pages/admin/DashBoard.jsx";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      }
    ],
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/admin",
        element: <Dashboard />,
      }
    ],
  },

  {
    path: "/login",
    element: <Auth modeAuth="login" />,
  },
]);
