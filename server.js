const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const isAuthMiddleware = require('./middleware/is-auth');
const cors = require('cors');
const log = require('./helpers/logger');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(isAuthMiddleware);

const port = process.env.PORT || 3000;
const graphQlSchema = require('./graphql/schemas/index');
const graphQlResolvers = require('./graphql/resolvers/index');

app.use('/graphql', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
}));

const mongoConnectionUrl = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`;

mongoose.connect(mongoConnectionUrl, { useNewUrlParser: true })
    .then(() => {
        app.listen(port, () => { log.event(`Server started on port ${port}`) });
    })
    .catch(err => {
        console.error(err);
    });
