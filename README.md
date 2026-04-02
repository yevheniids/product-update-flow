# DTP Product Tag Script

Shopify Remix app with a custom Flow trigger that fires on `products/update` webhook. Passes `product_reference` and `Tags` into Flow for automation.

## Setup

```bash
cp .env.example .env   # fill in API credentials
npm install
npx prisma migrate dev --name init
npm run dev             # start dev server
shopify app deploy      # deploy Flow trigger extension
```
