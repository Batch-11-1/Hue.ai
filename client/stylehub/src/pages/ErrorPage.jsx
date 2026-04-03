
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import Header from '../components/Header'
import Footer from '../components/Footer'

function ErrorPage() {
  const error = useRouteError();

  let status = 500;
  let message = "An unexpected error occurred.";

  if (isRouteErrorResponse(error)) {
    status = error.status;

    if (status === 404) {
      message = "The page you're looking for doesn't exist.";
    } else {
      message = error.data?.message || error.message || error.statusText || message;
    }
  } else if (error instanceof Error) {
    message = error.message || message;
  } else if (error) {
    message = String(error);
  }

  return (
    <>
      <Header />
      <h1>{status === 404 ? "404 - Page Not Found" : "Error"}</h1>
      <p>{message}</p>
      <Link to="/">Go back home</Link>

      {import.meta.env.DEV && status !== 404 ? (
        <pre style={{ whiteSpace: "pre-wrap" }}>{String((error && error.stack) || error)}</pre>
      ) : null}
      <Footer />
    </>
  )
}

export default ErrorPage
