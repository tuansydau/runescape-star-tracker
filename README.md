This is a [Next.js](https://nextjs.org) app that shows a filtered list of OSRS shooting stars from [OSRS Portal](https://osrsportal.com/shooting-stars-tracker).

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app fetches live star data through `/api/scrape`, a Next.js route that calls the OSRS Portal API directly.

## Usage

Go to your browser and navigate to `localhost:3000` to use. If you'd like to change your block list, you can change the `ignore_list` variable in backend/star-scraper.py @ line 48 and enter the locations you wouldn't like to see.
