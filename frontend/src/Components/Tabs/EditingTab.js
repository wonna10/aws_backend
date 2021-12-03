import { Paper, TextField } from "@material-ui/core"
import { Row, Col } from "react-bootstrap"
import StyledButton from "../StyledButton/StyledButton"
import TabData from "../Tabs/TabData";
import Submit from '../../Components/Functions/Submit';
import SelectHandler from "../SelectHandler/SelectHandler";
import Draft from '../../Components/Draft/Draft';
import { EditorState, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import RorDataMap from "../Functions/RorDataMap";
import { makeStyles } from "@material-ui/core";
import colour from "../Colours/Colours";
import editable from "../Functions/editable";
import personal_res_option from "../OapComponent/SelectOptions.js";

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

const EditingTab = ({ setDataByStatus, columns, Data, setData, formName, setFormName, handler, submitLocation, clause, company_id, user_id, certContent, setCertContent, setActiveEditTab, file, setFile, setRejectedEditTab, handlerList, setHandler }) => {
    const classes = useStyles()
    const setEditTab = () => {
        if (clause == "swot") {
            setData(
                prevState => ({
                    ...prevState,
                    edited_strengths: Data.strengths,
                    edited_weaknesses: Data.weaknesses,
                    edited_opportunities: Data.opportunities,
                    edited_threats: Data.threats
                }))
        }
        else if (clause == "ror") {
            let mappedData_ror = RorDataMap(Data.strengths, Data.weaknesses, Data.opportunities, Data.threats)
            setData(
                prevState => ({
                    ...prevState,
                    edited_strengths: mappedData_ror.sData,
                    edited_weaknesses: mappedData_ror.wData,
                    edited_opportunities: mappedData_ror.oData,
                    edited_threats: mappedData_ror.tData,
                }))
        }
        else if (clause == 'oap') {
            setFile([])
            let mappedData_oap = Data.data.map(oneData => ({ oap_id: oneData.oap_id, oap_item_id: oneData.oap_item_id, oapfunction: oneData.oapfunction, collecting_measuring_data: oneData.collecting_measuring_data, quality_obj: oneData.quality_obj, personal_resp: personal_res_option[oneData.personal_resp], analysing_data: oneData.analysing_data, files: oneData.files }))
            setData(
                prevState => ({
                    ...prevState,
                    edited_data: mappedData_oap
                }))
        }
        else {
            setData(
                prevState => ({
                    ...prevState,
                    edited_data: Data.data
                }))
        }

        if (submitLocation == 'Active') {
            setActiveEditTab(false)
        }
        else {
            setRejectedEditTab(false)
        }
    }
    return (
        <Paper className={classes.root}>
            <div className={classes.topFlex}>
                <div style={{ width: '40%' }}>
                    {((clause == "ip" || clause == "qms" || clause == "oap") &&
                        <div>
                            <label forHtml="formname"><b>Form Name:</b></label>
                            <input name="formname" placeholder="Form Name" type="text" className="form-control" label='Form Name' variant="outlined" onChange={e => setFormName(e.target.value)} /><br />
                        </div>)}

                    {(submitLocation == "Active" &&
                        <SelectHandler handlerList={handlerList} setHandler={setHandler}></SelectHandler>
                    )}
                </div>
                <div className={classes.topButtons}>
                    <StyledButton text="Submit" event={() => Submit(Data, handler, formName, submitLocation, clause, Data.id, company_id, user_id, certContent, file)} />
                    <StyledButton text="Cancel" event={() => setEditTab()} style={{ marginLeft: 10 }} />
                </div>
            </div>
            <div className={classes.btmContent} >
                <TabData columns={columns} file={file} Editing={true} certContent={certContent} setCertContent={setCertContent} setFile={setFile} Data={Data} setData={setData} clause={clause} showEdited={false} editable={true} />
            </div>
        </Paper>
    )
}

export default EditingTab;