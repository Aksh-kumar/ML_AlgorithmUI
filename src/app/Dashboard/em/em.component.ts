import { Component, OnInit } from '@angular/core';
import { EMService } from 'src/Services/em.service';

@Component({
  selector: 'app-em',
  templateUrl: './em.component.html',
  styleUrls: ['./em.component.sass']
})
export class EmComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  constructor(private _emService: EMService) { }

  ngOnInit() {
    this._emService.test().subscribe((response: any) => {
      console.log(response);
    });
  }

}
