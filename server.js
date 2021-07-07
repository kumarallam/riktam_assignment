const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);




// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));


var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));



require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);

const db = require("./app/models");

db.sequelize.sync();


// simple route
app.get("/", (req, res) => {
  res.render('index.ejs');
});

//Chat Application for users
io.sockets.on('connection', function(socket) {
  socket.on('username', function(username) {
      socket.username = username;
      io.emit('is_online', '🔵 <i>' + socket.username + ' join the chat..</i>');
  });

  socket.on('disconnect', function(username) {
      io.emit('is_online', '🔴 <i>' + socket.username + ' left the chat..</i>');
  })

  socket.on('chat_message', function(message) {
      io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
  });

});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});