import { NotAuthorized } from 'lib/error';
import passport from 'passport';
import PassportJwt, { StrategyOptions } from 'passport-jwt';
import VerificationTokenRepository from 'repository/verificationToken';
import VerificationService from 'service/verificationToken';
import Config from 'utils/config';

const opts: StrategyOptions = {
    jwtFromRequest: PassportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: Config.getEnv('ACCESS_TOKEN_KEY'),
};

export default passport.use(
    new PassportJwt.Strategy(opts, async (jwt_payload, done) => {
        try {
            const verificationTokenService = new VerificationService(
                new VerificationTokenRepository(),
            );
            const verificationToken =
                await verificationTokenService.getByIdentifier(jwt_payload.id);
            if (!verificationToken) {
                throw new NotAuthorized();
            }
            return done(null, jwt_payload.id);
        } catch (error) {
            const err = new NotAuthorized();
            return done(err, false);
        }
    }),
);
