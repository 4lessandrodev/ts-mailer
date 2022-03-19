import { existsSync, readFileSync } from 'fs';
import Handlebars from 'handlebars';
import { singleton } from 'tsyringe';

import { ITemplatesCompiler } from './mailer.interface';

@singleton()
export class TemplateCompiler implements ITemplatesCompiler {
	compileTemplate<T>(hbs: string, variable: T): string {
		const handlebar = Handlebars.create();
		const template = handlebar.compile(hbs);
		return template({ ...variable });
	}

	exists(path: string): boolean {
		return existsSync(path);
	}

	getTemplate(path: string): string {
		return readFileSync(path, 'utf-8');
	}
}

export default TemplateCompiler;
