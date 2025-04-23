document.addEventListener("DOMContentLoaded", function () {

    const chatMessages = document.getElementById("chat-messages");

    const userInput = document.getElementById("user-input");

    const sendBtn = document.getElementById("send-btn");

    let messages = [{
        role: "assistant",
        content: "你好，我是基于阿里的ai助手!"
    }];

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if(!userMessage) return

        userInput.value = "";

        userInput.focus();

        appendMessage("user",userMessage);
        messages.push({
            role: "user",
            content: userMessage
        });

        const loadingDiv = document.createElement("div");
        loadingDiv.className = "message assistant";
        loadingDiv.innerHTML = `
            <div class="loading">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;


        chatMessages.appendChild(loadingDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;

        axios.post('api/chat', {messages}).then(response => {
            chatMessages.removeChild(loadingDiv);
            appendMessage("assistant",response.data.messages);
            messages.push({
                role: response.data.role,
                content: response.data.messages
            });
        });
        
    }
    function appendMessage(sender,content){
        const messageDiv = document.createElement("div");
        messageDiv.className = `message ${sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${content}</p>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    sendBtn.addEventListener("click",sendMessage);
    userInput.addEventListener("keydown",function(e){
        if(e.key === "Enter" && !e.shiftKey){
            e.preventDefault();
            sendMessage();
        }
    });
    userInput.addEventListener("input",function(){
        this.style.height = "auto";
        this.style.height = this.scrollHeight < 120 ? this.scrollHeight + "px" : "120px";
    });

});