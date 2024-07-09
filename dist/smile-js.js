class u extends Error {
  constructor(e) {
    super(e);
  }
}
var A = { exports: {} };
(function(w) {
  (function(e) {
    var r = function(t, i, d) {
      var a = t instanceof ArrayBuffer || typeof Buffer < "u" && t instanceof Buffer;
      if (!a)
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
      var a = this._view.length * 8 - t;
      if (i > a)
        throw new Error("Cannot get " + i + " bit(s) from offset " + t + ", " + a + " available");
      for (var h = 0, c = 0; c < i; ) {
        var m = i - c, p = t & 7, f = this._view[t >> 3], l = Math.min(m, 8 - p), B, S;
        this.bigEndian ? (B = ~(255 << l), S = f >> 8 - l - p & B, h <<= l, h |= S) : (B = ~(255 << l), S = f >> p & B, h |= S << c), t += l, c += l;
      }
      return d ? (i !== 32 && h & 1 << i - 1 && (h |= -1 ^ (1 << i) - 1), h) : h >>> 0;
    }, r.prototype.setBits = function(t, i, d) {
      var a = this._view.length * 8 - t;
      if (d > a)
        throw new Error("Cannot set " + d + " bit(s) from offset " + t + ", " + a + " available");
      for (var h = 0; h < d; ) {
        var c = d - h, m = t & 7, p = t >> 3, f = Math.min(c, 8 - m), l, B, S;
        if (this.bigEndian) {
          l = ~(-1 << f), B = i >> d - h - f & l;
          var U = 8 - m - f;
          S = ~(l << U), this._view[p] = this._view[p] & S | B << U;
        } else
          l = ~(255 << f), B = i & l, i >>= f, S = ~(l << m), this._view[p] = this._view[p] & S | B << m;
        t += f, h += f;
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
      for (var d = new Uint8Array(i), a = 0; a < i; a++)
        d[a] = this.getUint8(t + a * 8);
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
    function x(t, i) {
      return g(t, i, !1);
    }
    function v(t, i) {
      return g(t, i, !0);
    }
    function g(t, i, d) {
      if (i === 0)
        return "";
      var a = 0, h = [], c = !0, m = !!i;
      for (i || (i = Math.floor((t._length - t._index) / 8)); a < i; ) {
        var p = t.readUint8();
        if (p === 0 && (c = !1, !m))
          break;
        c && h.push(p), a++;
      }
      var f = String.fromCharCode.apply(null, h);
      if (d)
        try {
          return decodeURIComponent(escape(f));
        } catch {
          return f;
        }
      else
        return f;
    }
    function _(t, i, d) {
      for (var a = d || i.length + 1, h = 0; h < a; h++)
        t.writeUint8(h < i.length ? i.charCodeAt(h) : 0);
    }
    function y(t, i, d) {
      for (var a = E(i), h = d || a.length + 1, c = 0; c < h; c++)
        t.writeUint8(c < a.length ? a[c] : 0);
    }
    function E(t) {
      var i = [], d, a;
      for (d = 0; d < t.length; d++)
        a = t.charCodeAt(d), a <= 127 ? i.push(a) : a <= 2047 ? (i.push(a >> 6 | 192), i.push(a & 63 | 128)) : a <= 65535 ? (i.push(a >> 12 | 224), i.push(a >> 6 & 63 | 128), i.push(a & 63 | 128)) : (i.push(a >> 18 | 240), i.push(a >> 12 & 63 | 128), i.push(a >> 6 & 63 | 128), i.push(a & 63 | 128));
      return i;
    }
    var o = function(t, i, d) {
      var a = t instanceof ArrayBuffer || typeof Buffer < "u" && t instanceof Buffer;
      if (!(t instanceof r) && !a)
        throw new Error("Must specify a valid BitView, ArrayBuffer or Buffer");
      a ? this._view = new r(t, i, d) : this._view = t, this._index = 0, this._startIndex = 0, this._length = this._view.byteLength * 8;
    };
    Object.defineProperty(o.prototype, "index", {
      get: function() {
        return this._index - this._startIndex;
      },
      set: function(t) {
        this._index = t + this._startIndex;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(o.prototype, "length", {
      get: function() {
        return this._length - this._startIndex;
      },
      set: function(t) {
        this._length = t + this._startIndex;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(o.prototype, "bitsLeft", {
      get: function() {
        return this._length - this._index;
      },
      enumerable: !0,
      configurable: !0
    }), Object.defineProperty(o.prototype, "byteIndex", {
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
    }), Object.defineProperty(o.prototype, "buffer", {
      get: function() {
        return this._view.buffer;
      },
      enumerable: !0,
      configurable: !1
    }), Object.defineProperty(o.prototype, "view", {
      get: function() {
        return this._view;
      },
      enumerable: !0,
      configurable: !1
    }), Object.defineProperty(o.prototype, "bigEndian", {
      get: function() {
        return this._view.bigEndian;
      },
      set: function(t) {
        this._view.bigEndian = t;
      },
      enumerable: !0,
      configurable: !1
    }), o.prototype.readBits = function(t, i) {
      var d = this._view.getBits(this._index, t, i);
      return this._index += t, d;
    }, o.prototype.writeBits = function(t, i) {
      this._view.setBits(this._index, t, i), this._index += i;
    }, o.prototype.readBoolean = s("getBoolean", 1), o.prototype.readInt8 = s("getInt8", 8), o.prototype.readUint8 = s("getUint8", 8), o.prototype.readInt16 = s("getInt16", 16), o.prototype.readUint16 = s("getUint16", 16), o.prototype.readInt32 = s("getInt32", 32), o.prototype.readUint32 = s("getUint32", 32), o.prototype.readFloat32 = s("getFloat32", 32), o.prototype.readFloat64 = s("getFloat64", 64), o.prototype.writeBoolean = n("setBoolean", 1), o.prototype.writeInt8 = n("setInt8", 8), o.prototype.writeUint8 = n("setUint8", 8), o.prototype.writeInt16 = n("setInt16", 16), o.prototype.writeUint16 = n("setUint16", 16), o.prototype.writeInt32 = n("setInt32", 32), o.prototype.writeUint32 = n("setUint32", 32), o.prototype.writeFloat32 = n("setFloat32", 32), o.prototype.writeFloat64 = n("setFloat64", 64), o.prototype.readASCIIString = function(t) {
      return x(this, t);
    }, o.prototype.readUTF8String = function(t) {
      return v(this, t);
    }, o.prototype.writeASCIIString = function(t, i) {
      _(this, t, i);
    }, o.prototype.writeUTF8String = function(t, i) {
      y(this, t, i);
    }, o.prototype.readBitStream = function(t) {
      var i = new o(this._view);
      return i._startIndex = this._index, i._index = this._index, i.length = t, this._index += t, i;
    }, o.prototype.writeBitStream = function(t, i) {
      i || (i = t.bitsLeft);
      for (var d; i > 0; )
        d = Math.min(i, 32), this.writeBits(t.readBits(d), d), i -= d;
    }, o.prototype.readArrayBuffer = function(t) {
      var i = this._view.getArrayBuffer(this._index, t);
      return this._index += t * 8, i;
    }, o.prototype.writeArrayBuffer = function(t, i) {
      this.writeBitStream(new o(t), i * 8);
    }, w.exports && (w.exports = {
      BitView: r,
      BitStream: o
    });
  })();
})(A);
var V = A.exports;
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
  decodeFixedLengthBigEndianEncodedBytes(e, r) {
    const s = new ArrayBuffer(r), n = new V.BitView(s);
    n.bigEndian = !0;
    let x = 0, v = r * 8;
    for (let g = 0; g < e.length; g++) {
      const _ = e[g], y = Math.min(v, g === 0 ? 7 - (e.length * 7 - r * 8) : 7);
      n.setBits(x, _, y), x += y, v -= y;
    }
    return new Uint8Array(s);
  }
  decodeSafeBinaryEncodedBits(e, r) {
    const s = new ArrayBuffer(r), n = new V.BitView(s);
    n.bigEndian = !0;
    let x = 0, v = r * 8;
    for (let g = 0; g < e.length; g++) {
      const _ = e[g], y = Math.min(v, 7);
      n.setBits(x, _, y), x += y, v -= y;
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
    return this.decoder.decodeFloat32(this.readFixedLengthBigEndianEncodedBytes(4));
  }
  readFloat64() {
    return this.decoder.decodeFloat64(this.readFixedLengthBigEndianEncodedBytes(8));
  }
  readFixedLengthBigEndianEncodedBytes(e) {
    const r = Math.ceil(e * 8 / 7), s = this.inputStream.readArray(r);
    return this.decoder.decodeFixedLengthBigEndianEncodedBytes(s, e);
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
class I {
  constructor(e, r, s) {
    this.name = e, this.enabled = r, this.maxStrings = s, this.strings = [], this.stringMap = {}, this.reset();
  }
  reset() {
    this.strings = [], this.stringMap = {};
  }
  static newValues(e) {
    return new I("values", e, 1024);
  }
  static newKeyNames(e) {
    return new I("keyNames", e, 1024);
  }
  addString(e) {
    if (!this.enabled || new TextEncoder().encode(e).length > 64)
      return -1;
    if (e in this.stringMap)
      return this.stringMap[e];
    this.strings.length >= this.maxStrings && this.reset();
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
function M(w, e) {
  return new L(w, e).parse();
}
class L {
  constructor(e, r) {
    this.decoderStream = new N(new P(e)), this.options = r, this.decoder = new F(), this.sharedPropertyName = !1, this.sharedStringValue = !1, this.rawBinary = !1, this.version = 0, this.sharedPropertyNames = I.newKeyNames(!1), this.sharedStringValues = I.newValues(!1);
  }
  parse() {
    const e = this.decoderStream.read(), r = this.decoderStream.read(), s = this.decoderStream.read();
    if (e !== 58 || r !== 41 || s !== 10)
      throw new u("invalid Smile header");
    const n = this.decoderStream.read();
    return this.sharedPropertyName = (n & 1) === 1, this.sharedStringValue = (n & 2) === 2, this.rawBinary = (n & 4) === 4, this.version = n >> 4, this.sharedPropertyNames = I.newKeyNames(this.sharedPropertyName), this.sharedStringValues = I.newValues(this.sharedStringValue), this.readValue();
  }
  readValue() {
    const e = this.decoderStream.read(), r = e >> 5, s = e & 31;
    switch (r) {
      case 0:
        return this.sharedStringValues.getString(s - 1);
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
  M as parse
};
//# sourceMappingURL=smile-js.js.map
