import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import {observer} from "mobx-react";
import PromptSymbol from 'components/PromptSymbol';
import {ThemeContext} from 'theme'

export const RESULT = 'result'
export const COMMAND = 'command'

const outputContainerStyle = {whiteSpace: "pre"}
const TextCommandWrapperStyle = theme => ({color: theme.commandColor})

const CommandOutput = ({ content }) => {
    const theme = useContext(ThemeContext)
    return (
        <div style={outputContainerStyle}>
            <PromptSymbol>{theme.promptSymbol}</PromptSymbol><span style={TextCommandWrapperStyle(theme)}>{content}</span>
        </div>
    )
}

CommandOutput.propTypes = {
    content: PropTypes.node.isRequired,
};

export const ResultOutput = observer(({ content }) => (
    <div style={outputContainerStyle}>{content}</div>
));

ResultOutput.propTypes = {
    content: PropTypes.node.isRequired
};

const outputRenderers = {
    [RESULT]: ResultOutput,
    [COMMAND]: CommandOutput
}

const style = {overflowAnchor: "none"};

const OutputList = ({ outputs, terminalId }) => (
    <div style={style}>
        {outputs.map((output, index) => {
            const type = output.type;

            if (!outputRenderers.hasOwnProperty(type)) {
                throw new Error(`No output renderer set for ${type} in outputRenderers`);
            }

            const OutputComponent = outputRenderers[type];

            return (
                <OutputComponent
                    key={`${terminalId}-${index}`}
                    {...output}/>
            );
        })}
    </div>
);

OutputList.propTypes = {
    outputs: PropTypes.array.isRequired,
    terminalId: PropTypes.string,
};

export default observer(OutputList);
