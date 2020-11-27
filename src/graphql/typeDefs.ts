import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type Address {
        firstName: String
        lastName: String
        street: String
        streetNumber: String
        zip: Int
        city: String
        country: String
        description: String
    }

    type Service {
        id: ID
        name: String
        description: String
        image: String
        price: Int
    }

    type Services {
        total: Int!
        result: [Service!]!
    }

    type UsedService {
        id: ID
        date: String
        service: Service
        address: Address
    }

    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        isServiceProvider: Boolean
        hasWallet: Boolean
        offeredServices: [Service] # only for isServiceProvider is true
        takenServices: [UsedService]
        givenServices: [UsedService] # only for isServiceProvider is true
        address: Address
    }

    type Viewer {
        id: ID
        firstName: String
        lastName: String
        token: String
        didRequest: Boolean!
        email: String
    }

    input LogInInput {
        email: String
        password: String
        service: String
        code: String
    }

    input RegisterUserInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    type Mutation {
        logOutUser: Viewer
        logInUser(input: LogInInput): Viewer
        registerUser(input: RegisterUserInput): User!
    }

    type Query {
        services(limit: Int!, offset: Int!): Services
        user: [User!]!
    }
`;
