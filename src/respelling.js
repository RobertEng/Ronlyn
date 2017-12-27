class PronunciationRespelling {
  constructor(parent) {
    this._parent = parent;
    this._spelling2respelling = new Map();
    this._spelling2respelling.set("Ronlyn", "ronland");
    this._spelling2respelling.set("Goo", "go");
    this._spelling2respelling.set("wen", "when");
    this._spelling2respelling.set("aruna", "iruna");
    this._spelling2respelling.set("shao", "shell");
    this._spelling2respelling.set("mai", "my");
    this._spelling2respelling.set("cheung", "chong");
    this._spelling2respelling.set("gaw", "gal");
    this._spelling2respelling.set("negin", "negeen");
    this._spelling2respelling.set("jaylynne", "jaylene");
    this._spelling2respelling.set("lynda", "linda");
  }
  respell(word) {
    // how many (re)tries before hint
    return this._spelling2respelling.get(word);
  }
}
