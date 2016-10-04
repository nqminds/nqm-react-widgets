import {compose} from "react-komposer";
import loadData from "../../../composers/load-resource-data-api";
import Pyramid from "./pyramid-display";
import ProgressIndicator from "../../progress-indicator";

export default compose(loadData, ProgressIndicator)(Pyramid);