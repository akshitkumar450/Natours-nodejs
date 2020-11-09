const nodemailer = require('nodemailer')

const sendEmail = async (options) => {
    // 1) create a tranporter

    const tranporter = nodemailer.createTransport({
        // by using mailtrap
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    // 2) define the email options
    const mailOptions = {
        from: 'professor <hello@jonas.io>',
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html:
    }

    // 3) actually send the email
    await tranporter.sendMail(mailOptions)
}

module.exports = sendEmail