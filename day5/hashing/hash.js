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
var hash = 0;
   if (word.length == 0) return hash;
   for (var i = 0; i < word.length; i++) {
       var char = word.charCodeAt(i);
       console.log(char);
       hash = ((hash<<5)-hash)+char;
       hash = hash & hash; // Convert to 32bit integer
   }
   return String(hash);
}
  // This hash function returns a string, and it's fast, but it's pretty
  // crummy since it produces tons of collisions!
  // return word.length.toString();

