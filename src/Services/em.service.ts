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
        const url = 'http://127.0.0.1:5000/em/predict/';
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.post<any>(url, form, { headers: header});
    }
    public getClusterName(k: number) {
        const url = 'http://127.0.0.1:5000/em/getclustername/?k=' + k.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public setClusterName(k: number, key: any) {
        const url = 'http://127.0.0.1:5000/em/setclustername/';
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        // tslint:disable-next-line: object-literal-shorthand
        return this._httpClient.post<any>(url, {k: k, mappedKey: key}, { headers: header});
    }
    public getClusterParameter(k: number) {
        const url = 'http://127.0.0.1:5000/em/getclusterparameter/?k=' + k.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getSupportedImagesExtension(k: number) {
        const url = 'http://127.0.0.1:5000/em/getsupportedimagesextension/?k=' + k.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getFirstNDataResponsibility(k: number, n: number) {
        const url = 'http://127.0.0.1:5000/em/getfirstndataresponsibility/?k=' + k.toString() + '&n=' + n.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getFirstNHeterogeneity(k: number, n: number) {
        const url = 'http://127.0.0.1:5000/em/getfirstnheterogeneity/?k=' + k.toString() + '&n=' + n.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public changeK(k: number) {
        const url = 'http://127.0.0.1:5000/em/changek/?k=' + k.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.post<any>(url, { headers: header});
    }
}
