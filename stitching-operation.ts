import { graphql, GraphQLSchema, GraphQLResolveInfo } from "graphql";
import { delegateToSchema, Transform } from "graphql-tools";

export class Connector {
    //Constructor get remote schema
    constructor(private schema: GraphQLSchema) {
    }

    //Resource query is a remote endpoint operation
    ResourceCreate(args: any, context: any, info: GraphQLResolveInfo): Promise<any> {

        //use of delegation on remote
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

    //Local query
    addResources(args: any, context: any, info: GraphQLResolveInfo, transforms?: Array<Transform>): Promise<any> {
        //That need to rewruite a different query adapted to next microservice
        const mutation = `mutation ResourceCreate($proto: Resource) {
            ResourceCreate(resource: $proto) {
              id
            }
          }`;

        //Promise for resources resolution
        return new Promise((resolve) => {
            graphql(this.schema, mutation, null, context, args).then((resource: any) => {
                resolve(resource.data.ResourceCreate);
            });
        });
    }
}
