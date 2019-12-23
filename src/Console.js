import PropTypes from 'prop-types';
import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import {Rnd} from "react-rnd";
import defaultTheme from 'theme'
import Terminator from "Terminator";

class Console extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minimized: false,
            zoomed: false,
            width: 600,
            height: 400
        }
    }
    componentDidMount() {
        this.props.terminator.attach(this.container)
    }

    onResize = (a,b,c,delta) => {
        this.setState({
            width: this.state.width + delta.width,
            height: this.state.height + delta.height,
        })
    }
    zoom = () => {
        this.setState({
            zoomed: !this.state.zoomed,
            minimized: false,
        })
    }
    minMax = () => {
        this.setState({
            minimized: !this.state.minimized,
            zoomed: this.state.minimized ? this.state.zoomed : false,
        })
    }
    close = () => {
        ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(this).parentNode)
    }

    componentDidUpdate() {
        if(!this.state.minimized) {
            this.props.terminator.fitAddon.fit()
            this.container.scrollTop = this.container.scrollHeight;
        }
    }

    render() {
        const {terminator, theme} = this.props
        const {width, height, minimized, zoomed} = this.state
        const wStyle = windowStyle(theme, zoomed)

        return (
                <Rnd
                    bounds={"window"}
                    enableResizing={minimized || zoomed ? {} : undefined}
                    disableDragging={zoomed}
                    onResizeStop={this.onResize}
                    onResize={(e, direction, ref, delta, position) => {
                        this.props.terminator.fitAddon.fit()
                    }}
                    dragHandleClassName={"draghandle"}
                    minHeight={150}
                    minWidth={200}
                    size={{
                        width: minimized ? "auto" : zoomed ? "95%" : width,
                        height: minimized ? "auto" : zoomed ? "95%" : height,
                    }}
                    position={zoomed ? { x: 0, y: 0 } : undefined}
                >
                    <div style={generalContainerStyle(theme)}>
                        <div className="draghandle" style={wStyle.titlebar}>
                            <div style={wStyle.buttons}>
                                <div style={wStyle.close} onClick={this.close}></div>
                                <div style={wStyle.minimize} onClick={this.minMax}></div>
                                <div style={wStyle.zoom} onClick={this.zoom}></div>
                            </div>
                            <span style={{margin: "0 15px"}}>Terminator</span>
                        </div>
                        <div style={terminalContainerStyle(theme, !minimized)}
                             ref={ref => (this.container = ref)} />
                        <div style={anchorStyle}/>
                    </div>
                </Rnd>
        );
    }
};


Console.propTypes = {
    theme: PropTypes.object,
    terminator: PropTypes.instanceOf(Terminator).isRequired,
};

Console.defaultProps = {
    theme: defaultTheme,
};

export default Console;

const generalContainerStyle = theme => ({
    borderRadius: theme.borderRadius,
    border: theme.border,
    height: "100%",
})

const terminalContainerStyle = (theme, display) => ({
    display: display ? "block" : "none",
    boxSizing: "border-box",
    height: "calc(100% - 24px)",
    padding: "0 0 0 6px",
    outline: "none",
    background: theme.background,
    borderBottomRightRadius: theme.borderRadius,
    borderBottomLeftRadius: theme.borderRadius,
})

const anchorStyle = {
    overflowAnchor: "auto",
    height: "1px",
}

const windowStyle = (theme, locked) => ({
    titlebar: {
        cursor: locked ? "default" : "move",
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
        cursor: "pointer",
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
        cursor: "pointer",
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
        cursor: "pointer",
    },
})
