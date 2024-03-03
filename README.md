This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Folder structure

- /src/app/api - holds a set of API routes triggered by the client
- /src/app/[...other folders] - each subfolder is a page (page.tsx is a page declaration)
- /src/constants - holds a set of constants
- /src/entities - holds a set of entity declarations in shape of types
- /src/hooks - custom hooks sit there
- /src/mocks - holds a huge JSON file that gets modified by one of api routes (note creation)
- /src/services - holds a set of services for back-end communication
- /src/utitlites - utility functions belong in there

## Testing

Simply run `npm run test` in your terminal

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deployed app

[Link to deployed app](https://patients-demo-app.vercel.app/) - your feedback is more than welcome!
