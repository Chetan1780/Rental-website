const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY+"");

class PaymentService {
  /**
   * Create a payment intent with INR currency.
   * @param {number} amount - Amount in paise (smallest currency unit, 1 INR = 100 paise).
   * @param {string} currency - Currency code, defaults to INR.
   */
  static async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });
      return paymentIntent;
    } catch (error) {
      throw new Error('Payment processing failed: ' + error.message);
    }
  }

  /**
   * Process a refund for a given payment intent ID.
   * @param {string} paymentIntentId - ID of the payment intent to refund.
   */
  static async processRefund(paymentIntentId) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
      });
      return refund;
    } catch (error) {
      throw new Error('Refund processing failed: ' + error.message);
    }
  }
}

module.exports = PaymentService;
