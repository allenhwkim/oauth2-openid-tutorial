# oauth2-openid-tutorial

This tutorial is to login using Twitter OAuth2.0 , OpenID client, and Express Server. While it's focused on authentication, browser-side coding is as minimal as possible.
This tutorial has one browser url and some API urls.

* `/` : show links for login and logout
* `GET /auth/login`: handles login request
* `GET /auth/callback`: handles callback requests from Twitter
* `GET /auth/logout`: handles logout request

## Checkout and install
```
$ git clone https://github.com/allenhwkim/oauth2-openid-tutorial.git
$ cd oauth2-openid-tutorial/
$ npm install
```

## Update configuration
First, update ./config.json with your own Twitter client_id , client_secret, and redirect_uri
For this tutorial, your redirect url must be http://localhost:3000/auth/callback
```
{
  "client_id": "xxxxxxxxxxxxxxxxxxxx",
  "client_secret": "xxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "redirect_uri": "http://localhost:3000/auth/callback"
}
```

To get the OAuth client id and secret, follow the Twitter instruction, [Getting access to the Twitter API | Docs | Twitter Developer Platform](https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api).


## Start the server and login from browser
Now, it's ready. Start your server, then visit http://localhost:3000
 ![image](https://user-images.githubusercontent.com/1437734/192902205-d8acd1fc-26fa-4653-b198-044534780c46.png)    | ![image](https://user-images.githubusercontent.com/1437734/192902221-219b8aa6-8953-4d6c-af74-202ac63b2b39.png) |    ![image](https://user-images.githubusercontent.com/1437734/192902236-0938a61f-1472-454b-a705-a17199a6923e.png) 
---- | ---- | ----


## How it works

Please refer to [RFC 7636](https://www.rfc-editor.org/rfc/rfc7636): Proof Key for Code Exchange by OAuth Public Clients (rfc-editor.org)

![image](https://user-images.githubusercontent.com/1437734/192901857-e8bb664f-f429-4044-af09-8cb9576895ad.png) | ![image](https://user-images.githubusercontent.com/1437734/192901910-fbd8778b-89a2-4ccd-a914-4cedb0e3359e.png)
-------- | --------



## References
- https://developer.twitter.com/en/docs/twitter-api/oauth2
- https://www.npmjs.com/package/openid-client
