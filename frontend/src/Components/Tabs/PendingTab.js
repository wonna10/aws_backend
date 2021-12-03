import { Paper } from "@material-ui/core"
import { Row, Col } from "react-bootstrap"
import StyledButton from "../StyledButton/StyledButton"
import TabData from "../Tabs/TabData";
import moment from "moment";
import { makeStyles } from "@material-ui/core";
import colour from "../Colours/Colours";
import Approve from "../Functions/Approve";
import RejectForm from "../RejectForm/RejectForm";
import { useState } from "react";
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
    }

})

const PendingTab = ({ activeData, pendingData, user_id, company_id, clause, columns, certContent }) => {
    const [toggleRejectFormState, setToggleRejectFormState] = useState(false);
    const classes = useStyles()
    return (
        <Paper className={classes.root}>
            {!toggleRejectFormState && (
                <div className={classes.topFlex}>
                    <div>
                        <p><b>To be Approved by: {pendingData.handled_by_name}</b></p></div>
                    <div className={classes.topButtons}>
                        <StyledButton text="Reject" event={() => setToggleRejectFormState(true)} />
                        <StyledButton style={{ marginLeft: 10 }} text="Approve" event={() => Approve(user_id, pendingData.handled_by, pendingData.id, activeData.id, company_id, clause)} />
                    </div>
                </div>


            )}
            {toggleRejectFormState && (
                <div className={classes.btmContent} style={{ paddingBottom: 0 }}>
                    <RejectForm clause={clause} user_id={user_id} pId={pendingData.id} Id={activeData.id} setToggleRejectFormState={setToggleRejectFormState}></RejectForm>
                </div>
            )}

            <div className={classes.btmContent} >
                <TabData Data={pendingData} clause={clause} certContent={certContent} Editing={false} showEdited={true} editable={false} columns={columns} />
            </div>
        </Paper>
    )
}

export default PendingTab;