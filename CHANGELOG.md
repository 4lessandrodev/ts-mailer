# Changelog

All notable changes to this project will be documented in this file.

Unreleased

---

1.1.7 - 2023-12-15

Changed

- Update dependencies
- aws-sdk/client-sesv2 to v3.474.0
- handlebars to 4.7.8

---

1.1.6 - 2023-01-23

Changed

- Update dependencies
- aws-sdk/client-sesv2 to v3.256.0

---

1.1.5 - 2023-01-03

Changed

- Update dependencies
- aws-sdk/client-sesv2 to v3.241.0
- tsyringe to v4.7.0

Added 

- Added license
- Added ci to check build and run tests
- Added info check on readme

---

1.1.4 - 2022-09-03

Changed

- Update dependencies
- aws-sdk/client-sesv2 to v3.171.0

---

1.1.3 - 2022-09-03

Changed

- Update dependencies
- typescript to v4.8.2
- aws sdk to v3.163.0
- tsnode to v10.9.1

---

1.1.2 - 2022-07-01

Changed

- Update docs

---

1.1.1 - 2022-06-30

Fix

- Update deps

---

1.1.0 - 2022-06-30

Added

- Implement export as class

```ts

import { SESMailer } from 'ts-mailer';

const mailer = new SESMailer();

```

---

1.0.0 - 2022-03-19

Added

- Published beta version with sendEmail function
