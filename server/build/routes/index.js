import { privateProcedure, procedure, router } from "../lib/trpc.js";
import authRouter from "./auth.js";
const appRouter = router({
    auth: authRouter,
    greet: procedure.query(({}) => {
        return "Hello, World!";
    }),
    protected: privateProcedure.query(() => "Hello, World!"),
});
export default appRouter;