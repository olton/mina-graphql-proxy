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

### Develop preparing
```
> cd mina-graphql-proxy
> npm i
```

### Env vars
You can define environment variables to assign parameters for the proxy server.

- `GRAPHQL_HOST` - host, where graphql started, default `localhost`
- `GRAPHQL_PORT` - port, where graphql started, default `3085`
- `GRAPHQL_PATH` - path to graphql service, default `graphql`
- `GRAPHQL_PROXY_PORT` - proxy port, default `3000`
- `GRAPHQL_PROXY_HOST` - proxy host, default `localhost`

### License
This project licensed under MIT license