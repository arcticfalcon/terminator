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
                    <div style={generalContainerStyle}>
                        <div className="draghandle" style={windowStyle.titlebar}>
                            <div className="buttons" style={windowStyle.buttons}>
                                <div className="close" style={windowStyle.close}></div>
                                <div className="minimize" style={windowStyle.minimize}></div>
                                <div className="zoom" style={windowStyle.zoom}></div>
                            </div>
                            Terminator
                        </div>
                        <div
                            style={terminalContainerStyle(theme)}
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

const generalContainerStyle = {
    borderRadius: "6px",
    border: "1px solid #acacac",
    height: "100%",
}

const terminalContainerStyle = theme => ({
    boxSizing: "border-box",
    height: "calc(100% - 22px)",
    lineHeight: "1.2em",
    padding: theme.spacing,
    overflowY: "scroll",
    color: theme.outputColor,
    background: theme.background,
    fontFamily: "monospace",
    fontSize: theme.fontSize,
    borderBottomRightRadius: "6px",
    borderBottomLeftRadius: "6px",
})

const anchorStyle = {
    overflowAnchor: "auto",
    height: "1px",
}

const windowStyle = {
    titlebar: {
        cursor: "move",
        fontFamily: "monospace",
        background: "linear-gradient(0deg, #ebebeb, #d5d5d5)",
        color: "#4d494d",
        fontSize: "11pt",
        lineHeight: "20px",
        textAlign: "center",
        height: "20px",
        borderTop: "1px solid #f3f1f3",
        borderBottom: "1px solid #b1aeb1",
        borderTopLeftRadius: "6px",
        borderTopRightRadius: "6px",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        MsUserSelect: "none",
        OUserSelect: "none",
    },
    buttons: {
        paddingLeft: "8px",
        paddingTop: "3px",
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
}
