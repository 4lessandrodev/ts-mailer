# ts-mailer

This lib provide a class and function as singleton instance to compile a hbs template adding data and send it as an email using aws-ses.
## Send email using hbs template and aws-ses

### Remember to configure your aws-ses

Access you aws account and set your [aws-ses](https://aws.amazon.com/ses/?nc2=type_a)

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

```html

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>my-template</title>
</head>
<body>
    <!-- data will apply this attribute --->
    <h1>{{ userName }}</h1>
</body>
</html>


```

### Import lib

The lib provide a singleton instance fo all your application as function or class

Example how to import it as Class

```ts

import { SESMailer } from 'ts-mailer';

const sesMailer = new SESMailer();

const result = await sesMailer.sendEmail({ ... });

```

Example how to import it as function

```ts

import { mailer } from 'ts-mailer';

```

### Sending an email

The mailer imported already is a singleton instance. you do not need to instantiate it.

```ts

import { resolve } from 'path';

const result = await mailer.sendEmail({
	fromEmail: 'my-email@domain.com',
	subject: 'some subject',
	templatePath: resolve(__dirname, 'templates', 'my-template.hbs'),
	toEmails: ['destination@domain.com'],
	data: { userName: 'John Doe' },
	bcc: ['financial@domain.com'],
	cc: ['my-email@domain.com']
});

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

- `fromEmail`: email address origin (email you set on your aws-ses)
- `subject`: email subject
- `templatePath`: the dir path to get your hbs template
- `toEmails`: emails recipients
- `data`: attributes value to handled and apply on your hbs template
- `bcc`: emails recipients to receive as blind carbon copy
- `cc`: emails recipients to send a visible copy

### Generic Types 

You can define interfaces to your template data. Generic types.

```ts

interface TemplateData {
	userName: string
	url: string
}

```

So you can provide your interface on call `sendEmail` function.
Now the data attributes will be typed

```ts

await mailer.sendEmail<TemplateData>({ ...params, data: { url, userName } });

```
