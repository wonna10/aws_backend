import personal_res_option from "./SelectOptions"
import Select from "react-select";
import { makeStyles, Paper } from "@material-ui/core";
import { Row, Col } from "react-bootstrap";

const useStyles = makeStyles({
    select: {
        width: 200,
    },
})


const PersonalResSelect = ({ Data, setData, i, x, editable }) => {
    const classes = useStyles()
    const handleSelectChange = (value, name, index, Data, setData) => {
        const list = [...Data];
        list[index][name] = value;
        setData(prevState => ({
            ...prevState,
            edited_data: list
        }));
    };
    if (editable) {
        return (
            <Row>
                <Col>
                    <h6>Personal Responsible</h6>
                    <Select className={classes.select}
                        styles={{
                            menu: provided => ({ ...provided, zIndex: 9999, color: 'black' }),
                        }}
                        options={personal_res_option}
                        name="personal_resp"
                        value={x.personal_resp}
                        onChange={(value) => handleSelectChange(value, "personal_resp", i, Data, setData)}
                    />
                </Col>
                <Col>
                </Col>
            </Row>
        )
    }
    else {
        return (
            <Row>
                <Col>
                    <h6>Personal Responsible</h6>
                    <Paper className='oapSelectLabel' style={{ width: 200, }}>
                        {personal_res_option[x.personal_resp].label}
                    </Paper>
                </Col>
            </Row>
        )
    }

}

export default PersonalResSelect;