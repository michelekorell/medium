import { graphql, GraphQLSchema, GraphQLResolveInfo } from "graphql";
import { delegateToSchema, Transform } from "graphql-tools";

export class Connector {
    constructor(private schema: GraphQLSchema) {
    }

    ResourceCreate(args: any, context: any, info: GraphQLResolveInfo): Promise<any> {

        let fieldName = "ResourceCreate";
        return delegateToSchema({
            schema: this.schema,
            operation: 'mutation',
            fieldName,
            args: { args },
            context: {},
            info,
        });

    }

    addResources(args: any, context: any, info: GraphQLResolveInfo, transforms?: Array<Transform>): Promise<any> {
        //Rewrite of different query adapted to next microservice
        const mutation = `mutation ResourceCreate($proto: Resource) {
            ResourceCreate(resource: $proto) {
              id
            }
          }`;

        //Promise for resource create
        return new Promise((resolve) => {
            graphql(this.schema, mutation, null, context, args).then((resource: any) => {
                resolve(resource.data.ResourceCreate);
            });
        });
    }
}
