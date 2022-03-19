import '../lib/index';
import { resolve } from 'path';
import { TemplateCompiler } from '../lib/template-compiler';

describe('template-compiler', () => {
	const templateCompiler = new TemplateCompiler();

	it('should return false if template does not exists', () => {
		const path = resolve(__dirname, 'email-templates', 'INVALID_TEMPLATE_NAME.hbs');
		const exists = templateCompiler.exists(path);

		expect(exists).toBeFalsy();
	});

	it('should return true if template exists', () => {
		const path = resolve(__dirname, 'email-templates', 'FAIL_CANCELLATION.hbs');
		const exists = templateCompiler.exists(path);

		expect(exists).toBeTruthy();
	});

	it('should return a template with success', () => {
		const path = resolve(__dirname, 'email-templates', 'FAIL_CANCELLATION.hbs');
		const template = templateCompiler.getTemplate(path);

		expect(template.includes('<!DOCTYPE html>')).toBeTruthy();
	});

	it('should compile with success', () => {
		const path = resolve(__dirname, 'email-templates', 'FAIL_CANCELLATION.hbs');
		const template = templateCompiler.getTemplate(path);

		const result = templateCompiler.compileTemplate(template, {
			userName: 'user',
		});

		expect(result.includes('<div>user</div>')).toBeTruthy();
		expect(result).toMatchSnapshot();
	});
});
