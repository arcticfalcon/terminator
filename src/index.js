import Console from "./Console";
import Terminator from "./Terminator";
import defaultTheme, {coal} from "./theme";
import React from "react";
import ReactDOM from "react-dom";

export const start = node => ReactDOM.render(<Console terminator={new Terminator([])} theme={coal}/>, node)
