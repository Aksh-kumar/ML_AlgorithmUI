import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlConstant} from '../app/Constants/Url.constants';
@Injectable()
export class EMService {
    // tslint:disable-next-line: variable-name
    constructor(private _httpClient: HttpClient) {}
    public test(): any {
        const url = UrlConstant.baseAddress;
        const header = new HttpHeaders({'Content-Type': 'text/plain; charset=utf-8'});
        return this._httpClient.get(url, { headers: header, responseType: 'text'});
    }
    public predict(form: any) {
        const url = UrlConstant.predictPostEM;
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.post<any>(url, form, { headers: header});
    }
    public getClusterName(k: number) {
        const url = UrlConstant.clusterNameGetEM + k.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public setClusterName(k: number, key: any) {
        const url = UrlConstant.setClusterNamePostEM;
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        // tslint:disable-next-line: object-literal-shorthand
        return this._httpClient.post<any>(url, {k: k, mappedKey: key}, { headers: header});
    }
    public getClusterParameter(k: number) {
        const url = UrlConstant.clusterParameterGetEM + k.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getSupportedImagesExtension(k: number) {
        const url = UrlConstant.supportedImagesExtensionGETEM + k.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getFirstNDataResponsibility(k: number, n: number) {
        const url = UrlConstant.firstNDataResponsibilityGETEM + k.toString() + '&n=' + n.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getFirstNHeterogeneity(k: number, n: number) {
        const url = UrlConstant.firstNHeterogeneityGETEM + k.toString() + '&n=' + n.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.get<any>(url, { headers: header});
    }
    public changeK(k: number) {
        const url = UrlConstant.changeKPOSTEM + k.toString();
        const header = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
        return this._httpClient.post<any>(url, { headers: header});
    }
}
