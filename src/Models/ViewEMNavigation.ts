import { EMNAV } from 'src/app/Constants/application.constants';

export class ViewEMNavigation {
    public static logLikelihood = true;
    public static means = false;
    public static covariances = false;
    public static weights = false;
    public static setVisibility(nav: EMNAV) {
        const ary = new Array(Object.keys(EMNAV).length).fill(false);
        ary[Number(nav) - 1] = true;
        ViewEMNavigation.logLikelihood = ary[0];
        ViewEMNavigation.means = ary[1];
        ViewEMNavigation.covariances = ary[2];
        ViewEMNavigation.weights = ary[3];
    }
}
