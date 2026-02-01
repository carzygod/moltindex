export const highlightTerm = (text: string, term?: string): (string | { match: string })[] => {
  if (!term) {
    return [text];
  }
  const lowered = term.toLowerCase();
  const parts: (string | { match: string })[] = [];
  let idx = 0;
  while (idx < text.length) {
    const segment = text.slice(idx);
    const pos = segment.toLowerCase().indexOf(lowered);
    if (pos === -1) {
      parts.push(segment);
      break;
    }
    if (pos > 0) {
      parts.push(segment.slice(0, pos));
    }
    parts.push({ match: segment.slice(pos, pos + term.length) });
    idx += pos + term.length;
  }
  return parts;
};
