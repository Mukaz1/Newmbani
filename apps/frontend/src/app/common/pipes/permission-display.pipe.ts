import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'permissionDisplay',
})
export class PermissionDisplayPipe implements PipeTransform {
  transform(permission: string): string {
    if (!permission) return '';

    return permission
      .split('-')
      .map((word: string) => {
        const splitted: string[] = word.split('');
        const firstLetter = splitted[0].toUpperCase();
        splitted.shift();
        return firstLetter + splitted.join('');
      })
      .join(' ');
  }
}
