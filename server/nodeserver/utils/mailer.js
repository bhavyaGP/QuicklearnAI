const sgMail = require('@sendgrid/mail');

const apiKey = process.env.SENDGRID_API_KEY;
if (!apiKey) {
    throw new Error("SENDGRID_API_KEY environment variable is not set");
}
sgMail.setApiKey(apiKey);
const sendEmail = async ({to, subject, html}) => {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_EMAIL,
            subject,
            html
        }
        
        await sgMail.send(msg);
        console.log("Email sent successfully");
    } catch (error) {
        console.log("Error sending email:", error);
    }
}
module.exports = sendEmail