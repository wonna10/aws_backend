import { TextField, makeStyles } from "@material-ui/core"
import colour from "../Colours/Colours"

const useStyles = makeStyles({
    TextField: {
        marginRight: 8,
        marginBottom: 30,
        width: 500,
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


const OapTextField = ({ setData, Data, fieldName, labelName, value, i, editable }) => {
    const classes = useStyles()
    const handleChange = (event, i) => {
        const { name, value } = event.target;
        const values = [...Data];
        values[i][name] = value
        setData(prevState => ({
            ...prevState,
            edited_data: values
        }));
    }
    if (editable) {
        return (
            <TextField className={classes.TextField}
                name={fieldName}
                InputProps={{
                    className: classes.textFieldFont
                }}
                InputLabelProps={{
                    className: classes.textFieldFont
                }}
                label={labelName}
                value={value}
                multiline
                onChange={event => handleChange(event, i)}
            />
        )
    }
    else {
        return (
            <TextField className={classes.TextField}
                name={fieldName}
                InputProps={{
                    className: classes.textFieldFont
                }}
                InputLabelProps={{
                    className: classes.textFieldFont
                }}
                label={labelName}
                value={value}
                disabled
                multiline
                onChange={event => handleChange(event, i)}
            />
        )
    }
}

export default OapTextField