import AWS from 'aws-sdk';
const SES = new AWS.SES({
    accessKeyId: process.env.AWS_EMAIL_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_EMAIL_SECRET_ACCESS_KEY,
    region: process.env.AWS_EMAIL_REGION
});

export const sendReminderEmail = async (recipient: string, contractId: string, language: string = 'en'): Promise<boolean> => {
    const params = {
        Destination: {
            ToAddresses: [recipient]
        },
        Template: language === 'es' ? 'SmartNFTsReminderSpanish' : 'SmartNFTsReminderEnglish',
        TemplateData: `{ "contractid":"${contractId}" }`,
        Source: `${language === 'es' ? 'Recordatorios' : 'Reminders'}@smart-nfts.gonzalohirsch.com`
    };

    return SES.sendTemplatedEmail(params)
        .promise()
        .then((res: any) => {
            console.log(res);
            return true;
        });
};
