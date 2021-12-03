import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Editor } from 'react-draft-wysiwyg';
import { Row, Col } from 'react-bootstrap';
import './draftStyle.css'
import { makeStyles } from '@material-ui/core';

//component
import colour from '../Colours/Colours'

const useStyle = makeStyles({
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
        marginBottom: 45,
        "& p, & b, & strong": {
            color: colour.c1
        }
    }
})

const Draft = ({ editable, Data, setData, htmlData }) => { //show in editor mode if editable else in html mode
    const classes = useStyle()
    if (editable) {
        return (
            <div style={{ marginBottom: 15, color: colour.c1 }}>
                <h5>The quality management system under the scope of ISO 9001:2015 Certification applies to:</h5>
                <Editor //show in editor mode
                    editorState={Data}
                    onEditorStateChange={setData}
                    wrapperClassName={classes.wrapper}
                    editorClassName={classes.editor}
                    toolbarClassName={classes.toolbar}
                />
            </div>
        )
    }
    else { //Html mode
        return (
            <div style={{ color: 'white' }}>
                <div className={classes.htmlText}>
                    <p><b>The quality management system under the scope of ISO 9001:2015 Certification applies to:</b></p>
                    <p>{htmlData}</p>
                </div >
            </div>
        )
    }
}

export default Draft