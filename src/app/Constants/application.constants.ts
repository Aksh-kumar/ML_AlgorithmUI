import { environment } from 'src/environments/environment';

export enum EMNAV {
    LOGLIKELIHOOD = 1,
    MEANS = 2,
    COVARIANCES = 3,
    WEIGHTS = 4
}

// tslint:disable-next-line: variable-name
export const NO_IMAGEURL = environment.ASSET_ROOT + environment.NO_IMAGE_FILENAME;

