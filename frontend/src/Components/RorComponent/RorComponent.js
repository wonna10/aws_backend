import { makeStyles, TextField, Paper } from '@material-ui/core';
import colour from '../Colours/Colours';
import { Row, Col } from 'react-bootstrap';
import ActionPlanTextField from './ActionPlanTextField';
import ContentTextField from './ContentTextField';
import SelectAndRPNTextField from './SelectAndRPNTextField';
import rorSwitchSetData from '../Functions/rorSwitchSetData';
import moment from 'moment'
// handle input change
const handleInputChange = (e, index, Data, setData, type) => {
    const { name, value } = e.target;
    const list = [...Data];
    list[index][name] = value;
    rorSwitchSetData(type, setData, list)
};


const useStyles = makeStyles({
    root: {
        backgroundColor: colour.c3,
        boxShadow: 'none',
        margin: 'auto'
    },
    container: {
        backgroundColor: colour.c2,
        color: "White",
    },
    contentTextField: {
        marginLeft: 10,
        marginBottom: 30,
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
    row: {
        padding: 30,
        marginLeft: 30,
    },
    button: {
        float: "right",
        marginTop: 20,
        marginRight: 20,
    },
    date: {
        float: "right",
    }
})




const RorComponent = ({ editable, Data, setData, type }) => {
    const classes = useStyles()
    const editableFields = (editable, x, i, Data, setData) => { //To check outputed textfields can be edited based on editableTab function

        return (
            <div className={classes.row}>
                <h6 className={classes.date}>{moment(Data[i].date_modified).format('YYYY-MM-DD HH:mm:ss')}</h6>
                <ContentTextField type={type} setData={setData} Data={Data} editable={editable} i={i} x={x} />
                <SelectAndRPNTextField editable={editable} x={x} i={i} Data={Data} setData={setData} type={type} />
                <ActionPlanTextField type={type} editable={editable} rpn={x.rpn > 12} i={i} Data={Data} setData={setData} action_plan={x.action_plan} />
            </div>
        )
    }




    return (
        <Paper className={classes.root}>
            {Data.map((x, i) => {
                return (
                    <div className={classes.container}>
                        {editableFields(editable, x, i, Data, setData)}
                    </div>
                );
            })}
        </Paper>
    );
}

export default RorComponent;