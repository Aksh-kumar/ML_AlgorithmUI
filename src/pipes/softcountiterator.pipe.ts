import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'softcountiterator'
})
export class SoftCountIteratorPipe implements PipeTransform {

  transform(value: any): any {
    return Object.keys(value).map(x => +x);
  }

}
