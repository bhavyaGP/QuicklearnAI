import React, { useState } from 'react';
import { paymentService } from '../services/api';
import { toast } from 'react-toastify';

const PaymentButton = ({ membershipType, price, name, email, contact }) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      if (!name || !email || !contact) {
        toast.error('Please ensure all user details are available');
        return;
      }

      // Load Razorpay script
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        toast.error('Failed to load Razorpay SDK');
        return;
      }

      // Create order
      console.log('Creating order with data:', {
        membershipType,
        name,
        email,
        contact
      });

      const orderData = await paymentService.createOrder({
        membershipType,
        name,
        email,
        contact
      });

      console.log('Order created:', orderData);

      if (!orderData || !orderData.id) {
        console.error('Invalid order data:', orderData);
        toast.error('Failed to create order: Invalid response from server');
        return;
      }

      // Store order details for verification
      const orderDetails = {
        membershipType,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        duration: 30, // Default duration in days
        name,
        email,
        contact
      };

      // Configure Razorpay options
      const options = {
        key: 'rzp_test_OpvAsbojSQhhkd',
        amount: orderData.amount, // Already in paise from backend
        currency: orderData.currency || 'INR',
        name: 'QuicklearnAI',
        description: orderData.description,
        order_id: orderData.id,
        handler: async function (response) {
          try {
            if (!response.razorpay_payment_id || !response.razorpay_order_id || !response.razorpay_signature) {
              toast.error('Invalid payment response');
              return;
            }

            // Verify payment with additional details
            const verificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              membership: orderDetails.membershipType,
            };
            console.log('Verification data:', verificationData);

            const result = await paymentService.verifyPayment(verificationData);
            if (result.success) {
              toast.success('Payment Successful!', {
                position: 'top-right',
                autoClose: 3000
              });
              // Optionally refresh the page or update UI to reflect new membership status
              setTimeout(() => {
                window.location.reload();
              }, 3000);
            } else {
              toast.error(result.message || 'Payment verification failed');
            }
          } catch (error) {
            console.error('Verification error:', error);
            toast.error(error.message || 'Payment verification failed');
          }
        },
        prefill: {
          name,
          email,
          contact
        },
        theme: {
          color: '#00FF9D'
        },
        modal: {
          ondismiss: function() {
            toast.info('Payment cancelled');
          }
        }
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Payment initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`w-full px-6 py-2 bg-[#00FF9D] text-black font-semibold rounded-md transition-colors ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#00FF9D]/90'
      }`}
    >
      {isLoading ? 'Processing...' : 'Buy Now'}
    </button>
  );
};

export default PaymentButton;