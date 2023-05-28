# Luna AI

An AI chat application that utilizes OpenAI's GPT-3.5 model built using the new app router, and server components in Next.js 13.

> **Warning** This app is work in progress and not meant to be a starter template. 

## About this project

This project is created with the aim of providing Lao users with access to ChatGPT features. It is also an experiment to see how modern app features like (authentication, API routes, ...etc) would work in Next.js 13 and server components. 

## Features

- New ```/app``` directory
- Routing and layouts
- Server and client components
- API routes and middleware
- ORM using Prisma
- Database using Planetscale
- Styled using Tailwind CSS
- Written in Typescript

## Getting Started

1. Install dependencies using npm:

```bash
npm install
```

2. Copy ```.env.example``` to ```.env.local``` and update the variables.

```bash
cp .env.example .env.local
```

3. Start the development server: 

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
