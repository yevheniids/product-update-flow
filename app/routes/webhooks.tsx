import { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

const FLOW_TRIGGER_RECEIVE = `#graphql
  mutation FlowTriggerReceive($handle: String!, $payload: JSON!) {
    flowTriggerReceive(handle: $handle, payload: $payload) {
      userErrors {
        field
        message
      }
    }
  }
`;

export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("[Webhook] Action called:", request.method, request.url);
  let topic: string, shop: string, admin: any, payload: any;
  try {
    ({ topic, shop, admin, payload } = await authenticate.webhook(request));
  } catch (e) {
    console.error("[Webhook] authenticate.webhook failed:", e);
    return new Response("Webhook auth failed", { status: 200 });
  }

  console.log(`[Webhook] Received: ${topic} from ${shop}`);

  switch (topic) {
    case "PRODUCTS_UPDATE": {
      const product = payload as {
        id: number;
        tags: string;
      };

      console.log(
        `[Flow Trigger] Firing for product ID: ${product.id}, tags: "${product.tags}"`
      );

      if (!admin) {
        console.error("[Flow Trigger] No admin client available");
        return new Response(null, { status: 200 });
      }

      const response = await admin.graphql(FLOW_TRIGGER_RECEIVE, {
        variables: {
          handle: "product-updated",
          payload: {
            product_id: product.id,
            Tags: product.tags || "",
          },
        },
      });

      const data = await response.json();
      const userErrors = data.data?.flowTriggerReceive?.userErrors ?? [];

      if (userErrors.length > 0) {
        console.error("[Flow Trigger] userErrors:", userErrors);
      } else {
        console.log(
          `[Flow Trigger] Successfully fired for product ${product.id}`
        );
      }

      return new Response(null, { status: 200 });
    }

    default:
      return new Response("Unhandled webhook topic", { status: 404 });
  }
};
