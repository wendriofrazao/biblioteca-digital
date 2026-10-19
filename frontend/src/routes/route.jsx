import { createBrowserRouter } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout.jsx";
import { PrivateRoute } from "../layouts/PrivateLayout.jsx";
import { Home } from "../pages/home.pages.jsx";
import { Dashboard } from "../pages/dashboard.jsx";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },

    {
      element: <PrivateRoute />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        }
      ],
    },
]);
