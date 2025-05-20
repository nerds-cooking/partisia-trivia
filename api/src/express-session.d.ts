import 'express-session';

declare module 'express-session' {
  type SessionUser = {
    id: string;
    address: string;
  };

  interface SessionData {
    user?: SessionUser;
  }
}
