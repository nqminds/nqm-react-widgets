import {compose} from "react-komposer";
import loadData from "../../../composers/load-aggregate";
import Table from "./table-display";
import ProgressIndicator from "../../progress-indicator";

export default compose(loadData, ProgressIndicator)(Table);