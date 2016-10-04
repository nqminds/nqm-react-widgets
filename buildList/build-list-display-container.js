import {composeWithTracker} from "react-komposer";
import loadResources from "../../../composers/load-resources";
import ProgressIndicator from "../../progress-indicator";
import BuildListDisplay from "./build-list-display";

// Makes an aggregate query and feeds to lsoa component
export default composeWithTracker(loadResources, ProgressIndicator)(BuildListDisplay);