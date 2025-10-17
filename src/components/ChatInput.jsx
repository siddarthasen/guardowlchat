export default function ChatInput({ value, onChange, onSend, disabled }) {
  // Derive hasText directly from the value prop on every render
  // Check for trimmed length to prevent whitespace-only submissions
  const hasText = value && value.trim().length > 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!disabled && hasText) {
      onSend();
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  return (
    <div className="chat-input-container">
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={value}
          onInput={handleInputChange}
          onChange={handleInputChange}
          disabled={disabled}
          aria-label="Chat message input"
        />
        <button
          type="submit"
          className="send-button"
          disabled={disabled || !hasText}
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}
