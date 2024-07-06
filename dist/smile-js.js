class n extends Error {
  constructor(e) {
    super(e);
  }
}
const S = [0, 1, 3, 7, 15, 31, 63, 127, 255];
class m {
  decodeVInt(e) {
    if (e.length <= 0)
      throw new n("invalid VInt");
    let t = BigInt(0);
    for (let i = 0; i < e.length; i++) {
      const r = e[i];
      if (i < e.length - 1) {
        if (r & 128)
          throw new n("invalid VInt");
        t = t * BigInt(128) + BigInt(r & 127);
      } else {
        if ((r & 128) !== 128)
          throw new n("invalid VInt");
        t = t * BigInt(64) + BigInt(r & 63);
        break;
      }
    }
    return t >= BigInt(Number.MIN_SAFE_INTEGER) && t <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(t) : t;
  }
  decodeZigZag(e) {
    if (e < 0)
      throw new n("illegal zigzag value");
    if (typeof e == "bigint") {
      if (e <= BigInt(2147483647))
        return e % BigInt(2) === BigInt(1) ? Number(-(e >> BigInt(1)) - BigInt(1)) : Number(e >> BigInt(1));
      if (e % BigInt(2) === BigInt(1)) {
        const t = (e - BigInt(1)) / BigInt(2);
        return Number(-t - BigInt(1));
      } else {
        const t = e / BigInt(2);
        return Number(t);
      }
    } else
      return e <= 2147483647 ? e % 2 === 1 ? -(e >> 1) - 1 : e >> 1 : e % 2 === 1 ? -((e - 1) / 2) - 1 : e / 2;
  }
  decodeAscii(e) {
    return new TextDecoder("ascii").decode(e);
  }
  decodeUtf8(e) {
    return new TextDecoder("utf8").decode(e);
  }
  toDataView(e) {
    const t = new ArrayBuffer(e.length), i = new DataView(t);
    for (let r = 0; r < e.length; r++)
      i.setUint8(r, e[r]);
    return i;
  }
  // big-endian encoding
  decodeFloat32(e) {
    return this.toDataView(e).getFloat32(0, !1);
  }
  // big-endian encoding
  decodeFloat64(e) {
    return this.toDataView(e).getFloat64(0, !1);
  }
  decodeFixedLengthBigEndianEncodedBits(e, t) {
    const i = new Uint8Array(Math.ceil(t / 8));
    let r = 0, s = t % 7, o = 0, a = 0, c = e[r], d = 0, h;
    for (; r < e.length; ) {
      const g = Math.min(s, 8 - a);
      d <<= g, d |= c >> s - g, s -= g, c &= S[s], a += g, s === 0 && (r++, s = 7, c = e[r]), a === 8 && (h = o, i[h] = d, o++, a = 0, d = 0);
    }
    return a > 0 && (d <<= 8 - a, h = o, i[h] = d), i;
  }
  decodeSafeBinaryEncodedBits(e, t) {
    const i = new Uint8Array(Math.ceil(t / 8));
    let r = 0, s = 7, o = 0, a = 0, c = e[r], d = 0;
    for (; o < i.length; ) {
      const h = Math.min(s, 8 - a);
      d <<= h, d |= c >> s - h, s -= h, c &= S[s], a += h, s === 0 && (r++, s = 7, c = e[r]), a === 8 && (i[o] = d, o++, a = 0, d = 0);
    }
    return a > 0 && (d <<= 8 - a, i[o] = d), i;
  }
}
class w {
  constructor(e) {
    this.inputStream = e, this.decoder = new m();
  }
  isEof() {
    return this.inputStream.isEof();
  }
  read() {
    return this.inputStream.read();
  }
  peek() {
    return this.inputStream.peek();
  }
  readVIntBytes() {
    const e = [];
    for (; ; ) {
      const t = this.read();
      if (e.push(t), (t & 128) === 128)
        break;
    }
    return new Uint8Array(e);
  }
  readUnsignedVint() {
    const e = this.readVIntBytes();
    return this.decoder.decodeVInt(e);
  }
  readSignedVint() {
    return this.decoder.decodeZigZag(this.readUnsignedVint());
  }
  readAscii(e) {
    return this.decoder.decodeAscii(this.inputStream.readArray(e));
  }
  readUtf8(e) {
    return this.decoder.decodeUtf8(this.inputStream.readArray(e));
  }
  readFloat32() {
    return this.decoder.decodeFloat32(this.readFixedLengthBigEndianEncodedBits(32));
  }
  readFloat64() {
    return this.decoder.decodeFloat64(this.readFixedLengthBigEndianEncodedBits(64));
  }
  readFixedLengthBigEndianEncodedBits(e) {
    const t = this.inputStream.readArray(Math.ceil(e / 7));
    return this.decoder.decodeFixedLengthBigEndianEncodedBits(t, e);
  }
  readSafeBinary() {
    const e = this.readUnsignedVint();
    if (typeof e == "bigint")
      throw new n("invalid length");
    const t = this.inputStream.readArray(Math.ceil(e * 8 / 7));
    return this.decoder.decodeSafeBinaryEncodedBits(t, e * 8);
  }
  readBigInt() {
    const e = this.readSafeBinary();
    let t = 0;
    for (let i = 0; i < e.length; i++)
      t = t * 256 + e[i];
    return t;
  }
  readBigDecimal() {
    const e = this.readSignedVint();
    if (typeof e == "bigint")
      throw new n("invalid scale");
    return this.readBigInt() * Math.pow(10, e);
  }
  readLongString() {
    const e = [];
    for (; ; ) {
      const t = this.inputStream.read();
      if (t === 252)
        break;
      e.push(t);
    }
    return new Uint8Array(e);
  }
  readLongAscii() {
    return this.decoder.decodeAscii(this.readLongString());
  }
  readLongUtf8() {
    return this.decoder.decodeUtf8(this.readLongString());
  }
  readBytes(e) {
    return this.inputStream.readArray(e);
  }
}
const f = new n("end of input stream reached");
class y {
  constructor(e) {
    this.index = 0, this.array = e;
  }
  isEof() {
    return this.index >= this.array.length;
  }
  read() {
    if (this.isEof())
      throw f;
    const e = this.array[this.index];
    return this.index++, e;
  }
  readArray(e) {
    if (this.isEof())
      throw f;
    if (e < 0)
      throw new n("invalid read amount");
    const t = Math.min(this.array.length, this.index + e), i = this.array.subarray(this.index, t);
    return this.index = t, i;
  }
  peek() {
    if (this.isEof())
      throw f;
    return this.array[this.index];
  }
  skip(e) {
    if (this.isEof())
      throw f;
    if (e < 0)
      throw new n("invalid skip amount");
    this.index += e;
  }
}
class u {
  constructor(e, t, i, r) {
    this.name = e, this.keyMode = t, this.enabled = i, this.maxStrings = r, this.reset(), this.strings = [], this.stringMap = {}, this.reset();
  }
  reset() {
    this.keyMode ? (this.strings = [], this.stringMap = {}) : (this.strings = [""], this.stringMap = {});
  }
  static newValues(e) {
    return new u("values", !1, e, 1024);
  }
  static newKeyNames(e) {
    return new u("keyNames", !0, e, 1024);
  }
  addString(e) {
    if (!this.enabled || new TextEncoder().encode(e).length > 64)
      return -1;
    if (e in this.stringMap)
      return this.stringMap[e];
    this.keyMode ? this.strings.length >= this.maxStrings && this.reset() : this.strings.length > this.maxStrings && this.reset();
    const i = this.strings.length;
    return this.strings.push(e), this.stringMap[e] = i, i;
  }
  getString(e) {
    if (!this.enabled)
      throw new n("shared strings are not enabled");
    if (e >= this.strings.length)
      throw new n("shared string reference out of range");
    return this.strings[e];
  }
}
function B(l, e) {
  return new p(l, e).parse();
}
class p {
  constructor(e, t) {
    this.decoderStream = new w(new y(e)), this.options = t, this.decoder = new m(), this.sharedPropertyName = !1, this.sharedStringValue = !1, this.rawBinary = !1, this.version = 0, this.sharedPropertyNames = u.newKeyNames(!1), this.sharedStringValues = u.newValues(!1);
  }
  parse() {
    const e = this.decoderStream.read(), t = this.decoderStream.read(), i = this.decoderStream.read();
    if (e !== 58 || t !== 41 || i !== 10)
      throw new n("invalid Smile header");
    const r = this.decoderStream.read();
    return this.sharedPropertyName = (r & 1) === 1, this.sharedStringValue = (r & 2) === 2, this.rawBinary = (r & 4) === 4, this.version = r >> 4, this.sharedPropertyNames = u.newKeyNames(this.sharedPropertyName), this.sharedStringValues = u.newValues(this.sharedStringValue), this.readValue();
  }
  readValue() {
    const e = this.decoderStream.read(), t = e >> 5, i = e & 31;
    switch (t) {
      case 0:
        return this.sharedStringValues.getString(i);
      case 1:
        return this.readSimpleLiteralValue(e);
      case 2: {
        const r = this.decoderStream.readAscii(i + 1);
        return this.sharedStringValues.addString(r), r;
      }
      case 3: {
        const r = this.decoderStream.readAscii(i + 33);
        return this.sharedStringValues.addString(r), r;
      }
      case 4: {
        const r = this.decoderStream.readUtf8(i + 2);
        return this.sharedStringValues.addString(r), r;
      }
      case 5: {
        const r = this.decoderStream.readUtf8(i + 34);
        return this.sharedStringValues.addString(r), r;
      }
      case 6:
        return this.decoder.decodeZigZag(i);
      case 7:
        return this.readBinaryLongTextStructureValues(e);
      default:
        throw new n(`unknown token class: ${t}`);
    }
  }
  readSimpleLiteralValue(e) {
    if (e === 32)
      return "";
    if (e === 33)
      return null;
    if (e === 34)
      return !1;
    if (e === 35)
      return !0;
    if (e === 36)
      return this.decoderStream.readSignedVint();
    if (e === 37)
      return this.decoderStream.readSignedVint();
    if (e === 38)
      return this.decoderStream.readBigInt();
    if (e === 40)
      return this.decoderStream.readFloat32();
    if (e === 41)
      return this.decoderStream.readFloat64();
    if (e === 42)
      return this.decoderStream.readBigDecimal();
    throw new n("invalid value token 0x" + e.toString(16));
  }
  readBinaryLongTextStructureValues(e) {
    if (e === 224)
      return this.decoderStream.readLongAscii();
    if (e === 228)
      return this.decoderStream.readLongUtf8();
    if (e === 232)
      return this.decoderStream.readSafeBinary();
    if (e >= 236 && e <= 239) {
      const t = (e & 3) << 8 | this.decoderStream.read();
      return this.sharedStringValues.getString(t);
    } else if (e === 248) {
      const t = [];
      for (; this.decoderStream.peek() !== 249; )
        t.push(this.readValue());
      return this.decoderStream.read(), t;
    } else if (e === 250) {
      const t = {};
      for (; this.decoderStream.peek() !== 251; ) {
        const i = this.readKey(), r = this.readValue();
        t[i] = r;
      }
      return this.decoderStream.read(), t;
    } else if (e === 253) {
      const t = this.decoderStream.readUnsignedVint();
      if (typeof t == "bigint")
        throw new n("invalid length");
      return this.decoderStream.readBytes(t);
    } else
      throw new n("invalid value token 0x" + e.toString(16));
  }
  readKey() {
    const e = this.decoderStream.read();
    if (e === 32)
      return "";
    if (e >= 48 && e <= 51) {
      const t = (e & 3) << 8 | this.decoderStream.read();
      return this.sharedPropertyNames.getString(t);
    } else {
      if (e === 52)
        return this.decoderStream.readLongUtf8();
      if (e >= 64 && e <= 127) {
        const t = e & 63;
        return this.sharedPropertyNames.getString(t);
      } else if (e >= 128 && e <= 191) {
        const t = this.decoderStream.readAscii((e & 63) + 1);
        return this.sharedPropertyNames.addString(t), t;
      } else if (e >= 192 && e <= 247) {
        const t = this.decoderStream.readUtf8((e & 63) + 2);
        return this.sharedPropertyNames.addString(t), t;
      } else
        throw new n("invalid key token 0x" + e.toString(16));
    }
  }
}
export {
  n as SmileError,
  B as parse
};
//# sourceMappingURL=smile-js.js.map
