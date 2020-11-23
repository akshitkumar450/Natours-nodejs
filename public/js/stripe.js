import Axios from "axios";

const Stripe = require("stripe");

const stripe = Stripe('pk_test_51HqQafIUdPPJZ9VIe0c4Mk7c3dTkhyyDJJ1DsJaqG9GqJkSx7qhhsvzuF1PW3ignauoPBS52rVJWGnK2dHq1vYyr00RrYT5bPP')
import axios from 'axios'
import { showAlert } from './alerts'

export const bookTour = async (tourId) => {
    try {
        // 1) get checkout session from api
        const session = await axios(`http://localhost:4000/api/v1/booking/checkout-session/${tourId}`)
        console.log(session)

        // 2) get the checkout form

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        console.log(err);
        showAlert('error', err)
    }
}
