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
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  // tslint:disable-next-line: variable-name
  constructor(private _emService: EMService, private fb: FormBuilder, private _sanitizer: DomSanitizer) {
    this.createForm();
  }
   ngOnInit() {
    this.url = null;
    this.url2 = null;
    this.k = 4;
    this.topNList = [{}];
    // this._emService.test().subscribe((response: any) => {
    //   console.log(response);
    // });
    // this.getClusterName();
    // this.getClusterParameter();
    // this.getFirstNDataResponsibility(5);
    this.getSupportedImagesExtension();
    // this.getFirstNHeterogeneity(55);
  }
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
    const resourceValue = 'data:' + filetype + ';base64,' + val;
    this.url2 = this._sanitizer.bypassSecurityTrustResourceUrl(resourceValue);
    console.log(this.url2);
    console.log(formModel);
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
      console.log(response);
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
  clearFile() {
    this.form.get('Image').setValue(null);
    this.url = null;
    this.fileInput.nativeElement.value = '';
  }
  retrain() {
    // pass
  }
}
