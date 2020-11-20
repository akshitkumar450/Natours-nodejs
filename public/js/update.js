import axios from 'axios'
import { showAlert } from './alerts'

//  we have changed the funtion so that it can update both name ,email and password
//  data will be an object for all the data to be updated
// type will be the data or password
export const updateSettings = async (data, type) => {
    try {
        let url;
        if (type === 'password') {
            url = 'http://localhost:4000/api/v1/users/updatePass'
        } else {
            url = 'http://localhost:4000/api/v1/users/updateMe'
        }

        const res = await axios({
            method: 'PATCH',
            url: url,
            data: data
        })
        if (res.data.status === 'success') {
            showAlert('success', `${type} updated successfully`)
        }
    }
    catch (err) {
        showAlert('error', err.response.data.message)
    }
}

