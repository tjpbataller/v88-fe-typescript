$(document).ready(function() {
    const socket = io();

    $(document).on("submit","#feedback_form",function(e) {
        e.preventDefault();
        e.stopPropagation();
        let name = $("#name").val();
        let track = $("#track").val();
        let rate = $("#rate").val();
        let reason = $("#reason").val();
        socket.emit("posting_form", {name, track, rate, reason});
        $("#message").html("").css("display","block");
        return false;
    })
    socket.on("updated_message",function(data){
        $("#message").append(data); 
    })
    socket.on("id_number", function(data) {
        $("#message").append(data);
    })
})