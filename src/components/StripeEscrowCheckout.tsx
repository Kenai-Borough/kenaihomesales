import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Shield, Clock, DollarSign } from 'lucide-react';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface StripeEscrowCheckoutProps {
  amount: number;
  itemId: string;
  itemTitle: string;
  sellerId?: string;
}

const CheckoutForm = ({ amount, itemId, itemTitle, sellerId }: StripeEscrowCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const escrowFee = amount * 0.005; // 0.5% escrow fee
  const totalAmount = amount + escrowFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent with escrow metadata
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(totalAmount * 100), // Convert to cents
          itemId,
          itemTitle,
          sellerId,
          escrowHours: 48,
          platformFee: escrowFee,
        }),
      });

      const { clientSecret } = await response.json();

      const { error: submitError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="mb-4 text-green-600">
          <Shield className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Secured!</h3>
        <p className="text-gray-600">
          Your payment is held in escrow for 48 hours. You'll receive confirmation shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Secure Escrow Protection</h4>
            <p className="text-sm text-blue-700">Your payment is held safely until you confirm receipt</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">48-Hour Hold Period</h4>
            <p className="text-sm text-blue-700">Funds released after confirmation or 48 hours</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-900">Low 0.5% Escrow Fee</h4>
            <p className="text-sm text-blue-700">Platform fee: ${escrowFee.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Item Price:</span>
          <span className="font-semibold text-gray-900">${amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Escrow Fee (0.5%):</span>
          <span className="font-semibold text-gray-900">${escrowFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg border-t pt-2">
          <span className="font-bold text-gray-900">Total:</span>
          <span className="font-bold text-gold-600">${totalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-700 mb-3">
          <strong>USDC on Base (x402) accepted</strong> - Pay with crypto for faster settlement
        </p>
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gold-600 hover:bg-gold-700 disabled:bg-gray-400 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>Processing...</>
        ) : (
          <>
            <Shield className="h-5 w-5" />
            Complete Secure Purchase
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By completing this purchase, you agree to hold funds in escrow for 48 hours.
        Seller receives payment after confirmation or automatic release.
      </p>
    </form>
  );
};

const StripeEscrowCheckout = (props: StripeEscrowCheckoutProps) => {
  const [showCheckout, setShowCheckout] = useState(false);

  if (!showCheckout) {
    return (
      <button
        onClick={() => setShowCheckout(true)}
        className="w-full bg-gold-600 hover:bg-gold-700 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
      >
        <Shield className="h-5 w-5" />
        Buy Now with Escrow
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Secure Checkout</h2>
              <p className="text-gray-600 mt-1">{props.itemTitle}</p>
            </div>
            <button
              onClick={() => setShowCheckout(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <Elements stripe={stripePromise}>
            <CheckoutForm {...props} />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default StripeEscrowCheckout;
