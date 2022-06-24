export default class KeyCharMap {
  private _keyToChar: Map<string, string>;
  private _charToKey: Map<string, string>;
  constructor(keys: Iterable<string>) {
    const copy = [...keys].sort();
    this._charToKey = new Map();
    this._keyToChar = new Map();

    let i = 0;
    for (let key of copy) {
      const code = String.fromCharCode(i);
      this._charToKey.set(code, key);
      this._keyToChar.set(key, code);
      i++;
    }
  }

  charToKey(char: string): string {
    const r = this._charToKey.get(char);
    if (r) {
      return r;
    } else {
      throw Error(`Could not find key for char '${char}'`);
    }
  }

  keyToChar(key: string): string {
    const r = this._keyToChar.get(key);
    if (r) {
      return r;
    } else {
      throw Error(`Could not find char for key '${key}'`);
    }
  }
}
