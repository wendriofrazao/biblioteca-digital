import { createBrowserRouter } from "react-router-dom";
// import { Auth } from "../pages/auth.jsx";
import { PublicLayout } from "../layouts/PublicLayout.jsx";
import { PrivateRoute } from "../layouts/PrivateLayout.jsx";
import { Home } from "../pages/home.pages.jsx";
// import { Dashboard } from "../pages/admin/DashBoard.jsx";

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

  //   {
  //     element: <PrivateRoute />,
  //     children: [
  //       {
  //         path: "/admin",
  //         element: <Dashboard />,
  //       }
  //     ],
  //   },
]);
