import { makeStyles, Paper } from '@material-ui/core';
import StyledButton from '../StyledButton/StyledButton';
import colour from '../Colours/Colours';
import { Row, Col } from 'react-bootstrap';
import OapTextField from './TextField';
import PersonalResSelect from './PersonalResSelect';
import FileTable from './FileTable';
import personal_res_option from './SelectOptions'
const useStyles = makeStyles({
    root: {
        backgroundColor: colour.c3,
        boxShadow: 'none'
    },
    container: {
        backgroundColor: colour.c2,
        color: "White",
        marginBottom: 30,
        padding: 20,
        "& h6": {
            color: 'white'
        },
    },
    fieldContainer: {
        margin: 'auto'
    },
    addButton: {
        marginBottom: 30
    },
    removeButton: {
        marginTop: 15
    },
    table: {
        margin: 'auto',
        marginTop: 15,
        boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
        "& > *": {
            backgroundColor: colour.c3,
            color: colour.c1 + '!important'
        },
        "& th > span": { color: colour.c1 + '!important' },
        // "& svg": { color: colour.c1 + '!important' },
        "& svg": { fill: colour.c1 },
        "& div": { color: colour.c1, borderBottom: colour.c1 + '!important' },
        "& td": { color: colour.c1 },
        borderRadius: 5,
        padding: 5,
        backgroundColor: colour.c3,
        "& .MuiPaper-elevation1, & .MuiPaper-elevation2": {
            boxShadow: "0 0 0"
        }
    },
})





const OapComponent = ({ editable, Data, setData, file, setFile }) => {
    const classes = useStyles()
    const handleAdd = () => {
        const values = [...Data];
        values.push({ oapfunction: "", quality_obj: "", collecting_measuring_data: "", analysing_data: "", personal_resp: personal_res_option[0], files: [] });
        setData(prevState => ({
            ...prevState,
            edited_data: values
        }));


    }

    const handleRemove = (i) => {
        const values = [...Data];
        const fileDelete = [...file]
        values.splice(i, 1);
        setData(prevState => ({
            ...prevState,
            edited_data: values
        }));
        fileDelete.sort((a, b) => a.row - b.row || a.tableid - b.tableid);
        let indexes = [];
        fileDelete.forEach((obj, innerIndex) => { if (obj.row == i) indexes.push(innerIndex) });
        for (var j = 0; j < indexes.length; j++) {
            fileDelete[indexes[j]].row = i - 1
        }
        fileDelete.splice(i, indexes.length)
        for (var j = 0; j < fileDelete.length; j++) {
            fileDelete[j].row -= 1
        }

        setFile(fileDelete)
    }



    const editableFields = (x, i) => { //To check outputed textfields can be edited based on editableTab function
        return (
            <div>
                <Row>
                    <Col>
                        <OapTextField setData={setData} Data={Data} fieldName="oapfunction" labelName="Function" value={x.oapfunction} i={i} editable={editable} />
                        <OapTextField setData={setData} Data={Data} fieldName="quality_obj" labelName="Quality Objective" value={x.quality_obj} i={i} editable={editable} />
                    </Col>
                    <Col>
                        <OapTextField setData={setData} Data={Data} fieldName="collecting_measuring_data" labelName="Collecting/Measuring Data" value={x.collecting_measuring_data} i={i} editable={editable} />
                        <OapTextField setData={setData} Data={Data} fieldName="analysing_data" labelName="Analysing Data" value={x.analysing_data} i={i} editable={editable} />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <PersonalResSelect setData={setData} Data={Data} editable={editable} x={x} i={i} />
                    </Col>
                </Row>
                <div className={classes.table}>
                    <FileTable file={file} setFile={setFile} Data={Data} setData={setData} i={i} editable={editable} />
                </div>
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
                            {editableFields(x, i)}
                            {(editable) && (
                                <div className={classes.removeButton}>
                                    {(Data.length !== 1) && (<StyledButton text="Remove" event={() => handleRemove(i)} />)}
                                </div>
                            )}
                        </Paper>
                    );
                })}
            </Paper>
        </>
    );
}

export default OapComponent;