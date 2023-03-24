//variable declaration
const express = require("express");
const app = express();
const server = app.listen(8000);
const io = require("socket.io")(server);
let backgroundColor;
//server setup
app.use(express.static(__dirname));
app.set("views",__dirname+"/views");
app.set("view engine", "ejs");
//load index
app.get("/",(req, res)=>{
    res.render("index");
})
//socket connection
io.on("connection", socket=>{
    socket.colorCollection = {
        "light": "#ffffff",
        "dark": "#000000",
        "random": ()=>{
            const rgb = ['a','b','c','d','e','f','0','1','2','3','4','5','6','7','8','9'];
            let color = '#'  //this is what we'll return!
            for(let i = 0; i < 6; i++)   // 6 is total number of characters in hex
            {
                let x = Math.floor((Math.random()*16));  // 16 for hex
                color += rgb[x]; 
            }
            return color;
        }
    }
    socket.emit("updateColor", backgroundColor);
    socket.on("changeColor",data=>{
        backgroundColor = (data === "random")?socket.colorCollection[data]():socket.colorCollection[data];
        io.emit("updateColor", backgroundColor);
    });
})