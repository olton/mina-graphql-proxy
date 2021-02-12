const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { loadSchema } = require('@graphql-tools/load');
const { UrlLoader } = require('@graphql-tools/url-loader');
const { wrapSchema, FilterRootFields, FilterTypes } = require('@graphql-tools/wrap');
const http = require('http');
const cors = require('cors');
const httpProxy = require('http-proxy');
const bodyParser = require('body-parser');
const {NoSchemaIntrospectionCustomRule } = require('graphql');
const fs = require('fs');

const GRAPHQL_PROTOCOL = process.env["GRAPHQL_PROTOCOL"] || "http";
const GRAPHQL_HOST = process.env["GRAPHQL_HOST"] || "localhost";
const GRAPHQL_PORT = process.env["GRAPHQL_PORT"] || 3085;
const GRAPHQL_PATH = process.env["GRAPHQL_PATH"] || "/graphql";
const GRAPHQL_PROXY_PORT = process.env["GRAPHQL_PROXY_PORT"] || 3000;
const GRAPHQL_PROXY_HOST = process.env["GRAPHQL_PROXY_HOST"] || "localhost";
const GRAPHQL_URI = `${GRAPHQL_PROTOCOL}://${GRAPHQL_HOST}:${GRAPHQL_PORT}${GRAPHQL_PATH}`;

const defaultQuery = /* GraphQL */ `
  query myQuery {
    version
  }
`;

const hiddenFields = [
    "trackedWallets",
    "currentSnarkWorker",
    "initialPeers",
    "wallet"
];

const extensions = ({
        document,
        variables,
        operationName,
        result,
        context,
    }) => {
    return {
        runTime: Date.now() - context.startTime,
        variables: true,
        operationName: true
    };
};

const graphiqlIDE = fs.readFileSync("./html/index.html");

const app = express();
const server = http.createServer(app);
const proxy = httpProxy.createProxy({
    target: {
        host: GRAPHQL_HOST,
        port: GRAPHQL_PORT
    },
    ws: true
});

const getSchema = async () => await loadSchema('http://localhost:3085/graphql', {   // load from endpoint
    loaders: [
        new UrlLoader()
    ]
});

getSchema().then(function(remoteSchema){
    const schema = wrapSchema({
        schema: remoteSchema,
        transforms: [
            // new FilterRootFields((operation, fieldName, field) => fieldName !== '_mutationType'),
            new FilterRootFields((operation, fieldName, field) => !field.isDeprecated),
            new FilterRootFields((operation, fieldName, field) => operation !== 'Mutation'),
            new FilterRootFields((operation, fieldName, field) => hiddenFields.includes(fieldName) === false),
        ]
    });

    app.use(cors());

    app.post(
        '/graphql',
        graphqlHTTP({
            schema: schema,
            validationRules: [NoSchemaIntrospectionCustomRule],
            graphiql: false,
            customValidateFn: () => [],
            customFormatErrorFn: (error) => ({
                message: error.message,
                locations: error.locations,
                stack: error.stack ? error.stack.split('\n') : [],
                path: error.path,
            })
        }),
    );

    app.get(
        '/graphql',
        (req, res, next) => {
            res.setHeader('Content-Type', 'text/html');
            res.write(graphiqlIDE);
            res.end();
        }
    );

    server.on('upgrade', (req, socket, head) => {
        proxy.ws(req, socket, head);
    });
    server.listen(parseInt(GRAPHQL_PROXY_PORT), GRAPHQL_PROXY_HOST, () => {
        console.info(`Go to http://${GRAPHQL_PROXY_HOST}:${GRAPHQL_PROXY_PORT}/graphql to run queries!`);
    });
})
