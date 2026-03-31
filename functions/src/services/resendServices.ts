import { Resend } from 'resend';

export const sendDeepSeekReport = async (email: string, report: string) => {
    try {
        // Lazy-init to support Secret Manager during runtime but avoid build-time crashes 🤫
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { error } = await resend.emails.send({
            from: 'NOREDFLAGS <reports@noredflags.com>',
            to: email,
            subject: 'Signal Interpretation Report',
            text: report,
        });

        if (error) {
            console.error('Resend Error:', error);
            return false;
        }

        return true;
    } catch (err) {
        console.error('Email Dispatch Failed:', err);
        return false;
    }
};
