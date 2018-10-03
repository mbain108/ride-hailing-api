import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

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

passport.use('local.signup', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    try {
      const driver = await Drivers.findByEmail(email.toLowerCase());
      if (driver) {
        return done(null, false, { message: `User registration failed.` });
      }
      return done(null, { email, password });
    } catch (err) {
      return done(err);
    }
  }),
);

/**
 * Sign in using Email and Password.
 */
passport.use('local.signin', new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
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
    return done(err, false, { message: `Email ${email} not found.` });
  }
}));

/**
 * Login Required middleware.
 */
export function isAuthenticated(request: IRequestWithAuthentication, response: Response, next: Next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect('/login', next);
}
