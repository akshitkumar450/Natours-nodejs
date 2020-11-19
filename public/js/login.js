const login = async (email, password) => {
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

        if (result.data.status === 'success') {
            alert('logged in successfully ')
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
        console.log(result);
        //  if it login successfully it will produce a jwt token  and a cookie also containing jwt token and this will help to build the complete authentication
    }
    catch (err) {
        // console.log(err);
        alert(err.response.data.message);
    }
}

document.querySelector('.form').addEventListener('submit', (e) => {
    e.preventDefault()
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    login(email, password)
})

console.log('login');