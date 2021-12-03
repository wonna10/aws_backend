import axios from "axios";
import config from '../../Config.js';
import convert from "htmr"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import RorDataMap from "../Functions/RorDataMap";
import draftToHtml from "draftjs-to-html";
import personal_res_option from "../OapComponent/SelectOptions.js";
const GetDataByStatus = (clause, company_id, status, setData, get, setCertContentEditor, setCertContentHTML) => {
    if (status != null) {
        axios.get(`${config.baseUrl}/u/${clause}/get${clause}data?companyid=${company_id}&statusid=${status}`,
            {})
            .then(response => {
                var data = response.data

                if (get == 'getTab') {
                    if (clause == "swot" || clause == "ror") {
                        if (data.Data.length != 0) {
                            setData({
                                available: true,
                                handled_by: data.Data[0].handled_by,
                                edited_by: data.Data[0].edited_by
                            })
                        }
                        else {
                            setData({
                                available: false,
                                handled_by: null,
                                edited_by: null
                            })
                        }
                    }
                    else {
                        if (data.length != 0) {
                            setData({
                                available: true,
                                handled_by: data[0].handled_by,
                                edited_by: data[0].edited_by
                            })
                        }
                        else {
                            setData({
                                available: false,
                                handled_by: null,
                                edited_by: null
                            })
                        }
                    }
                }

                else {
                    switch (clause) {
                        case "swot":
                            setData({
                                data: data,
                                id: data.Data[0].swot_id,
                                handled_on: data.Data[0].handled_on,
                                handled_by_name: data.Data[0].handled_by_name,
                                remarks: data.Data[0].remarks,
                                edited_by: data.Data[0].edited_by,
                                handled_by: data.Data[0].handled_by,
                                strengths: data.strengths,
                                weaknesses: data.weaknesses,
                                opportunities: data.opportunities,
                                threats: data.threats,
                                edited_strengths: data.edited_strengths,
                                edited_weaknesses: data.edited_weaknesses,
                                edited_opportunities: data.edited_opportunities,
                                edited_threats: data.edited_threats,
                            })
                            break;
                        case "ip":
                            setData({
                                data: data,
                                edited_data: data,
                                id: data[0].ip_id,
                                handled_on: data[0].handled_on,
                                handled_by_name: data[0].handled_by_name,
                                remarks: data[0].remarks,
                                edited_by: data[0].edited_by,
                                handled_by: data[0].handled_by,
                                form_name: data[0].form_name
                            })
                            break;
                        case "qms":
                            setData({
                                data: data,
                                edited_data: data,
                                id: data[0].qms_id,
                                handled_on: data[0].handled_on,
                                handled_by_name: data[0].handled_by_name,
                                remarks: data[0].remarks,
                                edited_by: data[0].edited_by,
                                handled_by: data[0].handled_by,
                                form_name: data[0].form_name,
                                cert_content: JSON.parse(data[0].cert_content)
                            })
                            setCertContentEditor(EditorState.createWithContent(convertFromRaw(JSON.parse(data[0].cert_content))))
                            setCertContentHTML(convert(draftToHtml(convertToRaw(EditorState.createWithContent(convertFromRaw(JSON.parse(data[0].cert_content))).getCurrentContent()))))
                            break;
                        case "policy":
                            let mappedData_policy = data.map(x => ({ title: x.title, content: x.content }))
                            setData({
                                data: data,
                                edited_data: mappedData_policy,
                                id: data[0].policy_id,
                                handled_on: data[0].handled_on,
                                handled_by_name: data[0].handled_by_name,
                                remarks: data[0].remarks,
                                edited_by: data[0].edited_by,
                                handled_by: data[0].handled_by,
                            })
                            break;
                        case "ror":
                            let mappedData_ror = RorDataMap(data.strengths, data.weaknesses, data.opportunities, data.threats)
                            setData({
                                data: data,
                                id: data.Data[0].ror_id,
                                handled_on: data.Data[0].handled_on,
                                handled_by_name: data.Data[0].handled_by_name,
                                remarks: data.Data[0].remarks,
                                edited_by: data.Data[0].edited_by,
                                handled_by: data.Data[0].handled_by,
                                strengths: data.strengths,
                                weaknesses: data.weaknesses,
                                opportunities: data.opportunities,
                                threats: data.threats,
                                edited_strengths: mappedData_ror.sData,
                                edited_weaknesses: mappedData_ror.wData,
                                edited_opportunities: mappedData_ror.oData,
                                edited_threats: mappedData_ror.tData,
                            })
                            break;
                        case "oap":
                            let mappedData_oap = data.map(oneData => ({ oap_id: oneData.oap_id, oap_item_id: oneData.oap_item_id, oapfunction: oneData.oapfunction, collecting_measuring_data: oneData.collecting_measuring_data, quality_obj: oneData.quality_obj, personal_resp: personal_res_option[oneData.personal_resp], analysing_data: oneData.analysing_data, files: oneData.files }))
                            setData({
                                data: data,
                                edited_data: mappedData_oap,
                                id: data[0].oap_id,
                                handled_on: data[0].handled_on,
                                handled_by_name: data[0].handled_by_name,
                                remarks: data[0].remarks,
                                edited_by: data[0].edited_by,
                                handled_by: data[0].handled_by,
                            })
                        
                            break;
                    }
                }
            }).catch(error => {
                console.log(error);
            });
    }
}

export default GetDataByStatus;