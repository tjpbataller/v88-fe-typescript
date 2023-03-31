const express = require("express");
const app = express();
const server = app.listen(8000);
const io = require("socket.io")(server);
let users = {};
let messages = {};


app.use(express.static(__dirname + "/public"));
app.set("views",__dirname + "/views");
app.set("view engine","ejs");

app.get("/",function (req, res){
    res.render("index");    
})

io.on("connection", function (socket){
    socket.on("new_user", function (name){
        //add new user to users
        users[socket.id] = {
            name,
            type: Object.keys(users).length == 0?"admin":"normal"
        };
        let data = {users}
        io.emit("update_users", data);
    })
    socket.on("send_message", function(data){
        let to = "Everyone";
        data["target_name"] = "Everyone";
        let message = "";
        if(data.target !== "everyone"){
            data["target_name"] = users[data.target].name;
            to = users[data.target].name;
            data["message"] = `<div class="border-bottom border-dark border-3"><p>${users[socket.id].name} to ${to}:</p><p>${data.message}</p></div>`;
            io.to(data.target).emit("update_message", data);
            return;
        }
        data["message"] = `<div class="border-bottom border-dark border-3"><p>${users[socket.id].name} to ${to}:</p><p>${data.message}</p></div>`;
        socket.broadcast.emit("update_message", data);
    })
    socket.on("disconnect", function (){
        console.log("User has left the chat", users[socket.id].name);
        socket.broadcast.emit("user_left", users[socket.id].name);
        delete users[socket.id];
        let data = {users}
        io.emit("update_users", data)
    })
    socket.on("disconnect_client", function(data){
        io.to(data).emit("disconnect_me");
    })
})