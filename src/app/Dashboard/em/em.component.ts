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
     this.k = 1;
     this.topNList = [{}];
     this._emService.test().subscribe((response: any) => {
      console.log(response);
    });
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
    console.log(formModel);
    const resourceValue = 'data:' + formModel.filetype + ';base64,' + formModel.value;
    this.url2 = this._sanitizer.bypassSecurityTrustResourceUrl(resourceValue);
    console.log(this.url2);
    // this._emService.predict(formModel).subscribe((response) => {
    //   console.log(response);
    // });
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
