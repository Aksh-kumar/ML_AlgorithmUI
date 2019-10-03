import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EMService } from 'src/Services/em.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-em',
  templateUrl: './em.component.html',
  styleUrls: ['./em.component.sass']
})
export class EmComponent implements OnInit {
  form: FormGroup;
  loading = false;
  url: any;
  k: number;
  readonly MAX_N_TRAINING_DATA = 5;
  url2: any;
  topNList: any;
  dicKToName: any;
  NRespKeys: any;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  // tslint:disable-next-line: variable-name
  constructor(private _emService: EMService, private fb: FormBuilder, private _sanitizer: DomSanitizer) {
    this.createForm();
  }
   ngOnInit() {
    this.url = null;
    this.url2 = null;
    this.k = 4;
    this.topNList = {};
    this.dicKToName = {};
    this.NRespKeys = [];
    for (let x = 0; x < this.k; x++) {
      this.dicKToName[x] = x;
    }
    // this._emService.test().subscribe((response: any) => {
    //   console.log(response);
    // });
    // this.getClusterName();
    // this.getClusterParameter();
    this.getFirstNDataResponsibility(5);
    this.getSupportedImagesExtension();
    // this.getFirstNHeterogeneity(55);
  }
  /// API calling methods
  predictImage(formModel: any) {
    this._emService.predict(formModel).subscribe((response) => {
      console.log(response);
    });
  }
  getClusterName() {
    this._emService.getClusterName(this.k).subscribe((response) => {
      console.log(response);
    });
  }
  setClusterName(mappingKey: any) {
    this._emService.setClusterName(this.k, mappingKey).subscribe((response) => {
      console.log(response);
    });
  }
  getClusterParameter() {
    this._emService.getClusterParameter(this.k).subscribe((response) => {
      console.log(response);
    });
  }
  getSupportedImagesExtension() {
    this._emService.getSupportedImagesExtension(this.k).subscribe((response) => {
      console.log(response);
    });
  }
  getFirstNDataResponsibility(n: number) {
    this._emService.getFirstNDataResponsibility(this.k, n).subscribe((response) => {
      if (Object.keys(response).length !== 0) {
        Object.keys(response).forEach(element => {
          response[element].forEach(ele => {
          // tslint:disable-next-line: no-string-literal
          const base64 = this.getUrlFromBase64(ele['Extension'], ele['Image_base64']);
          // tslint:disable-next-line: no-string-literal
          ele['browserUrl'] = base64;
          });
        });
        this.topNList = response;
        this.NRespKeys = Object.keys(this.topNList);
      }
    });
  }
  getFirstNHeterogeneity(n: number) {
    this._emService.getFirstNHeterogeneity(this.k, n).subscribe((response) => {
      console.log(response);
    });
  }
  changeK(k: number) {
    this._emService.changeK(k).subscribe((response) => {
      console.log(response);
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
        this.url = reader.result;
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
    const val = formModel.value;
    const extension = '.' + filetype.split('/')[1];
    console.log(filetype, extension);
    // const resourceValue = 'data:' + filetype + ';base64,' + val;
    this.url2 = this.getUrlFromBase64(extension , val);
    console.log(formModel);
    // this.predictImage(formModel);
  }
  clearFile() {
    this.form.get('Image').setValue(null);
    this.url = null;
    this.fileInput.nativeElement.value = '';
  }
  retrain() {
    // pass
    alert('retrain successful');
  }
  bindPredictionData(items: any) {
    // pass
    console.log(items);
    this.url2 = items.browserUrl;
  }
  save() {
    // pass
    alert('saved dictionay');
  }
  // button action end
}
