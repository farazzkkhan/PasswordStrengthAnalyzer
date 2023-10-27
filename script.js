
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");
const chatbox = document.querySelector(".chatbox");
const chatbotToggeler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization" : `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo-0613",
            messages: [{role: "user", content: userMessage}]
        })
    }
    
    fetch(API_URL, requestOptions).then(res => res.json()).then(data => {
        messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.classList.add("error");
        messageElement.textContent = "Oops! Something went wrong please try again or refresh the page.";
    }).finally(() => chatbox.scrollTo(0, chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking....", "incoming")
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);

}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});
chatInput.addEventListener("keydown", (e) => {
    if(e.key === "Enter" && !e.shiftkey && window.innerWidth > 800){
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggeler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

function processInput() {
    // Function to calculate password strength and estimate cracking time
    function analyzePassword(password) {
        // Minimum password length
        const minLength = 8;

        // Regular expressions to check for character classes
        const regexUpperCase = /[A-Z]/;
        const regexLowerCase = /[a-z]/;
        const regexNumbers = /[0-9]/;
        const regexSpecialChars = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/;

        // Calculate entropy using Shannon's entropy formula
        function calculateEntropy(password) {
            let entropy = 0;
            const charSetSize = 256; // Assuming ASCII character set

            for (let i = 0; i < password.length; i++) {
                const char = password.charCodeAt(i);
                if (char < charSetSize) {
                    entropy += 1;
                }
            }

            return entropy;
        }

        // Check if the password meets the minimum length requirement
        if (password.length < minLength) {
            return {
                strength: "Weak",
                timeToCrack: "Instant",
            };
        }

        // Calculate password entropy
        const entropy = calculateEntropy(password);

        // Check if the password includes various character classes
        const hasUpperCase = regexUpperCase.test(password);
        const hasLowerCase = regexLowerCase.test(password);
        const hasNumbers = regexNumbers.test(password);
        const hasSpecialChars = regexSpecialChars.test(password);

        // Calculate password strength based on criteria
        if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
            // Strong password
            return {
                strength: "Strong",
                timeToCrack: "Centuries",
            };
        } else if ((hasUpperCase || hasLowerCase) && hasNumbers) {
            // Moderately strong password
            return {
                strength: "Moderate",
                timeToCrack: "Years",
            };
        } else {
            // Weak password
            return {
                strength: "Weak",
                timeToCrack: "Months",
            };
        }
    }

    // Get the user input from the input field
    const passwordInput = document.getElementById("password");
    const password = passwordInput.value;

    // Analyze the password
    const result = analyzePassword(password);

    // Display the password strength and estimated cracking time
    document.getElementById("demo").innerHTML = `Password Strength: ${result.strength} <br> Estimated Time to Crack: ${result.timeToCrack}`;
}
