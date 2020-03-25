/* eslint no-extend-native: ["error", { "exceptions": ["Array"]}] */
declare global {
   interface Array<T> {
      equals(other: T[]): boolean
      shuffle(): T[]
      zip<U>(other: U[]): [T, U][]
   }
}

// unbelievable that I have to write this
Array.prototype.equals = function <T>(this: T[], other: T[]) {
   return (this.length === other.length) && this.every((element, index) => element === other[index]);
}

Array.prototype.shuffle = function <T>(this: T[]) {
   for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
   }
   return this;
}

Array.prototype.zip = function <T, U>(this: T[], other: U[]) {
   return this.map((e, i) => [e, other[i]]);
}

const range = function (start: number, end: number) {
   return Array.from({ length: end - start }, (v, k) => k + start);
}

export { range };