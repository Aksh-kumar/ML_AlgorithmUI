import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-dynamictable',
  templateUrl: './dynamictable.component.html',
  styleUrls: ['./dynamictable.component.sass']
})
export class DynamictableComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() nameDic;
  header: any;
  bindedData: any;
  subHeader: any;
  clusterNameBinded: any;
  constructor() { }

  ngOnInit() {
    // this.initVariable();
  }
  initVariable() {
    this.header = [];
    this.bindedData = [];
    this.clusterNameBinded = {};
    this.subHeader = ['R', 'G', 'B'];
  }
  ngOnChanges(changes: SimpleChanges) {
    this.initVariable();
    // console.log(changes);
    // tslint:disable-next-line: no-string-literal
    if (changes['data'] && changes['nameDic']) {
      // tslint:disable-next-line: no-string-literal
    this.bindedData = changes['data'].currentValue;
    // console.log(this.bindedData);
    // tslint:disable-next-line: no-string-literal
    this.clusterNameBinded = changes['nameDic'].currentValue;
    // console.log(this.clusterNameBinded);
    this.header = Object.keys(this.clusterNameBinded);
    // console.log(this.header);
    }
  }
  checkForArray(item: any): boolean {
    return Array.isArray(item);
  }
}
