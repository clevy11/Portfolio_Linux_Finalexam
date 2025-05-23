const express = require('express');
const app = express();
const path = require('path');

// Serve static files from the root directory
app.use(express.static(path.join(__dirname, './')));

// Start the server
app.listen(3030, () => {
  console.log('Server running on port 3030');
});