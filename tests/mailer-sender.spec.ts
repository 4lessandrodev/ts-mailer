import '../lib/index';
import { SESv2Client } from '@aws-sdk/client-sesv2';
import { resolve } from 'path';

import { Mailer } from '../lib/mail-sender';
import { ITemplatesCompiler } from '../lib/mailer.interface';
import { IAwsMailerProvider } from '../lib/mailer.provider';

describe('mailer-sender', () => {
	const awsClient: SESv2Client = {
		send: jest.fn(),
	} as unknown as SESv2Client;

	const awsMailerMock: IAwsMailerProvider = {
		init: () => awsClient,
	};

	const templateCompilerMock: ITemplatesCompiler = {
		compileTemplate: jest.fn(),
		exists: jest.fn(),
		getTemplate: jest.fn(),
	};

	const mailer = new Mailer(awsMailerMock, templateCompilerMock);

	it('should send email with success', async () => {
		jest.spyOn(templateCompilerMock, 'exists').mockReturnValueOnce(true);
		jest
			.spyOn(templateCompilerMock, 'getTemplate')
			.mockReturnValueOnce(
				'<!DOCTYPE html><html><body><h1>{{ userName }}</h1><body/></html>',
			);
		jest
			.spyOn(templateCompilerMock, 'compileTemplate')
			.mockReturnValueOnce(
				'<!DOCTYPE html><html><body><h1>John</h1><body/></html>',
			);

		const clientSpy = jest.spyOn(awsClient, 'send');

		await mailer.sendEmail({
			cc: ['valid_cc_email@domain.com'],
			data: {
				userName: 'John',
			},
			fromEmail: 'valid_from_email@domain.com',
			subject: 'valid_subject',
			templatePath: resolve(__dirname, 'email-templates', 'SUCCESS_CANCELLATION.hbs'),
			toEmails: ['valid_to_email@domain.com'],
		});

		expect(clientSpy).toHaveBeenCalled();
		clientSpy.mockClear();	
	});

	it('should not call send email if template does not exists', async () => {
		const templatePath = resolve(__dirname, 'email-templates', 'SUCCESS_CANCELLATION.hbs');
		const clientSpy = jest.spyOn(awsClient, 'send');
		jest.spyOn(templateCompilerMock, 'exists').mockReturnValueOnce(false);
		try {

			expect.assertions(2);


			await mailer.sendEmail({
				cc: ['valid_cc_email@domain.com'],
				data: {
					userName: 'John',
				},
				fromEmail: 'valid_from_email@domain.com',
				subject: 'valid_subject',
				templatePath: templatePath,
				toEmails: ['valid_to_email@domain.com'],
			});

		
		} catch (error: any) {
			expect(clientSpy).not.toHaveBeenCalled();
			expect(error.message).toBe(`Template not found on path: ${templatePath}`);
			clientSpy.mockClear();
		}
	});
});
