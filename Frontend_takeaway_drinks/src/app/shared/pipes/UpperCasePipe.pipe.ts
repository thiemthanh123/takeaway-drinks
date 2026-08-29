import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'upperCasePipe'
})
export class UpperCasepipe implements PipeTransform {
  transform(value: string): string {
    return value.toUpperCase();
  }
}