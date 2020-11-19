import axios from 'axios'
import { showAlert } from './alerts'

export const login = async (email, password) => {
    // here we will use http request to get access the login api
    //  using axios
    //  axios will return a promise
    try {
        const result = await axios({
            method: 'POST',
            url: 'http://localhost:4000/api/v1/users/login',
            //  data to send to the url in body
            //  it will work same as it was working in postman
            data: {
                email: email,
                password: password
            }
        })

        //  user menu will be shown only by reloading the page afer logging in
        //  so if we are logged in then only it will work
        if (result.data.status === 'success') {
            showAlert('success', 'logged in successfully')
            //  to reload to main page
            window.setTimeout(() => {
                //  to load other page
                location.assign('/')
            }, 1500)
        }
        console.log(result);
        //  if it login successfully it will produce a jwt token  and a cookie also containing jwt token and this will help to build the complete authentication
    }
    catch (err) {
        // console.log(err);
        // alert(err.response.data.message);
        showAlert('error', err.response.data.message)
    }
}
console.log('login');

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:4000/api/v1/users/logout',
        })
        if (res.data.status === 'success') location.reload(true) // force reloading  from server not from browser
    }
    catch (err) {
        showAlert('error', 'error logging out,try again')
    }
}