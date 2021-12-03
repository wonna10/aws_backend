import { Paper } from "@material-ui/core"
import { Row, Col } from "react-bootstrap"
import StyledButton from "../StyledButton/StyledButton"
import TabData from "../Tabs/TabData";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import colour from "../Colours/Colours";
import Draft from "../Draft/Draft";
import { stateToHTML } from "draft-js-export-html";
import { convertFromRaw } from "draft-js";

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
    }
})

const ActiveTab = ({ Data, activeEditTab, setActiveEditTab, clause, editable, columns, certContent }) => {
    const classes = useStyles()
    return (
        <Paper className={classes.root}>
            <div className={classes.topFlex}>
                <div>
                    {((clause == "ip" || clause == "qms") &&
                        <p><b>Form Name: {Data.form_name}</b></p>
                    )}
                    <p><b>Approved by: {Data.handled_by_name}</b></p>
                    <p><b>Approved on: {moment(Data.handled_on).format('MM/DD/YYYY')}</b></p>
                </div>
                {editable && !activeEditTab && (
                    <div className={classes.topButtons}>
                        <StyledButton text="Edit" event={() => setActiveEditTab(true)} />
                    </div>
                )}
            </div>
            <div className={classes.btmContent} >
                <TabData Data={Data} clause={clause} certContent={certContent} Editing={false} showEdited={false} editable={false} columns={columns} />
            </div>
        </Paper >
    )
}

export default ActiveTab;