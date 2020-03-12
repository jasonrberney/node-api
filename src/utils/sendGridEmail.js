const sgMail = require('@sendgrid/mail');

sendEmail = (emailConfig) => {
    return new Promise((resovle, reject) => {
        try {
            
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
            const msg = {
                to: emailConfig.recipients,
                from: emailConfig.fromAddress,
                subject: emailConfig.subject,
                //text: emailConfig.text,
                html: emailConfig.html
            };
            
            sgMail.send(msg);
    
            resovle({ success: true });
        }
        catch(err){
            console.log(err);
            reject({ success: false });
        }
    })
}

module.exports = {
    sendEmail
};