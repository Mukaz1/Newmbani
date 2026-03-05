import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates a string to a given length and appends an ellipsis if truncated.
   *
   * @param value The string to be truncated.
   * @param limit The maximum length of the string. Defaults to 100.
   * @param ellipsis The string to be appended if the string is truncated. Defaults to '...'.
   * @returns The truncated string with an ellipsis if it exceeds the limit.
   */
  transform(
    value: string,
    limit = 100,
    ellipsis = '...'
  ): string {
    if (value.length <= limit) {
      return value;
    }
    return value.substring(0, limit) + ellipsis;
  }
}
