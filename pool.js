function Pool(name, cb) {
  this.cb = cb;
  this.entries = {};
  this.size = 0;
  this.waited = 0;
  this.startLength = Object.keys(this.entries).length;

  this.add = (str) => {
    this.entries[str] = true;
    this.size += 1;

    if (this.waitFor) {
      this.waited += 1;
    }

    return this;
  };

  this.wait = (num) => {
    this.waitFor = num;
  };

  this.remove = (str) => {
    delete this.entries[str];
    this.size -= 1;

    const length = Object.keys(this.entries).length - this.startLength;
    if (this.size !== length) {
      console.log(`Length: ${length}\nSize: ${this.size}`);
      throw new Error(`Pool "${name}" may be empty but size is different to the length`);
    }

    if (this.size === 0 && length === 0) {
      if (this.waitFor > this.waited) {
        console.log(`Pool "${name}" is empty but we havent waited enough (Needs: ${this.waitFor}, Has: ${this.waited})`);
      } else {
        this.cb();
      }
    }

    return this;
  };
}

module.exports = Pool;
