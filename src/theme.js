import React from "react";

const base = {
    background: '#141313',
    foreground: '#fcfcfc',
    titleBarBackground: "linear-gradient(0deg, #ebebeb, #d5d5d5)",
    titleBarColor: "#4d494d",
    titleBarBorderTop: "1px solid #f3f1f3",
    titleBarBorderBottom: "1px solid #b1aeb1",
    border: "1px solid #acacac",
    borderRadius: "6px",
    fontSize: '1.1rem',
    fontFamily: 'monospace',
    height: '70vh',
    width: '80%',
}

export default {
    ...base,
};

export const coal = {
    ...base,
    titleBarBackground: '#282d35',
    titleBarColor: "#eee",
    titleBarBorderTop: "0",
    titleBarBorderBottom: "0",
    background: '#282d35',
    foreground: '#c0c8d2',
    border: "1px solid transparent",
    borderRadius: "5px",
}
