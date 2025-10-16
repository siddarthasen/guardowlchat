/**
 * Simulates streaming text word-by-word
 * @param {string} text - Full text to stream
 * @param {function} onWord - Callback function called with each word
 * @param {number} delay - Milliseconds between words (default: 75ms)
 * @returns {Promise} - Resolves when streaming is complete
 */
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
