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

When the project is started, connect it to the Shopify Flow
Example: https://admin.shopify.com/store/yevhenii-test/apps/flow/overview/019cf6fc-148f-7819-bc10-bbe279457c60