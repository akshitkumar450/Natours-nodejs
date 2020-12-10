import Axios from "axios";

const Stripe = require("stripe");

const stripe = Stripe('pk_test_51HqQTbLWvPrhtN3fShiy1rFE89lbHiy6m28h42Tor3a00w7WjtlmMojlJkjHYQw6EOiknEj5Ysr7OwyLZjKyBPPd00aYrjNbDj')
import axios from 'axios'
import { showAlert } from './alerts'

export const bookTour = async (tourId) => {
    try {
        // 1) get checkout session from api
        const session = await axios(`/api/v1/booking/checkout-session/${tourId}`)
        // const session = await axios(`http://localhost:4000/api/v1/booking/checkout-session/${tourId}`)
        // console.log(session)

        // 2) get the checkout form

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id
        })
    } catch (err) {
        console.log(err);
        showAlert('error', err)
    }
}
