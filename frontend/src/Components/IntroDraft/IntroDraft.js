import { useEffect, useState } from "react"
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { Row, Col } from 'react-bootstrap';
import { makeStyles } from "@material-ui/core";

//components    
import colour from "../Colours/Colours"
import StyledButton from "../StyledButton/StyledButton"
import IntroAPI from "./IntroAPI";

const IntroDraft = ({ Data, EditorData, setEditorData, user_id, company_id, clause, toggleGetData, setToggleGetData, title, editable }) => {
    const [toggleEditMode, setToggleEditMode] = useState(false)
    const useStyles = makeStyles({
        container: {
            height: 'auto',
            borderRadius: 5,
            backgroundColor: colour.c2,
            padding: 10,
            marginBottom: 15,
            color: colour.c1
        },
        header: {
            display: 'flex',
            justifyContent: "space-between",
        },
        wrapper: {
            paddingTop: 15
        },
        editor: {
            backgroundColor: colour.c1,
            color: 'black',
            padding: 5,
            borderTop: `1px dashed ${colour.c2}`
        },
        toolbar: {
            border: 0,
            margin: 0,
            color: 'black'
        },
        htmlText: {
            paddingTop: 10
            // backgroundColor: colour.c1,
            // color: "black",
            // border: `1px solid ${colour.c1}`,
        }
    })
    const classes = useStyles()

    const Submit = () => {
        if (!EditorData.getCurrentContent().hasText()) {
            alert('Please fill up the field.')
        }
        else {
            IntroAPI(null, null, null, null, null, EditorData, user_id, company_id, "PUT", clause)
            setTimeout(() => {
                setToggleEditMode(false)
                if (toggleGetData) {
                    setToggleGetData(false)
                }
                else {
                    setToggleGetData(true)
                }      
            }, 1000)
        
        }
    }





    if (toggleEditMode) {
        return (
            <>
                <div className={classes.container}>
                    <div className={classes.header}>
                        <h1>{title}</h1>
                        {(editable &&
                            <div className={classes.button}>
                                <StyledButton text="Save Changes" event={() => Submit()} />
                                <StyledButton text="Cancel" style={{ marginLeft: 10 }} event={() => setToggleEditMode(false)} />
                            </div>
                        )}
                    </div>
                    <Editor //show in editor mode
                        editorState={EditorData}
                        onEditorStateChange={setEditorData}
                        wrapperClassName={classes.wrapper}
                        editorClassName={classes.editor}
                        toolbarClassName={classes.toolbar}
                    />
                </div>
            </>
        )
    }
    else { //Html mode
        return (
            <>
                <div className={classes.container}>
                    <div className={classes.header}>
                        <h1>{title}</h1>
                        {(editable &&
                            <div className={classes.button}>
                                <StyledButton text="Edit" event={() => setToggleEditMode(true)} />
                            </div>
                        )}
                    </div>
                    <div className={classes.htmlText}>{Data.html_content}</div>
                </div>
            </>
        )
    }

}

export default IntroDraft