import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#00FF9D] to-[#00FF9D]/50 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <div className="prose prose-invert prose-green max-w-none">
          <p className="text-gray-400 mb-4">Last updated on March 19th, 2024</p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction to Privacy Policy</h2>
          <p className="text-gray-400">
            This privacy policy (the "Privacy Policy") applies to your use of the website of Razorpay hosted at razorpay.com, the Services (as
            defined under the Razorpay "Terms of Use") and Razorpay applications on mobile platforms (Android, Blackberry, Windows Phone, iOS
            etc.) (collectively ("RAZORPAY" or "WEBSITE")), but does not apply to any third party websites that may be linked to them, or any
            relationships you may have with the businesses listed on Razorpay.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Information we collect and how we use it</h2>
          <p className="text-gray-400">
            We collect, receive and store your Personal Information. If you provide your third-party account credentials ("Third Party Account
            Information") to us, you understand that some content and information in those accounts may be transmitted to your account with us if
            you authorise such transmissions and that Third Party Account Information transmitted to us shall be covered by this Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Account information of Merchants</h2>
          <p className="text-gray-400">
            If you create an account to take advantage of the full range of services offered on Razorpay, we ask for and record Personal Information
            such as your name, email address and mobile number. We may collect and store your Sensitive Personal Data or Information (such as
            any financial information including inter alia credit card, debit card details, bank account and know your customer ("KYC") documents
            as per RBI regulations and any other information as may be applicable).
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Customer Information</h2>
          <p className="text-gray-400">
            We also store customer information of customers such as address, mobile number, Third Party Wallet details, Card Details and email
            address making payments through Razorpay checkouts. However, only when customer chooses to share the information on the
            businesses powered with Razorpay applications we share the information to respective businesses.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
          <p className="text-gray-400">
            We send cookies to your computer in order to uniquely identify your browser and improve the quality of our service. The term "cookies"
            refers to small pieces of information that a website sends to your computer's hard drive while you are viewing the site.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Security</h2>
          <p className="text-gray-400">
            Your account is password protected. We use industry standard measures to protect the Personal Information that is stored in our database.
            We follow industry standard best practices on Information Security, as also mentioned in our website.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
          <div className="bg-[#0C1F17] border border-[#00FF9D]/30 rounded-lg p-6 mt-4">
            <h3 className="text-xl font-semibold mb-4 text-[#00FF9D]">DPO</h3>
            <p className="text-gray-400">Mr. SHASHANK KARINCHETI</p>
            <p className="text-gray-400">Razorpay Software Private Limited</p>
            <p className="text-gray-400">Address: No. 22, 1st Floor, SJR Cyber, Laskar - Hosur Road, Adugodi, Bangalore - 560030</p>
            <p className="text-gray-400">Ph: 080-46669555</p>
            <p className="text-gray-400">E-mail: dpo@razorpay.com</p>
            <p className="text-gray-400">Grievances portal: <a href="https://razorpay.com/grievances/" className="text-[#00FF9D] hover:underline">https://razorpay.com/grievances/</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 