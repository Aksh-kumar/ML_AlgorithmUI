import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { EMService } from 'src/Services/em.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Chart } from 'angular-highcharts';
import { ImageModel } from 'src/Models/ImageModel';
import { EMNAV, NO_IMAGEURL } from 'src/app/Constants/application.constants';
import { ViewEMNavigation } from 'src/Models/ViewEMNavigation';
// import * as Highcharts from 'highcharts';

// declare var require: any;
// let Boost = require('highcharts/modules/boost');
// let noData = require('highcharts/modules/no-data-to-display');
// let More = require('highcharts/highcharts-more');

// Boost(Highcharts);
// noData(Highcharts);
// More(Highcharts);
// noData(Highcharts);

@Component({
  selector: 'app-em',
  templateUrl: './em.component.html',
  styleUrls: ['./em.component.sass']
})
export class EmComponent implements OnInit {
  form: FormGroup;
  imageExtension: string[];
  url: any;
  k: number;
  readonly MAX_N_TRAINING_DATA = 5;
  readonly NAV = EMNAV;
  readonly viewNav = ViewEMNavigation;
  readonly noIMG = NO_IMAGEURL;
  topNList: any;
  dicKToName: any;
  NRespKeys: any;
  parameterChart: Chart;
  featureChart: Chart;
  responsibilityChart: Chart;
  clusterParameter: any;
  imageName: string;
  imageParameter: ImageModel;
  clusterIsReady: EventEmitter<boolean>;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  // @ViewChild('logLikelihoodChart', {static: false}) public logLikelihoodChartRef: ElementRef;
  // @ViewChild('meansChart', {static: false}) public meansChartRef: ElementRef;
  // @ViewChild('weightsChart', {static: false}) public weightsChartRef: ElementRef;
  // @ViewChild('featureChart', {static: false}) public featureChartRef: ElementRef;
  // tslint:disable-next-line: variable-name
  constructor(private _emService: EMService,
              // tslint:disable-next-line: variable-name
              private fb: FormBuilder, private _sanitizer: DomSanitizer) {
    this.createForm();
  }
   ngOnInit() {
     this.initVar();
     this.getClusterParameter(true);
     // this.retrain();
     this.clusterIsReady.subscribe((res) => {
      if (res) {
        this.getClusterName();
        this.getFirstNDataResponsibility(this.MAX_N_TRAINING_DATA);
        this.getSupportedImagesExtension();
        // this.getFirstNHeterogeneity(55);
      }
    });
  }
  // Init variables
  initVar() {
    this.url = null;
    this.clusterIsReady =  new EventEmitter<boolean>();
    this.imageName = '';
    this.imageParameter = null;
    this.k = 4;
    this.topNList = {};
    this.dicKToName = {};
    this.NRespKeys = [];
    this.imageExtension = [];
    this.clusterParameter = {};
    this.parameterChart = null;
    this.featureChart = null;
    this.responsibilityChart = null;
  }
  /// API calling methods
  predictImage(formModel: any) {
    this._emService.predict(formModel).subscribe((response) => {
      if (Object.keys(response).length !== 0) {
        const url = this.getUrlFromBase64(response[0].Extension, formModel.value);
        response[0].browserUrl = url;
        this.bindPredictionData(response[0]);
      }
    });
  }
  getClusterName() {
    this._emService.getClusterName(this.k).subscribe((response) => {
      if (Object.keys(response).length !== 0) {
        this.dicKToName = response;
      } else {
        for (let x = 0; x < this.k; x++) {
          this.dicKToName[x.toString()] = x.toString();
        }
      }
    });
  }
  setClusterName(mappingKey: any) {
    this._emService.setClusterName(this.k, mappingKey).subscribe((response) => {
      if (Object.keys(response).length !== 0) {
        if (response.res) {
          alert('saved dictionay');
          this.getClusterName();
        } else {
          alert('some error occured');
        }
      }
    });
  }
  getClusterParameter(trigger = false) {
    this._emService.getClusterParameter(this.k).subscribe((response) => {
      if (Object.keys(response)) {
        this.clusterParameter = response;
        // console.log(response);
        this.parameterChart = this.getLineChart(this.clusterParameter.loglikelihood);
        if (trigger) {
          this.clusterIsReady.emit(true);
        }
      }
    });
  }
  getSupportedImagesExtension() {
    this._emService.getSupportedImagesExtension(this.k).subscribe((response) => {
      if (Object.keys(response).length !== 0) {
        this.imageExtension = response;
      }
    });
  }
  getFirstNDataResponsibility(n: number) {
    this._emService.getFirstNDataResponsibility(this.k, n).subscribe((response) => {
      if (Object.keys(response).length !== 0) {
        Object.keys(response).forEach(element => {
          response[element].forEach(ele => {
          // tslint:disable-next-line: no-string-literal
          const base64 = this.getUrlFromBase64(ele['Extension'], ele['ImageBase64']);
          // tslint:disable-next-line: no-string-literal
          ele['browserUrl'] = base64;
          });
        });
        this.topNList = response;
        // console.log(this.topNList);
        this.NRespKeys = Object.keys(this.topNList);
      }
    });
  }
  getFirstNHeterogeneity(n: number) {
    this._emService.getFirstNHeterogeneity(this.k, n).subscribe((response) => {
      // console.log(response);
    });
  }
  changeK(k: number) {
    this._emService.changeK(k).subscribe((response) => {
      // console.log(response);
      if (Object.keys(response).length !== 0) {
        if (response.res) {
          alert('retrain successful');
          this.getClusterParameter(true);
        }
      }
    });
  }
  /// API calling methods end
  /// User Interface actions
  createForm() {
    this.form = this.fb.group({
      Image: {
        filename: null,
        filetype: null,
        value: null
      }
    });
  }
  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('Image').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        });
        // this.url = reader.result;
        this.setImageUrl(reader.result,  file.name);
        this.imageParameter = null;
      };
    }
  }
  getUrlFromBase64(fileExtension: string, base64Val: string) {
    const resourceValue = 'data:image/' + fileExtension.replace(/^./g, '') + ';base64,'
    + base64Val.replace(/\\\//g, '/');
    return this._sanitizer.bypassSecurityTrustResourceUrl(resourceValue);
  }
  /// User Interface actions
  /// Button or click actions
  onSubmit() {
    const formModel = this.form.get('Image').value; // this.form.value;
    if (this.form.get('Image').value.value == null) {
      alert('No Image uploaded');
      return;
    }
    // tslint:disable-next-line: no-string-literal
    formModel['k'] = this.k;
    const filetype = formModel.filetype;
    // const val = formModel.value;
    const extension = '.' + filetype.split('/')[1];
    if (this.imageExtension.find(x => extension).length === 0) {
      alert('File is not supported');
      return;
    }
    // const url = this.getUrlFromBase64(extension , val);
    // this.setImageUrl(url, formModel.filename);
    this.predictImage(formModel);
  }
  clearFile() {
    this.form.get('Image').setValue(null);
    this.url = null;
    this.fileInput.nativeElement.value = '';
    this.imageParameter = null;
    this.setImageUrl(this.url, null);
  }
  retrain() {
    this.changeK(this.k);
  }
  bindPredictionData(items: any) {
    this.setImageUrl(items.browserUrl, items.ImageName);
    this.imageParameter = new ImageModel(items);
    // console.log(this.dicKToName[this.imageParameter.AssignCluster]);
    this.featureChart = this.getfeatureChart(this.imageParameter.R, this.imageParameter.G, this.imageParameter.B);
    this.responsibilityChart = this.getResponsibilityLineChart(this.imageParameter.SoftCount);
    // console.log(this.imageParameter);
  }
  save() {
    if (Object.keys(this.dicKToName).length === this.k &&
    // tslint:disable-next-line: triple-equals
    !Object.values(this.dicKToName).some(x => x == undefined || x == null)) {
      // console.log(this.dicKToName);
      this.setClusterName(this.dicKToName);
    }
  }
  navChange(nav: EMNAV) {
    this.viewNav.setVisibility(nav);
    if (nav === EMNAV.LOGLIKELIHOOD) {
      this.parameterChart = this.getLineChart(this.clusterParameter.loglikelihood);
    } else if (nav === EMNAV.MEANS) {
      this.parameterChart = this.getmeansChart(this.clusterParameter.means);
    } else if (nav === EMNAV.WEIGHTS) {
      this.parameterChart = this.getPieChart(this.clusterParameter.weights, 'Weights of cluster');
    } else {
      this.parameterChart = null;
    }
  }
  // button action end
  // chart
  getLineChart(Data: any): Chart {
    const chart = new Chart({
      chart: {
        width: 630,
        height: 210,
        type: 'line'
      },
      title: {
        text: 'LogLikelihood variation with iterations'
      },
      yAxis : {
        title: {
          text: 'Log likelihood'
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          type: 'line',
          name: 'Iterations',
          data: Data
        }
      ]
    });
    // if (ref && ref.nativeElement) {
    //   // tslint:disable-next-line: no-string-literal
    //   chart.chart['renderTo'] = 'a1'; // ref.nativeElement;
    // }
    return chart;
  }
  getResponsibilityLineChart(Data: any): Chart {
    const chart = new Chart({
      chart: {
        width: 310,
        height: 180,
        type: 'line'
      },
      title: {
        text: 'Responsibilities of assignment cluster'
      },
      xAxis: {
        categories: Object.keys(Data).map(element => this.dicKToName[element.toString()])
        // labels: {enabled: false}
      },
      yAxis : {
        title: {
          text: 'Responsibility'
        },
        min: -1
      },
      tooltip: {
        // shared: true,
        // tslint:disable-next-line: object-literal-shorthand
        formatter: function() {
          return '<span> ' + this.y.toString() + '<b>(' + (+parseFloat(this.y.toString()).toFixed( 2 ) * 100).toString() + '%)</b>';
        }
      },
      credits: {
        enabled: false
      },
      series: [
        {
          type: 'line',
          name: '',
          data: Object.values(Data)
        }
      ]
    });
    // if (ref && ref.nativeElement) {
    //   // tslint:disable-next-line: no-string-literal
    //   chart.chart['renderTo'] = 'a1'; // ref.nativeElement;
    // }
    return chart;
  }
  getfeatureChart(r: number, g: number, b: number): Chart {
    const chart = new Chart({
      chart: {
          width: 287,
          height: 181,
          type: 'column'
      },
      title: {
          text: 'Features'
      },
      subtitle: {
          text: 'Feature Intensity of red blue and green color'
      },
      xAxis: {
          categories: [
              'Red',
              'Green',
              'Blue'
          ]
          // labels: {enabled: false}
      },
      yAxis: {
          min: 0,
          title: {
              text: 'Average intensity (units)'
          }
      },
      series: [
        {
          type: 'column',
          name: '',
          data: [{
            name: 'Red',
            color: '#FF0000',
            y: r
            }, {
              name: 'Green',
              color: '#00FF00',
              y: g
            }, {
            name: 'Blue',
            color: '#0000FF',
            y: b
            }
          ]
        }
      ]
    });
    // if (ref && ref.nativeElement) {
    //   // tslint:disable-next-line: no-string-literal
    //   chart.chart['renderTo'] = ref.nativeElement;
    // }
    return chart;
  }
  getmeansChart(data: any): Chart {
    const Series = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      const serie = {
        type: 'column',
        color: 'B3CCFF',
        name: this.dicKToName[i.toString()],
        data: [{
          name: 'Red',
          color: '#FF0000',
          y: data[i][0]
          }, {
            name: 'Green',
            color: '#00FF00',
            y: data[i][1]
          }, {
          name: 'Blue',
          color: '#0000FF',
          y: data[i][2]
          }]
        };
      Series.push(serie);
    }
    const chart = new Chart({
      chart: {
        width: 630,
        height: 210,
        type: 'column'
      },
      title: {
          text: 'Means'
      },
      subtitle: {
          text: 'centroids co-ordinate of each cluster'
      },
      xAxis: {
          categories: ['Red', 'Green', 'Blue']
      },
      yAxis: {
          min: 0
      },
      legend: {
          enabled: false
      },
      series: Series
    });
    // if (ref && ref.nativeElement) {
    //   // tslint:disable-next-line: no-string-literal
    //   chart.chart['renderTo'] = 'a2'; // ref.nativeElement;
    // }
    return chart;
  }
  getPieChart(Data: any, title: string): Chart {
    const chart = new Chart({
        chart: {
          width: 630,
          height: 210,
          type: 'pie'
        },
        title: {
              text: title,
          },
        subtitle: {
            text: ''
          },
      xAxis: {
        categories: Object.keys(Data).map(element => this.dicKToName[element.toString()])
      },
      yAxis: {
        min: 0
      },
      tooltip: {
        shared: true,
        pointFormat: '<b> {point.y}</b><br/>'
      },
      series: [{
        type: 'pie',
        data: Object.keys(Data).map(element => {
                return {
                name: this.dicKToName[element.toString()],
                y: Data[element]};
              }),
        }]
    });
    // if (ref && ref.nativeElement) {
    //   // tslint:disable-next-line: no-string-literal
    //   chart.chart['renderTo'] = 'a4'; // ref.nativeElement;
    // }
    return chart;
  }
  // End chart
  setImageUrl(url: any, imageName: string) {
    this.url = url;
    this.imageName = imageName;
  }
}
