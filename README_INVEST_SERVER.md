Cpace Investor Application Server
================================

This Node server accepts investor applications from `invest.html`, stores them to `data/investments.json`, saves uploaded PDFs to `uploads/`, and sends notification + confirmation emails via SendGrid.

Setup
-----

1. Install dependencies:

```bash
npm install
```

2. Environment variables (recommended):

- `SENDGRID_API_KEY` — your SendGrid API key
- `FROM_EMAIL` — sender e-mail (e.g. no-reply@cpace.cloud)
- `TO_EMAIL` — recipient e-mail for notifications (e.g. invest@cpace.cloud)
- `PORT` — (optional) port to run the server (default 3000)

3. Run server:

```bash
npm start
```

Notes
-----
- The form on `invest.html` posts to `/api/invest`. If you deploy the static site separately, ensure the server is reachable and update the form `action` accordingly.
- Uploaded PDFs are stored in `uploads/` and form records are appended to `data/investments.json`.
- The server will attempt to send emails only when `SENDGRID_API_KEY` is set.

Security
--------
- For production, host behind HTTPS and secure the server. Limit access to uploaded files and rotate SendGrid keys.
