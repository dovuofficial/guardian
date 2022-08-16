import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from '@guardian/common';
import { GroupAccessType, GroupRelationshipType } from '@guardian/interfaces';

/**
 * PolicyRoles collection
 */
@Entity()
export class PolicyRoles extends BaseEntity {
    /**
     * Group UUID
     */
    @Property({ nullable: true })
    uuid?: string;

    /**
     * Policy Id name
     */
    @Property({ nullable: true })
    policyId?: string;

    /**
     * Group creator (User DID)
     */
    @Property({ nullable: true })
    did?: string;

    /**
     * Group Role
     */
    @Property({ nullable: true })
    role?: string;

    /**
     * Group Type
     */
    @Property({ nullable: true })
    groupRelationshipType?: GroupRelationshipType;

    /**
     * Group Type
     */
    @Property({ nullable: true })
    groupAccessType?: GroupAccessType;
}
