import merge from 'lodash.merge';
import { serviceResolvers } from './Service';
import { userResolver } from './User';
import { viewerResolver } from './Viewer';
import { bookingResolver } from './Booking';

export const resolvers = merge(
    serviceResolvers,
    userResolver,
    viewerResolver,
    bookingResolver
);
