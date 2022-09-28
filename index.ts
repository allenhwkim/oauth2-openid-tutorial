import express from 'express';
import session from 'express-session';
import crypto from 'crypto';
import { Issuer, generators, TokenSet } from 'openid-client';

declare module 'express-session' {
  export interface SessionData {
    tokenSet: TokenSet;
    state: string;
    codeVerifier: string;
    originalUrl: string;
  }
}

const config = require('./config.json');

const app: express.Express = express();

const issuer = new Issuer({
  issuer: 'https://twitter.com',
  authorization_endpoint: 'https://twitter.com/i/oauth2/authorize',
  token_endpoint: 'https://api.twitter.com/2/oauth2/token',
  revocation_endpoint: 'https://api.twitter.com/2/oauth2/revoke',
  userinfo_endpoint: 'https://api.twitter.com/2/users/me',
});

const client = new issuer.Client({
  client_id: config.client_id,
  client_secret: config.client_secret,
});

app.use(session({
  name: 'session',
  secret: [crypto.randomBytes(32).toString('hex')],
  resave: true,
  saveUninitialized: true
}));

app.get('/', (req, res, next) => {
  (async () => {
    if (req.session.tokenSet) {
      const resp = await client.userinfo(req.session.tokenSet.access_token as unknown as TokenSet);
      console.log(resp.data);
      return res.send(`
        Hello ${JSON.stringify(resp.data)}!
        <br/> <a href="/auth/logout">Logout</a>
        <br/> <a href="/auth/refresh">Refresh Token</a>`);
    } else {
      return res.send('<a href="/auth/login">Login</a>');
    }
  })().catch(next);
});

app.get('/auth/login', (req, res, next) => {
  const state = generators.state();
  const codeVerifier = generators.codeVerifier();
  const codeChallenge = generators.codeChallenge(codeVerifier);
  const url = client.authorizationUrl({
    redirect_uri: config.redirect_uri,
    response_type: 'code',
    scope: 'tweet.read users.read offline.access',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })
  req.session.state = state;
  req.session.codeVerifier = codeVerifier;
  return res.redirect(url);
});

app.get('/auth/callback', (req, res, next) => {
  (async () => {
    if (!req.session) {
      return res.status(403).send('NG');
    }
    const state = req.session.state;
    const codeVerifier = req.session.codeVerifier;
    const params = client.callbackParams(req);
    const tokenSet = await client.oauthCallback(config.redirect_uri, params, { code_verifier: codeVerifier, state }, { exchangeBody: { client_id: config.client_id } });
    console.log('received and validated tokens %j', tokenSet);
    req.session.tokenSet = tokenSet;
    return res.redirect(req.session.originalUrl || '/');
  })().catch(next);
});

app.get('/auth/refresh', (req, res, next) => {
  (async () => {
    if (!req.session || !req.session.tokenSet || !req.session.tokenSet.refresh_token) {
      return res.status(403).send('NG');
    }
    const resp = await client.refresh(req.session.tokenSet.refresh_token);
    req.session.tokenSet = <TokenSet>resp.data;
    return res.send('OK!');
  })().catch(next);
});

app.get('/auth/logout', (req, res, next) => {
  (async () => {
    if (!req.session.tokenSet) {
      return res.status(403).send('NG');
    }
    await client.revoke(req.session.tokenSet.access_token as string, 'access_token');
    req.session.destroy(_ => res.send('OK'));
  })().catch(next);
});

app.listen(3000, () => console.log(`Started app on port 3000`));