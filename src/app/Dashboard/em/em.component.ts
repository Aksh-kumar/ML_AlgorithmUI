import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EMService } from 'src/Services/em.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-em',
  templateUrl: './em.component.html',
  styleUrls: ['./em.component.sass']
})
export class EmComponent implements OnInit {
  form: FormGroup;
  loading = false;
  @ViewChild('fileInput', {static: false}) fileInput: ElementRef;
  // tslint:disable-next-line: variable-name
  constructor(private _emService: EMService, private fb: FormBuilder) {
    this.createForm();
   }
   ngOnInit() {
    this._emService.test().subscribe((response: any) => {
      console.log(response);
    });
  }
  createForm() {
    this.form = this.fb.group({
      name: ['p_image', Validators.required],
      Image: null
    });
  }
  onFileChange(event) {
    const reader = new FileReader();
    console.log(event.target.files);
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.form.get('Image').setValue({
          filename: file.name,
          filetype: file.type,
          value: reader.result.toString().split(',')[1]
        });
      };
    }
  }
  onSubmit() {
    const formModel = this.form.value;
    // this.loading = true;
    // In a real-world app you'd have a http request / service call here like
    this._emService.predict(formModel).subscribe((response) => {
      console.log(response);
    });
    // this.http.post('apiUrl', formModel)
    // setTimeout(() => {
    //   console.log(formModel);
    //   alert('done!');
    //   this.loading = false;
    // }, 1000);
  }
  clearFile() {
    this.form.get('Image').setValue(null);
    this.fileInput.nativeElement.value = '';
  }
}
