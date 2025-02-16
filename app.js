// تابع ارسال پیام
function sendMessage() {
    const input = document.getElementById('chat-input');
    const messageu = input.value.trim();

    if (messageu) {
        // افزودن پیام کاربر به چت
        const chatBody = document.getElementById('chat-body');
        chatBody.innerHTML += `
            <div class="message user">
                <div class="message-content">
                    ${messageu}
                </div>
            </div>
        `;

        // پاک کردن فیلد ورودی
        input.value = '';

        // اسکرول به پایین
        chatBody.scrollTop = chatBody.scrollHeight;

        // شبیه‌سازی پاسخ ربات (می‌توانید با API واقعی جایگزین کنید)
        


// کلید API
const apiKey = '78478a957f1c4c10bba78a1acf2d3401'; // جایگزین <YOUR_API_KEY> با کلید خود

// آدرس API
const apiUrl = 'https://api.aimlapi.com/v1/chat/completions'; // endpoint صحیح

// داده‌های درخواست
const requestData = {
    model: "gpt-4o", // مدل مورد استفاده
    messages: [
        {
            role: "system",
            content: "You are an AI assistant who knows everything."
        },
        {
            role: "user",
            content: messageu
        }
    ]
};

// ارسال درخواست به API
fetch(apiUrl, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestData)
})
.then(response => {
    if (!response.ok) {
        throw new Error(`خطا: ${response.status} ${response.statusText}`);
    }
    return response.json();
})
.then(data => {
    const message = data.choices[0].message.content;
    chatBody.innerHTML += `
                <div class="message bot">
                    <div class="message-content">
                 ${message}
                    </div>
                </div>`
console.log(`Assistant: ${message}`);
})
.catch(error => {
    console.error('خطا در ارتباط با API:', error);
});


    }

}