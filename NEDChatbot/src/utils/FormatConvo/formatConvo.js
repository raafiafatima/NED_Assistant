export function formatConvo(messages) {
  return messages
    .map((msg, i) => {
      if (i % 2 == 0) {
        return `Human: ${msg}`;
      } else {
        return `AI:  ${msg}`;
      }
    })
    .join("\n");
}
