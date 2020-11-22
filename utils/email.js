const nodemailer = require('nodemailer')
const pug = require('pug')
// this is used to convert html to text
const htmlToText = require('html-to-text')


class Email {
    constructor(user, url) {
        this.to = user.email,
            this.firstName = user.name.split(' ')[0],
            this.url = url,
            this.from = `professor <${process.env.EMAIL_FROM}>`
    }

    // used for sending emails in both dev and prod environent
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // sendgrid
            return 1
        }
        return nodemailer.createTransport({
            // by using mailtrap
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        })
    }

    // send the actual email
    // using this we can send differnt mail for different
    async send(template, subject) {
        // 1) render HTML based on pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        })

        // 2) define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html: html,
            //  we should also send simple text to emails
            text: htmlToText.fromString(html)
        }
        // 3) create a tranport and send email
        await this.newTransport().sendMail(mailOptions)

    }

    async sendWelcome() {
        await this.send('welcome', 'welcome to natours ')
    }
}

const sendEmail = async (options) => {
    // 1) create a tranporter

    // const tranporter = nodemailer.createTransport({
    //     // by using mailtrap
    //     host: process.env.EMAIL_HOST,
    //     port: process.env.EMAIL_PORT,
    //     auth: {
    //         user: process.env.EMAIL_USERNAME,
    //         pass: process.env.EMAIL_PASSWORD
    //     }
    // })

    // 2) define the email options
    // const mailOptions = {
    //     from: 'professor <hello@jonas.io>',
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message,
    //     // html:
    // }

    // 3) actually send the email
    // await tranporter.sendMail(mailOptions)
}

module.exports = Email