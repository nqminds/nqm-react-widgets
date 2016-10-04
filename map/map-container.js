import { compose } from "react-komposer";
import mapComposer from "./map-composer";
import ProgressIndicator from "../../progress-indicator";
import MapDisplay from "./map-display";

export default compose(mapComposer, ProgressIndicator)(MapDisplay);