import {compose} from "react-komposer";
import loadData from "../../../composers/load-resource-data-api";
import Detail from "./detail-display";
import ProgressIndicator from "../../progress-indicator";

export default compose(loadData, ProgressIndicator)(Detail);