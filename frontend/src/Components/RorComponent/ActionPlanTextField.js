import { makeStyles, TextField } from '@material-ui/core';
import { Row, Col } from 'react-bootstrap';
import colour from '../Colours/Colours';
import rorSwitchSetData from '../Functions/rorSwitchSetData';

const useStyles = makeStyles({
    APTextField: {
        marginLeft: 20,
        marginTop: 15,
        width: 1000,
        "& .MuiInputBase-root.Mui-disabled": {
            color: 'white',
        },
        "& .MuiFormLabel-root.Mui-disabled": {
            color: 'white',
        }
    },
    textFieldFont: {
        color: "white",
        disableUnderline: "true",
        fontSize: 20,
    },
})

const handleInputChange = (e, index, Data, setData, type) => {
    const { name, value } = e.target;
    const list = [...Data];
    list[index][name] = value;
    rorSwitchSetData(type, setData, list)

};

const ActionPlanTextField = ({ rpn, editable, i, Data, type, setData, action_plan }) => {
    const classes = useStyles()
    if (rpn && editable) {
        return (
            <Row>
                <TextField className={classes.APTextField}
                    name="action_plan"
                    InputProps={{
                        className: classes.textFieldFont
                    }}
                    InputLabelProps={{
                        className: classes.textFieldFont
                    }}
                    label="Action Plan"
                    value={action_plan}
                    error={action_plan == "No Action Required."}
                    helperText={action_plan == "No Action Required." ? 'Enter Action Plan' : ' '}
                    multiline
                    onChange={e => handleInputChange(e, i, Data, setData, type)}
                />
            </Row>
        )
    }
    else if (!rpn && editable) {
        return (
            <Row>
                <TextField className={classes.APTextField}
                    name="action_plan"
                    InputProps={{
                        className: classes.textFieldFont
                    }}
                    InputLabelProps={{
                        className: classes.textFieldFont
                    }}
                    label="Action Plan"
                    value="No Action Required."
                    multiline
                    disabled
                />
            </Row>
        )
    }
    else {
        return (
            <Row>
                <TextField className={classes.APTextField}
                    name="action_plan"
                    InputProps={{
                        className: classes.textFieldFont
                    }}
                    InputLabelProps={{
                        className: classes.textFieldFont
                    }}
                    label="Action Plan"
                    value={action_plan}
                    multiline
                    disabled
                />
            </Row>
        )
    }
}

export default ActionPlanTextField;