export default function LoadingIndicator() {
  return (
    <div className="loading-indicator">
      <span className="loading-text">Agent is typing</span>
      <div className="loading-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}
