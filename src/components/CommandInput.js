import React, {Component} from 'react';
import PromptSymbol from 'components/PromptSymbol';
import PropTypes from 'prop-types';
import {ThemeContext} from 'theme'

class CommandInput extends Component {
    static contextType = ThemeContext

    focus() {
        this.input.focus();
    }

    render() {
        const {autoFocus, showPromptSymbol, value, onChange} = this.props;

        return (
            <div style={containerStyle}>
                {showPromptSymbol && <PromptSymbol>{this.context.promptSymbol}</PromptSymbol>}
                <input
                    style={inputStyle(this.context)}
                    autoFocus={autoFocus}
                    onChange={e => {
                        e.persist();
                        onChange(e);
                    }}
                    value={value}
                    ref={ref => (this.input = ref)}
                />
            </div>
        );
    }
};

CommandInput.propTypes = {
    autoFocus: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    showPromptSymbol: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired
};

export default CommandInput;


const containerStyle = {display: "flex", overflowAnchor: "none"}

const inputStyle = theme => ({
    flex: 1,
    border: 0,
    boxSizing: "border-box",
    outline: "none",
    color: theme.commandColor,
    background: theme.background,
    fontSize: "1em",
    fontFamily: "monospace",
    padding: 0
})
