import EditingTab from "./EditingTab"
import PendingTab from "./PendingTab"
import RejectedTab from "./RejectedTab"
const setSecondTabPanel = ( setDataByStatus, tabData, columns, activeData, setActiveData, pendingData, rejectedData, setRejectedData, setActiveEditTab, setRejectedEditTab, handlerList, setHandler, handler, formName, setFormName, clause, company_id, user_id, certContentEditor, setCertContentEditor, certContentHTML, setCertContentHTML, file, setFile) => {
    switch (tabData) {
        case 'ActiveEdit': return (<EditingTab setDataByStatus={setDataByStatus} setData={setActiveData} columns={columns} Data={activeData}  handler={handler} formName={formName} setFormName={setFormName} submitLocation="Active" clause={clause} company_id={company_id} user_id={user_id} certContent={certContentEditor} setCertContent={setCertContentEditor} setActiveEditTab={setActiveEditTab} handlerList={handlerList} setHandler={setHandler} file={file} setFile={setFile} />)
        case 'Pending': return(<PendingTab columns={columns} activeData={activeData} pendingData={pendingData} company_id={company_id} user_id={user_id} clause={clause} certContent={certContentHTML}/>)
        case 'Rejected': return(<RejectedTab columns={columns} rejectedData={rejectedData} clause={clause} setRejectedEditTab={setRejectedEditTab} certContent={certContentHTML}/>)
        case "RejectEdit": return (<EditingTab setDataByStatus={setDataByStatus} setData={setRejectedData} columns={columns}  Data={rejectedData} formName={formName} setFormName={setFormName} submitLocation="Rejected" clause={clause} company_id={company_id} user_id={user_id} certContent={certContentEditor} setCertContent={setCertContentEditor} setRejectedEditTab={setRejectedEditTab} file={file} setFile={setFile}/>)
    }
}

export default setSecondTabPanel;