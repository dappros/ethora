import { useRouteError } from "react-router-dom";

export function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="text-center h-[90vh] flex items-center justify-center flex-col">
      <h1 className="text-2xl font-bold">Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>Page Not Found</i>
      </p>
    </div>
  );
}