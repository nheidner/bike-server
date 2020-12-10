import { gql } from 'apollo-server-express';

export const typeDefs = gql`
    scalar Date

    type Address {
        fullName: String!
        firstLine: String!
        secondLine: String
        postalCode: String!
        city: String!
        utcZone: Int
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

    type TimeFrame {
        from: Date
        to: Date
    }

    type NewBooking {
        id: ID!
        date: TimeFrame
        services: [Service!]!
        address: Address
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

    input UpdateNewBookingAddressInput {
        # newBookingId: String!
        fullName: String!
        firstLine: String!
        secondLine: String
        postalCode: String!
        city: String!
    }

    input UpdateNewBookingDateInput {
        # newBookingId: String!
        from: Date
        to: Date
    }

    input NewBookingInput {
        serviceId: String
    }

    type Mutation {
        logOutUser: Viewer
        logInUser(input: LogInInput): Viewer
        registerUser(input: RegisterUserInput): User!
        updateNewBookingAddress(
            input: UpdateNewBookingAddressInput
        ): NewBooking!
        updateNewBookingDate(input: UpdateNewBookingDateInput): NewBooking!
    }

    type Query {
        services(limit: Int!, offset: Int!): Services!
        user: [User!]!
        service(id: ID!): Service!
        newBooking(input: NewBookingInput): NewBooking!
    }
`;
