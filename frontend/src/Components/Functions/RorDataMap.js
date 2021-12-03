import RorOptions from "../RorComponent/RorOptions"
import moment from "moment"
const risk_opportunity_option = RorOptions.risk_opportunity_option
const severity_option = RorOptions.severity_option
const likelihood_option = RorOptions.likelihood_option
const singleMap = (data) => {
    var list = data.map(oneData => ({ content: oneData.content, risk_opportunity: risk_opportunity_option[oneData.risk_opportunity], severity: severity_option[oneData.severity], likelihood: likelihood_option[oneData.likelihood], rpn: oneData.rpn, action_plan: oneData.action_plan, edited: oneData.edited, date_modified: moment(oneData.date_modified).format('YYYY-MM-DD HH:mm:ss'), swot_item_id: oneData.swot_item_id, ror_item_id: oneData.ror_item_id}))
    return list
}

const RorDataMap = (sData, wData, oData, tData) => {
    sData = singleMap(sData)
    wData = singleMap(wData)
    oData = singleMap(oData)
    tData = singleMap(tData)
    return {
        sData: sData,
        wData: wData,
        oData: oData,
        tData: tData
        
    };
} 

export default RorDataMap;