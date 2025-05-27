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
btn.style.backgroundColor= '#111519'

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
        const apiKey = '2ae75bc0af94466c90e602663063d30e'; // جایگزین <YOUR_API_KEY> با کلید خود

        // آدرس API
        const apiUrl = 'https://api.aimlapi.com/v1/chat/completions'; // endpoint صحیح

        // داده‌های درخواست
        const requestData = {
            model: "openai/o4-mini-2025-04-16", // مدل مورد استفاده
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
btn.style.backgroundColor ="#6A83CC" 
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