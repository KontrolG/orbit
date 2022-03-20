# Notes

## Do's and dont's

- Don't store tokens in LocalStorage.
- Do store in httpOnly Cookie or React State.
- Don't save secret keys in client.
- Don't decode the JWT in the client, that data is only for the API.
- Do request the user info from an endpoint. Like Auth0 does.

## Opaque Token

A JWT has readable content, as you can see for example on https://jwt.io/. Everyone can decode the token and read the information in it. The format is documented in RFC 7519.

An opaque token on the other hand has a format that is not intended to be read by you. Only the issuer knows the format.

## Share constants between API and APP

I wanted to share constants like API routes path in both Node Server and React App.

My first idea was an npm module that can be installed in both parties. But after some reading I notice this will be too much. I realise that because of this:

"Consider extracting code to modules when the core packs some logic and abstracting that logic would give you a benefit."

This mean that there is not enough benefit to make a npm module just for constants.

"The more you treat your backend and your front-end as separate code bases, the better. Because, well, that's what they are and this just leads to better, more decoupled implementantions"

Decoupled means I can connect my App with another API easily.

## Questions

- How to handle unauthenticated user trying to navigate to a protected route?
- How redirect him back when is authorized?
