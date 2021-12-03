import axios from "axios";
import config from '../../Config.js';
const Approve = (user_id, handledBy, pId, Id, company_id, clause) => {
    axios.put(`${config.baseUrl}/u/${clause}/update${clause}/`,
        {
            data: {
                user_id: user_id,
                editor: handledBy,
                status_id: 1,
                pending_id: pId,
                active_id: Id,
                company_id: company_id,

            }
        })
        .then(response => {
            alert(`${clause} has been approved.`)
            window.location.reload(false);
        }).catch(error => {
            console.log(error);
        });
}

export default Approve;