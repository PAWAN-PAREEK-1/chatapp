const socket = io()
let messageArea =  document.querySelector(".messages")
let userName

do {
    userName = prompt('please enter your userName')
} while (!userName);


let textarea = document.querySelector("#textarea")


textarea.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        sendMessage(e.target.value);
    }

});




let sendMessage= (msg)=>{

    let message = {
        user:userName,
        message:msg.trim()
    }

    //Append

    appendMessage(message,'sent')
    scrollToBottom()
    textarea.value=''
    


    //send to server

    socket.emit('message',message)

}

let appendMessage = (msg, type) => {
    let mainDiv = document.createElement('div');
    let className = type;
    mainDiv.classList.add(className);

    let markup = `
        <h4>${msg.user}</h4>
        <p>${msg.message}</p>
    `;

    mainDiv.innerHTML = markup;

    messageArea.appendChild(mainDiv);

    // Scroll to bottom after a short delay to allow DOM update
    setTimeout(scrollToBottom, 100);
};



//rescive message  

socket.on('message',(message)=>{
appendMessage(message,'received')
scrollToBottom()

})

let scrollToBottom = () => {
    console.log("Scrolling to bottom...");
    console.log("scrollTop before:", messageArea.scrollTop);
    console.log("scrollHeight:", messageArea.scrollHeight);
    messageArea.scrollTop = messageArea.scrollHeight;
    console.log("scrollTop after:", messageArea.scrollTop);
}


