import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";
import http from "./http";

const app = defineApp();
app.use(betterAuth);
app.use(http);

export default app;
