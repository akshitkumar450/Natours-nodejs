console.log('bundle');
import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateSettings } from './update'

//  DOM elements

const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const updateForm = document.querySelector('.form-user-data')
const userPasswordForm = document.querySelector('.form-user-password')


if (mapBox) {
    const locations = JSON.parse(mapBox.dataset.locations)
    displayMap(locations)
}

if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        login(email, password)
    })
}

if (updateForm) {
    updateForm.addEventListener('submit', (e) => {
        e.preventDefault()
        //  we have created multipart form-data
        const form = new FormData()
        form.append('name', document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo', document.getElementById('photo').files[0])
        // console.log(form);
        // form will be an object
        //  so axios request  will be working fine
        updateSettings(form, 'data')
        // const email = document.getElementById('email').value
        // const name = document.getElementById('name').value
        // updateSettings({ name, email }, 'data')
    })
}

if (userPasswordForm) {
    userPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        document.querySelector('btn--save-password').textContent = 'updating...'
        alert('password')

        const passwordCurrent = document.getElementById('password-current').value
        const password = document.getElementById('password').value
        const confirmPassword = document.getElementById('password-confirm').value
        //  updateSettings  is a async  fn so we can await it ,,so that we can do some work after that 
        await updateSettings({ passwordCurrent, password, confirmPassword }, 'password')
        //  clearing the input fields
        document.querySelector('btn--save-password').textContent = 'save password'
        document.getElementById('password-current').value = ' '
        document.getElementById('password').value = ' '
        document.getElementById('password-confirm').value = ' '
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
}