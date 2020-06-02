import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirst'
})

export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(s: string): string {
    if (s === null)
    {
      return 'Non déclaré';
    }
    return s.charAt(0).toUpperCase() + s.slice(1);
  }
}
