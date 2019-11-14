import { Component, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { EMService } from 'src/Services/em.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Chart } from 'angular-highcharts';
import { ImageModel } from 'src/Models/ImageModel';
import { EMNAV, NO_IMAGEURL } from 'src/app/Constants/application.constants';
import { ViewEMNavigation } from 'src/Models/ViewEMNavigation';

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
  // tslint:disable-next-line: variable-name
  constructor(private _emService: EMService,
              // tslint:disable-next-line: variable-name
              private fb: FormBuilder, private _sanitizer: DomSanitizer) {
    this.createForm();
  }

   ngOnInit() {
     this.initVar();
     this.getClusterParameter(true);
     this.clusterIsReady.subscribe((res) => {
      if (res) {
        this.getClusterName();
        this.getFirstNDataResponsibility(this.MAX_N_TRAINING_DATA);
        this.getSupportedImagesExtension();
      }
    });
  }

  // Initialize all variables
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

  /**
   * take form data object as parameter and
   * bind the predicted response data to html
   * @param formModel: object
   */
  predictImage(formModel: any) {
    this._emService.predict(formModel).subscribe((response) => {
      if (Object.keys(response).length !== 0) {  // check for NULL data
        const url = this.getUrlFromBase64(response[0].Extension, formModel.value); // bind base64 image data
        response[0].browserUrl = url;                                              // to HTML using DomSanitizer
        this.bindPredictionData(response[0]); // Bind properties of given image
      }
    });
  }

  /**
   * Get cluster name mapped with cluster number return dictionary
   * of number to name mapped cluster names if not found display only numbers
   */
  getClusterName() {
    this._emService.getClusterName(this.k).subscribe((response) => {
      if (Object.keys(response).length !== 0) { // check for NULL
        this.dicKToName = response;
      } else {    // If not found then bind cluster numbers
        for (let x = 0; x < this.k; x++) {
          this.dicKToName[x.toString()] = x.toString();
        }
      }
    });
  }

  /**
   * Set Cluster Name take Dictionary of cluster number to
   * name mapping as parameter and saved it to server side
   * @param mappingKey: object
   */
  setClusterName(mappingKey: any) {
    this._emService.setClusterName(this.k, mappingKey).subscribe((response) => {
      if (Object.keys(response).length !== 0) { // check for NULL
        if (response.res) { // If saved successfully
          alert('saved dictionay');
          this.getClusterName(); // refetch the saved name
        } else { // If failed
          alert('some error occured');
        }
      }
    });
  }

  /** Get cluster parameter take optional parameter triggered if it
   * become true then reinitialize all the value responsibility cluster
   * name and image extension supported it is useful when k value is changed
   * @param trigger: boolean
   */
  getClusterParameter(trigger = false) {
    this._emService.getClusterParameter(this.k).subscribe((response) => {
      if (Object.keys(response)) { // check for NULL
        this.clusterParameter = response; // bind cluster parameters
        this.parameterChart = this.getLineChart(this.clusterParameter.loglikelihood); // bind loglikelihood chart
        if (trigger) { // if triggered then rebind all the values
          this.clusterIsReady.emit(true);
        }
      }
    });
  }

  /**
   * load all the image extension supported by models
   */
  getSupportedImagesExtension() {
    this._emService.getSupportedImagesExtension(this.k).subscribe((response) => {
      if (Object.keys(response).length !== 0) { // check for NULL
        this.imageExtension = response;
      }
    });
  }

  /**
   * load the top n image responsibility along with all
   * the parameter of image take n i.e number of parameter
   * to load
   * @param n: number
   */
  getFirstNDataResponsibility(n: number) {
    this._emService.getFirstNDataResponsibility(this.k, n).subscribe((response) => {
      if (Object.keys(response).length !== 0) { // check for NULL
        Object.keys(response).forEach(element => {
          response[element].forEach(ele => {
          /* Iterate through each response to assign browser URL for each Image*/
          // tslint:disable-next-line: no-string-literal
          const base64 = this.getUrlFromBase64(ele['Extension'], ele['ImageBase64']);
          // tslint:disable-next-line: no-string-literal
          ele['browserUrl'] = base64;
          });
        });
        this.topNList = response;
        this.NRespKeys = Object.keys(this.topNList);
      }
    });
  }

  /**
   * Used to get TOP n heteroginity to find optimum number
   * of number of cluster take n (number of heterogeneity)
   * @param n : number
   */
  getFirstNHeterogeneity(n: number) {
    this._emService.getFirstNHeterogeneity(this.k, n).subscribe((response) => {
      if (Object.keys(response).length !== 0) { // check for NULL
        // console.log(response); // Leave for bind in future
      }
    });
  }

  /**
   * take new value of k (number of cluster) and retrain
   * the model and rebind the response to view
   * @param k : number
   */
  changeK(k: number) {
    this._emService.changeK(k).subscribe((response) => {
      if (Object.keys(response).length !== 0) { // check For NULL
        if (response.res) {
          alert('retrain successful');
          this.getClusterParameter(true); // Rebind view if success
        }
      }
    });
  }
  /// API calling methods end

  /// User Interface actions

  /**
   * create form object for View HTML forms
   */
  createForm() {
    this.form = this.fb.group({
      Image: {
        filename: null,
        filetype: null,
        value: null
      }
    });
  }

  /**
   * change Image File method take event as parameter
   * and set the Image Url to current Image
   * @param event : $event
   */
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
        this.setImageUrl(reader.result,  file.name); // Bind Image With URL in View
        this.imageParameter = null; // reset the Image Parameter
      };
    }
  }

  /**
   * take 2 paramter extension and base64 string and return
   * SafeResourseUrl taht can be binded in <img>  src attribute
   * @param fileExtension : string
   * @param base64Val : string
   */
  getUrlFromBase64(fileExtension: string, base64Val: string): SafeResourceUrl {
    const resourceValue = 'data:image/' + fileExtension.replace(/^./g, '') + ';base64,'
    + base64Val.replace(/\\\//g, '/');
    return this._sanitizer.bypassSecurityTrustResourceUrl(resourceValue);
  }

  /// User Interface actions end

  /// Button or click actions

  /**
   * Predict action take place call predict API to
   * get response and Bind the result to view
   */
  onSubmit() {
    const formModel = this.form.get('Image').value; // this.form.value;
    if (this.form.get('Image').value.value == null) { // Check for NULL
      alert('No Image uploaded');
      return;
    }
    // tslint:disable-next-line: no-string-literal
    formModel['k'] = this.k;
    const filetype = formModel.filetype;
    const extension = '.' + filetype.split('/')[1];
    if (this.imageExtension.find(x => extension).length === 0) { // Check for supported Image EXtension
      alert('File is not supported');
      return;
    }
    this.predictImage(formModel); // Call predict API and Bind response
  }

  /**
   * Used to clear all the Form data and Binded Image parameters
   */
  clearFile() {
    this.form.get('Image').setValue(null);
    this.url = null;
    this.fileInput.nativeElement.value = '';
    this.imageParameter = null;
    this.setImageUrl(this.url, null);
  }

  /**
   * Called when value of k is changes
   */
  retrain() {
    this.changeK(this.k);
  }

  /**
   * Bind the result of predicted data or top
   * n trained data parameter charts on View
   * @param items : object
   */
  bindPredictionData(items: any) {
    this.setImageUrl(items.browserUrl, items.ImageName);
    this.imageParameter = new ImageModel(items);
    this.featureChart = this.getfeatureChart(this.imageParameter.R, this.imageParameter.G, this.imageParameter.B);
    this.responsibilityChart = this.getResponsibilityLineChart(this.imageParameter.SoftCount);
  }

  /**
   * called clusterName set API when cluster name changed
   */
  save() {
    if (Object.keys(this.dicKToName).length === this.k &&
    // tslint:disable-next-line: triple-equals
    !Object.values(this.dicKToName).some(x => x == undefined || x == null)) {
      this.setClusterName(this.dicKToName); // call cluster name changed API
    }
  }

  /**
   * set Cluster parameter Navigation chart
   * visibility respect to the selection
   * @param nav : EMNAV
   */
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

  /**
   * return LogLikelihood chart with
   * provided data as parameters
   * @param Data : object
   */
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
    return chart;
  }

  /**
   * return Responsibility Line chart
   * with provided data as parameters
   * @param Data : object
   */
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
    return chart;
  }

  /**
   * return Image Features Red, green and Blue
   * column chart with provided Data as parameters
   * @param r : number
   * @param g : number
   * @param b : number
   */
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
    return chart;
  }

  /**
   * return center co-ordinates of
   * each clusters provided in data
   * @param data : object
   */
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
    return chart;
  }

  /**
   * return Pi chart with provided title
   * Binded to see the weight of each clusters
   * @param Data : object
   * @param title : string
   */
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
    return chart;
  }

  // End chart

  /**
   * bind the Image Name and Url to View
   * @param url : string/SafeResourceUrl
   * @param imageName : string
   */
  setImageUrl(url: any, imageName: string) {
    this.url = url;
    this.imageName = imageName;
  }
}
