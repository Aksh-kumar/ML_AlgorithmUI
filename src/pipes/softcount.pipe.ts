import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'softcount'
})
export class SoftCountPipe implements PipeTransform {

  transform(index: any, data: any): any {
    const t = Object.values(data).reduce((a, b) => (+a) + (+b), 0);
    const temp = data[index] / +t;
    return (+parseFloat(temp.toString()).toFixed( 2 ) * 100).toString();
  }

}
