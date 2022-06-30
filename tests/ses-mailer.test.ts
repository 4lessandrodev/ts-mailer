import { resolve } from "path";
import { SESMailer } from "../lib";

describe('SESMailer', () => {
	
	const mailer = new SESMailer();
	interface Props {
		userName: string;
	};
	const myTemplatePath = resolve(__dirname, 'email-templates', 'SUCCESS_CANCELLATION.hbs');

	jest.setTimeout(20000);
	it('should send email with success', async () => {

		const result = await mailer.sendEmail<Props>({
			fromEmail: process.env.FROM_EMAIL as string,
			subject: 'testing...😊',
			templatePath: myTemplatePath,
			toEmails: [process.env.TO_EMAIL as string],
			data: { userName: 'John Doe' }
		});

		expect(result).toBeDefined();
		expect(result.$metadata.httpStatusCode).toBe(200);
		expect(result.MessageId).toBeDefined();
	});
});
