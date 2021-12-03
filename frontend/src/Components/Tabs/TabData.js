import Tables from "../Tables/Tables";
import PolicyComponent from "../PolicyComponent/PolicyComponent";
import RorComponentRow from '../../Components/RorComponent/RorComponentRow';
import OapComponent from "../OapComponent/OapComponent";
import Draft from "../Draft/Draft";
import { makeStyles } from '@material-ui/core';
import colour from "../Colours/Colours";

//style
const useStyle = makeStyles({

    qmsHistory: {
        "& > p": {
            color: colour.c1
        }
    }
})


const TabData = ({ clause, file, setFile, Data, setData, certContent, setCertContent, Editing, showEdited, editable, columns }) => {
    const classes = useStyle()

    switch (clause) {
        case 'swot':
            if (Editing) {
                return (
                    <>
                        <Tables columns={columns("Strengths")} type="S" Data={Data.edited_strengths} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                        <Tables columns={columns("Weaknesses")} type="W" Data={Data.edited_weaknesses} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                        <Tables columns={columns("Opportunities")} type="O" Data={Data.edited_opportunities} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                        <Tables columns={columns("Threats")} type="T" Data={Data.edited_threats} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                    </>
                )
            }
            else {
                return (
                    <>
                        <Tables columns={columns("Strengths")} type="S" Data={Data.strengths} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                        <Tables columns={columns("Weaknesses")} type="W" Data={Data.weaknesses} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                        <Tables columns={columns("Opportunities")} type="O" Data={Data.opportunities} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                        <Tables columns={columns("Threats")} type="T" Data={Data.threats} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                    </>)
            }

        case 'ip':
            if (Editing) {
                return (
                    <Tables columns={columns()} Data={Data.edited_data} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                )
            }
            else {
                return (
                    <Tables columns={columns()} Data={Data.data} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                )
            }
        case "qms":
            if (Editing) {
                return (
                    <>
                        <Draft editable={true} Data={certContent} setData={setCertContent} />
                        <h5>Physical Boundary: The corporate office address from where the above mentioned services are provided as follows:</h5>
                        <Tables columns={columns()} Data={Data.edited_data} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                    </>
                )
            }
            else {
                return (
                    <div>
                        <Draft editable={false} htmlData={certContent} />
                        <h5 style={{ color: colour.c1 }}>Physical Boundary: The corporate office address from where the above mentioned services are provided as follows:</h5>
                        <Tables columns={columns()} Data={Data.data} setData={setData} showEdited={showEdited} editable={editable} clause={clause}></Tables>
                    </div>
                )
            }
        case "policy":
            if (Editing) {
                return (
                    <PolicyComponent Data={Data.edited_data} setData={setData} editable={editable} />
                )
            }
            else {
                return (
                    <PolicyComponent Data={Data.data} setData={setData} editable={editable} />
                )
            }
        case "ror":
            if (Editing) {
                return (
                    <>
                        <RorComponentRow Data={Data.edited_strengths} setData={setData} type="S" title="Strengths" editable={editable} />
                        <RorComponentRow Data={Data.edited_weaknesses} setData={setData} type="W" title="Weaknesses" editable={editable} />
                        <RorComponentRow Data={Data.edited_opportunities} setData={setData} type="O" title="Opportunities" editable={editable} />
                        <RorComponentRow Data={Data.edited_threats} setData={setData} type="T" title="Threats" editable={editable} />
                    </>
                )
            }
            else {
                return (
                    <>
                        <RorComponentRow Data={Data.strengths} setData={setData} type="S" title="Strengths" editable={editable} />
                        <RorComponentRow Data={Data.weaknesses} setData={setData} type="W" title="Weaknesses" editable={editable} />
                        <RorComponentRow Data={Data.opportunities} setData={setData} type="O" title="Opportunities" editable={editable} />
                        <RorComponentRow Data={Data.threats} setData={setData} type="T" title="Threats" editable={editable} />
                    </>
                )
            }
        case "oap":
            if (Editing) {
                return (
                    <OapComponent file={file} setFile={setFile} Data={Data.edited_data} setData={setData} editable={editable} />
                )
            }
            else {
                return (
                    <OapComponent file={file} setFile={setFile} Data={Data.data} setData={setData} editable={editable} />
                )
            }
    }
}

export default TabData;