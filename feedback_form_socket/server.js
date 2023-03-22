const express = require("express");
const app = express();
const server = app.listen(1995);
const io = require("socket.io")(server);

app.use(express.static(__dirname));
app.set("views",__dirname+"/views");
app.set("view engine","ejs");

app.get("/",function(req, res){
    res.render("index");
})

io.on("connection", function(socket) {
    socket.on("posting_form", function(data) {
        let randomNumber = Math.floor(Math.random() * (1 - 1000 + 1));
        socket.emit('updated_message', `<p>You emitted the following values to the server: ${JSON.stringify(data)}</p>`);
        socket.emit("id_number", `<p>Random generated id number is ${Math.abs(randomNumber)}</p>`);
    })
})