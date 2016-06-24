"use strict";

// Pre-fill this array so we don't have to run the hash function
// multiple times.
var table = {};
var lengths = {};
var total = 0;
wordlist.forEach(function(word) {
  var hashed = hashIt(word);
  if (table.hasOwnProperty(hashed)) table[hashed]++;
  else table[hashed] = 0;
  if (lengths.hasOwnProperty(hashed.length)) lengths[hashed.length]++;
  else lengths[hashed.length] = 1;
  total++;
});
var sum = Object.values(table).reduce(function(a, b) { return a+b }, 0);
console.log("Test found " + sum + " collisions among " + total + " words (" + (sum/total*100) + "%)");

describe("Your hashIt function", function() {
  it("outputs a string", function() {
    var input = "Hello, world!";
    var output = hashIt(input);
    expect(output).toEqual(jasmine.any(String));
  });
  it("has no collisions for a short list", function() {
    var strings = "The quick brown fox jumps over the lazy dog".split(" ");
    var table = {};
    strings.forEach(function(string) {
      if (table[hashIt(string)]) throw new Error('Detected collision');
      table[hashIt(string)] = 1;
    });
    // We need this to have at least one expectation.
    expect(true).toBe(true);
  });
  it("always produces the same size output", function() {
    expect(Object.values(lengths).length).toBe(1);
  });
  it("achieves a collision rate <10% for a very long list", function() {
    expect(sum/total).toBeLessThan(0.1);
  });
  it("achieves a collision rate <1% for a very long list", function() {
    expect(sum/total).toBeLessThan(0.01);
  });
});

