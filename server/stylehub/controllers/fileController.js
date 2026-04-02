/* The req.body contains the html file that the user wants to convert and download.

The internal css part has to be taken from the html file and create a new css file that can be downloaded by the user.
The html file should be modified to link the new css file instead of having the internal css.

Finally, send the modified html file and the new css file back to the client as a response.
*/
const fileDownload = (req, res) => {
  console.log("fileController.fileDownload called");
  res.send("fileDownload placeholder");
};

module.exports = {
  fileDownload,
};
