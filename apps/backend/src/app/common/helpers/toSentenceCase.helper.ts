export function toSentenceCase(word: string): string {
  return word
    .split('-')
    .map((t: string) => {
      const splitted: string[] = t.split('');
      const firstLetter = splitted[0].toUpperCase();
      splitted.shift().split('');
      return firstLetter + splitted.join('');
    })
    .join(' ');
}
