import { SendEmailCommandOutput } from "@aws-sdk/client-sesv2";

export interface IBaseVariables<T> {
	toEmails: string[];
	fromEmail: string;
	cc?: string[];
	bcc?: string[],
	subject: string;
	templatePath: string;
	data?: T
}

export interface IMailer {
	sendEmail<T>(data: IBaseVariables<T>): Promise<SendEmailCommandOutput>;
}

export interface ITemplatesCompiler {
	getTemplate(path: string): string;
	compileTemplate<T>(hbs: string, variables?: T): string;
	exists(path: string): boolean;
}
