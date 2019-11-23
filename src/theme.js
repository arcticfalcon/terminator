import React from "react";

const base = {
    background: '#141313',
    promptSymbolColor: '#fffd65',
    commandColor: '#fcfcfc',
    outputColor: '#fcfcfc',
    errorOutputColor: '#ff5956',
    scrollbarClass: 'scrollbar-default',
    titleBarBackground: "linear-gradient(0deg, #ebebeb, #d5d5d5)",
    titleBarColor: "#4d494d",
    titleBarBorderTop: "1px solid #f3f1f3",
    titleBarBorderBottom: "1px solid #b1aeb1",
    border: "1px solid #acacac",
    borderRadius: "6px",
    fontSize: '1.1rem',
    spacing: '1%',
    fontFamily: 'monospace',
    height: '70vh',
    width: '80%',
    promptSymbol: '',
}

export default {
    ...base,
    promptSymbol: '$',
};

export const coal = {
    ...base,
    titleBarBackground: '#282d35',
    titleBarColor: "#eee",
    titleBarBorderTop: "0",
    titleBarBorderBottom: "0",
    scrollbarClass: 'scrollbar-coal',
    background: '#282d35',
    promptSymbolColor: '#fffd65',
    commandColor: '#c0c8d2',
    outputColor: '#c0c8d2',
    errorOutputColor: '#ff5956',
    border: '0',
    borderRadius: "5px",
    promptSymbol: 'λ'
}

export const ThemeContext = React.createContext({});
