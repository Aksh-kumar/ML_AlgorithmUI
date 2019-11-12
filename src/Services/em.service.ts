import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {UrlConstant} from '../app/Constants/Url.constants';

@Injectable()
export class EMService {
    // tslint:disable-next-line: variable-name
    constructor(private _httpClient: HttpClient) {}
    public predict(form: any) {
        const url = UrlConstant.predictPostEM;
        const header = this.getHeader();
        return this._httpClient.post<any>(url, form, { headers: header});
    }
    public getClusterName(k: number) {
        const url = UrlConstant.clusterNameGetEM + k.toString();
        const header = this.getHeader();
        return this._httpClient.get<any>(url, { headers: header});
    }
    public setClusterName(k: number, key: any) {
        const url = UrlConstant.setClusterNamePostEM;
        const header = this.getHeader();
        // tslint:disable-next-line: object-literal-shorthand
        return this._httpClient.post<any>(url, {k: k, mappedKey: key}, { headers: header});
    }
    public getClusterParameter(k: number) {
        const url = UrlConstant.clusterParameterGetEM + k.toString();
        const header = this.getHeader();
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getSupportedImagesExtension(k: number) {
        const url = UrlConstant.supportedImagesExtensionGETEM + k.toString();
        const header = this.getHeader();
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getFirstNDataResponsibility(k: number, n: number) {
        const url = UrlConstant.firstNDataResponsibilityGETEM + k.toString() + '&n=' + n.toString();
        const header = this.getHeader();
        return this._httpClient.get<any>(url, { headers: header});
    }
    public getFirstNHeterogeneity(k: number, n: number) {
        const url = UrlConstant.firstNHeterogeneityGETEM + k.toString() + '&n=' + n.toString();
        const header = this.getHeader();
        return this._httpClient.get<any>(url, { headers: header});
    }
    public changeK(k: number) {
        const url = UrlConstant.changeKPOSTEM + k.toString();
        const header = this.getHeader();
        return this._httpClient.post<any>(url, { headers: header});
    }
    private getHeader(contentType: string = 'application/json', charset: string = 'utf-8'): HttpHeaders {
        return new HttpHeaders({'Content-Type': + contentType + '; charset=' + charset});
    }
}
