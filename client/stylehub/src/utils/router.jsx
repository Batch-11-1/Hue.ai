import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import AboutUs from "../pages/AboutUs"
import Input from "../pages/Input"
import Output from "../pages/Output"
import Result from "../pages/Result"
import ErrorPage from "../pages/ErrorPage"

const router = createBrowserRouter([
    { path: '', element: <App/>, errorElement: <ErrorPage/> },
    { path : '/aboutus' , element : <AboutUs/> },
    { path : '/input', element: <Input/>},
    { path : '/output', element: <Output/>},
    { path : '/result', element: <Result/>},
    { path: '*', element: <ErrorPage /> }
]);

export default router;