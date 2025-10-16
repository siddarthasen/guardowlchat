# Guard Owl Chat Interface

A responsive chat interface built with Preact, SCSS, and Vite for interacting with the Guard Owl AI agent.

## Features

- **Real-time Chat Interface**: User messages on the right, AI agent messages on the left
- **Word-by-word Streaming**: Simulates streaming responses for better UX
- **Guard Owl Branding**: Purple color scheme (#782AE4) matching guardowlco.com
- **Error Handling**: Graceful fallback when server is unavailable
- **Auto-scroll**: Automatically scrolls to latest messages
- **Loading Indicators**: Visual feedback during API calls
- **Input Protection**: Prevents spam by disabling input during requests
- **CORS Configuration**: Vite proxy configured for development

## Project Structure

```
chatbot/
├── src/
│   ├── components/
│   │   ├── ChatContainer.jsx       # Main container with state management
│   │   ├── MessageList.jsx         # Scrollable message list
│   │   ├── Message.jsx             # Individual message bubble
│   │   ├── ChatInput.jsx           # Input field and send button
│   │   └── LoadingIndicator.jsx   # Animated loading dots
│   ├── services/
│   │   └── api.js                  # API call functions
│   ├── utils/
│   │   ├── constants.js            # API URL configuration
│   │   └── streamSimulator.js     # Word-by-word streaming logic
│   ├── styles/
│   │   ├── main.scss               # Global styles
│   │   ├── _variables.scss         # Color scheme and design tokens
│   │   └── components/             # Component-specific styles
│   ├── app.jsx                     # Root component
│   └── main.jsx                    # Application entry point
├── vite.config.js                  # Vite configuration with proxy
├── index.html                      # HTML entry point
└── package.json
```

## Installation

```bash
# Dependencies are already installed
# If you need to reinstall:
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Important**: Make sure your backend API is running on `http://127.0.0.1:8000` before testing.

## API Configuration

The API endpoint is configured in `src/utils/constants.js`:

```javascript
export const API_BASE_URL = 'http://127.0.0.1:8000';
export const CHAT_ENDPOINT = '/chat';
```

### Development vs Production

- **Development**: Uses Vite proxy (`/api`) to avoid CORS issues
- **Production**: Uses direct API URL from constants

To change the API URL for production, update the `API_BASE_URL` constant or use environment variables.

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

Preview the production build:

```bash
npm run preview
```

## Color Scheme

The application uses Guard Owl's purple branding:

- **Primary Color**: #782AE4 (buttons, accents)
- **Primary Hover**: #6020C0 (hover states)
- **User Messages**: #F0E6FF (light purple background)
- **Agent Messages**: #F5F5F5 (light gray background)
- **Chat Background**: #FFFFFF (white)

## API Specification

### Request

```bash
POST /chat
Content-Type: application/json

{
  "query": "user's message"
}
```

### Response (Success)

```json
{
  "query": "user's message",
  "response": {
    "output": "Agent's response text..."
  }
}
```

### Error Handling

If the API is unavailable or returns an error, the app displays:
"Sorry, the server is down. We are working on a fix!"

## Features Implemented

✅ User messages appear on the right side
✅ Agent messages appear on the left side
✅ Word-by-word streaming simulation
✅ Loading indicator during API calls
✅ Input disabled during requests
✅ Auto-scroll to latest messages
✅ Manual scroll for viewing history
✅ Error handling with fallback message
✅ CORS proxy configuration
✅ Guard Owl purple branding
✅ Responsive design
✅ Keyboard support (Enter to send)

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Notes

- The streaming simulation uses a 75ms delay between words (configurable in `streamSimulator.js`)
- API requests have a 30-second timeout
- Messages are stored in component state (not persisted)
- The chat automatically scrolls to the bottom as new messages arrive
