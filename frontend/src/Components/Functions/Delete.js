import axios from "axios";
import config from '../../Config.js';
const Delete = (Id, clause) => {
    var confirm = window.confirm('Are you sure you want to delete this data?')
    if (confirm == true) {
        axios.delete(`${config.baseUrl}/u/${clause}/delete${clause}/${Id}`,
            {})
            .then(response => {
                alert(`This ${clause} data has been deleted.`)
                window.location.reload();
            }).catch(error => {
                console.log(error);
            });
    }
};

export default Delete;