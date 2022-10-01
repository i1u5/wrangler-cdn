# CF Wrangler (for [Eikon](https://github.com/i1u5/Eikon))

Proxy Imgur images using Cloudflare Workers

The parent repo works as well, this fork is merely a bunch of minor adjustments specifically for my project [Eikon](https://github.com/i1u5/Eikon).

All the credit goes to [MedzikUser](https://github.com/MedzikUser) for their wonderful work & idea.

## TL;DR
Just copy code from [this page](https://raw.githubusercontent.com/i1u5/wrangler-cdn/main/dist/worker.js) and go to [CF dashboard](https://dash.cloudflare.com/workers/overview) (Manage Workers > Create a Service > HTTP Handler > *pick a name and* **Create Service** > Quick Edit), clear all the code there, paste the one you copied then hit **Save and Deploy**, and you'll be good to go.

## Usage
```
// install wrangler globally
npm install -g wrangler

// auth with your CloudFlare account
wrangler login

// build
npm i && npm run build

// init and follow the instructions
wrangler init

// publish
wrangler publish ./dist/worker.js
```