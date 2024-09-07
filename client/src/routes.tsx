import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";


const HomePage = lazy(() => import('./pages/Home'));
const NotFoundPage = lazy(() => import('./pages/error/NotFound'));


const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const DashboardIndexPage = lazy(() => import('./pages/dashboard/Index'));



const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "*",
        element: <NotFoundPage />
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { path: "", element: <DashboardIndexPage />, index: true }
        ]
    }
]);

export default routes;