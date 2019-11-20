import PropTypes from 'prop-types';
import React, {Component, Fragment} from 'react';
import {observer} from 'mobx-react'
import {reaction} from "mobx";
import {Rnd} from "react-rnd";
import CommandInput from 'components/CommandInput';
import OutputList from 'components/OutputList';
import defaultTheme, {ThemeContext} from 'theme'
import Terminator from "Terminator";
import {ResultOutput} from "components/OutputList";

@observer
class Console extends Component {
    constructor(props) {
        super(props);

        this.inputRef = null;
        this.containerRef = null;

        // Scroll to bottom when new lines are added
        reaction(
            () => props.terminator.items.length,
            () => {
                this.scrollOutput()
            }
        )
    }

    focus() {
        if (this.inputRef) {
            this.inputRef.focus();
        }
    }

    scrollOutput() {
        this.containerRef.scrollTop = this.containerRef.scrollHeight;
    }

    componentDidUpdate() {
        const {autoFocus} = this.props;

        this.scrollOutput();

        if (autoFocus) {
            this.containerRef.focus()
            this.focus();
        }
    }

    _onKeyDown = e => {
        // Execute
        if (e.key === "Enter") {
            this.props.terminator.execute(this.props.terminator.input)
            return
        }

        // Autocomplete:
        if (e.key === "Tab") {
            e.preventDefault()
            //ToDo Execute internal command?
            this.props.terminator.autocomplete()

            return
        }

        // Abort
        if (e.key === 'Escape' || (e.key === 'c' && e.ctrlKey)) {
            this.props.terminator.abort()
            return
        }

        // ArrowUp

        // ArrowDown

        if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
            return
        }

        this.focus()
    }

    interactiveTerminal(props) {
        const {
            terminator, readonly, autoFocus, terminalId
        } = props;
        let inputControl;
        if (!readonly) {
            inputControl = (
                <CommandInput
                    ref={(ref) => {
                        this.inputRef = ref;
                    }}
                    autoFocus={autoFocus}
                    showPromptSymbol={!terminator.executing}
                    value={terminator.input}
                    onChange={(e) => terminator.setInput(e.target.value)}
                />
            );
        }

        return (
            <Fragment>
                <OutputList
                    terminalId={terminalId}
                    outputs={terminator.items}
                />
                {inputControl}
                <div style={anchorStyle}/>
            </Fragment>
        )
    }

    fullScreenTerminal(props) {
        return (
            <ResultOutput content={props.terminator.fullScreenContent}/>
        )
    }

    render() {
        const {terminator, theme} = this.props;

        let terminal
        if (terminator.fullScreenMode) {
            terminal = this.fullScreenTerminal(this.props)
        } else {
            terminal = this.interactiveTerminal(this.props)
        }
        const wStyle = windowStyle(theme)
        return (
            <ThemeContext.Provider value={theme}>
                <Rnd
                    dragHandleClassName={"draghandle"}
                    default={{
                        x: 0,
                        y: 0,
                        width: 600,
                        height: 400,
                    }}
                >
                    <div style={generalContainerStyle(theme)}>
                        <div className="draghandle" style={wStyle.titlebar}>
                            <div style={wStyle.buttons}>
                                <div style={wStyle.close}> </div>
                                <div style={wStyle.minimize}> </div>
                                <div style={wStyle.zoom}> </div>
                            </div>
                            Terminator
                        </div>
                        <div
                            style={terminalContainerStyle(theme)}
                            className={theme.scrollbarClass}
                            ref={(ref) => {
                                this.containerRef = ref;
                            }}
                            onKeyDown={this._onKeyDown}
                            tabIndex={0}
                        >
                            {terminal}
                        </div>
                    </div>
                </Rnd>
            </ThemeContext.Provider>
        );
    }
};


Console.propTypes = {
    readonly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    terminalId: PropTypes.string,
    theme: PropTypes.object,
    terminator: PropTypes.instanceOf(Terminator).isRequired,
};

Console.defaultProps = {
    readonly: false,
    autoFocus: true,
    terminalId: 'terminal01',
    theme: defaultTheme,
};

export default Console;

const generalContainerStyle = theme => ({
    borderRadius: theme.borderRadius,
    border: theme.border,
    height: "100%",
})

const terminalContainerStyle = theme => ({
    boxSizing: "border-box",
    height: "calc(100% - 24px)",
    lineHeight: "1.2em",
    padding: theme.spacing,
    overflowY: "scroll",
    outline: "none",
    color: theme.outputColor,
    background: theme.background,
    fontFamily: "monospace",
    fontSize: theme.fontSize,
    borderBottomRightRadius: theme.borderRadius,
    borderBottomLeftRadius: theme.borderRadius,
})

const anchorStyle = {
    overflowAnchor: "auto",
    height: "1px",
}

const windowStyle = theme => ({
    titlebar: {
        cursor: "move",
        fontFamily: theme.fontFamily,
        background: theme.titleBarBackground,
        color: theme.titleBarColor,
        fontSize: "11pt",
        lineHeight: "24px",
        textAlign: "center",
        height: "24px",
        borderTop: theme.titleBarBorderTop,
        borderBottom: theme.titleBarBorderBottom,
        borderTopLeftRadius: theme.borderRadius,
        borderTopRightRadius: theme.borderRadius,
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        MsUserSelect: "none",
        OUserSelect: "none",
    },
    buttons: {
        paddingLeft: "8px",
        paddingTop: "6px",
        float: "left",
        lineHeight: "0px"
    },
    close: {
        background: "#ff5c5c",
        fontSize: "9pt",
        width: "11px",
        height: "11px",
        border: "1px solid #e33e41",
        borderRadius: "50%",
        display: "inline-block",
        cursor: "default",
    },
    minimize: {
        background: "#ffbd4c",
        fontSize: "9pt",
        lineHeight: "11px",
        marginLeft: "4px",
        width: "11px",
        height: "11px",
        border: "1px solid #e09e3e",
        borderRadius: "50%",
        display: "inline-block",
        cursor: "default",
    },
    zoom: {
        background: "#00ca56",
        fontSize: "9pt",
        lineHeight: "11px",
        marginLeft: "6px",
        width: "11px",
        height: "11px",
        border: "1px solid #14ae46",
        borderRadius: "50%",
        display: "inline-block",
        cursor: "default",
    },
})
