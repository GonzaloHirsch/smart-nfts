import axios, { AxiosInstance } from 'axios';
import qs from 'qs';

class RecaptchaVerificationService {
    private static instance: RecaptchaVerificationService;
    private static client: AxiosInstance;

    static getInstance = () => {
        if (!RecaptchaVerificationService.instance) {
            RecaptchaVerificationService.instance = new RecaptchaVerificationService();
            RecaptchaVerificationService.createClient();
        }
        return RecaptchaVerificationService.instance;
    };

    static createClient = () => {
        RecaptchaVerificationService.client = axios.create({
            baseURL: 'https://www.google.com/recaptcha/api/',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });
    };

    public verifyToken = async (token: string) => {
        return RecaptchaVerificationService.client
            .post(
                'siteverify',
                qs.stringify({
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: token
                })
            )
            .then((res) => {
                // Always log response for record keeping
                console.log(res.data)
                return {
                    success: res.data.success && res.data.score > 0.5,
                    timestamp: res.data.challenge_ts,
                    action: res.data.action
                }
            });
    };
}

export default RecaptchaVerificationService;
