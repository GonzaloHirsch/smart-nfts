import AWS from 'aws-sdk';
const SES = new AWS.SES();

export const sendReminderEmail = async (recipient: string, contractId: string): Promise<boolean> => {
    const params = {
        Destination: {
            ToAddresses: [recipient]
        },
        Template: 'SmartNFTsReminderEnglish',
        TemplateData: `{ "contractid":"${contractId}" }`,
        Source: 'reminders@smart-nfts.gonzalohirsch.com'
    };

    return await SES.sendTemplatedEmail(params)
        .promise()
        .then((res: any) => {
            console.log(res);
            return true;
        });
};
