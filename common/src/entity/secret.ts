import { Entity, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../models/index.js';

/**
 * Secrets collection
 */
@Entity()
@Unique({ properties: ['path'], options: { partialFilterExpression: { path: { $type: 'string' }}}})
export class Secret extends BaseEntity {
    /**
     * Secret name
     */
    @Property({ nullable: true })
    path?: string;

    /**
     * Secret value
     */
    @Property({ nullable: true })
    data?: string;
}
