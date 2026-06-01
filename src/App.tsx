import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./Admin/Dashboard";
import Login from "./Admin/Login";
import Home from "./userView/Home";
import ProjectDetail from "./userView/ProjectDetail";
import ArticleDetail from "./userView/ArticleDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/projects/:slug",
    element: <ProjectDetail />,
  },
  {
    path: "/articles/:slug",
    element: <ArticleDetail />,
  },
  {
    path: "/admin",
    element: <Login />,
  },
  {
    path: "/admin/login",
    element: <Login />,
  },
  {
    path: "/admin/dashboard",
    element: <Dashboard />,
  },
]);
