import { createApi } from "@convex-dev/better-auth";
import schema from "./schema";
import { createAuth } from "../auth";
import { query, mutation } from "./_generated/server";

export const {
  create,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} = createApi(schema, (ctx) => createAuth(ctx));
