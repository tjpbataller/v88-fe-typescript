$(document).ready(()=>{
    let socket = io();

    $(document).on("click","button",e=>{
        e.stopPropagation();
        let $this = $(e.currentTarget);
        socket.emit("changeColor", $this.attr("name"))
    })
    socket.on("updateColor",newColor=>{
        console.log(newColor)
        $(".container").css({"background-color":newColor});
    })
})