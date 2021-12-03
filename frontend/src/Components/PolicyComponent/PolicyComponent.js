import { makeStyles, TextField, Paper } from '@material-ui/core';
import StyledButton from '../StyledButton/StyledButton';
import colour from '../Colours/Colours';
import { Row, Col } from 'react-bootstrap';
import TitleTextField from './TitleTextField';
import ContentTextField from './ContentTextField';

const useStyles = makeStyles({
    root: {
        backgroundColor: colour.c3,
        boxShadow: 'none'
    },
    container: {
        backgroundColor: colour.c2,
        color: "White",
        marginBottom: 30,
        marginTop: 20,
    },
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
    contentTextField: {
        marginRight: 8,
        marginBottom: 30,
        width: 800,
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
        marginBottom: 30
    },
    removeButton: {
        float: "right",
        marginTop: 85,
        marginRight: 30,
    },
    addButton: {
        marginTop: 50,
    }
})





const PolicyComponent = ({ editable, Data, setData }) => {
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

    const handleAdd = () => {
        const values = [...Data];
        values.push({ title: "", content: "" });
        setData(prevState => ({
            ...prevState,
            edited_data: values
        }));
    }

    const handleRemove = (i) => {
        const values = [...Data];
        values.splice(i, 1);
        setData(prevState => ({
            ...prevState,
            edited_data: values
        }));
    }



    const editableFields = (x, i) => { //To check outputed textfields can be edited based on editableTab function
        return (
            <div className={classes.row}>
                <Row>
                    <TitleTextField setData={setData} Data={Data} editable={editable} i={i} x={x} />
                </Row>
                <Row>
                    <ContentTextField setData={setData} Data={Data} editable={editable} i={i} x={x} />
                </Row>
            </div>
        )

    }
    return (
        <>
            <Row>
                <Col>
                    {(editable) && (
                        <div className={classes.addButton}>
                            <StyledButton text="Add" event={() => handleAdd()} />
                        </div>
                    )}
                </Col>
            </Row>
            <Paper className={classes.root}>
                {Data.map((x, i) => {
                    return (
                        <Paper className={classes.container}>
                            {(editable) && (
                                <div className={classes.removeButton}>
                                    {(Data.length !== 1) && (<StyledButton text="Remove" event={() => handleRemove(i)} />)}
                                </div>
                            )}
                            {editableFields(x, i)}
                        </Paper>
                    );
                })}

            </Paper>
        </>
    );
}

export default PolicyComponent;