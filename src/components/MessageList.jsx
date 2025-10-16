import { useEffect, useRef } from 'preact/hooks';
import Message from './Message';
import LoadingIndicator from './LoadingIndicator';

export default function MessageList({ messages, isLoading }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="message-list-container">
      {messages.map((message) => (
        <Message
          key={message.id}
          text={message.text}
          sender={message.sender}
        />
      ))}
      {isLoading && <LoadingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
}
