import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

export const auth = betterAuth({
	database: drizzleAdapter({} as any, { provider: 'sqlite' }),
	socialProviders: {
		google: {
			clientId: 'dummy',
			clientSecret: 'dummy'
		}
	}
});
