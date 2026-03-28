/* The App.jsx file is the main entry point for the React application. It renders the landing page of the application. The landing page will have a small intro and two buttons, one for starting the styling which redirects to the input page and another for viewing the about page which redirects to the about page.

At the beginning of the page loading, we will show a loading animation for few seconds before rendering the landing page. This is to give the user a better experience and to make the application look more polished. Also an axios reqeust is made to the backend to check if the server is running.
*/
import './App.css'

function App() {

  return (
    <>
      <h1>Landing page</h1>
    </>
  )
}

export default App
