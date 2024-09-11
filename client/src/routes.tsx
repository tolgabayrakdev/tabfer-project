import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import Contact from './pages/dashboard/Contact';

const HomePage = lazy(() => import('./pages/Home'));
const SignInPage = lazy(() => import('./pages/SignIn'));
const SignUpPage = lazy(() => import('./pages/SignUp'));
const NotFoundPage = lazy(() => import('./pages/error/NotFound'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const DashboardIndexPage = lazy(() => import('./pages/dashboard/Index'));
const DashboardProfilePage = lazy(() => import('./pages/dashboard/Profile'));
const DashboardContactPage = lazy(() => import('./pages/dashboard/Contact'));
const DashboardDealPage = lazy(() => import('./pages/dashboard/Deal'));
const routes = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />
    },
    {
        path: "/signin",
        element: <SignInPage />
    },
    {
        path: "/signup",
        element: <SignUpPage />
    },
    {
        path: "*",
        element: <NotFoundPage />
    },
    {
        path: "/forgot-password",
        element: <ForgotPasswordPage />
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { path: "", element: <DashboardIndexPage />, index: true },
            { path: "profile", element: <DashboardProfilePage /> },
            { path: "contacts", element: <DashboardContactPage /> },
            { path: "contacts", element: <Contact /> }, 
            { path: "deals", element: <DashboardDealPage /> },
        ]
    }
]);

export default routes;