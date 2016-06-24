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
  var output = ""
  for (var i = 0; i < word.length; i ++) {
  	output += word[i].charCodeAt()
  }
  if (output.length < 1000) {
  	for (var i = 0; i < output.length; i ++) {
  		output += output[i];
  	}
  }
  return output;
}

