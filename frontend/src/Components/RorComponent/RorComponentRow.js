import { colors, makeStyles } from '@material-ui/core';
import { Row, Col } from 'react-bootstrap';
import RorComponent from '../../Components/RorComponent/RorComponent';
import colour from '../Colours/Colours';

const useStyles = makeStyles({
    container: {
        width: '100%',
        margin: 'auto',
        marginBottom: 30,
        marginTop: 20,
        borderRadius: 5,
        padding: 5,
        backgroundColor: colour.c2,
        boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
        "& p": { color: 'white' }
    },
    title: {
        textAlign: 'center',
        padding: 10,
        marginBottom: 0,
        backgroundColor: colour.c2,
        color: colour.c1z
    }
})

const RorComponentRow = ({ editable, Data, setData, type, title }) => {
    const classes = useStyles()
    return (
        <Row>
            <Col>
                <div className={classes.container}>
                    <h3 className={classes.title}>{title}</h3>
                    <RorComponent editable={editable} type={type} Data={Data} setData={setData}></RorComponent>
                </div>
            </Col>
        </Row>
    )
}

export default RorComponentRow;
