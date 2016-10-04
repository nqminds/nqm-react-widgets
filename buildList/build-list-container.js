import {composeWithTracker} from "react-komposer";
import loadData from "../../../composers/load-resource-data";
import ProgressIndicator from "../../progress-indicator";
import BuildList from "./build-list";

// Makes an aggregate query and feeds to lsoa component
export default composeWithTracker(loadData, ProgressIndicator)(BuildList);