import RorOptions from './RorOptions';
import colour from '../Colours/Colours';
import Select from 'react-select'
import { makeStyles, TextField, Paper } from '@material-ui/core';
import { Row, Col } from 'react-bootstrap';
import rorSwitchSetData from '../Functions/rorSwitchSetData';
const risk_opportunity_option = RorOptions.risk_opportunity_option
const severity_option = RorOptions.severity_option
const likelihood_option = RorOptions.likelihood_option

const useStyles = makeStyles({
    historycont: {
        "& col div": {
            color: 'black'
        }
    },
    textHolder: {
        backgroundColor: 'white',
    },
    RPNTextField: {
        marginTop: 5,
        marginLeft: 30,
    },
    textFieldFont: {
        color: "white",
        disableUnderline: "true",
        fontSize: 20,
    },
    row: {
        padding: 30,
        marginLeft: 30,
        marginBottom: 30
    },
    button: {
        float: "right",
        marginTop: 20,
        marginRight: 20,
    },
})



const handleInputChange = (e, index, Data, setData, type) => {
    const { name, value } = e.target;
    const list = [...Data];
    list[index][name] = value;
    rorSwitchSetData(type, setData, list)
};

const handleSelectChange = (value, name, index, Data, setData, type) => {
    const list = [...Data];
    list[index][name] = value;
    var rpn = Data[index].severity.value * Data[index].likelihood.value
    list[index]['rpn'] = rpn
    rorSwitchSetData(type, setData, list)
};

const SelectAndRPNTextField = ({ editable, x, i, Data, setData, type }) => {
    const classes = useStyles()
    if (editable) {
        return (
            <Row>
                <Col>
                    <h6>Risk/Opportunity</h6>
                    <Select className={classes.selectField}
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 9999, color: 'black' }),
                        }}
                        options={risk_opportunity_option}
                        name="risk_opportunity"
                        value={x.risk_opportunity}
                        onChange={(value) => handleSelectChange(value, "risk_opportunity", i, Data, setData, type)}
                    />
                </Col>
                <Col>
                    <h6>Severity</h6>
                    <Select className={classes.selectField}
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 9999, color: 'black' }),
                        }}
                        options={severity_option}
                        label
                        name="severity"
                        value={x.severity}
                        onChange={(value) => handleSelectChange(value, "severity", i, Data, setData, type)}
                    />
                </Col>
                <Col>
                    <h6>Likelihood</h6>
                    <Select className={classes.selectField}
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 9999, color: 'black' }),
                        }}
                        options={likelihood_option}
                        value={x.likelihood}
                        name="likelihood"
                        onChange={(value) => handleSelectChange(value, "likelihood", i, Data, setData, type)}
                    />
                </Col>
                <Col>
                    <TextField className={classes.RPNTextField}
                        name="rpn"
                        InputProps={{
                            className: classes.textFieldFont,
                        }}
                        InputLabelProps={{
                            className: classes.textFieldFont
                        }}
                        label="RPN"
                        type="number"
                        value={x.rpn}
                        onChange={e => handleInputChange(e, i, Data, setData, type)}
                    />
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Row className={classes.historycont}>
                <Col className={classes.container}>
                    <h6>Risk/Opportunity</h6>
                    <Paper className='rorSelectLabel'>
                        {risk_opportunity_option[x.risk_opportunity].label}
                    </Paper>
                </Col>
                <Col className={classes.container}>
                    <h6>Severity</h6>
                    <Paper className='rorSelectLabel'>
                        {severity_option[x.severity].label}
                    </Paper>
                </Col>
                <Col className={classes.container}>
                    <h6>Likelihood</h6>
                    <Paper className='rorSelectLabel'>
                        {likelihood_option[x.likelihood].label}
                    </Paper>
                </Col>
                <Col>
                    <TextField className={classes.RPNTextField}
                        name="rpn"
                        InputProps={{
                            className: classes.textFieldFont,
                            readOnly: true,
                            disableUnderline: true
                        }}
                        InputLabelProps={{
                            className: classes.textFieldFont
                        }}
                        label="RPN"
                        type="number"
                        value={x.rpn}
                    />
                </Col>
            </Row>
        )
    }
}

export default SelectAndRPNTextField;