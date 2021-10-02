export function sendSMS(phoneNumber, message) {
    return new Promise((resolve) => {
        console.log(`send sms to: ${phoneNumber}\n\"${message}\"`)
        resolve();
    })
}