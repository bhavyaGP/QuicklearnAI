const axios = require('axios');
require('dotenv').config();

const sendEmail = async ({ to, subject, html }) => {
    const apikey = process.env.BROVO_API_KEY;
    const url = 'https://api.brevo.com/v3/smtp/email';
    const headers = {
        'Content-Type': 'application/json',
        'api-key': apikey,
    };
    const data = {
        sender: {
            email: 'iamquicklearn.ai@gmail.com',
            name: 'QuickLearnAI',
        },
        to: [
            {
                email: to,
            }
        ],
        subject: subject,
        htmlContent: html
    };
    try {
        const response = await axios.post(url, data, { headers });
        console.log(response.data);
        
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
    }
}

module.exports = sendEmail;