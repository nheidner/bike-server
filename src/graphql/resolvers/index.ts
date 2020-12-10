import merge from 'lodash.merge';
import { serviceResolvers } from './Service';
import { userResolver } from './User';
import { viewerResolver } from './Viewer';
import { newBookingResolver } from './NewBooking';
import { scalarTypesResolvers } from './CustomScalarTypes';

export const resolvers = merge(
    serviceResolvers,
    userResolver,
    viewerResolver,
    newBookingResolver,
    scalarTypesResolvers
);
