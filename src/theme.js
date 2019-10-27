import React from "react";

const defaultColors = {
    background: '#141313',
    promptSymbolColor: '#fffd65',
    commandColor: '#fcfcfc',
    outputColor: '#fcfcfc',
    errorOutputColor: '#ff5956'
};

export default {
    ...defaultColors,
    fontSize: '1.1rem',
    spacing: '1%',
    fontFamily: 'monospace',
    height: '70vh',
    width: '80%',
    promptSymbol: '$',
};

export const ThemeContext = React.createContext({});
