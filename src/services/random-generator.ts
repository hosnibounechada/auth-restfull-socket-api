import { randomInt } from "crypto";

export class RandomGenerator {
  static username(firstName: string, lastName: string) {
    const uuid = randomInt(1000, 9999);
    const prefix = `${firstName}.${lastName}`;
    return `${prefix.replace(/\s/g, "")}${uuid}`;
  }
  static randomInt(min: number, max: number) {
    return randomInt(min, max);
  }
}
