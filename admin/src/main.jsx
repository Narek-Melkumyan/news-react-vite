import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";
import "./App.css";

import RequireAdmin from "./middleware/RequireAdmin.jsx";

import LoginPage from "./pages/loginPage.jsx";
import Layout from "./pages/layouts/layout.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Categories from "./pages/categories.jsx";
import Articles from "./pages/articles.jsx";
import ArticleCreate from "./components/articles/articleCreate.jsx";
import EditArticle from "./components/articles/editArticle.jsx";
import Polls from "./pages/polls.jsx";
import Users from "./pages/users.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/admin",
        element: <RequireAdmin />,
        children: [
            {
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "categories",
                        element: <Categories />,
                    },
                    {
                        path: "articles",
                        element: <Articles />,
                    },
                    {
                        path: "createArticle",
                        element: <ArticleCreate />,
                    },
                    {
                        path: "editArticle/:id",
                        element: <EditArticle />,
                    },
                    {
                        path: "polls",
                        element: <Polls />,
                    },
                    {
                        path: "users",
                        element: <Users />,
                    },
                ],
            },
        ],
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
);
