import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    type User {
        id: String
        firstName: String
        lastName: String
        email: String
        password: String
    }

    type Viewer {
        id: String
        firstName: String
        lastName: String
        token: String
        didRequest: Boolean!
        email: String
    }

    type Query {
        user: [User!]!
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
`;
