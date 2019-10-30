export class UrlConstantBase {
    public static baseAddress = 'http://127.0.0.1:5000/';
}
export class UrlConstant extends UrlConstantBase {
    public static predictPostEM = UrlConstantBase.baseAddress + 'em/predict/';
    public static ClusterNameGetEM = UrlConstantBase.baseAddress + 'em/getclustername/?k=';
    public static setClusterNamePostEM = UrlConstantBase.baseAddress + 'em/setclustername/';
    public static ClusterParameterGetEM = UrlConstantBase.baseAddress + 'em/getclusterparameter/?k=';
    // public static setClusterNamePostEM = UrlConstantBase.baseAddress + 'em/setclustername/';
    // public static setClusterNamePostEM = UrlConstantBase.baseAddress + 'em/setclustername/';
    // public static setClusterNamePostEM = UrlConstantBase.baseAddress + 'em/setclustername/';
}
