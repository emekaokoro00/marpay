// Install express server 
const express = require('express');
const path = require('path');
const app = express();
// Serve only the static files form the src directory
app.use(express.static(__dirname + '/dist/client')); // or [ + '/src/static'] instead of [ + '/src']
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/client/index.html'));
});

console.log('listening ' + path.join(__dirname + '/src/index.html'));
console.log('PORT ' + process.env.PORT);

// Start the app by listening on the default Heroku port
// app.listen(process.env.PORT || 8080);
app.listen(process.env.PORT || 8080);