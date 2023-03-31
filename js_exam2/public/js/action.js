$(document).ready(function(){
    let name = prompt("Who is this?");
    const socket = io();

    socket.emit("new_user", name);
    socket.on("update_users",function(data){
        let participants = "";
        let btn = "";
        let select = `<option value='everyone'>Everyone</option>`;
        for(let user in data.users){
            if(data.users[user].type !== "admin" && data.users[socket.id].type === "admin"){
                btn = `<button class="btn-sm btn-danger ms-3 btn-remove" data-target="${user}">Remove</button>`;
            }
            if(user === socket.id){
                participants += `<p>You ${btn}</p>`;
            }else if(user !== socket.id){
                participants += `<p>${data.users[user].name} ${btn}</p>`;
            }
            if(user !== socket.id){select += `<option value="${user}">${data.users[user].name}</option>`;}
        }
        $("select").empty().append(select);
        $("#participants").empty().append(participants);
    })
    socket.on("user_left",function(data){
        $("#chats").append(`<div class="border-bottom border-dark border-3"><p>${data} has left the chat.</p></div>`);
    })
    socket.on("update_message",function(data){
        $("#chats").append(`${data.message}`);
    })
    socket.on("disconnect_me", function(){
        $(".container-fluid").empty();
        $(".container-fluid").append("You have been disconnected");
        socket.disconnect();
    })
    $(document).on("submit","#message-form",sendMessage);
    $(document).on("click","#send",sendMessage);
    function sendMessage(e){
        e.stopPropagation();
        e.preventDefault();
        let data = {
            target: $("#target").val(),
            message: $("#message").val()
        }
        $("#chats").append(`<div class="border-bottom border-dark border-3"><p>${name} to ${$("#target").children(":selected").text()}:</p><p>${$("#message").val()}</p></div>`)
        socket.emit("send_message",data);
        $("#message").val("");
        return false;
    }
    $(document).on("click",".btn-remove",function(e){
        e.stopPropagation();
        e.preventDefault();
        socket.emit("disconnect_client", $(this).attr("data-target"));
        return false;
    })
})