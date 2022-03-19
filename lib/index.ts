import "reflect-metadata";
import { container } from "tsyringe";
import { Mailer } from "./mail-sender";
import { AwsMailerProvider } from "./mailer.provider";
import { TemplateCompiler } from "./template-compiler";

container.registerSingleton('Mailer', Mailer);
container.registerSingleton('AwsMailerProvider', AwsMailerProvider);
container.registerSingleton('TemplateCompiler', TemplateCompiler);
export const mailer = container.resolve(Mailer);

export default mailer;
