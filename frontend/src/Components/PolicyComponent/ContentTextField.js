import { makeStyles, TextField, Paper } from '@material-ui/core';

const useStyles = makeStyles({
    contentTextField: {
        marginRight: 8,
        marginBottom: 30,
        width: 800,
        "& .MuiInputBase-root.Mui-disabled": {
            color: 'white',
        },
        "& .MuiFormLabel-root.Mui-disabled": {
            color: 'white',
        },
    },
    textFieldFont: {
        color: "white",
        disableUnderline: "true",
        fontSize: 20,
    },
})



const ContentTextField = ({ setData, Data, i, x, editable }) => {
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
            < TextField className={classes.contentTextField}
                name="content"
                InputProps={{
                    className: classes.textFieldFont
                }
                }
                InputLabelProps={{
                    className: classes.textFieldFont
                }}
                label="Content"
                value={x.content}
                onChange={event => handleChange(event, i)}
                multiline
                variant="filled"
            />
        )
    }
    else {
        return (
            < TextField className={classes.contentTextField}
                name="content"
                InputProps={{
                    className: classes.textFieldFont
                }
                }
                InputLabelProps={{
                    className: classes.textFieldFont
                }}
                label="Content"
                value={x.content}
                onChange={event => handleChange(event, i)}
                disabled
                multiline
                variant="filled"
            />
        )
    }
}

export default ContentTextField;