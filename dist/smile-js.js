class u extends Error {
  constructor(e) {
    super(e);
  }
}
var A = { exports: {} };
(function(y) {
  (function(e) {
    var r = function(t, i, d) {
      var o = t instanceof ArrayBuffer || typeof Buffer < "u" && t instanceof Buffer;
      if (!o)
        throw new Error("Must specify a valid ArrayBuffer or Buffer.");
      i = i || 0, d = d || t.byteLength || t.length, this._view = new Uint8Array(t.buffer || t, i, d), this.bigEndian = !1;
    };
    r._scratch = new DataView(new ArrayBuffer(8)), Object.defineProperty(r.prototype, "buffer", {
      get: function() {
        return typeof Buffer < "u" ? Buffer.from(this._view.buffer) : this._view.buffer;
      },
      enumerable: !0,
      configurable: !1
    }), Object.defineProperty(r.prototype, "byteLength", {
      get: function() {
        return this._view.length;
      },
      enumerable: !0,
      configurable: !1
    }), r.prototype._setBit = function(t, i) {
      i ? this._view[t >> 3] |= 1 << (t & 7) : this._view[t >> 3] &= ~(1 << (t & 7));
    }, r.prototype.getBits = function(t, i, d) {
      var o = this._view.length * 8 - t;
      if (i > o)
        throw new Error("Cannot get " + i + " bit(s) from offset " + t + ", " + o + " available");
      for (var h = 0, f = 0; f < i; ) {
        var v = i - f, w = t & 7, l = this._view[t >> 3], g = Math.min(v, 8 - w), S, m;
        this.bigEndian ? (S = ~(255 << g), m = l >> 8 - g - w & S, h <<= g, h |= m) : (S = ~(255 << g), m = l >> w & S, h |= m << f), t += g, f += g;
      }
      return d ? (i !== 32 && h & 1 << i - 1 && (h |= -1 ^ (1 << i) - 1), h) : h >>> 0;
    }, r.prototype.setBits = function(t, i, d) {
      var o = this._view.length * 8 - t;
      if (d > o)
        throw new Error("Cannot set " + d + " bit(s) from offset " + t + ", " + o + " available");
      for (var h = 0; h < d; ) {
        var f = d - h, v = t & 7, w = t >> 3, l = Math.min(f, 8 - v), g, S, m;
        if (this.bigEndian) {
          g = ~(-1 << l), S = i >> d - h - l & g;
          var V = 8 - v - l;
          m = ~(g << V), this._view[w] = this._view[w] & m | S << V;
        } else
          g = ~(255 << l), S = i & g, i >>= l, m = ~(g << v), this._view[w] = this._view[w] & m | S << v;
        t += l, h += l;
      }
    }, r.prototype.getBoolean = function(t) {
      return this.getBits(t, 1, !1) !== 0;
    }, r.prototype.getInt8 = function(t) {
      return this.getBits(t, 8, !0);
    }, r.prototype.getUint8 = function(t) {
      return this.getBits(t, 8, !1);
    }, r.prototype.getInt16 = function(t) {
      return this.getBits(t, 16, !0);
    }, r.prototype.getUint16 = function(t) {
      return this.getBits(t, 16, !1);
    }, r.prototype.getInt32 = function(t) {
      return this.getBits(t, 32, !0);
    }, r.prototype.getUint32 = function(t) {
      return this.getBits(t, 32, !1);
    }, r.prototype.getFloat32 = function(t) {
      return r._scratch.setUint32(0, this.getUint32(t)), r._scratch.getFloat32(0);
    }, r.prototype.getFloat64 = function(t) {
      return r._scratch.setUint32(0, this.getUint32(t)), r._scratch.setUint32(4, this.getUint32(t + 32)), r._scratch.getFloat64(0);
    }, r.prototype.setBoolean = function(t, i) {
      this.setBits(t, i ? 1 : 0, 1);
    }, r.prototype.setInt8 = r.prototype.setUint8 = function(t, i) {
      this.setBits(t, i, 8);
    }, r.prototype.setInt16 = r.prototype.setUint16 = function(t, i) {
      this.setBits(t, i, 16);
    }, r.prototype.setInt32 = r.prototype.setUint32 = function(t, i) {
      this.setBits(t, i, 32);
    }, r.prototype.setFloat32 = function(t, i) {
      r._scratch.setFloat32(0, i), this.setBits(t, r._scratch.getUint32(0), 32);
    }, r.prototype.setFloat64 = function(t, i) {
      r._scratch.setFloat64(0, i), this.setBits(t, r._scratch.getUint32(0), 32), this.setBits(t + 32, r._scratch.getUint32(4), 32);
    }, r.prototype.getArrayBuffer = function(t, i) {
      for (var d = new Uint8Array(i), o = 0; o < i; o++)
        d[o] = this.getUint8(t + o * 8);
      return d;
    };
    var s = function(t, i) {
      return function() {
        if (this._index + i > this._length)
          throw new Error("Trying to read past the end of the stream");
        var d = this._view[t](this._index);
        return this._index += i, d;
      };
    }, n = function(t, i) {
      return function(d) {
        this._view[t](this._index, d), this._index += i;
      };
    };
    function p(t, i) {
      return c(t, i, !1);
    }
    function B(t, i) {
      return c(t, i, !0);
    }
    function c(t, i, d) {
      if (i === 0)
        return "";
      var o = 0, h = [], f = !0, v = !!i;
      for (i || (i = Math.floor((t._length - t._index) / 8)); o < i; ) {
        var w = t.readUint8();
        if (w === 0 && (f = !1, !v))
          break;
        f && h.push(w), o++;
      }
      var l = String.fromCharCode.apply(null, h);
      if (d)
        try {
          return decodeURIComponent(escape(l));
        } catch {
          return l;
        }
      else
        return l;
    }
    function I(t, i, d) {
      for (var o = d || i.length + 1, h = 0; h < o; h++)
        t.writeUint8(h < i.length ? i.charCodeAt(h) : 0);
    }
    function x(t, i, d) {
      for (var o = U(i), h = d || o.length + 1, f = 0; f < h; f++)
        t.writeUint8(f < o.length ? o[f] : 0);
    }
    function U(t) {
      var i = [], d, o;
      for (d = 0; d < t.length; d++)
        o = t.charCodeAt(d), o <= 127 ? i.push(o) : o <= 2047 ? (i.push(o >> 6 | 192), i.push(o & 63 | 128)) : o <= 65535 ? (i.push(o >> 12 | 224), i.push(o >> 6 & 63 | 128), i.push(o & 63 | 128)) : (i.push(o >> 18 | 240), i.push(o >> 12 & 63 | 128), i.push(o >> 6 & 63 | 128), i.push(o & 63 | 128));
      return i;
    }
    var a = function(t, i, d) {
      var o = t instanceof ArrayBuffer || typeof Buffer < "u" && t instanceof Buffer;
      if (!(t instanceof r) && !o)
        throw new Error("Must specify a valid BitView, ArrayBuffer or Buffer");
      o ? this._view = new r(t, i, d) : this._view = t, this._index = 0, this._startIndex = 0, this._length = this._view.byteLength * 8;
    };
    Object.defineProperty(a.prototype, "index", {
      get: function() {
        return this._index - this._startIndex;
      },
      set: function(t) {
        this._index = t + this._startIndex;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(a.prototype, "length", {
      get: function() {
        return this._length - this._startIndex;
      },
      set: function(t) {
        this._length = t + this._startIndex;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(a.prototype, "bitsLeft", {
      get: function() {
        return this._length - this._index;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(a.prototype, "byteIndex", {
      // Ceil the returned value, over compensating for the amount of
      // bits written to the stream.
      get: function() {
        return Math.ceil(this._index / 8);
      },
      set: function(t) {
        this._index = t * 8;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(a.prototype, "buffer", {
      get: function() {
        return this._view.buffer;
      },
      enumerable: !0,
      configurable: !1
    }), Object.defineProperty(a.prototype, "view", {
      get: function() {
        return this._view;
      },
      enumerable: !0,
      configurable: !1
    }), Object.defineProperty(a.prototype, "bigEndian", {
      get: function() {
        return this._view.bigEndian;
      },
      set: function(t) {
        this._view.bigEndian = t;
      },
      enumerable: !0,
      configurable: !1
    }), a.prototype.readBits = function(t, i) {
      var d = this._view.getBits(this._index, t, i);
      return this._index += t, d;
    }, a.prototype.writeBits = function(t, i) {
      this._view.setBits(this._index, t, i), this._index += i;
    }, a.prototype.readBoolean = s("getBoolean", 1), a.prototype.readInt8 = s("getInt8", 8), a.prototype.readUint8 = s("getUint8", 8), a.prototype.readInt16 = s("getInt16", 16), a.prototype.readUint16 = s("getUint16", 16), a.prototype.readInt32 = s("getInt32", 32), a.prototype.readUint32 = s("getUint32", 32), a.prototype.readFloat32 = s("getFloat32", 32), a.prototype.readFloat64 = s("getFloat64", 64), a.prototype.writeBoolean = n("setBoolean", 1), a.prototype.writeInt8 = n("setInt8", 8), a.prototype.writeUint8 = n("setUint8", 8), a.prototype.writeInt16 = n("setInt16", 16), a.prototype.writeUint16 = n("setUint16", 16), a.prototype.writeInt32 = n("setInt32", 32), a.prototype.writeUint32 = n("setUint32", 32), a.prototype.writeFloat32 = n("setFloat32", 32), a.prototype.writeFloat64 = n("setFloat64", 64), a.prototype.readASCIIString = function(t) {
      return p(this, t);
    }, a.prototype.readUTF8String = function(t) {
      return B(this, t);
    }, a.prototype.writeASCIIString = function(t, i) {
      I(this, t, i);
    }, a.prototype.writeUTF8String = function(t, i) {
      x(this, t, i);
    }, a.prototype.readBitStream = function(t) {
      var i = new a(this._view);
      return i._startIndex = this._index, i._index = this._index, i.length = t, this._index += t, i;
    }, a.prototype.writeBitStream = function(t, i) {
      i || (i = t.bitsLeft);
      for (var d; i > 0; )
        d = Math.min(i, 32), this.writeBits(t.readBits(d), d), i -= d;
    }, a.prototype.readArrayBuffer = function(t) {
      var i = this._view.getArrayBuffer(this._index, t);
      return this._index += t * 8, i;
    }, a.prototype.writeArrayBuffer = function(t, i) {
      this.writeBitStream(new a(t), i * 8);
    }, y.exports && (y.exports = {
      BitView: r,
      BitStream: a
    });
  })();
})(A);
var E = A.exports;
const M = [0, 1, 3, 7, 15, 31, 63, 127, 255];
class F {
  normalizeInt(e) {
    return typeof e == "bigint" && e >= BigInt(Number.MIN_SAFE_INTEGER) && e <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(e) : e;
  }
  decodeVInt(e) {
    if (e.length <= 0)
      throw new u("invalid VInt");
    let r = BigInt(0);
    for (let s = 0; s < e.length; s++) {
      const n = e[s];
      if (s < e.length - 1) {
        if (n & 128)
          throw new u("invalid VInt");
        r = r * BigInt(128) + BigInt(n & 127);
      } else {
        if ((n & 128) !== 128)
          throw new u("invalid VInt");
        r = r * BigInt(64) + BigInt(n & 63);
        break;
      }
    }
    return this.normalizeInt(r);
  }
  decodeZigZag(e) {
    if (e < 0)
      throw new u("illegal zigzag value");
    if (typeof e == "bigint") {
      if (e <= BigInt(2147483647))
        return e % BigInt(2) === BigInt(1) ? this.normalizeInt(-(e >> BigInt(1)) - BigInt(1)) : this.normalizeInt(e >> BigInt(1));
      if (e % BigInt(2) === BigInt(1)) {
        const r = (e - BigInt(1)) / BigInt(2);
        return this.normalizeInt(-r - BigInt(1));
      } else {
        const r = e / BigInt(2);
        return this.normalizeInt(r);
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
    const r = new ArrayBuffer(e.length), s = new DataView(r);
    for (let n = 0; n < e.length; n++)
      s.setUint8(n, e[n]);
    return s;
  }
  // big-endian encoding
  decodeFloat32(e) {
    return this.toDataView(e).getFloat32(0, !1);
  }
  // big-endian encoding
  decodeFloat64(e) {
    return this.toDataView(e).getFloat64(0, !1);
  }
  decodeFixedLengthBigEndianEncodedBits(e, r) {
    const s = new Uint8Array(Math.ceil(r / 8));
    let n = 0, p = r % 7, B = 0, c = 0, I = e[n], x = 0, U;
    for (; n < e.length; ) {
      const a = Math.min(p, 8 - c);
      x <<= a, x |= I >> p - a, p -= a, I &= M[p], c += a, p === 0 && (n++, p = 7, I = e[n]), c === 8 && (U = B, s[U] = x, B++, c = 0, x = 0);
    }
    return c > 0 && (x <<= 8 - c, U = B, s[U] = x), s;
  }
  decodeSafeBinaryEncodedBits(e, r) {
    if (r === 0)
      return new Uint8Array(0);
    const s = new ArrayBuffer(r), n = new E.BitView(s);
    n.bigEndian = !0;
    let p = 0, B = r * 8;
    for (let c = 0; c < e.length - 1; c++) {
      let I = e[c];
      n.setBits(p, I, 7), p += 7, B -= 7;
    }
    if (B > 0) {
      const c = e[e.length - 1];
      n.setBits(p, c, B);
    }
    return new Uint8Array(s);
  }
}
class N {
  constructor(e) {
    this.inputStream = e, this.decoder = new F();
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
      const r = this.read();
      if (e.push(r), (r & 128) === 128)
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
    const r = this.inputStream.readArray(Math.ceil(e / 7));
    return this.decoder.decodeFixedLengthBigEndianEncodedBits(r, e);
  }
  readSafeBinary() {
    const e = this.readUnsignedVint();
    if (typeof e == "bigint")
      throw new u("invalid length");
    const r = Math.ceil(e * 8 / 7), s = this.inputStream.readArray(r);
    return this.decoder.decodeSafeBinaryEncodedBits(s, e);
  }
  readBigInt() {
    const e = this.readSafeBinary();
    let r = BigInt(0);
    if (e.length === 0)
      return r;
    const s = (e[0] & 128) === 128;
    for (let n = 0; n < e.length; n++)
      r = r * BigInt(256) + BigInt(s ? e[n] ^ 255 : e[n]);
    return s && (r = -r - BigInt(1)), r;
  }
  readBigDecimal() {
    const e = this.readSignedVint();
    if (typeof e == "bigint")
      throw new u("invalid scale");
    const r = this.readBigInt();
    return Number(r) * Math.pow(10, e);
  }
  readLongString() {
    const e = [];
    for (; ; ) {
      const r = this.inputStream.read();
      if (r === 252)
        break;
      e.push(r);
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
const b = new u("end of input stream reached");
class P {
  constructor(e) {
    this.index = 0, this.array = e;
  }
  isEof() {
    return this.index >= this.array.length;
  }
  read() {
    if (this.isEof())
      throw b;
    const e = this.array[this.index];
    return this.index++, e;
  }
  readArray(e) {
    if (this.isEof())
      throw b;
    if (e < 0)
      throw new u("invalid read amount");
    const r = Math.min(this.array.length, this.index + e), s = this.array.subarray(this.index, r);
    return this.index = r, s;
  }
  peek() {
    if (this.isEof())
      throw b;
    return this.array[this.index];
  }
  skip(e) {
    if (this.isEof())
      throw b;
    if (e < 0)
      throw new u("invalid skip amount");
    this.index += e;
  }
}
class _ {
  constructor(e, r, s, n) {
    this.name = e, this.keyMode = r, this.enabled = s, this.maxStrings = n, this.reset(), this.strings = [], this.stringMap = {}, this.reset();
  }
  reset() {
    this.keyMode ? (this.strings = [], this.stringMap = {}) : (this.strings = [""], this.stringMap = {});
  }
  static newValues(e) {
    return new _("values", !1, e, 1024);
  }
  static newKeyNames(e) {
    return new _("keyNames", !0, e, 1024);
  }
  addString(e) {
    if (!this.enabled || new TextEncoder().encode(e).length > 64)
      return -1;
    if (e in this.stringMap)
      return this.stringMap[e];
    this.keyMode ? this.strings.length >= this.maxStrings && this.reset() : this.strings.length > this.maxStrings && this.reset();
    const s = this.strings.length;
    return this.strings.push(e), this.stringMap[e] = s, s;
  }
  getString(e) {
    if (!this.enabled)
      throw new u("shared strings are not enabled");
    if (e >= this.strings.length)
      throw new u("shared string reference out of range");
    return this.strings[e];
  }
}
function T(y, e) {
  return new L(y, e).parse();
}
class L {
  constructor(e, r) {
    this.decoderStream = new N(new P(e)), this.options = r, this.decoder = new F(), this.sharedPropertyName = !1, this.sharedStringValue = !1, this.rawBinary = !1, this.version = 0, this.sharedPropertyNames = _.newKeyNames(!1), this.sharedStringValues = _.newValues(!1);
  }
  parse() {
    const e = this.decoderStream.read(), r = this.decoderStream.read(), s = this.decoderStream.read();
    if (e !== 58 || r !== 41 || s !== 10)
      throw new u("invalid Smile header");
    const n = this.decoderStream.read();
    return this.sharedPropertyName = (n & 1) === 1, this.sharedStringValue = (n & 2) === 2, this.rawBinary = (n & 4) === 4, this.version = n >> 4, this.sharedPropertyNames = _.newKeyNames(this.sharedPropertyName), this.sharedStringValues = _.newValues(this.sharedStringValue), this.readValue();
  }
  readValue() {
    const e = this.decoderStream.read(), r = e >> 5, s = e & 31;
    switch (r) {
      case 0:
        return this.sharedStringValues.getString(s);
      case 1:
        return this.readSimpleLiteralValue(e);
      case 2: {
        const n = this.decoderStream.readAscii(s + 1);
        return this.sharedStringValues.addString(n), n;
      }
      case 3: {
        const n = this.decoderStream.readAscii(s + 33);
        return this.sharedStringValues.addString(n), n;
      }
      case 4: {
        const n = this.decoderStream.readUtf8(s + 2);
        return this.sharedStringValues.addString(n), n;
      }
      case 5: {
        const n = this.decoderStream.readUtf8(s + 34);
        return this.sharedStringValues.addString(n), n;
      }
      case 6:
        return this.decoder.decodeZigZag(s);
      case 7:
        return this.readBinaryLongTextStructureValues(e);
      default:
        throw new u(`unknown token class: ${r}`);
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
    throw new u("invalid value token 0x" + e.toString(16));
  }
  readBinaryLongTextStructureValues(e) {
    if (e === 224)
      return this.decoderStream.readLongAscii();
    if (e === 228)
      return this.decoderStream.readLongUtf8();
    if (e === 232)
      return this.decoderStream.readSafeBinary();
    if (e >= 236 && e <= 239) {
      const r = (e & 3) << 8 | this.decoderStream.read();
      return this.sharedStringValues.getString(r);
    } else if (e === 248) {
      const r = [];
      for (; this.decoderStream.peek() !== 249; )
        r.push(this.readValue());
      return this.decoderStream.read(), r;
    } else if (e === 250) {
      const r = {};
      for (; this.decoderStream.peek() !== 251; ) {
        const s = this.readKey(), n = this.readValue();
        r[s] = n;
      }
      return this.decoderStream.read(), r;
    } else if (e === 253) {
      const r = this.decoderStream.readUnsignedVint();
      if (typeof r == "bigint")
        throw new u("invalid length");
      return this.decoderStream.readBytes(r);
    } else
      throw new u("invalid value token 0x" + e.toString(16));
  }
  readKey() {
    const e = this.decoderStream.read();
    if (e === 32)
      return "";
    if (e >= 48 && e <= 51) {
      const r = (e & 3) << 8 | this.decoderStream.read();
      return this.sharedPropertyNames.getString(r);
    } else {
      if (e === 52)
        return this.decoderStream.readLongUtf8();
      if (e >= 64 && e <= 127) {
        const r = e & 63;
        return this.sharedPropertyNames.getString(r);
      } else if (e >= 128 && e <= 191) {
        const r = this.decoderStream.readAscii((e & 63) + 1);
        return this.sharedPropertyNames.addString(r), r;
      } else if (e >= 192 && e <= 247) {
        const r = this.decoderStream.readUtf8((e & 63) + 2);
        return this.sharedPropertyNames.addString(r), r;
      } else
        throw new u("invalid key token 0x" + e.toString(16));
    }
  }
}
export {
  u as SmileError,
  T as parse
};
//# sourceMappingURL=smile-js.js.map
