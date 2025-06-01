// ذخیرهٔ چت
function saveChat() {
    const chatBody = document.getElementById('chat-body').innerHTML;
    localStorage.setItem('chatHistory', chatBody);
}

// بازیابی چت
function loadChat() {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
        document.getElementById('chat-body').innerHTML = savedChat;
    }
}

// فراخوانی هنگام لود صفحه
document.addEventListener('DOMContentLoaded', loadChat);

// ذخیره پس از هر پیام جدید

    // ... کدهای ارسال پیام
     // اضافه کردن این خط
// تابع ارسال پیام (با تغییرات جدید)
function sendMessage() {
   
 const aiIntro = document.querySelector('.ai-intro');
    if (aiIntro) {
        aiIntro.remove();
    }
 const btn = document.getElementById('btn');
 
    const input = document.getElementById('chat-input');
    const messageu = input.value.trim();
    if (messageu) {
btn.style.background= '#111519'

        // افزودن پیام کاربر به چت
        const chatBody = document.getElementById('chat-body');
        chatBody.innerHTML += `
            <div class="message user">
                <span class="message-content">
                    ${messageu}
                </span>
            </div>
        `;

        // پاک کردن فیلد ورودی
        input.value = '';

        // نمایش حالت "در حال تایپ"
        chatBody.innerHTML += `
            <div class="message bot">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        // اسکرول به پایین
        chatBody.scrollTop = chatBody.scrollHeight;

        // کلید API
        const apiKey = '16d5de8540d3476b8d0b4d6ee2872bd5'; // جایگزین <YOUR_API_KEY> با کلید خود

        // آدرس API
        const apiUrl = 'https://api.aimlapi.com/v1/chat/completions'; // endpoint صحیح

        // داده‌های درخواست
        const requestData = {
            model: "gpt-4-turbo-2024-04-09", // مدل مورد استفاده
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
            // حذف حالت "در حال تایپ"
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }

            // افزودن پاسخ ربات به چت
            const message = data.choices[0].message.content;
            chatBody.innerHTML += `
                <div class="message bot">
                    <div class="message-content">
                        ${message}
                    </div>
                </div>
            `;
btn.style.background ="linear-gradient(135deg, #6e8efb, #a777e3)" 
 saveChat();
            // اسکرول به پایین
            chatBody.scrollTop = chatBody.scrollHeight;
        })
        .catch(error => {
            console.error('خطا در ارتباط با API:', error.response ? error.response.data : error.message);

            // حذف حالت "در حال تایپ"
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }

            // بررسی Retry-After
            if (error.response && error.response.headers) {
                const retryAfter = error.response.headers['retry-after'];
                if (retryAfter) {
                    console.log(`لطفاً ${retryAfter} ثانیه صبر کنید و دوباره تلاش کنید.`);
                }
            }

            // نمایش خطا به کاربر
            chatBody.innerHTML += `
                <div class="message bot">
                    <div class="message-content">
                        متاسفم، مشکلی در ارتباط با سرور پیش آمده است. لطفاً دوباره تلاش کنید.
                    </div>
                </div>
            `;

            // اسکرول به پایین
            chatBody.scrollTop = chatBody.scrollHeight;
        });
    } 
    
}