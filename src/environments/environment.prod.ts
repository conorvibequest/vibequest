const baseUrl = "http://localhost:8100";
export const environment = {
  production: true,
  appShellConfig: {
    debug: false,
    networkDelay: 500
  },
  oAuthConfig: {
    issuer:'https://app.vibe-quest.com/api',
    redirectUri: baseUrl,
    responseType: 'code'
  }
};
