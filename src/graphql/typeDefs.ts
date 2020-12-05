import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    # type Address {
    #     firstName: String
    #     lastName: String
    #     street: String
    #     streetNumber: String
    #     zip: Int
    #     city: String
    #     country: String
    #     description: String
    # }

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

    type Booking {
        id: ID!
        date: String
        time: String
        services: [Service!]!
        # address: Address
        wallet: String
        userId: ID! # User.id
        isMade: Boolean!
    }

    # id is same id as of Viewer.id
    type User {
        id: ID!
        firstName: String!
        lastName: String!
        email: String!
        password: String!
        isServiceProvider: Boolean
        hasWallet: Boolean
        offeredServices: [Service] # only for isServiceProvider is true
        # takenServices: [UsedService]
        # givenServices: [UsedService] # only for isServiceProvider is true
        # address: Address
    }

    # id is same id as of User.id
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

    input UpdateBookingInput {
        date: String
        time: String
        services: [ID]
        wallet: String
        isMade: Boolean
    }

    type Mutation {
        logOutUser: Viewer
        logInUser(input: LogInInput): Viewer
        registerUser(input: RegisterUserInput): User!
        updateBooking(input: UpdateBookingInput): Booking!
    }

    type Query {
        services(limit: Int!, offset: Int!): Services!
        user: [User!]!
        service(id: ID!): Service!
        booking(serviceId: ID): Booking!
    }
`;
