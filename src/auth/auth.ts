import { betterAuth } from 'better-auth';
import { genericOAuth } from 'better-auth/plugins';

export const auth = betterAuth({
  // ... other config options
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: 'gamma',
          clientId: process.env.GAMMA_CLIENT_ID ?? '',
          clientSecret: process.env.GAMMA_CLIENT_SECRET ?? '',
          discoveryUrl:
            process.env.GAMMA_ROOT_URL + '/.well-known/openid-configuration',
          scopes: ['openid', 'profile'],
          mapProfileToUser: async (profile) => {
            return {
              email: profile.id + '@chalmers-fake.it'
            };
          }
        }
      ]
    })
  ]
});
