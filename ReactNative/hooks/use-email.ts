import * as MailComposer from 'expo-mail-composer';


export const useEmail = () => {
    const sendEmail = async (recEmails: string[], subject: string, body: string) => {
        const isAvailable = await MailComposer.isAvailableAsync();

        if (isAvailable) {
            MailComposer.composeAsync({
                recipients: recEmails, // The email address you want to send to
                subject: subject,
                body: body,
                // You can also add attachments if necessary
            })
                .then(result => {
                    console.log(result.status); // Sent, saved, or cancelled
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            // Inform the user that they can't send emails on their device
            console.log("Email is not setup on device");
        }
    };

    const sendDevInquiry = async () => {
        sendEmail(['mike@amaruq.ch'], 'Poseify Mobile - Inquiry', 'Write your message here...')
    }

    return { sendEmail, sendDevInquiry }
}