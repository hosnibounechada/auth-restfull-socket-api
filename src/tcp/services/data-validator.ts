import { Validator, Schema } from "jsonschema";
const v = new Validator();
// validation class to validate all the data coming through events.
export class DataValidator {
  // function to validate data payload based on each event and its proper json schema
  static isValid(schema: any, payload: any): boolean {
    const result = v.validate(payload, schema as Schema);

    if (result.errors.length == 0) return true;

    return false;
  }
}
