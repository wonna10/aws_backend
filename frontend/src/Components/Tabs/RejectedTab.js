import { Paper } from "@material-ui/core"
import { Row, Col } from "react-bootstrap"
import StyledButton from "../StyledButton/StyledButton"
import TabData from "../Tabs/TabData";
import Delete from "../Functions/Delete";
import { makeStyles } from "@material-ui/core";
import colour from "../Colours/Colours";
import { TextField } from "@material-ui/core";
import Draft from "../Draft/Draft";
import { stateToHTML } from "draft-js-export-html";
const useStyles = makeStyles({
    root: {
        marginBottom: 15,
        boxShadow: "0px 5px 5px rgba(00,00,00,0.2)",
        backgroundColor: colour.c3,
        "& > *": {
            color: "white"
        },
        "& .MuiTableCell-root": {
            borderBottom: "1px solid white"
        },
        borderRadius: 0,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5
    },
    topFlex: {
        display: 'flex',
        width: '100%',
        alignContent: 'space-between',
        padding: 10
    },
    topButtons: {
        margin: 'auto',
        marginRight: 0,
        marginTop: 0
    },
    btmContent: {
        padding: 10
    },
    reject: {
        backgroundColor: colour.c2,
        borderRadius: 5,
        border: '1px solid #fff',
        padding: 10,
        width: '100%',
        colour: 'black'
    }

})
const RejectedTab = ({ columns, rejectedData, clause, setRejectedEditTab, certContent }) => {
    const classes = useStyles()

    return (
        <Paper className={classes.root}>
            <div className={classes.topFlex}>
                <div style={{ width: '40%' }}>
                    <p><b>Evaluated by: {rejectedData.handled_by_name}</b></p>
                    <div className={classes.reject}>
                        <p>{rejectedData.remarks}</p>
                    </div>
                </div>
                <div className={classes.topButtons}>
                    <StyledButton text="Delete" event={() => Delete(rejectedData.id, clause)} />
                    <StyledButton text="Edit" style={{ marginLeft: 10 }} event={() => setRejectedEditTab(true)} />
                </div>

            </div>

            <div className={classes.btmContent} >
                <TabData columns={columns} Data={rejectedData} certContent={certContent} Editing={false} clause={clause} showEdited={false} editable={false} />
            </div>
        </Paper>
    )
}

export default RejectedTab;