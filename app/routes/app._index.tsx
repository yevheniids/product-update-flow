import { type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  Text,
  BlockStack,
  InlineStack,
  Badge,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  return { shop: session.shop };
};

export default function Index() {
  const { shop } = useLoaderData<typeof loader>();

  return (
    <Page title="Flow: Product Updated Trigger">
      <Layout>
        <Layout.Section>
          <Card>
            <BlockStack gap="400">
              <InlineStack align="space-between">
                <Text variant="headingMd" as="h2">
                  Flow Trigger Status
                </Text>
                <Badge tone="success">Active</Badge>
              </InlineStack>

              <Text as="p" variant="bodyMd" tone="subdued">
                Shop: <strong>{shop}</strong>
              </Text>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">How it works</Text>
                <Text as="p" variant="bodyMd">
                  1. A <strong>products/update</strong> webhook fires when any product is updated.
                </Text>
                <Text as="p" variant="bodyMd">
                  2. The app calls <code>flowTriggerReceive</code> mutation with the product ID and tags.
                </Text>
                <Text as="p" variant="bodyMd">
                  3. Shopify Flow runs any workflows that use the <strong>"Product Updated"</strong> trigger.
                </Text>
              </BlockStack>

              <BlockStack gap="200">
                <Text variant="headingSm" as="h3">Trigger Payload</Text>
                <Text as="p" variant="bodyMd">
                  — <code>product_reference</code> — ID продукта (даёт доступ к данным продукта в Flow)
                </Text>
                <Text as="p" variant="bodyMd">
                  — <code>Tags</code> — теги продукта на момент обновления
                </Text>
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
