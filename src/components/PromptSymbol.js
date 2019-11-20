import theme from 'theme';
import React, {useContext} from "react";
import {ThemeContext} from 'theme'

export default props => {
  const theme = useContext(ThemeContext)
  return (<span style={{
    marginRight: "0.25em",
    whiteSpace: "pre",
    color: theme.promptSymbolColor,
  }} {...props} />)
}

