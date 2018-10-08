import * as passport from 'passport';
import { Strategy as LocalStrategy} from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import * as Drivers from '../cassandra/drivers';
import { Request, Response, Next } from 'restify';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: 'secret',
  issuer: 'accounts.mooving.io',
  audience: 'mooving.io',
};

export interface IRequestWithAuthentication extends Request {
  user: string;
  /**
   * Check passport.js authentication
   */
  isAuthenticated(): boolean;
  login(driver: Drivers.IDriver, callback: (err: Error) => void): void;
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

export function generateSignedToken(driver: Drivers.IDriver) {
  const payload = {
    id: driver.id,
    // email: driver.email,
  };
  return jwt.sign(payload, jwtOptions.secretOrKey);
}

/**
 * Sign in using Email and Password.
 */
// passport.use( new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
//   try {
//     const driver = await Drivers.findByEmail(email.toLowerCase());
//     comparePassword(password, (err: Error, isMatch: boolean) => {
//       if (err) { return done(err); }
//       if (isMatch) {
//         return done(undefined, driver);
//       }
//       return done(undefined, false, { message: 'Invalid email or password.' });
//     });
//   } catch (err) {
//     return done(err, false, { message: `Email ${email} not found.` });
//   }
// }));

/**
 * Login Required middleware.
 */
export function isAuthenticated(request: IRequestWithAuthentication, response: Response, next: Next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.send(401, 'User id is not logged in.');
}

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  try {
    const driver = Drivers.findById(jwtPayload.sub);
    if (driver) {
      return done(null, driver);
    } else {
      return done(null, false);
       // or you could create a new account
    }
  } catch (err) {
    return done(err);
  }
    // User.findOne({id: jwt_payload.sub}, function(err, user) {
    //     if (err) {
    //         return done(err, false);
    //     }
    //     if (user) {
    //         return done(null, user);
    //     } else {
    //         return done(null, false);
    //         // or you could create a new account
    //     }
    // });
}));
