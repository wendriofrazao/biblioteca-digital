import { createBrowserRouter } from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout.jsx";
import { PrivateRoute } from "../layouts/PrivateLayout.jsx";

import { Home } from "../pages/home.pages.jsx";
import { Dashboard } from "../pages/dashboard.jsx";
import { Catalogo } from "../pages/catalogo.jsx";
import { DashboardLoan } from "../pages/dashboardLoan.jsx";
import { Staff } from "../pages/dashboardAdmin.jsx";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/catalogo",
        element: <Catalogo />,
      },
    ],
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/loan",
        element: <DashboardLoan />,
      },
      {
        path: "/staff",
        element: <Staff />,
      },
    ],
  },
]);