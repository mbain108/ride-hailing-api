import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as bcrypt from 'bcrypt';

import * as Drivers from '../cassandra/drivers';
import { Request, Response, Next } from 'restify';

export interface IRequestWithAuthentication extends Request {
  /**
   * Check passport.js authentication
   */
  isAuthenticated(): boolean;
}

export function comparePassword(candidatePassword: any, callback: any) {
  bcrypt.compare(candidatePassword, this.password, (err: any, isMatch: boolean) => {
    callback(err, isMatch);
  });
}

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const driver = await Drivers.findById(id);
    done(undefined, driver);
  } catch (err) {
    done(err, undefined);
  }
});

/**
 * Sign in using Email and Password.
 */
passport.use('local', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const driver = await Drivers.findByEmail(email.toLowerCase());
    comparePassword(password, (err: Error, isMatch: boolean) => {
      if (err) { return done(err); }
      if (isMatch) {
        return done(undefined, driver);
      }
      return done(undefined, false, { message: 'Invalid email or password.' });
    });
  } catch (err) {
    return done(undefined, false, { message: `Email ${email} not found.` });
  }
}));

/**
 * Login Required middleware.
 */
export let isAuthenticated = (req: IRequestWithAuthentication, res: Response, next: Next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login', next);
};
