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
  word = word.toString()
  var output = ''
  for (var i=0; i<word.length; i++) {
  	output+=(word[i].charCodeAt()*31*Math.pow(2,i)).toString(16)
  }
  while (output.length<256) {
  	output+=output
  }
  return output.slice(0,256);
}

