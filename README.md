# ts-mailer

## send email using hbs template

installation

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

```ts

import { mailer } from 'ts-mailer';

```

### Send an email

```ts

const templatePath = resolve(__dirname, 'templates', 'my-template.hbs');

const result = await mailer.sendEmail({
	fromEmail: 'my-email@domain.com',
	subject: 'some subject',
	templatePath: resolve(__dirname, 'templates', 'my-template.hbs'),
	toEmails: ['destination@domain.com'],
	data: { userName: 'John Doe' },
	bcc: ['financial@domain.com'],
	cc: []
});

```
