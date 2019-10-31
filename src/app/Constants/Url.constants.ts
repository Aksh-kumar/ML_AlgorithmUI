export class UrlConstantBase {
    public static baseAddress = 'http://127.0.0.1:5000/';
}
export class UrlConstant extends UrlConstantBase {
    // FOR EM
    public static predictPostEM = UrlConstantBase.baseAddress + 'em/predict/';
    public static clusterNameGetEM = UrlConstantBase.baseAddress + 'em/getclustername/?k=';
    public static setClusterNamePostEM = UrlConstantBase.baseAddress + 'em/setclustername/';
    public static clusterParameterGetEM = UrlConstantBase.baseAddress + 'em/getclusterparameter/?k=';
    public static supportedImagesExtensionGETEM = UrlConstantBase.baseAddress + 'em/getsupportedimagesextension/?k=';
    public static firstNDataResponsibilityGETEM = UrlConstantBase.baseAddress + 'em/getfirstndataresponsibility/?k=';
    public static firstNHeterogeneityGETEM = UrlConstantBase.baseAddress + 'em/getfirstnheterogeneity/?k=';
    public static changeKPOSTEM = UrlConstantBase.baseAddress + 'em/changek/?k=';
    // EM END
}
