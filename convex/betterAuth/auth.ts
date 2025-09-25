import { createAuth } from '../auth'
import { getStaticAuth } from '@convex-dev/better-auth'
import { GenericCtx } from "@convex-dev/better-auth";
import { DataModel } from "../_generated/dataModel";

export const auth = getStaticAuth((ctx: GenericCtx<DataModel>) => createAuth(ctx))
