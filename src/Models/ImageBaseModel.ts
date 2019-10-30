export interface IImageBaseModel {
    ImageName: string;
    ImageBase64: string;
    Extension: string;
    R: number;
    G: number;
    B: number;
    AssignCluster: number;
    browserUrl: any;
}

export class ImageBaseModel implements IImageBaseModel {
    public ImageName: string;
    public ImageBase64: string;
    public Extension: string;
    public R: number;
    public G: number;
    public B: number;
    public AssignCluster: number;
    public browserUrl: any;
    public constructor(response: any) {
        this.ImageName = response.ImageName;
        this.ImageBase64 = response.ImageBase64;
        this.Extension = response.Extension;
        this.R = response.R;
        this.G = response.G;
        this.B = response.B;
        this.AssignCluster = response.AssignCluster;
        this.browserUrl = response.browserUrl;
    }
}
