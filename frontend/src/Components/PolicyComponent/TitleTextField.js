import { makeStyles, TextField, Paper } from '@material-ui/core';

const useStyles = makeStyles({
    titleTextField: {
        marginRight: 8,
        marginBottom: 30,
        width: 200,
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



const TitleTextField = ({ setData, Data, i, x, editable }) => {
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
            < TextField className={classes.titleTextField}
                name="title"
                InputProps={{
                    className: classes.textFieldFont
                }
                }
                InputLabelProps={{
                    className: classes.textFieldFont
                }}
                label="Title"
                value={x.title}
                onChange={event => handleChange(event, i)}
            />
        )
    }
    else {
        return (
            < TextField className={classes.titleTextField}
                name="title"
                InputProps={{
                    className: classes.textFieldFont
                }
                }
                InputLabelProps={{
                    className: classes.textFieldFont
                }}
                label="Title"
                value={x.title}
                onChange={event => handleChange(event, i)}
                disabled
            />
        )
    }
}

export default TitleTextField;