import React from 'react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/50 bg-clip-text text-transparent">
          Terms of Service
        </h1>
        <div className="prose prose-invert prose-green max-w-none">
          <p className="text-gray-400 mb-4">Last updated on March 19th, 2024</p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p className="text-gray-400">
            Welcome to QuickLearnAI. By accessing or using our website, mobile applications, and services, you agree to be bound by these Terms of Service. Please read these terms carefully before using our platform.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">2. Definitions</h2>
          <ul className="list-disc pl-6 text-gray-400 space-y-2">
            <li>"Service" refers to the QuickLearnAI platform, including all features, functionalities, and content.</li>
            <li>"User" refers to students, teachers, and any other individuals who access or use our Service.</li>
            <li>"Subscription" refers to the paid access to premium features of our Service.</li>
            <li>"Content" refers to all materials, including text, images, videos, and interactive content available on our platform.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">3. User Accounts</h2>
          <p className="text-gray-400">
            Users must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">4. Subscription Terms</h2>
          <div className="space-y-4 text-gray-400">
            <p>
              Our platform offers different subscription tiers with varying features and pricing. By purchasing a subscription, you agree to the following terms:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Subscriptions are billed on a monthly or annual basis, as per your selected plan.</li>
              <li>Subscription fees are non-refundable except as described in our Refund Policy.</li>
              <li>We reserve the right to modify subscription prices with prior notice to users.</li>
              <li>Users can cancel their subscription at any time through their account settings.</li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">5. Refund Policy</h2>
          <div className="bg-[#0C1F17] border border-[#00FF9D]/30 rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold text-[#00FF9D] mb-4">5.1 Subscription Refunds</h3>
            <div className="text-gray-400 space-y-2">
              <p><strong>Cooling-off Period:</strong> We offer a 7-day cooling-off period from the date of subscription purchase. During this period, you can request a full refund if you're not satisfied with our services.</p>
              
              <p><strong>Eligibility for Refund:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request must be made within 7 days of purchase</li>
                <li>Account must not have violated our terms of service</li>
                <li>Limited to one refund per user</li>
                <li>Usage during the cooling-off period must not exceed reasonable trial usage</li>
              </ul>

              <p><strong>Partial Refunds:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>After the cooling-off period, refunds are considered on a case-by-case basis</li>
                <li>Technical issues preventing service access may qualify for partial refunds</li>
                <li>Pro-rated refunds may be offered for annual subscriptions</li>
              </ul>

              <p><strong>Non-Refundable Cases:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Excessive usage of platform features</li>
                <li>Violation of terms of service</li>
                <li>Requests made after the cooling-off period without valid reason</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-[#00FF9D] mt-6 mb-4">5.2 Refund Process</h3>
            <div className="text-gray-400 space-y-2">
              <p><strong>How to Request a Refund:</strong></p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log in to your account</li>
                <li>Navigate to Billing & Subscriptions</li>
                <li>Click on "Request Refund"</li>
                <li>Fill out the refund request form</li>
                <li>Submit supporting documentation if required</li>
              </ol>

              <p><strong>Processing Time:</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Refund requests are processed within 5-7 business days</li>
                <li>Approved refunds may take 5-10 business days to appear in your account</li>
                <li>Refund method will match the original payment method</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">6. User Conduct</h2>
          <p className="text-gray-400">
            Users must comply with all applicable laws and regulations while using our Service. Prohibited conduct includes:
          </p>
          <ul className="list-disc pl-6 text-gray-400 space-y-2">
            <li>Sharing account credentials</li>
            <li>Unauthorized distribution of content</li>
            <li>Harassment or abuse of other users</li>
            <li>Attempting to breach platform security</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">7. Content Usage Rights</h2>
          <p className="text-gray-400">
            All content provided through our Service is protected by copyright and other intellectual property rights. Users may not reproduce, distribute, or create derivative works without explicit permission.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">8. Limitation of Liability</h2>
          <p className="text-gray-400">
            QuickLearnAI provides the Service "as is" without any warranties. We are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">9. Changes to Terms</h2>
          <p className="text-gray-400">
            We reserve the right to modify these terms at any time. Users will be notified of significant changes, and continued use of the Service constitutes acceptance of modified terms.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">10. Contact Information</h2>
          <div className="bg-[#0C1F17] border border-[#00FF9D]/30 rounded-lg p-6 mt-4">
            <p className="text-gray-400">For any questions about these Terms of Service, please contact us at:</p>
            <p className="text-gray-400 mt-2">Email: support@quicklearnai.com</p>
            <p className="text-gray-400">Phone: +1 (555) 123-4567</p>
            <p className="text-gray-400">Address: [Your Company Address]</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 