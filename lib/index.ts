import "reflect-metadata";
import { container } from "tsyringe";
import { Mailer } from "./mail-sender";
import { IBaseVariables, IMailer } from "./mailer.interface";
import { AwsMailerProvider } from "./mailer.provider";
import { TemplateCompiler } from "./template-compiler";

container.registerSingleton('Mailer', Mailer);
container.registerSingleton('AwsMailerProvider', AwsMailerProvider);
container.registerSingleton('TemplateCompiler', TemplateCompiler);
export const mailer = container.resolve(Mailer);

export class SESMailer {
	private mailer: IMailer;
	constructor() {
		this.mailer = mailer;
	}

	sendEmail<T>(data: IBaseVariables<T>) {
		return this.mailer.sendEmail(data);
	}
}

export default mailer;
