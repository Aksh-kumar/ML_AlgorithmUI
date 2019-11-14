import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';

@Component({
  selector: 'app-dynamictable',
  templateUrl: './dynamictable.component.html',
  styleUrls: ['./dynamictable.component.sass']
})
export class DynamictableComponent implements OnChanges {
  @Input() data;
  @Input() nameDic;
  header: any;
  bindedData: any;
  subHeader: any;
  clusterNameBinded: any;
  constructor() { }

  /**
   * Initiate all the variables
   */
  initVariable() {
    this.header = [];
    this.bindedData = [];
    this.clusterNameBinded = {};
    this.subHeader = ['R', 'G', 'B'];
  }

  /**
   * Life cycle hook change reflacted when data is changed
   * @param changes : SimpleChanges
   */
  ngOnChanges(changes: SimpleChanges) {
    this.initVariable(); // Initialize all variable
    // tslint:disable-next-line: no-string-literal
    if (changes['data'] && changes['nameDic']) {
      // tslint:disable-next-line: no-string-literal
    this.bindedData = changes['data'].currentValue; // Bind table data
    // tslint:disable-next-line: no-string-literal
    this.clusterNameBinded = changes['nameDic'].currentValue; // Bind Cluster Name
    this.header = Object.keys(this.clusterNameBinded); // Bind headers
    }
  }

  /**
   * check If Item is Array or Not
   * @param item : object
   */
  checkForArray(item: any): boolean {
    return Array.isArray(item);
  }
}
