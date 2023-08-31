import { F8000401SimulateService } from "./f8000401/f8000401-simulate.service";
import { F8000402SimulateService } from "./f8000402/f8000402-simulate.service";

/** 1:    import {F0XXXXXXSimulateService} from "./f0xxxxxx/f0xxxxxx-simulate.service"; **/
// Demo:
// import { F0XXXXXXSimulateService } from './f0xxxxxx/f0xxxxxx-simulate.service';
// ---------------------- import Start ---------------------- //

// ---------------------- import End ---------------------- //


/** 2:    F0XXXSimulateService **/
// Demo:
// export {
//     // ----- 功能名稱: ----- //
//     F0XXXXXXSimulateService
// };
// ---------------------- export Start ---------------------- //
export {
    F8000401SimulateService,
    F8000402SimulateService
};
