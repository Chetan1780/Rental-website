import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { 
  Elements, 
  CardElement, 
  useStripe, 
  useElements 
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
// Load Stripe outside of components to avoid recreating the Stripe object
const stripePromise = loadStripe(import.meta.env.STRIPE_PUBLISHABLE_KEY+"");

const StripePaymentForm = ({ booking, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      return;
    }

    setIsProcessing(true);

    try {
      // Confirm the payment on the client
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        booking.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: 'Customer Name' // You can add more details
            }
          }
        }
      );

      if (error) {
        // Show error to your customer
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive'
        });
        setIsProcessing(false);
        return;
      }

      // Confirm booking on backend
      const confirmResponse = await fetch('/api/bookings/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          bookingId: booking._id,
          paymentMethodId: paymentIntent.payment_method
        })
      });

      const confirmResult = await confirmResponse.json();

      if (confirmResponse.ok) {
        toast({
          title: 'Booking Confirmed',
          description: 'Your booking has been successfully confirmed.'
        });
        onPaymentSuccess(confirmResult.booking);
      } else {
        throw new Error(confirmResult.message);
      }
    } catch (error) {
      toast({
        title: 'Booking Confirmation Failed',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border p-4 rounded">
        <CardElement 
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      <div className="text-xl font-bold">
        Total to Pay: ${booking.totalPrice}
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};

// Wrapper component to provide Stripe context
const BookingPaymentForm = ({ booking, onPaymentSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      {console.log(booking)}
      <StripePaymentForm 
        booking={booking} 
        onPaymentSuccess={onPaymentSuccess} 
      />
    </Elements>
  );
};

export default BookingPaymentForm;