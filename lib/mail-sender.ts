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
		if (!validRegions.includes(`${region}`)) throw new Error(`Invalid aws region: ${region} on environment`);
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
	 *    toEmails: [ 'destination@domain.com' ],
	 *    data: { userName: 'John Doe' },
	 *    bcc: [ 'financial@domain.com' ],
	 *    cc: [ 'my-email@domain.com' ]
	 * }
	 * @returns `{ $metadata, MessageId }`
	 * @example
	 * `
	 *  "$metadata": {
	 *    "httpStatusCode": 200,
     *     "requestId": "e6c808b4-4246-43a5-908d-bfb2d42b5de0",
     *     "attempts": 1,
     *     "totalRetryDelay": 0 
	 *   }
	 *   "MessageId": "0100017fa29f0e77-d32250df-e245-4bbc-b7f3-9d56a0a214ae-000000"
	 * `
	 * 
	 * @augments data the values refer to what is being applied in the template
	 * @example 
	 * // on template you can access data as example
	 * `
	 * <h1>{{ userName }}</h1>
	 * `
	 */
	async sendEmail<T>(params: IBaseVariables<T>): Promise<SendEmailCommandOutput> {
		const templateExists = this.templateCompiler.exists(params.templatePath);

		if (!templateExists) throw new Error(`Template not found on path: ${params.templatePath}`);

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
