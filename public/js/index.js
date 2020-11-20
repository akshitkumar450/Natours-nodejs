console.log('bundle');
import '@babel/polyfill'
import { displayMap } from './mapbox'
import { login, logout } from './login'
import { updateData } from './update'

//  DOM elements

const mapBox = document.getElementById('map')
const loginForm = document.querySelector('.form--login')
const logoutBtn = document.querySelector('.nav__el--logout')
const updateForm = document.querySelector('.form-user-data')


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
        const email = document.getElementById('email').value
        const name = document.getElementById('name').value
        updateData(name, email)
    })
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout)
}