import { SendEmailCommand, SendEmailCommandOutput, SESv2Client } from '@aws-sdk/client-sesv2';
import { inject, singleton } from 'tsyringe';

import { IBaseVariables, IMailer, ITemplatesCompiler } from './mailer.interface';
import { IAwsMailerProvider, validRegions } from './mailer.provider';

@singleton()
export class Mailer implements IMailer {
	private readonly client: SESv2Client;
	constructor(
		@inject('AwsMailerProvider')
		awsMailer: IAwsMailerProvider,

		@inject('TemplateCompiler')
		private readonly templateCompiler: ITemplatesCompiler,
	) {
		const region = process.env.AWS_MAILER_REGION ?? process.env.AWS_DEFAULT_REGION;
		if (!validRegions.includes(`${region}`)) throw new Error("invalid aws region");
		this.client = awsMailer.init({ region });
	}

	/**
	 * @description singleton client instance to send emails by aws ses
	 * @param params as Object
	 * @example 
	 * {
	 *    fromEmail: 'my-email@domain.com',
	 *    subject: 'some subject',
	 *    templatePath: resolve(__dirname, 'templates', 'my-template.hbs'),
	 *    toEmails: ['destination@domain.com'],
	 *    data: { userName: 'John Doe' },
	 *    bcc: ['financial@domain.com'],
	 *    cc: []
	 * }
	 * @returns `{ $metadata, requestId }`
	 * 
	 * @augments data the values refer to what is being applied in the template
	 * @example 
	 * // on template access
	 * `
	 * <h1>{{ data.userName }}</h1>
	 * `
	 */
	async sendEmail<T>(params: IBaseVariables<T>): Promise<SendEmailCommandOutput> {
		const templateExists = this.templateCompiler.exists(params.templatePath);

		if (!templateExists) throw new Error('template not found');

		const template = this.templateCompiler.getTemplate(params.templatePath);

		const htmlWithData = this.templateCompiler.compileTemplate(template, params.data);

		const command = new SendEmailCommand({
			Destination: {
				ToAddresses: params.toEmails,
				CcAddresses: params.cc,
				BccAddresses: params.bcc,
			},
			Content: {
				Simple: {
					Body: {
						Html: {
							Data: htmlWithData,
							Charset: 'utf-8',
						},
						Text: {
							Data: JSON.stringify(params.data),
							Charset: 'utf-8',
						},
					},
					Subject: {
						Data: params.subject,
						Charset: 'utf-8',
					},
				},
			},
			FromEmailAddress: params.fromEmail,
		});

		return this.client.send(command);
	}
}
