import { Service } from '../lib/types';

export interface ServicesData {
    total: number;
    result: Service[];
}

export interface ServiceArgs {
    id: string;
}
