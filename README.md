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

Search requests are loaded on the server (SSR and Server Actions). Set this environment variable in Vercel:

- `SWAPI_BASE_URL=https://swapi.dev/api`

`swapi.py4e.com` often returns **403** for requests from Vercel/AWS IPs. `swapi.dev` exposes the same API shape and works from serverless hosts. Local development can keep the default `https://swapi.py4e.com/api`.

## Author

- GitHub: [bukt0r](https://github.com/bukt0r)

## Course

- [RS School React course](https://rs.school/courses/reactjs)
