# Proxy-server for Mina GraphQL

While exposing the GraphQL API to the internet is not recommended,
an implementation of a GraphQL proxy is available that removes the
queries that pose a threat but still allows querying of the node's
data from a public endpoint.

### Install
First. Clone the repository into you server
```
> git clone https://github.com/olton/mina-graphql-proxy.git
```

### Start server
```
> cd mina-graphql-proxy
> node bin/index.js
```
#### Environment variables
The Proxy uses different environment variables. You can define ones to change proxy server behavior.

- `GRAPHQL_HOST` - host, where graphql started, default `localhost`
- `GRAPHQL_PORT` - port, where graphql started, default `3085`
- `GRAPHQL_PATH` - path to graphql service, default `graphql`
- `GRAPHQL_PROXY_PORT` - proxy port, default `3000`
- `GRAPHQL_PROXY_HOST` - proxy host, default `localhost`

### Development, preparing
```
> cd mina-graphql-proxy
> npm i
```

### Hacks
If you have server error 500 linked to `mutation` or `protocolStateProof` types, you must hack `node_modules/graphql/type/validate.js`.
Comment out line number ~229 (`context.reportError`):
```javascript
function validateFields(context, type) {
  var fields = (0, _objectValues5.default)(type.getFields()); // Objects and Interfaces both must define one or more fields.

  if (fields.length === 0) {
    //context.reportError("Type ".concat(type.name, " must define one or more fields."), getAllNodes(type));
  }
  ...
}
```

### Build executable
To build an executable file, you must add  `@vercel/ncc` utility.
```console
> npm i -g @vercel/ncc
```
Now you can use build command:
```console
> npm run build
```
The result executable file will be created in the `bin` directory.

### License
This project licensed under MIT license