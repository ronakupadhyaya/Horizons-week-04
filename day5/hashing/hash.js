"use strict";

// INLINE EXERCISE: Password hashing
//
// Write a hash function below that takes an input string and returns an
// output hash (as a string). The function should:
// 1. Be fast to run
// 2. Produce as few collisions as possible
//
// We've filled in a very simple, naive (and pretty bad) hash function for you
// as a starting point.

function hashIt(word) {
  // This hash function returns a string, and it's fast, but it's pretty
  // crummy since it produces tons of collisions!
  var hash = 0, i, chr, len;
  if (word.length === 0) return hash;
  for (i = 0, len = word.length; i < len; i++) {
    chr   = word.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  console.log(hash);
  return hash;
}

