import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const HomePage = lazy(() => import('./pages/Home'));
const SignInPage = lazy(() => import('./pages/SignIn'));
const SignUpPage = lazy(() => import('./pages/SignUp'));
const NotFoundPage = lazy(() => import('./pages/error/NotFound'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPassword'));
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const DashboardIndexPage = lazy(() => import('./pages/dashboard/Index'));
const DashboardProfilePage = lazy(() => import('./pages/dashboard/Profile'));
const DashboardCustomerSupportPage = lazy(() => import('./pages/dashboard/CustomerSupport'));
const CreateTicketPage = lazy(() => import('./pages/CreateTicket'));
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
        path: "/create-ticket",
        element: <CreateTicketPage />
    },
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            { path: "", element: <DashboardIndexPage />, index: true },
            { path: "profile", element: <DashboardProfilePage /> },
            { path: "customer-support", element: <DashboardCustomerSupportPage /> },
        ]
    }
]);

export default routes;