# ts-mailer

## send email using hbs template and aws-ses

### Remember to configure your aws-ses

Access you aws account and set you [aws-ses](https://aws.amazon.com/ses/?nc2=type_a)

Tutorial step by step [Here](https://www.replyup.com/blog/amazon-ses-tutorial/)

### Installation

```sh

$ npm install ts-mailer

# OR 

$ yarn add ts-mailer

```

### Variables on your .env

```env

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_MAILER_REGION=

```

### Create your hbs template 

You can define attributes using double key as example below. [Documentation](https://handlebarsjs.com/guide/)

You can preview your template using vscode extension [Here](https://marketplace.visualstudio.com/items?itemName=greenbyte.handlebars-preview)

```hbs

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>my-template</title>
</head>
<body>
    <div>{{ userName }}</div>
</body>
</html>


```

### Import lib

The lib provide an singleton instance as function or as a class

import as Class

```ts

import { SESMailer } from 'ts-mailer';

{

	const sesMailer = new SESMailer();

	const result = await sesMailer.sendEmail({ ... });

}

```

import as function

```ts

import { mailer } from 'ts-mailer';

```

### Send an email

The mailer imported already is a singleton instance. you do not need to instantiate it.

```ts
{
	const result = await mailer.sendEmail({
		fromEmail: 'my-email@domain.com',
		subject: 'some subject',
		templatePath: resolve(__dirname, 'templates', 'my-template.hbs'),
		toEmails: ['destination@domain.com'],
		data: { userName: 'John Doe' },
		bcc: ['financial@domain.com'],
		cc: ['my-email@domain.com']
	});
}
```

### Payload

```ts

console.log(result);

`
"$metadata": {
  "httpStatusCode": 200,
  "requestId": "e6c808b4-4246-43a5-908d-bfb2d42b5de0",
  "attempts": 1,
  "totalRetryDelay": 0
}
"MessageId": "0100017fa29f0e77-d32250df-e245-4bbc-b7f3-9d56a0a214ae-000000"
`
```
### Summary

- `fromEmail`: email address origin
- `subject`: email subject
- `templatePath`: the path to hbs template
- `toEmails`: destination emails
- `data`: attributes to be handled on template
- `bcc`: destination address to send email as blind carbon copy
- `cc`: destination address to send a visible copy

### Generic Types 

You can define interfaces to your template data

```ts

interface TemplateData {
	name: string
	url: string
}

```

So you can provide your interface on call sendEmail function.
Now the data attributes will be typed

```ts

await mailer.sendEmail<TemplateData>({ ...params, data: { url, name } });

```
