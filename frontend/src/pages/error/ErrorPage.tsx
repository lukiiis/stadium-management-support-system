import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {(() => {
            if (isRouteErrorResponse(error)) {
              return <p>{error.status} {error.statusText}</p>
            }
          })()}
        </i>
      </p>
    </div>
  );
}

export default ErrorPage;