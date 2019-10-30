import { ImageBaseModel } from './ImageBaseModel';

export class ImageModel extends ImageBaseModel {
    public SoftCount: any;
    public constructor(response: any) {
        super(response);
        this.SoftCount = {};
        this.setSoftCount(response);
    }
    private setSoftCount(response: any) {
        Object.keys(response).forEach(element => {
            if (!Object.prototype.hasOwnProperty.call(this, element)) {
                this.SoftCount[element] = response[element];
              }
        });
    }
}
