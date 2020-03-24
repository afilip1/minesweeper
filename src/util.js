// unbelievable that I have to write this
Array.prototype.equals = function (other) {
   return (this.length === other.length) && this.every((element, index) => element === other[index]);
}

Array.prototype.shuffle = function () {
   for (let i = this.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this[i], this[j]] = [this[j], this[i]];
   }
   return this;
}