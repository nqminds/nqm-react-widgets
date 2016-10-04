import {compose} from "react-komposer";
import loadData from "../../../composers/load-aggregate";
import Timeline from "./timeline-display";
import ProgressIndicator from "../../progress-indicator";

const reload = (currentProps, nextProps) => currentProps.pipeline != nextProps.pipeline;

export default compose(loadData, ProgressIndicator, null, {shouldResubscribe: reload})(Timeline);