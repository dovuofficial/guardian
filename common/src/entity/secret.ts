import { Entity, Property, Unique } from '@mikro-orm/core';
import { BaseEntity } from '../models/index.js';

/**
 * Secrets collection
 */
@Entity()
@Unique({ properties: ['key'], options: { partialFilterExpression: { key: { $type: 'string' }}}})
export class Secret extends BaseEntity {
    /**
     * Secret name
     */
    @Property({ nullable: true })
    key?: string;

    /**
     * Secret value
     */
    @Property({ nullable: true })
    value?: string;
}
