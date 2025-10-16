import { useState } from 'preact/hooks';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { sendChatMessage } from '../services/api';
import { streamText } from '../utils/streamSimulator';

export default function ChatContainer() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSendMessage = async () => {
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) return;

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
      // Make API call
      const response = await sendChatMessage(trimmedMessage);
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
        <h1>Guard Owl Assistant</h1>
        <p>Ask me anything about your schedule and tasks</p>
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
