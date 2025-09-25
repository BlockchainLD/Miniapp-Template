import { createApi } from "@convex-dev/better-auth";
import schema from "./schema";
import { createAuth } from "../auth";
import { query, mutation } from "./_generated/server";
import { GenericCtx } from "@convex-dev/better-auth";
import { DataModel } from "../_generated/dataModel";

export const {
  create,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} = createApi(schema, (ctx: GenericCtx<DataModel>) => createAuth(ctx));
