import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'toSentenceCase',
})
export class ToSentenceCasePipe implements PipeTransform {
  transform(word: string): string {
    if (!word) return '';

    return word
      .split('-')
      .map((t: string) => {
        const splitted: string[] = t.split('');
        const firstLetter = splitted[0].toUpperCase();
        splitted.shift();
        return firstLetter + splitted.join('');
      })
      .join(' ');
  }
}
