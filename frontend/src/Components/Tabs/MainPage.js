import { TabList, Tab, Tabs, TabPanel } from "react-tabs";
import ActiveTab from "./ActiveTab";
import setSecondTabPanel from "./SetSecondTab";
import { makeStyles } from '@material-ui/core';

import './tabStyle.css'

//import components
import colour from "../Colours/Colours";

const reloadData = (setDataByStatus, availableData, setData, setFile, clause) => {
    setDataByStatus(
        prevState => ({
            ...prevState,
            status1: null,
            setData1: null,
            status2: availableData,
            setData2: setData
        }))
}

const MainPage = ({ setDataByStatus, columns, activeData, setActiveData, pendingData, setPendingData, rejectedData, setRejectedData, availablePendingTab, availableRejectedTab, activeEditTab, rejectedEditTab, setActiveEditTab, setRejectedEditTab, editable, visiblePending, visibleRejected, handlerList, setHandler, handler, formName, setFormName, clause, company_id, user_id, certContentEditor, setCertContentEditor, certContentHTML, setCertContentHTML, file, setFile, clicked }) => {

    let tabName
    let bolean = false
    let tabData
    let availableData
    let setData
    if (activeEditTab || rejectedEditTab) {
        if (activeEditTab) {
            tabData = 'ActiveEdit'
        }
        else {
            tabData = 'RejectEdit'
        }
        tabName = 'Editing'
        bolean = true
    }
    else if (availablePendingTab) {
        if (visiblePending) {
            tabName = 'Pending'
            tabData = 'Pending'
            bolean = true
            availableData = 2
            setData = setPendingData
        }
        else {
            bolean = false
        }
    }
    else if (availableRejectedTab) {
        if (visibleRejected) {
            tabName = 'Rejected'
            tabData = 'Rejected'
            bolean = true
            availableData = 3
            setData = setRejectedData
        }
        else {
            bolean = false
        }
    }
    return (
        <Tabs>
            <TabList>
                <Tab>Active</Tab>

                {(bolean && <Tab onClick={() => reloadData(setDataByStatus, availableData, setData, setFile, clause)}>{tabName}</Tab>)
                }
            </TabList>
            <TabPanel>
                <ActiveTab Data={activeData} setData={setActiveData} activeEditTab={activeEditTab} setActiveEditTab={setActiveEditTab} clause={clause} editable={editable} columns={columns} certContent={certContentHTML} />
            </TabPanel>
            <TabPanel>
                {setSecondTabPanel(setDataByStatus, tabData, columns, activeData, setActiveData, pendingData, rejectedData, setRejectedData, setActiveEditTab, setRejectedEditTab, handlerList, setHandler, handler, formName, setFormName, clause, company_id, user_id, certContentEditor, setCertContentEditor, certContentHTML, setCertContentHTML, file, setFile)}
            </TabPanel>
        </Tabs >

    )
}

export default MainPage;