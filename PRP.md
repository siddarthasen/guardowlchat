# Project Requirements Prompt (PRP)
## Guard Owl Chat Interface

### Project Overview
A responsive chat interface built with Preact, SCSS, and Vite that enables users to interact with an AI agent through a conversational UI. The application will communicate with a backend API and provide a smooth, user-friendly chat experience with simulated streaming responses.

---

## Technical Stack

### Core Technologies
- **Frontend Framework**: Preact (v10+)
- **Styling**: SCSS (Sass)
- **Build Tool**: Vite
- **HTTP Client**: Fetch API (native)

### Project Initialization
```bash
npm init preact
# Choose options during setup:
# - Name: guard-owl-chat
# - Language: JavaScript
# - Use router: No
# - Use ESLint: Yes (recommended)
```

---

## Project Structure

```
chatbot/
├── src/
│   ├── components/
│   │   ├── ChatContainer.jsx       # Main chat container component
│   │   ├── MessageList.jsx         # Scrollable message list
│   │   ├── Message.jsx             # Individual message component
│   │   ├── ChatInput.jsx           # User input field and send button
│   │   └── LoadingIndicator.jsx   # Visual loading indicator
│   ├── services/
│   │   └── api.js                  # API call functions
│   ├── utils/
│   │   ├── constants.js            # Configuration constants (API URL)
│   │   └── streamSimulator.js     # Word-by-word streaming simulation
│   ├── styles/
│   │   ├── main.scss               # Global styles and variables
│   │   ├── components/
│   │   │   ├── _chat-container.scss
│   │   │   ├── _message.scss
│   │   │   ├── _chat-input.scss
│   │   │   └── _loading-indicator.scss
│   │   └── _variables.scss         # Color scheme and design tokens
│   ├── app.jsx                     # Root application component
│   └── main.jsx                    # Application entry point
├── vite.config.js                  # Vite configuration (with proxy)
├── package.json
└── PRP.md                          # This file
```

---

## Feature Requirements

### 1. Chat Interface Layout

#### Visual Design
- **Two-column message layout**:
  - **Left side**: AI agent messages (with distinct background color)
  - **Right side**: User messages (with contrasting background color)
- **Chat background**: White (#FFFFFF)
- **Message bubbles**: Colored backgrounds with padding and border-radius
- **Responsive design**: Works on desktop and mobile devices

#### Scrolling Behavior
- **Auto-scroll**: Automatically scroll to bottom when new messages are added
- **Manual scroll**: Allow users to scroll up to view chat history
- **Scroll container**: Fixed height with overflow-y: auto

### 2. Message Flow

#### User Sends Message
1. User types message in input field
2. User clicks "Send" button or presses Enter
3. Message immediately appears on right side of chat
4. Input field is **disabled** to prevent spam
5. **Loading indicator** appears below the user's message
6. API request is sent

#### Agent Response
1. Upon successful API response:
   - Remove loading indicator
   - Display agent message on left side
   - **Simulate streaming** by displaying response word-by-word
   - Auto-scroll to keep latest word in view
2. Upon API error:
   - Remove loading indicator
   - Stream error message: "Sorry, the server is down. We are working on a fix!"
3. Re-enable input field after streaming completes

### 3. API Integration

#### API Endpoint Configuration
- **File**: `src/utils/constants.js`
- **Export**: API_BASE_URL as a configurable variable
```javascript
// constants.js
export const API_BASE_URL = 'http://127.0.0.1:8000';
export const CHAT_ENDPOINT = '/chat';
```

#### API Call Function
- **File**: `src/services/api.js`
- **Function**: `sendChatMessage(query)`
- **Method**: POST
- **Headers**:
  - `accept: application/json`
  - `Content-Type: application/json`
- **Request body**:
```json
{
  "query": "user's message"
}
```

#### Expected Response Format
**Success** (HTTP 200):
```json
{
  "query": "give me my shift schedule",
  "response": {
    "output": "Can you provide the date for which you'd like to see your shift schedule?..."
  }
}
```

**Error Handling**:
- Network errors
- HTTP 4xx/5xx responses
- Malformed JSON responses
- Timeout (implement 30-second timeout)

### 4. Streaming Simulation

#### Implementation Details
- **File**: `src/utils/streamSimulator.js`
- **Function**: `streamText(text, callback, delay)`
- **Parameters**:
  - `text`: Full text to stream
  - `callback`: Function called with each word
  - `delay`: Milliseconds between words (default: 50-100ms)
- **Behavior**:
  - Split text by spaces
  - Emit one word at a time with delay
  - Trigger re-render after each word
  - Return a promise that resolves when complete

#### Example Implementation
```javascript
export function streamText(text, onWord, delay = 75) {
  return new Promise((resolve) => {
    const words = text.split(' ');
    let index = 0;

    const interval = setInterval(() => {
      if (index < words.length) {
        onWord(words[index]);
        index++;
      } else {
        clearInterval(interval);
        resolve();
      }
    }, delay);
  });
}
```

### 5. State Management

#### Application State
Use Preact hooks (`useState`, `useEffect`, `useRef`) to manage:
- **messages**: Array of message objects
  ```javascript
  {
    id: uniqueId,
    text: string,
    sender: 'user' | 'agent',
    timestamp: Date,
    isStreaming: boolean
  }
  ```
- **inputValue**: Current input field value
- **isLoading**: Boolean for API request state
- **error**: Error message if API fails

#### Message List Reference
- Use `useRef` to maintain reference to message container
- Use `scrollIntoView()` or `scrollTop` manipulation for auto-scroll

### 6. CORS Configuration

#### Vite Proxy Setup
- **File**: `vite.config.js`
- **Purpose**: Prevent CORS errors during development

```javascript
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});
```

#### API Call Adjustment
- During development: Use `/api/chat` (proxied)
- In production: Use full URL from constants.js
- Environment variable to toggle between dev/prod URLs

```javascript
const API_URL = import.meta.env.DEV
  ? '/api'
  : API_BASE_URL;
```

---

## Styling Guidelines

### Color Scheme
Based on Guard Owl branding (guardowlco.com):

#### Primary Colors
- **Primary Brand Color**: Purple (#782AE4) - Main brand color for buttons, accents
- **Primary Hover**: Darker purple (#6020C0) - For button hover states
- **Secondary Brand Color**: Light purple tint (#F0E6FF) - For backgrounds and highlights
- **Accent Color**: Complementary color (to be determined based on website)

#### Application Colors
- **Chat Background**: White (#FFFFFF)
- **User Message Background**: Light purple (#F0E6FF) - Matches brand purple theme
- **Agent Message Background**: Light gray (#F5F5F5) - Neutral contrast to user messages
- **Text Colors**:
  - Primary text: Dark gray (#212121)
  - Secondary text: Medium gray (#757575)
  - On purple background: White (#FFFFFF) or very dark (#1A1A1A)
- **Input Border**: Light gray (#E0E0E0)
- **Input Focus Border**: Brand purple (#782AE4)
- **Button Primary**: Purple (#782AE4) with hover state

#### SCSS Variables
**File**: `src/styles/_variables.scss`
```scss
// Brand Colors - Guard Owl Purple Theme
$color-primary: #782AE4;
$color-primary-dark: #6020C0;
$color-primary-light: #F0E6FF;
$color-secondary: #9B59FF;  // Lighter purple variant

// UI Colors
$color-bg-chat: #ffffff;
$color-bg-user-message: #F0E6FF;  // Light purple for user messages
$color-bg-agent-message: #f5f5f5;  // Light gray for agent messages
$color-text-primary: #212121;
$color-text-secondary: #757575;
$color-border: #e0e0e0;
$color-border-focus: #782AE4;  // Purple border on focus

// Spacing
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// Typography
$font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-size-base: 16px;
$font-size-sm: 14px;

// Border Radius
$border-radius-sm: 4px;
$border-radius-md: 8px;
$border-radius-lg: 16px;
```

### Component Styling

#### Message Bubbles
- **Max width**: 70% of container
- **Padding**: 12px 16px
- **Border radius**: 16px
- **Box shadow**: Subtle shadow for depth
- **Margin**: Space between messages
- **Animation**: Fade-in animation for new messages

#### Chat Input
- **Position**: Fixed at bottom or within container
- **Border**: Top border to separate from messages
- **Padding**: Comfortable spacing for input field
- **Button**: Primary brand color, disabled state styling
- **Focus state**: Clear visual indicator

#### Loading Indicator
- **Type**: Three animated dots or spinner
- **Color**: Match agent message theme
- **Position**: Left-aligned (agent side)
- **Animation**: Smooth, continuous animation

---

## User Experience Requirements

### 1. Input Validation
- Trim whitespace from messages
- Prevent sending empty messages
- Maximum message length (optional: 1000 characters)

### 2. Accessibility
- Semantic HTML elements
- ARIA labels for screen readers
- Keyboard navigation support (Enter to send)
- Focus management

### 3. Performance
- Efficient re-rendering (use `memo` if needed)
- Debounce input if implementing typing indicators
- Lazy load old messages if implementing pagination

### 4. Error Handling
- Clear error messages to user
- Retry mechanism for failed requests
- Graceful degradation if streaming fails

### 5. Loading States
- **Visual indicator**: Show loading spinner/dots
- **Input disabled**: Prevent new messages during API call
- **Button disabled**: Disable send button while loading
- **Clear feedback**: User knows system is processing

---

## Implementation Steps

### Phase 1: Project Setup
1. Initialize Preact project with Vite
2. Install dependencies:
   ```bash
   npm install sass
   ```
3. Set up project structure (folders and files)
4. Configure Vite proxy for CORS
5. Create constants file with API URL

### Phase 2: Core Components
1. Create `ChatContainer` component (main wrapper)
2. Create `MessageList` component (scrollable area)
3. Create `Message` component (individual message bubble)
4. Create `ChatInput` component (input field + send button)
5. Create `LoadingIndicator` component

### Phase 3: Styling
1. Set up SCSS structure with variables
2. Style chat container and layout
3. Style message bubbles (user vs agent)
4. Style input area and button
5. Add loading indicator animation
6. Implement responsive design

### Phase 4: Functionality
1. Implement API service (`api.js`)
2. Implement streaming simulator (`streamSimulator.js`)
3. Wire up state management in components
4. Implement message sending flow
5. Implement response receiving and streaming
6. Add auto-scroll functionality
7. Add error handling

### Phase 5: Polish
1. Add animations and transitions
2. Test error scenarios
3. Optimize performance
4. Add accessibility features
5. Cross-browser testing

---

## Dependencies

### Required
```json
{
  "dependencies": {
    "preact": "^10.x.x"
  },
  "devDependencies": {
    "@preact/preset-vite": "^2.x.x",
    "vite": "^5.x.x",
    "sass": "^1.x.x"
  }
}
```

### Optional (Recommended)
- **classnames**: Conditional CSS classes
- **date-fns** or **dayjs**: Timestamp formatting
- **uuid**: Generate unique message IDs

---

## Testing Scenarios

### Manual Testing Checklist
- [ ] Send a message and verify it appears on right side
- [ ] Verify API call is made with correct payload
- [ ] Verify agent response streams word-by-word
- [ ] Verify input is disabled during API call
- [ ] Verify loading indicator appears and disappears
- [ ] Verify auto-scroll works with new messages
- [ ] Verify manual scroll up to view history
- [ ] Test error scenario (stop backend server)
- [ ] Verify error message streams correctly
- [ ] Test empty message prevention
- [ ] Test rapid message sending (spam prevention)
- [ ] Test responsive design on mobile
- [ ] Test keyboard navigation (Enter to send)

---

## Notes

### Development Environment
- **Dev server**: `npm run dev` (typically runs on `http://localhost:5173`)
- **Build**: `npm run build` (outputs to `dist/`)
- **Preview**: `npm run preview` (preview production build)

### API URL Configuration
For production deployment, update `API_BASE_URL` in `constants.js` or use environment variables:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
```

Then set in `.env`:
```
VITE_API_URL=https://api.guardowl.com
```

### Browser Compatibility
- Modern browsers with ES6+ support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Success Criteria

The project is complete when:
1. ✅ User can send messages that appear on the right side
2. ✅ API calls are made successfully to the backend
3. ✅ Agent responses stream word-by-word on the left side
4. ✅ Error handling displays fallback message
5. ✅ Input is disabled during API processing
6. ✅ Loading indicator provides visual feedback
7. ✅ Auto-scroll keeps latest messages in view
8. ✅ Manual scrolling works for viewing history
9. ✅ Styling matches Guard Owl brand colors
10. ✅ Code is modular with clear separation of concerns
11. ✅ CORS is properly configured for development
12. ✅ Application is responsive and accessible

---

**Document Version**: 1.0
**Last Updated**: 2025-10-16
**Project**: Guard Owl Chat Interface
