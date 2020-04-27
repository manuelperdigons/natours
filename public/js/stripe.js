import axios from 'axios';
import { showAlert } from './alert';
// import Stripe from 'stripe';

export const bookTour = async tourId => {
  try {
    const stripe = Stripe('pk_test_IgmkgOSfsSiPhmfRbJUwAhHQ00oBhKtzLy');
    // 1) Get Checkout Session from endpoint (router)
    const session = await axios({
      url: `/api/v1/bookings/checkout-session/${tourId}`
    });
    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
