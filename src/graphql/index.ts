import { GraphQLSchema } from 'graphql'
import { mergeSchemas } from 'apollo-server-express'
import 'graphql-import-node'

//schemas imports
import notices from './schemas/notices.graphql';
import content from './schemas/content.graphql';
import users from './schemas/users.graphql';
import sections from './schemas/section.graphql';

//resolvers imports 
import {Rusers} from './resolvers/users.resolvers';
import {Rcontent} from './resolvers/content.resolvers';
import {Rnotices} from './resolvers/notice.resolvers';
import { Rsections } from './resolvers/section.resolvers';

export const schema: GraphQLSchema = mergeSchemas({
    schemas:[
        notices,
        content,
        users,
        sections
    ],
    resolvers:[
        Rusers,
        Rcontent,
        Rnotices,
        Rsections
    ]
})