import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default function Message({ text, sender }) {
  // Parse markdown and sanitize HTML for agent messages
  const renderContent = () => {
    if (sender === 'agent') {
      const rawHtml = marked.parse(text);
      const sanitizedHtml = DOMPurify.sanitize(rawHtml);
      return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
    }
    // User messages are plain text
    return text;
  };

  return (
    <div className={`message-wrapper ${sender}`}>
      <div className={`message ${sender}`}>
        {renderContent()}
      </div>
    </div>
  );
}
