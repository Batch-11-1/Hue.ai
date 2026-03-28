/*In this page the user should be able to upload an html/ejs/jsx file.
Then there should be 3 questions that the user should answer to help the AI understand the design of the page. The questions are:
1. which layout want to use? There should be cards that the user can choose from. The cards should have a title and a diagram of the layout.
2. which color scheme to use? There should be option to choose upto 4 colors as the color scheme of the site. There should be a color selector and a plus button if the user wants to add more colors.
3. which font to use? There should be a dropdown menu with different font options. The user should be able to see a preview of the font before selecting it.

Once selected there should be an axios request to backend(for now use a dummy endpoint) to send the file and the answers to the questions. Once the response is received the user should be redirected to the output page along with the response data.

While waiting for the response there should be a loading animation to indicate that the AI is processing the request.
*/
import '../App.css'

function Input() {

  return (
    <>
      <h1>Input page</h1>
    </>
  )
}

export default Input
