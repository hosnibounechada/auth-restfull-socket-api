import { randomInt } from "crypto";

export class RandomGenerator {
  static username(firstName: string, lastName: string) {
    const uuid = randomInt(1000, 9999);
    return `${firstName}.${lastName}${uuid}`;
  }
  static randomInt(min: number, max: number) {
    return randomInt(min, max);
  }
}
