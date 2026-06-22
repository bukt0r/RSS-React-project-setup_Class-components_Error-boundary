# RS React Course — Next.js SSR

Training project for [**The Rolling Scopes School**](https://rs.school/) React course.

## About

Migration of the SWAPI search application from Vite + React Router to **Next.js App Router** with server components, server actions, and internationalization.

## Scripts

- `npm run dev` — start Next.js dev server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run test` — Vitest (legacy modules during migration)

## Deployment

- Production: https://rss-react-seven.vercel.app/?page=1
- Platform: Vercel

Search requests are server-rendered on first load (SSR) and then loaded in the browser for pagination and new searches. This avoids Vercel serverless blocks from `swapi.py4e.com` while keeping SSR for local development.

## Author

- GitHub: [bukt0r](https://github.com/bukt0r)

## Course

- [RS School React course](https://rs.school/courses/reactjs)
