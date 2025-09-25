import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./auth";
import { GenericCtx } from "@convex-dev/better-auth";
import { DataModel } from "./_generated/dataModel";

const http = httpRouter();

authComponent.registerRoutes(http, (ctx: GenericCtx<DataModel>) => createAuth(ctx));

export default http;
