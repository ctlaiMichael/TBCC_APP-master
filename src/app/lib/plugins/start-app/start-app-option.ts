import { AppProfile } from './app-profile';

export class StartAppOption {
    android: AppProfile;
    ios: AppProfile;
    title?: string;
    context?: string;
    other?: any;
}
