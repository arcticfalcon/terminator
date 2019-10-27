import theme from 'theme';
import React from "react";

export default props => <span style={{
  marginRight: "0.25em",
  whiteSpace: "pre",
  color: theme.promptSymbolColor,
}} {...props} />

