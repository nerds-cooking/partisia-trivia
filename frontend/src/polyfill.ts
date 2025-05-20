// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// This file is used to polyfill the global objects that are not available in the browser environment.

import { Buffer } from "buffer";
import crypto from "crypto-browserify";
import { EventEmitter } from "events";
import { Duplex, Stream, Transform } from "stream-browserify";

if (!window.Buffer) {
  window.Buffer = Buffer;
}
if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}
if (!globalThis.Transform) {
  globalThis.Transform = Transform;
}
if (!globalThis.Stream) {
  globalThis.Stream = Stream;
}
if (!globalThis.Duplex) {
  globalThis.Duplex = Duplex;
}
if (!globalThis.EventEmitter) {
  globalThis.EventEmitter = EventEmitter;
}
