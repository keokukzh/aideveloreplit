(function() {
  'use strict';

  // Configuration
  const API_BASE = window.location.origin;
  const WIDGET_ID = 'aidevelo-chat-widget';
  
  // Get widget key from script tag
  const widgetScript = document.querySelector('script[data-key]');
  const WIDGET_KEY = widgetScript?.getAttribute('data-key');
  
  if (!WIDGET_KEY) {
    console.error('AIDevelo.AI Chat Widget: No widget key found. Please add data-key attribute to the script tag.');
    return;
  }

  // State management
  let isOpen = false;
  let isMinimized = false;
  let session = null;
  let messages = [];
  let unreadCount = 0;

  // API helper function
  async function apiRequest(method, endpoint, data = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (data) {
        options.body = JSON.stringify(data);
      }
      
      const response = await fetch(API_BASE + endpoint, options);
      return response;
    } catch (error) {
      console.error('Chat Widget API Error:', error);
      throw error;
    }
  }

  // Create CSS styles
  function createStyles() {
    const styles = `
      #${WIDGET_ID} {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      }
      
      .chat-widget-button {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: #00cfff;
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 207, 255, 0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      }
      
      .chat-widget-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 207, 255, 0.4);
      }
      
      .chat-widget-button svg {
        width: 24px;
        height: 24px;
        color: white;
      }
      
      .chat-widget-unread-badge {
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ef4444;
        color: white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: bold;
      }
      
      .chat-widget-card {
        width: 320px;
        height: 480px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
        border: 1px solid #e5e7eb;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .chat-widget-header {
        background: #f9fafb;
        padding: 16px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .chat-widget-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 600;
        font-size: 14px;
        color: #111827;
      }
      
      .chat-widget-title svg {
        width: 16px;
        height: 16px;
        color: #00cfff;
      }
      
      .chat-widget-controls {
        display: flex;
        gap: 4px;
      }
      
      .chat-widget-control-btn {
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        cursor: pointer;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      
      .chat-widget-control-btn:hover {
        background: #e5e7eb;
      }
      
      .chat-widget-control-btn svg {
        width: 16px;
        height: 16px;
        color: #6b7280;
      }
      
      .chat-widget-messages {
        flex: 1;
        overflow-y: auto;
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      
      .chat-widget-message {
        display: flex;
      }
      
      .chat-widget-message.user {
        justify-content: flex-end;
      }
      
      .chat-widget-message.agent {
        justify-content: flex-start;
      }
      
      .chat-widget-message-bubble {
        max-width: 240px;
        padding: 8px 12px;
        border-radius: 18px;
        font-size: 14px;
        line-height: 1.4;
      }
      
      .chat-widget-message.user .chat-widget-message-bubble {
        background: #00cfff;
        color: white;
      }
      
      .chat-widget-message.agent .chat-widget-message-bubble {
        background: #f3f4f6;
        color: #374151;
      }
      
      .chat-widget-message-time {
        font-size: 11px;
        opacity: 0.7;
        margin-top: 4px;
      }
      
      .chat-widget-input-area {
        padding: 16px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
      }
      
      .chat-widget-input {
        flex: 1;
        border: 1px solid #d1d5db;
        border-radius: 20px;
        padding: 8px 16px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.2s;
      }
      
      .chat-widget-input:focus {
        border-color: #00cfff;
      }
      
      .chat-widget-send-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: #00cfff;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s;
      }
      
      .chat-widget-send-btn:hover {
        background: #00b8e6;
      }
      
      .chat-widget-send-btn:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
      
      .chat-widget-send-btn svg {
        width: 16px;
        height: 16px;
        color: white;
      }
      
      .chat-widget-loading {
        display: flex;
        justify-content: flex-start;
      }
      
      .chat-widget-loading-bubble {
        background: #f3f4f6;
        color: #374151;
        max-width: 240px;
        padding: 8px 12px;
        border-radius: 18px;
        display: flex;
        gap: 4px;
      }
      
      .chat-widget-loading-dot {
        width: 8px;
        height: 8px;
        background: #9ca3af;
        border-radius: 50%;
        animation: chat-widget-bounce 1.4s ease-in-out infinite both;
      }
      
      .chat-widget-loading-dot:nth-child(1) { animation-delay: -0.32s; }
      .chat-widget-loading-dot:nth-child(2) { animation-delay: -0.16s; }
      
      @keyframes chat-widget-bounce {
        0%, 80%, 100% {
          transform: scale(0);
        } 40% {
          transform: scale(1);
        }
      }
      
      .chat-widget-hidden {
        display: none !important;
      }
      
      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .chat-widget-card {
          background: #1f2937;
          border-color: #374151;
        }
        
        .chat-widget-header {
          background: #111827;
          border-color: #374151;
        }
        
        .chat-widget-title {
          color: #f9fafb;
        }
        
        .chat-widget-control-btn:hover {
          background: #374151;
        }
        
        .chat-widget-control-btn svg {
          color: #9ca3af;
        }
        
        .chat-widget-message.agent .chat-widget-message-bubble {
          background: #374151;
          color: #f3f4f6;
        }
        
        .chat-widget-input {
          background: #374151;
          border-color: #4b5563;
          color: #f9fafb;
        }
        
        .chat-widget-input:focus {
          border-color: #00cfff;
        }
        
        .chat-widget-loading-bubble {
          background: #374151;
          color: #f3f4f6;
        }
      }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }

  // Initialize chat session
  async function initializeChat() {
    try {
      const response = await apiRequest('POST', '/api/chat/sessions', {
        agentConfigId: 'demo-agent-config',
        visitorId: `visitor-${Date.now()}`,
        visitorEmail: null,
        visitorName: null
      });
      
      const responseData = await response.json();
      
      if (responseData.data) {
        session = responseData.data;
        
        // Add welcome message
        const welcomeMessage = {
          id: `welcome-${Date.now()}`,
          sender: 'agent',
          message: 'Hello! How can I help you today?',
          timestamp: new Date().toISOString()
        };
        
        messages.push(welcomeMessage);
        renderMessages();
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  }

  // Send message
  async function sendMessage(messageText) {
    if (!messageText.trim() || !session) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      message: messageText,
      timestamp: new Date().toISOString()
    };

    messages.push(userMessage);
    renderMessages();

    // Show loading
    showLoading();

    try {
      const response = await apiRequest('POST', '/api/chat/messages', {
        sessionId: session.id,
        message: messageText,
        sender: 'user'
      });
      
      const responseData = await response.json();

      if (responseData.data?.message) {
        const agentMessage = {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          message: responseData.data.message,
          timestamp: new Date().toISOString()
        };

        messages.push(agentMessage);
        
        // If chat is minimized, increment unread count
        if (isMinimized) {
          unreadCount++;
          updateUnreadBadge();
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: 'agent',
        message: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      };
      messages.push(errorMessage);
    }

    hideLoading();
    renderMessages();
  }

  // Format time
  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Show loading indicator
  function showLoading() {
    const messagesContainer = document.querySelector(`#${WIDGET_ID} .chat-widget-messages`);
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-widget-loading';
    loadingDiv.id = 'chat-widget-loading-indicator';
    loadingDiv.innerHTML = `
      <div class="chat-widget-loading-bubble">
        <div class="chat-widget-loading-dot"></div>
        <div class="chat-widget-loading-dot"></div>
        <div class="chat-widget-loading-dot"></div>
      </div>
    `;
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Hide loading indicator
  function hideLoading() {
    const loadingIndicator = document.getElementById('chat-widget-loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.remove();
    }
  }

  // Render messages
  function renderMessages() {
    const messagesContainer = document.querySelector(`#${WIDGET_ID} .chat-widget-messages`);
    if (!messagesContainer) return;

    // Remove loading indicator if present
    hideLoading();

    // Clear existing messages (except loading)
    const existingMessages = messagesContainer.querySelectorAll('.chat-widget-message');
    existingMessages.forEach(msg => msg.remove());

    // Add all messages
    messages.forEach(message => {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-widget-message ${message.sender}`;
      messageDiv.innerHTML = `
        <div class="chat-widget-message-bubble">
          ${message.message}
          <div class="chat-widget-message-time">${formatTime(message.timestamp)}</div>
        </div>
      `;
      messagesContainer.appendChild(messageDiv);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Update unread badge
  function updateUnreadBadge() {
    const badge = document.querySelector(`#${WIDGET_ID} .chat-widget-unread-badge`);
    if (badge) {
      badge.textContent = unreadCount;
      badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
  }

  // Toggle chat
  function toggleChat() {
    isOpen = !isOpen;
    const button = document.querySelector(`#${WIDGET_ID} .chat-widget-button`);
    const card = document.querySelector(`#${WIDGET_ID} .chat-widget-card`);
    
    if (isOpen) {
      button.style.display = 'none';
      card.style.display = 'flex';
      if (!session) {
        initializeChat();
      }
    } else {
      button.style.display = 'flex';
      card.style.display = 'none';
    }
  }

  // Toggle minimize
  function toggleMinimize() {
    isMinimized = !isMinimized;
    const messagesContainer = document.querySelector(`#${WIDGET_ID} .chat-widget-messages`);
    const inputArea = document.querySelector(`#${WIDGET_ID} .chat-widget-input-area`);
    const minimizeBtn = document.querySelector(`#${WIDGET_ID} .chat-widget-minimize-btn`);
    
    if (isMinimized) {
      messagesContainer.style.display = 'none';
      inputArea.style.display = 'none';
      minimizeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
        </svg>
      `;
    } else {
      messagesContainer.style.display = 'flex';
      inputArea.style.display = 'flex';
      minimizeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3v3a2 2 0 0 1-2 2H3M3 8h3a2 2 0 0 1 2-2V3m13 5h-3a2 2 0 0 1-2-2V3m0 13v-3a2 2 0 0 1 2-2h3"/>
        </svg>
      `;
      unreadCount = 0;
      updateUnreadBadge();
    }
  }

  // Create widget HTML
  function createWidget() {
    const widgetContainer = document.createElement('div');
    widgetContainer.id = WIDGET_ID;
    
    widgetContainer.innerHTML = `
      <!-- Chat Button -->
      <button class="chat-widget-button" onclick="window.AIDeveloChatWidget.toggleChat()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <div class="chat-widget-unread-badge" style="display: none;">0</div>
      </button>
      
      <!-- Chat Card -->
      <div class="chat-widget-card" style="display: none;">
        <div class="chat-widget-header">
          <div class="chat-widget-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            AIDevelo.AI
          </div>
          <div class="chat-widget-controls">
            <button class="chat-widget-control-btn chat-widget-minimize-btn" onclick="window.AIDeveloChatWidget.toggleMinimize()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M8 3v3a2 2 0 0 1-2 2H3M3 8h3a2 2 0 0 1 2-2V3m13 5h-3a2 2 0 0 1-2-2V3m0 13v-3a2 2 0 0 1 2-2h3"/>
              </svg>
            </button>
            <button class="chat-widget-control-btn" onclick="window.AIDeveloChatWidget.toggleChat()">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div class="chat-widget-messages"></div>
        
        <div class="chat-widget-input-area">
          <input type="text" class="chat-widget-input" placeholder="Type your message..." />
          <button class="chat-widget-send-btn" onclick="window.AIDeveloChatWidget.handleSend()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22,2 15,22 11,13 2,9"/>
            </svg>
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(widgetContainer);
  }

  // Handle send button click
  function handleSend() {
    const input = document.querySelector(`#${WIDGET_ID} .chat-widget-input`);
    const message = input.value.trim();
    if (message) {
      sendMessage(message);
      input.value = '';
    }
  }

  // Handle enter key in input
  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      handleSend();
    }
  }

  // Initialize widget
  function initWidget() {
    // Check if widget already exists
    if (document.getElementById(WIDGET_ID)) {
      return;
    }

    createStyles();
    createWidget();
    
    // Add event listeners
    const input = document.querySelector(`#${WIDGET_ID} .chat-widget-input`);
    input.addEventListener('keypress', handleKeyPress);
    
    // Expose global functions
    window.AIDeveloChatWidget = {
      toggleChat,
      toggleMinimize,
      handleSend,
      sendMessage
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

})();