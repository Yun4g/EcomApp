import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";

import { checkGoogleExistingUserRepo, GoogleCreateUserRepo } from "../repository/auth.repository";




passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: "/api/google/callback",
        },
        async (_accessToken, _refreshToken, profile: Profile, done) => {
            if (!profile.emails?.[0]?.value) {
                return done(new Error("No email found in Google profile"));
            }

            const email = profile.emails?.[0]?.value

            const checkExistingUser = await checkGoogleExistingUserRepo(email, profile.id)
            if (checkExistingUser) {
                return done(null, checkExistingUser.rows[0]);
            } 


            const CreateNewUser = await GoogleCreateUserRepo(profile.displayName, email, profile.id)
 

            return done(null, CreateNewUser );

           
        }
    )
);

passport.serializeUser((user: any, done) => {
    done(null, user);
});


passport.deserializeUser((obj, done) => {
    done(null, obj as Express.User);
});