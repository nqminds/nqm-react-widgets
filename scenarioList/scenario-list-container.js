import {composeWithTracker} from "react-komposer";
import loadData from "../../../composers/load-resource-data";
import ScenarioList from "./scenario-list";
import ProgressIndicator from "../../progress-indicator";

export default composeWithTracker(loadData, ProgressIndicator)(ScenarioList);