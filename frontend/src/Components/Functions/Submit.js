import axios from 'axios';
import config from '../../Config.js';
import { convertToRaw, convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const addType = (Data, type) => {
    for (var i = 0; i < Data.length; i++) {
        Data[i].type = type
    }
}
const checkEdited = (Data, editedData, formName, certContent, editedCertContent, clause, file) => {
    var changes = false;
    var filledup = false;
    for (var i = editedData.length; i > Data.length; i--) {
        editedData[i - 1].edited = 1
        changes = true;
    }
    for (var i = 0; i < Data.length; i++) {
        if (Data.length > editedData.length) {
            Data.splice(Data.length - 1, 1);
            changes = true
        }
    }
    switch (clause) {
        case "swot":
            for (var i = 0; i < Data.length; i++) {
                if (Data[i].content != editedData[i].content) {
                    editedData[i].edited = 1
                    changes = true;
                }
                else {
                    editedData[i].edited = 0
                }
            }
            break;
        case "ip":
            if (Data[0].form_name != formName) changes = true;
            for (var i = 0; i < Data.length; i++) {
                if (Data[i].interested_parties != editedData[i].interested_parties || Data[i].needs_expectations != editedData[i].needs_expectations) {
                    editedData[i].edited = 1
                    changes = true
                }
                else {
                    editedData[i].edited = 0
                }
            }
            break;
        case "qms":
            if (stateToHTML(convertFromRaw(certContent)) != stateToHTML(editedCertContent.getCurrentContent())) changes = true;

            if (Data[0].form_name != formName) changes = true;
            for (var i = 0; i < Data.length; i++) {
                if (Data[i].site_name != editedData[i].site_name || Data[i].site_address != editedData[i].site_address || Data[i].site_scope != editedData[i].site_scope) {
                    editedData[i].edited = 1
                    changes = true
                }
                else {
                    editedData[i].edited = 0
                }
            }
            break;
        case "ror":
            for (var i = 0; i < Data.length; i++) {
                if (Data[i].content != editedData[i].content || Data[i].risk_opportunity != editedData[i].risk_opportunity.value || Data[i].severity != editedData[i].severity.value || Data[i].likelihood != editedData[i].likelihood.value || Data[i].rpn != editedData[i].rpn || Data[i].action_plan != editedData[i].action_plan) {
                    editedData[i].edited = 1
                    changes = true
                }
                else {
                    editedData[i].edited = 0
                }
            }
            break;
        case "policy":
            for (var i = 0; i < editedData.length; i++) {
                if (editedData[i].title == "" || editedData[i].content == "") {
                    filledup = false
                    break;
                }
                else {
                    filledup = true
                }
            }
            for (var i = 0; i < Data.length; i++) {
                if (Data[i].title != editedData[i].title || Data[i].content != editedData[i].content) {
                    editedData[i].edited = 1
                    changes = true
                }
                else {
                    editedData[i].edited = 0
                }
            }
            break;
        case "oap":
            if (Data[0].form_name != formName) changes = true;
            for (var i = 0; i < editedData.length; i++) {
                if (editedData[i].oapfunction == "" || editedData[i].collecting_measuring_data == "" || editedData[i].quality_obj == "" || editedData[i].personal_resp.value == 0 || editedData[i].analysing_data == "") {
                    filledup = false
                    break;
                }
                else {
                    filledup = true
                }
            }
            for (var i = 0; i < Data.length; i++) {
                if (Data[i].oapfunction != editedData[i].oapfunction || Data[i].collecting_measuring_data != editedData[i].collecting_measuring_data || Data[i].quality_obj != editedData[i].quality_obj || Data[i].personal_resp != editedData[i].personal_resp.value || Data[i].analysing_data != editedData[i].analysing_data) {
                    editedData[i].edited = 1
                    changes = true
                }
                else {
                    editedData[i].edited = 0
                }
            }
            console.log(changes)
            break;
    }
    return {
        changes: changes,
        filledup: filledup,
        data: editedData
    }
}

const SwotAndRor = (Data, sData, wData, oData, tData, clause) => {
    var sArr = []
    var wArr = []
    var oArr = []
    var tArr = []
    var select = true;
    let oldData = Data.data.Data
    console.log(oldData)
    for (var i = 0; i < oldData.length; i++) {
        switch (oldData[i].type) {
            case 'S': sArr.push(oldData[i])
                break;
            case 'W': wArr.push(oldData[i])
                break;
            case 'O': oArr.push(oldData[i])
                break;
            case 'T': tArr.push(oldData[i])
                break;
        }
    }
    var checkedSData = checkEdited(sArr, sData, null, null, null, clause, null)
    var checkedWData = checkEdited(wArr, wData, null, null, null, clause, null)
    var checkedOData = checkEdited(oArr, oData, null, null, null, clause, null)
    var checkedTData = checkEdited(tArr, tData, null, null, null, clause, null)
    addType(checkedSData.data, 'S')
    addType(checkedWData.data, 'W')
    addType(checkedOData.data, 'O')
    addType(checkedTData.data, 'T')
    var data = checkedSData.data.concat(checkedWData.data, checkedOData.data, checkedTData.data)
    var changes = (checkedSData.changes || checkedWData.changes || checkedOData.changes || checkedTData.changes)
    if (clause == "ror") {
        for (var i = 0; i < data.length; i++) { //check if all select are selected
            if (data[i].risk_opportunity.value > 0 && data[i].severity.value > 0 && data[i].likelihood.value > 0) {
                select = true
            }
            else {
                select = false
                break;
            }
        }
    }
    return {
        changes: changes,
        data: data,
        select: select
    }
}

const callSubmitApiFormData = (submitLocation, clause, company_id, user_id, handler, rId, data, formName, files) => {
    const formData = new FormData();
    formData.append('files_info', JSON.stringify(files))
    for (var i = 0; i < files.length; i++) {
        formData.append('files', files[i].file);
    }
    formData.append(`data`, JSON.stringify(data));
    let arr = []
    for (var j = 0; j < data.length; j++) {
        arr.push(data[j].files)
    }
    formData.append(`files_data`, JSON.stringify(arr))
    formData.append(`handler`, JSON.stringify(handler));
    formData.append('company_id', company_id);
    formData.append('form_name', formName);
    formData.append('user_id', user_id);

    if (submitLocation == "Active") {
        axios({
            method: "post",
            url: `${config.baseUrl}/u/${clause}/submit${clause}/`,
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(function (response) {
                alert(`${clause} has been submitted.`)
                window.location.reload(false);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }
    else {
        axios({
            method: "post",
            url: `${config.baseUrl}/u/${clause}/submitrejected${clause}/${rId}`,
            data: formData,
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(function (response) {
                alert(`${clause} has been submitted.`)
                window.location.reload(false);
            })
            .catch(function (response) {
                //handle error
                console.log(response);
            });
    }
}

const callSubmitApi = (submitLocation, clause, company_id, user_id, handler, rId, data, formName, convertedContent, file) => {
    if (submitLocation == "Active") {
        axios.post(`${config.baseUrl}/u/${clause}/submit${clause}/`,
            {
                data: {
                    company_id: company_id,
                    user_id: user_id,
                    handler: handler,
                    form_name: formName,
                    data: data,
                    file: file,
                    cert_content: convertedContent
                }
            })
            .then(response => {
                alert(`${clause} has been submitted.`)
                window.location.reload(false);
            }).catch(error => {
                if (error.response.status == 409) {
                    if ( error.response.data.clause == "SWOT" || error.response.data.clause == "ROR") {
                        alert('There is pending or rejected swot, register of opportunity and risk data. Hence unable to process this submission.')

                    }
                    else {
                        alert(`There is pending or rejected ${error.response.data.clause} data. Hence unable to process this submission.`)

                    }                    
                    window.location.reload(false);
                }
                if (error.response.status == 500) {
                    alert('Something went wrong. Please try again later. Send a support ticket if problem persists.')
                }

            });
    }
    else {
        axios.post(`${config.baseUrl}/u/${clause}/submitrejected${clause}/${rId}`,
            {
                data: {
                    company_id: company_id,
                    user_id: user_id,
                    form_name: formName,
                    data: data,
                    file: file,
                    cert_content: convertedContent
                }
            })
            .then(response => {
                alert(`${clause} has been submitted.`)
                window.location.reload(false);
            }).catch(error => {
                if (error.response.status == 500) {
                    alert('Something went wrong. Please try again later. Send a support ticket if problem persists.')
                }
            });
    }
}


const Submit = (Data, handler, formName, submitLocation, clause, rId, company_id, user_id, editedCertContent, file) => {
    var data;
    var changes;
    var convertedContent;
    var emptyCertContent = true;
    var select = true;
    var filledup = true;
    if (clause == "swot" || clause == "ror") {
        const dataHandling = SwotAndRor(Data, Data.edited_strengths, Data.edited_weaknesses, Data.edited_opportunities, Data.edited_threats, clause);
        changes = dataHandling.changes
        data = dataHandling.data
        formName = 'placeholder'
        if (clause == "ror") {
            select = dataHandling.select
        }
        for (var i = 0; i<data.length; i++) {
            if (data[i].rpn <= 12) {
                data[i].action_plan = 'No Action Required.'
            }
        }
    }
    if (clause == "ip") {
        const dataHandling = checkEdited(Data.data, Data.edited_data, formName, null, null, clause, null);
        changes = dataHandling.changes
        data = dataHandling.data
    }
    if (clause == "qms") {
        const dataHandling = checkEdited(Data.data, Data.edited_data, formName, Data.cert_content, editedCertContent, clause, null);
        changes = dataHandling.changes
        data = dataHandling.data
        convertedContent = convertToRaw(editedCertContent.getCurrentContent()) //convert data to json
        convertedContent = JSON.stringify(convertedContent) // convert json to string to store in database
        emptyCertContent = editedCertContent.getCurrentContent().hasText()
    }
    if (clause == "policy") {
        const dataHandling = checkEdited(Data.data, Data.edited_data, null, null, null, clause, null);
        changes = dataHandling.changes
        data = dataHandling.data
        filledup = dataHandling.filledup
        formName = 'placeholder'
    }
    if (clause == "oap") {
        const dataHandling = checkEdited(Data.data, Data.edited_data, formName, null, null, clause, file);
        changes = dataHandling.changes
        data = dataHandling.data
        filledup = dataHandling.filledup
    }

    if (handler == null) handler = ["handler"]
    if (select == false || filledup == false || changes == false || handler.length == 0 || formName == undefined || formName.length == 0 || emptyCertContent == false) { //Alert based on validation
        if (select == false) {
            alert('Please select all the fields that requires selection.')
        }
        else if (filledup == false) {
            alert('Please fill up the empty fields.')
        }
        else if (changes == false) {
            alert('Unable to submit because no changes was made.')
        }
        else if (emptyCertContent == false) {
            alert('Fill in the Certification Field.')
        }
        else if (formName == undefined || formName.length == 0) {
            alert('Enter Form Name.')
        }
        else if (handler.length == 0) {
            alert('Select a user to get approval from.')
        }
    }
    else {
        if (clause == "oap") {
            callSubmitApiFormData(submitLocation, clause, company_id, user_id, handler, rId, data, formName, file)
        }
        else {
            callSubmitApi(submitLocation, clause, company_id, user_id, handler, rId, data, formName, convertedContent, file);

        }
    }
}


export default Submit