import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Install } from "./pages/Install.tsx";
import { ErrorPage } from "./pages/ErrorPage.tsx";
import { Layout } from "./Layouts/Layout.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Install />
      </Layout>
    ),
    errorElement: <Layout><ErrorPage /></Layout>,
  },
]);
export const Router = () => {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};
