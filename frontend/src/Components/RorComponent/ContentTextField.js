
import { makeStyles, TextField, Paper } from '@material-ui/core';
import rorSwitchSetData from '../Functions/rorSwitchSetData';

const useStyles = makeStyles({
    contentTextField: {
        marginRight: 10,
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
})



const ContentTextField = ({ setData, Data, i, x, editable, type }) => {
    const classes = useStyles()
    const handleInputChange = (e, index, Data, setData, type) => {
        const { name, value } = e.target;
        const list = [...Data];
        list[index][name] = value;
        rorSwitchSetData(type, setData, list)
    
    };

    if (editable) {
        return (
            <TextField className={classes.contentTextField}
                name="content"
                InputProps={{
                    className: classes.textFieldFont
                }}
                InputLabelProps={{
                    className: classes.textFieldFont
                }}
                label="Content"
                value={x.content}
                multiline
                disabled
                onChange={e => handleInputChange(e, i, Data, setData, type)}
            />
        )
    }
    else {
        return (
            <TextField className={classes.contentTextField}
                name="content"
                InputProps={{
                    className: classes.textFieldFont
                }}
                InputLabelProps={{
                    className: classes.textFieldFont
                }}
                label="Content"
                value={x.content}
                multiline
                disabled
            />
        )
    }
}

export default ContentTextField;