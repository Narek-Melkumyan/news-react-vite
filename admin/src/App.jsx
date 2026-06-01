import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./pages/layouts/layout.jsx";
import LoginPage from "./pages/loginPage.jsx";
import Dashboard from "./pages/dashboard.jsx";
import Categories from "./pages/categories.jsx";
import Articles from "./pages/articles.jsx";
import ArticleCreate from "./components/articles/articleCreate.jsx";
import EditArticle from "./components/articles/editArticle.jsx";
import Polls from "./pages/polls.jsx";
import Users from "./pages/users.jsx";

function App() {
  const routers = createBrowserRouter([
    {
      path: '/',
      element: <LoginPage />
    },
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: 'dashboard',
          element: <Dashboard />
        },
        {
          path: 'categories',
          element: <Categories />,
        },
        {
          path: 'articles',
          element: <Articles />,
        },
        {
          path: 'createArticle',
          element: <ArticleCreate/>
        },
        {
          path: 'editArticle/:id',
          element: <EditArticle/>
        },
        {
          path: 'polls',
          element: <Polls />,
        },
        {
          path: 'users',
          element:<Users />,
        }
      ],
    }
  ]);

  return <RouterProvider router={routers} />;
}

export default App;