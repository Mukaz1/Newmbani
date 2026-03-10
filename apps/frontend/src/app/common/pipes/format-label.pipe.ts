import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatLabel',
})
export class FormatLabelPipe implements PipeTransform {
  /**
   * Transforms a string by replacing underscores and dashes with spaces and capitalizing the first letter of each word.
   * @param value - The string to transform.
   * @returns The transformed string.
   */
  transform(value: string): string {
    if (!value) return '';

    return value
      .replace(/[_-]+/g, ' ')      // turn "_" and "-" into spaces
      .replace(/\b\w/g, (c) => c.toUpperCase()); // capitalize words
  }
}
