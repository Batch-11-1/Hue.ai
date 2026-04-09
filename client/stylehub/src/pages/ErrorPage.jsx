import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import Header from '../components/Navbar.jsx'
import Footer from '../components/Footer'
import DottedSurface from '../components/DottedSurface'
import '../styles/ErrorPage.css'

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
      <DottedSurface theme="dark">
        <Header />

        <div className="error-page">

          <div className="error-body">
            <p className="error-code">404</p>
            <h1 className="error-title">Faaaahhhh !</h1>
            <h1 className="error-title"> Page Not Found</h1>
            <p className="error-message">
              The page you are looking for doesn't exist. Click the button below to go to the homepage.
            </p>
          </div>

          <Link to="/" className="btn-home">
            Go back home
          </Link>

        </div>

        <Footer />
      </DottedSurface>
    </>
  )
}

export default ErrorPage