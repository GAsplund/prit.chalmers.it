# prit.chalmers.it

This is the repository for the website for the PR and student facilities committee at the IT-division at Chalmers.
It provides multiple tools for helping P.R.I.T. with their activities and gives info about the committee itself.

## Getting Started

First, start the database:

```bash
docker compose up -d
```

Then, run the development server:

```bash
pnpm dev
```

The server will automatically run database migrations upon startup. If these fail, the server will not start.

Once loaded, open [http://localhost:3000](http://localhost:3000) with your browser.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
