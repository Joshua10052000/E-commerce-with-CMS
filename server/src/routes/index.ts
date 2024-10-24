import { procedure, router } from "../lib/trpc.js";

type AppRouter = typeof appRouter;

const appRouter = router({
  greet: procedure.query(() => "Hello, World!"),
});

export type { AppRouter };
export default appRouter;
