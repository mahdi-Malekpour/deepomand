class DeepomandChat {
  constructor() {
    this.API_KEY = 'd297bb116174444199bb116a3ae6a202'; // باید از طریق متغیر محیطی تنظیم شود
    this.API_URL = 'https://api.aimlapi.com/v1/chat/completions';
    this.MODEL = 'openai/gpt-4.1-2025-04-14';
    this.lastRequestTime = 0;
    this.RATE_LIMIT = 1000; // 1 ثانیه بین هر درخواست
    
    this.initElements();
    this.initEventListeners();
    this.loadChatHistory();
  }

  initElements() {
    this.chatBody = document.getElementById('chat-body');
    this.chatInput = document.getElementById('chat-input');
    this.sendButton = document.getElementById('btn');
    this.aiIntro = document.querySelector('.ai-intro');
  }

  initEventListeners() {
    this.sendButton.addEventListener('click', () => this.sendMessage());
    this.chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }

  async sendMessage() {
    const message = this.chatInput.value.trim();
    if (!message) return;

    // مدیریت نرخ ارسال
    const now = Date.now();
    if (now - this.lastRequestTime < this.RATE_LIMIT) {
      this.showError('لطفاً بین ارسال پیام‌ها کمی صبر کنید');
      return;
    }
    this.lastRequestTime = now;

    // حذف معرفی اولیه اگر وجود دارد
    if (this.aiIntro) {
      this.aiIntro.remove();
    }

    // تغییر ظاهر دکمه
    this.sendButton.style.background = '#111519';
    // this.sendButton.style. = '#111519';

    // افزودن پیام کاربر
    this.addUserMessage(message);
    this.chatInput.value = '';

    // نمایش حالت در حال تایپ
    const typingIndicator = this.showTypingIndicator();

    try {
      const response = await this.fetchAIResponse(message);
      this.addBotMessage(response);
      this.saveChatHistory();
    } catch (error) {
      console.error('API Error:', error);
      this.addBotMessage('متاسفم، مشکلی در ارتباط با سرور پیش آمده است. لطفاً دوباره تلاش کنید.');
    } finally {
      this.removeTypingIndicator(typingIndicator);
      this.sendButton.style.background = "linear-gradient(135deg, #6e8efb, #a777e3)";
    }
  }

  async fetchAIResponse(message) {
    const requestData = {
      model: this.MODEL,
      messages: [
        {
          role: "system",
          content: "You are an AI assistant who knows everything."
        },
        {
          role: "user",
          content: message
        }
      ]
    };

    const response = await fetch(this.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.API_KEY}`
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'خطا در ارتباط با سرور');
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }

  addUserMessage(content) {
    this.addMessage(content, 'user');
  }

  addBotMessage(content) {
    this.addMessage(content, 'bot');
  }

  addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    if (type === 'bot' && content.includes('```')) {
      // فرمت‌دهی کدهای مارک‌داون
      messageDiv.innerHTML = this.formatMarkdown(content);
    } else {
      const contentSpan = document.createElement('div');
      contentSpan.className = 'message-content';
      contentSpan.textContent = content;
      messageDiv.appendChild(contentSpan);
    }

    if (type === 'bot') {
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-btn';
      copyButton.innerHTML = '📋';
      copyButton.addEventListener('click', () => this.copyToClipboard(content));
      messageDiv.appendChild(copyButton);
    }

    this.chatBody.appendChild(messageDiv);
    this.scrollToBottom();
  }

  formatMarkdown(content) {
    // پیاده‌سازی ساده فرمت‌دهی مارک‌داون
    return content
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text)
      .then(() => {
        const copyButtons = document.querySelectorAll('.copy-btn');
        copyButtons.forEach(btn => {
          btn.textContent = '📋';
          btn.style.color = '';
        });
        event.target.textContent = 'کپی شد!';
        event.target.style.color = '#4CAF50';
        setTimeout(() => {
          event.target.textContent = '📋';
          event.target.style.color = '';
        }, 2000);
      })
      .catch(err => console.error('Failed to copy:', err));
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    this.chatBody.appendChild(typingDiv);
    this.scrollToBottom();
    return typingDiv;
  }

  removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
      indicator.remove();
    }
  }

  scrollToBottom() {
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  saveChatHistory() {
    localStorage.setItem('chatHistory', this.chatBody.innerHTML);
  }

  loadChatHistory() {
    const savedChat = localStorage.getItem('chatHistory');
    if (savedChat) {
      this.chatBody.innerHTML = savedChat;
      this.scrollToBottom();
    }
  }

  showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'message error';
    errorDiv.textContent = message;
    this.chatBody.appendChild(errorDiv);
    this.scrollToBottom();
  }
}

// راه‌اندازی چت هنگام لود صفحه
document.addEventListener('DOMContentLoaded', () => {
  const chat = new DeepomandChat();
});