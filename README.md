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

Search requests are loaded on the server (SSR and Server Actions). On Vercel the app automatically uses `https://swapi.dev/api`, because `swapi.py4e.com` often returns **403** from serverless IPs. Local development keeps the default `https://swapi.py4e.com/api`.

Optional override (available on the free Hobby plan too): Project → Settings → Environment Variables → add `SWAPI_BASE_URL`.

## Author

- GitHub: [bukt0r](https://github.com/bukt0r)

## Course

- [RS School React course](https://rs.school/courses/reactjs)
