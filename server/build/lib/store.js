import { Store } from "express-session";
import db from "./db.js";
class SessionStore extends Store {
    #cookie;
    #expires;
    constructor() {
        super();
        this.#cookie = { originalMaxAge: 1000 * 60 * 60 * 24 * 7 };
        this.#expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
    }
    get(sid, callback) {
        db.session
            .findUnique({ where: { sid } })
            .then((session) => {
            if (!session) {
                return callback(new Error("Session not found."), null);
            }
            if (session.expiresAt <= new Date()) {
                db.session
                    .delete({ where: { sid } })
                    .then(() => callback(new Error("Session expired."), null))
                    .catch((error) => callback(error, null));
            }
            db.user
                .findUnique({ where: { id: session.userId } })
                .then((foundUser) => {
                if (!foundUser)
                    return callback(new Error("User not found."), null);
                const { password, ...user } = foundUser;
                return callback(null, {
                    cookie: this.#cookie,
                    user,
                    userId: user.id,
                });
            })
                .catch((error) => callback(error, null));
        })
            .catch((error) => callback(error, null));
    }
    set(sid, session, callback) {
        db.session
            .upsert({
            where: { sid },
            update: { expiresAt: this.#expires },
            create: {
                sid,
                expiresAt: this.#expires,
                userId: session.userId,
            },
        })
            .then(() => {
            callback?.(null);
        })
            .catch((error) => {
            console.log(`Error setting session in database. ${error}`);
            return callback?.(error);
        });
    }
    destroy(sid, callback) {
        db.session
            .delete({ where: { sid } })
            .then(() => callback?.(null))
            .catch((error) => callback?.(error));
    }
}
const store = new SessionStore();
export default store;
