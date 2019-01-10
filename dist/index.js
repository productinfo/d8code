"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PSHIFT = 32;
/**
 * Encodes binary data as UTF-8, returns it as a `Uint8Array`
 *
 * Characters `s1` and `s2` will be avoided in the output. By default, these
 * are set to `34` (`"` character) and `92` (`\` character).
 * You may want to set `s1` to `39` if you are using `'` instead of `"` around strings.
 *
 * @returns `bin` encoded as valid UTF-8, in a `Uint8Array`.
 * @param bin Binary input (Uint8Array)
 * @param s1 Character code to avoid in the output
 * @param s2 Second character code to avoid in the output
 */
function encode(bin, s1, s2) {
    if (s1 === void 0) { s1 = 34; }
    if (s2 === void 0) { s2 = 92; }
    var encoded = [];
    bin.forEach(function (b) {
        b += PSHIFT;
        if (b === s1 || b === s2) {
            b += 0x100;
        }
        if (b < 0x80) {
            encoded.push(b);
        }
        else {
            encoded.push((b >>> 6) | 0xc0, (b & 0x3f) | 0x80);
        }
    });
    return new Uint8Array(encoded);
}
exports.encode = encode;
/**
 * Encodes binary data as UTF-8, returns it as a `string`
 *
 * Characters `s1` and `s2` will be avoided in the output. By default, these
 * are set to `34` (`"` character) and `92` (`\` character).
 * You may want to set `s1` to `39` if you are using `'` instead of `"` around strings.
 *
 * @returns `bin` encoded as valid UTF-8, in a `string`.
 * @param bin Binary input (Uint8Array)
 * @param s1 Character code to avoid in the output
 * @param s2 Second character code to avoid in the output
 */
function encodeToString(bin, s1, s2) {
    if (s1 === void 0) { s1 = 34; }
    if (s2 === void 0) { s2 = 92; }
    return (new TextDecoder("utf-8")).decode(encode(bin));
}
exports.encodeToString = encodeToString;
/**
 * Decode binary data encoded as UTF-8
 *
 * @returns Decoded data, as a `Uint8Array`
 * @param encoded Encoded data, as a `Uint8Array`
 */
function decode(encoded) {
    var bin = [];
    var shift = 0;
    encoded.forEach(function (c) {
        if (c >= 0xc0) {
            if (c < 0xc2 || c > 0xc5) {
                throw new Error("Parse error");
            }
            shift = ((c - 0xc2) << 6) + 0x80;
        }
        else {
            var c2 = (c & 0x7f) + shift;
            if (c2 < PSHIFT || c2 > PSHIFT + 0x17f) {
                throw new Error("Parse error");
            }
            bin.push((c2 - PSHIFT) & 0xff);
            shift = 0;
        }
    });
    return new Uint8Array(bin);
}
exports.decode = decode;
/**
 * Decode binary data encoded as UTF-8, provided as a string
 *
 * @returns Decoded data, as a `Uint8Array`
 * @param encoded Encoded data, as a `string`
 */
function decodeFromString(encoded) {
    return decode((new TextEncoder()).encode(encoded));
}
exports.decodeFromString = decodeFromString;
//# sourceMappingURL=index.js.map