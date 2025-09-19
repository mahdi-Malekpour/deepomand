// ========================
// اتصال به API و مدیریت پیام
// ========================

const API_URL = "https://deepomand-api-1.onrender.com/chat";

// ارسال پیام به API
async function sendMessageToAI(message) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: message })
        });

        if (!response.ok) {
            throw new Error(`خطای سرور: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("خطا در اتصال به API:", error);
        return {
            success: false,
            response: "⚠️ متأسفم، نتونستم به سرور وصل بشم!",
            error: error.message
        };
    }
}

// ========================
// مدیریت نمایش پیام‌ها
// ========================

const chatBox = document.getElementById('chat-box');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');

// اضافه کردن پیام به چت
function addMessage(text, isUser, isThinking = false) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');

    if (isThinking) {
        messageDiv.innerHTML = `
            <div class="thinking">
                <span>.</span><span>.</span><span>.</span>
            </div>
        `;
        messageDiv.classList.add('thinking-message');
    } else {
        messageDiv.textContent = text;
    }

    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight; // فقط هنگام اضافه شدن پیام
    return messageDiv;
}

// فعال/غیرفعال کردن فرم
function setFormState(isDisabled) {
    sendButton.disabled = isDisabled;
    chatInput.disabled = isDisabled;
    sendButton.style.cursor = isDisabled ? 'not-allowed' : 'pointer';
    chatInput.style.cursor = isDisabled ? 'not-allowed' : 'text';
}

// ارسال پیام از کاربر
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // نمایش پیام کاربر
    addMessage(message, true);
    chatInput.value = '';

    // نمایش پیام در حال فکر کردن
    const thinkingMessage = addMessage('', false, true);

    // غیرفعال کردن فرم
    setFormState(true);

    try {
        // ارسال پیام به API و دریافت پاسخ
        const result = await sendMessageToAI(message);

        // حذف پیام در حال فکر کردن
        thinkingMessage.remove();

        if (result.success) {
            addMessage(result.response, false);
        } else {
            addMessage(`خطا: ${result.error || "پاسخ دریافت نشد"}`, false);
        }
    } catch (error) {
        thinkingMessage.remove();
        addMessage("خطای غیرمنتظره رخ داد", false);
        console.error("Error:", error);
    } finally {
        // فعال کردن مجدد فرم
        setFormState(false);
        chatInput.focus();
    }
}

// ========================
// Event Listeners
// ========================

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendButton.disabled) {
        sendMessage();
    }
});

// ========================
// تست اتصال اولیه و دوره‌ای
// ========================

async function testConnection() {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: "سلام" })
        });
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        const data = await response.json();
        console.log("✅ اتصال به API موفق:", data);
        return true;
    } catch (error) {
        console.error("❌ اتصال به API失敗:", error);
        addMessage("⚠️ سرور در دسترس نیست. لطفا مطمئن شوید سرور روشن است.", false);
        return false;
    }
}

let isConnected = false;
async function checkConnectionPeriodically() {
    isConnected = await testConnection();
    if (!isConnected) {
        setTimeout(checkConnectionPeriodically, 30000); // هر 30 ثانیه
    }
}

// ========================
// DOMContentLoaded
// ========================

document.addEventListener('DOMContentLoaded', function() {
    checkConnectionPeriodically();
    

    // placeholder داینامیک
    const placeholders = [
        "سوال خود را بپرسید...",
        "چطور می‌تونم کمک کنم؟",
        "چه سوالی دارید؟"
    ];
    let placeholderIndex = 0;
    setInterval(() => {
        chatInput.placeholder = placeholders[placeholderIndex];
        placeholderIndex = (placeholderIndex + 1) % placeholders.length;
    }, 3000);
});
