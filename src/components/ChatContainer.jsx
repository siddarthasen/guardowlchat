import { useState, useEffect } from 'preact/hooks';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendChatMessage } from '../services/api';
import { streamText } from '../utils/streamSimulator';
import guardOwlLogo from '../utils/guardOwlLogo.jpeg';

const CONVERSATION_ID_KEY = 'guardOwl_conversationId';

// UUID v4 generator (no external dependencies)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);

  // Initialize or retrieve conversationId on component mount
  useEffect(() => {
    let existingId = localStorage.getItem(CONVERSATION_ID_KEY);

    if (!existingId) {
      // Generate new UUID v4
      existingId = generateUUID();
      localStorage.setItem(CONVERSATION_ID_KEY, existingId);
      console.log('[ChatContainer] Created new conversation ID:', existingId);
    } else {
      console.log('[ChatContainer] Using existing conversation ID:', existingId);
    }

    setConversationId(existingId);
  }, []);

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading || !conversationId) return;

    // Add user message immediately
    const userMessage = {
      id: generateId(),
      text: trimmedMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Make API call with conversationId
      const response = await sendChatMessage(trimmedMessage, conversationId);
      const agentText = response.response?.output || 'No response received.';

      // Create agent message placeholder
      const agentMessageId = generateId();
      let streamedText = '';

      // Add empty agent message that will be updated during streaming
      setMessages((prev) => [
        ...prev,
        {
          id: agentMessageId,
          text: '',
          sender: 'agent',
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      setIsLoading(false);

      // Stream the response word by word
      await streamText(agentText, (word) => {
        streamedText += (streamedText ? ' ' : '') + word;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === agentMessageId
              ? { ...msg, text: streamedText }
              : msg
          )
        );
      });

      // Mark streaming as complete
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === agentMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    } catch (error) {
      console.error('Error sending message:', error);

      // Stream error message
      const errorMessageId = generateId();
      const errorText = 'Sorry, the server is down. We are working on a fix!';
      let streamedErrorText = '';

      setMessages((prev) => [
        ...prev,
        {
          id: errorMessageId,
          text: '',
          sender: 'agent',
          timestamp: new Date(),
          isStreaming: true,
        },
      ]);

      setIsLoading(false);

      await streamText(errorText, (word) => {
        streamedErrorText += (streamedErrorText ? ' ' : '') + word;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === errorMessageId
              ? { ...msg, text: streamedErrorText }
              : msg
          )
        );
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === errorMessageId
            ? { ...msg, isStreaming: false }
            : msg
        )
      );
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <img src={guardOwlLogo} alt="Guard Owl Logo" className="header-logo" />
        <div className="header-text">
          <h1>Guard Owl Assistant</h1>
          <p>Ask me anything about your reports, schedule, or contact information</p>
        </div>
      </div>
      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput
        value={inputValue}
        onChange={setInputValue}
        onSend={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  );
}
