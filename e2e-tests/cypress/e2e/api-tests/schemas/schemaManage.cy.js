import {METHOD, STATUS_CODE} from "../../../support/api/api-const";
import API from "../../../support/ApiUrls";

context("Schemas", {tags: '@schemas'}, () => {
    const authorization = Cypress.env("authorization");
    const schemaUUID = ("0000b23a-b1ea-408f-a573" + Math.floor(Math.random() * 999999) + "a2060a");
    let topicUid;
    // const schemaUUID = "0000b23a-b1ea-408f-a573-6d8bd1a2060a";
    before(() => {
        cy.request({
            method: METHOD.GET,
            url: API.ApiServer + API.Schemas,
            headers: {
                authorization,
            },
        }).then((resp) => {
            topicUid = resp.body.at(-1).topicId;
            //Create new schema
            cy.request({
                method: "POST",
                url: API.ApiServer + API.Schemas + topicUid,
                headers: {authorization},
                body: {
                    uuid: schemaUUID,
                    name: "test",
                    description: "new",
                    entity: "VC",
                    status: "DRAFT",
                    readonly: false,
                    document: {
                      "$id": "#${schemaUUID}",
                      "$comment": "{ \"@id\": \"schema:${schemaUUID}#${schemaUUID}\", \"term\": \"${schemaUUID}\" }",
                      "title": "wqe",
                      "description": "",
                      "type": "object",
                      "properties": {
                        "@context": {
                          "oneOf": [
                            {
                              "type": "string"
                            },
                            {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            }
                          ],
                          "readOnly": true
                        },
                        "type": {
                          "oneOf": [
                            {
                              "type": "string"
                            },
                            {
                              "type": "array",
                              "items": {
                                "type": "string"
                              }
                            }
                          ],
                          "readOnly": true
                        },
                        "id": {
                          "type": "string",
                          "readOnly": true
                        },
                        "policyId": {
                          "title": "policyId",
                          "description": "policyId",
                          "readOnly": true,
                          "type": "string",
                          "$comment": "{\"term\":\"policyId\",\"@id\":\"https://www.schema.org/text\"}"
                        },
                        "ref": {
                          "title": "ref",
                          "description": "ref",
                          "readOnly": true,
                          "type": "string",
                          "$comment": "{\"term\":\"ref\",\"@id\":\"https://www.schema.org/text\"}"
                        }
                      },
                      "required": [
                        "@context",
                        "type",
                        "policyId"
                      ],
                      "additionalProperties": false,
                      "$defs": {}
                    },
                    context: null,
                    topicId: topicUid,
                    contextURL: "schema:${schemaUUID}",
                    fields: [],
                    conditions: [],
                    active: false,
                    system: false,
                    category: "POLICY",
                    errors: [],
                  },
            }).then((response) => {
                expect(response.status).eql(STATUS_CODE.SUCCESS);
            });
        });
    });

    it("Delete the schema with the provided schema ID", () => {
        cy.request({
            method: METHOD.GET,
            url: API.ApiServer + API.Schemas + topicUid,
            headers: {
                authorization,
            },
        }).then((response) => {
            let schemaId = response.body.at(0).id;
            expect(response.status).eql(STATUS_CODE.OK);

            //Delete schema
            cy.request({
                method: "DELETE",
                url: API.ApiServer + API.Schemas + schemaId,
                headers: { authorization },
            }).then((response) => {
                expect(response.status).eql(STATUS_CODE.OK);
            });
        });
    });
});
