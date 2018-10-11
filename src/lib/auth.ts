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
  // issuer: 'accounts.mooving.io',
  // audience: 'mooving.io',
};

export interface IRequestWithAuthentication extends Request {
  user: any;
}

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user.id);
});

passport.deserializeUser((id: string, done) => {
  try {
    const driver = { id };
    done(undefined, driver);
  } catch (err) {
    done(err, undefined);
  }
});

export function generateSignedToken(driver: Drivers.IDriver) {
  const payload = {
    id: driver.id,
    // email: driver.email,
  };
  return jwt.sign(payload, jwtOptions.secretOrKey);
}

passport.use('jwt', new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  try {
    // const driver = Drivers.findById(jwtPayload.id);
    if (jwtPayload.id) {
      return done(null, { id: jwtPayload.id });
    } else {
      return done(null, false);
       // or you could create a new account
    }
  } catch (err) {
    return done(err);
  }
}));
