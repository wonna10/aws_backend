import StyledButton from "../StyledButton/StyledButton";
import axios from "axios";
import config from '../../Config.js';
import { useForm } from 'react-hook-form';
import { makeStyles, Button } from '@material-ui/core';
import colour from "../Colours/Colours";

const RejectForm = (props) => {
    const { register, handleSubmit } = useForm();
    const useStyles = makeStyles({
        buttonContainer: {
            marginTop: 10
        }
    })
    const classes = useStyles()
    const Reject = (data, e) => {
        var remarks = data.remarks
        axios.put(`${config.baseUrl}/u/${props.clause}/update${props.clause}/`,
            {
                data: {
                    user_id: props.user_id,
                    remarks: remarks,
                    status_id: 3,
                    pending_id: props.pId,
                    active_id: props.Id

                }
            })
            .then(response => {
                alert(`${props.clause} has been rejected.`)
                window.location.reload();
            }).catch(error => {
                console.log(error);
            });
    };

    return (
        <form onSubmit={handleSubmit(Reject)} noValidate autoComplete="off" style={{ width: "40%" }}>
            <textarea
                rows="2"
                id="remarksInput"
                name="remarks"
                type="text"
                className="form-control"
                aria-describedby="Enter remarks"
                placeholder="Enter remarks"
                textarea ref={register({
                    required: {
                        value: true,
                        message: 'Please enter remarks',
                    },
                })}
            />
            <div>
                <div className={classes.buttonContainer}>
                    <StyledButton text='Confirm Reject' type="submit" event={() => { }} />
                    <StyledButton style={{ marginLeft: 10 }} text="Cancel" event={() => props.setToggleRejectFormState(false)} />
                </div>
            </div>
        </form>
    )
}


export default RejectForm;