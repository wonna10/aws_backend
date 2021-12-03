import axios from "axios";
import config from "../../Config";
import { stateToHTML } from "draft-js-export-html";
import draftToHtml from "draftjs-to-html";
import convert from "htmr"
import { convertFromRaw, EditorState, convertToRaw } from "draft-js";


const IntroAPI = (setAllData, setRights, setScopeData, setNRData, setTDData, Data, user_id, company_id, request, clause) => {
    if (request == 'GET') {
        axios.get(`${config.baseUrl}/u/users/getuserrights/${user_id}`,
            {})
            .then(response => {
                var data = response.data
                setRights({
                    scope_rights: data[0].scope_rights,
                    nr_rights: data[0].nr_rights,
                    td_rights: data[0].td_rights
                })
            }).catch(error => {
                console.log(error);
            });
        axios.get(`${config.baseUrl}/u/intro/getintrodata/${company_id}`,
            {})
            .then(response => {
                var data = response.data
                setAllData({
                    scope: {
                        html_content: convert(draftToHtml(convertToRaw(EditorState.createWithContent(convertFromRaw(JSON.parse(data.scope[0].content))).getCurrentContent()))),
                        edited_by: data.scope[0].edited_by
                    },
                    normative_references: {
                        html_content: convert(draftToHtml(convertToRaw(EditorState.createWithContent(convertFromRaw(JSON.parse(data.normative_references[0].content))).getCurrentContent()))),
                        edited_by: data.scope[0].edited_by
                    },
                    terms_definitions: {
                        html_content: convert(draftToHtml(convertToRaw(EditorState.createWithContent(convertFromRaw(JSON.parse(data.terms_definitions[0].content))).getCurrentContent()))),
                        edited_by: data.terms_definitions[0].edited_by
                    }
                })

                setScopeData(EditorState.createWithContent(convertFromRaw(JSON.parse(data.scope[0].content))))
                setNRData(EditorState.createWithContent(convertFromRaw(JSON.parse(data.normative_references[0].content))))
                setTDData(EditorState.createWithContent(convertFromRaw(JSON.parse(data.terms_definitions[0].content))))
            }).catch(error => {
                console.log(error);
            });
    }
    else {
        let convertedContent = convertToRaw(Data.getCurrentContent()) //convert data to json
        convertedContent = JSON.stringify(convertedContent) // convert json to string to store in database
        axios.put(`${config.baseUrl}/u/intro/update${clause}/${company_id}`,
        
            {
                data: {
                    user_id: user_id,
                    content: convertedContent
                }
            })
            .then(response => {
                var data = response.data
            }).catch(error => {
                console.log(error);
            });
    }
}

export default IntroAPI