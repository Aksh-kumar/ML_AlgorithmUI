import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlConstant} from '../app/Constants/Url.constants';
@Injectable()
export class EMService {
    // tslint:disable-next-line: variable-name
    constructor(private _httpClient: HttpClient) {}
    public test(): any {
        const url = 'http://127.0.0.1:5000/';
        const header = new HttpHeaders({'Content-Type': 'text/plain; charset=utf-8'});
        return this._httpClient.get(url, { headers: header, responseType: 'text'});
    }
    public predict(form: any) {
        const url = 'http://127.0.0.1:5000/em';
        const header = new HttpHeaders({'Content-Type': 'multipart/form-data; charset=utf-8'});
        return this._httpClient.post<any>(url, form, { headers: header});
    }
}
