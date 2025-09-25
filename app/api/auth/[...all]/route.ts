import { nextJsHandler } from "@convex-dev/better-auth/nextjs";
import { authComponent } from "../../../../convex/auth";

export const { GET, POST } = nextJsHandler(authComponent);
