import {
  ExtractDocumentTypeFromTypedRxJsonSchema,
  RxJsonSchema,
  toTypedRxJsonSchema} from 'rxdb';

export const userSchemaLiteral = {
  title: 'user schema',
  description: 'describes a user',
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
        },
      first_name: {

          type: 'string'
      },
      last_name: {
          type: 'string'
      },

},
  required: ['first_name', 'last_name', 'id'],

} as const;

const schemaTyped = toTypedRxJsonSchema(userSchemaLiteral);
export type UserDocType = ExtractDocumentTypeFromTypedRxJsonSchema<typeof schemaTyped>;
export const userSchema: RxJsonSchema<UserDocType> = userSchemaLiteral;
