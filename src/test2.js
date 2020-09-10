var  { MyDate }    = require('../src/utilities.js');
var  { Tokenizer }    = require('../src/test2_tokenizer.js');
var  { Parser }    = require('../src/test2_parser.js');
const { TokenTypes }  = require('../src/test2_tokentypes.js');

const ut_tokenizer = require('../data/test2_unittest_tokenizer.json');
const ut_parser = require('../data/test2_unittest_parser.json');
//const testSource      = require('../data/testcases_tokenizer.json');
//const testSource     = require('../data/test2_unittest.json');
const fs = require('fs');
const path = require('path');

var tokenType;
var spanTree;
var outputHTML;
var tokenlist;
const utjson = {
  id: "0",
  content: "",
  expected: ""
};
//console.log(sentenceSource.sentencebank01.section[0].sentence[0].content);
//console.log(sentenceSource.sentencebank01.section[0].sentence[0].partOfSpeech);
//console.log(sentenceSource.sentencebank01.section[1].sentence[0].content);
//console.log(sentenceSource.sentencebank01.section[1].sentence[0].partOfSpeech);

const verbose = false;
const utoutput = false; // create expected values for unit test
let timestamp = new MyDate().yyyymmddhhmmss();
let passCount = 0;
let totalCount = 0;
let totalPassCount = 0;
let secId = 0;
let sentId = 0;
const basepath = "D:\\users\\wen\\documents\\personal\\ronlyn\\medical\\therapy\\SLP\\apps\\data\\";
const uttokenout = basepath+"ut01token.txt";
const utparserout = basepath+"ut01parse.txt";
let testSectionLabel = "";
let unitTestSuccessful;
console.log(path.basename(__filename) + " started at " + timestamp);
console.log("verbose mode: "+(verbose ? "ON" : "OFF"));
console.log("unit test output mode: " + (utoutput ? "ON" : "OFF"));
totalPassCount = 0;
totalCount = 0;
if (verbose) console.log("*********************************************");
if (verbose) console.log("* T O K E N I Z E R *************************");
if (uttokenout) fs.writeFileSync(uttokenout, timestamp + "\n");
for (let secIdx = 0; secIdx < ut_tokenizer.Tokenizer01.section.length; secIdx++) {
  passCount = 0;
  secId = ut_tokenizer.Tokenizer01.section[secIdx].id;
  testSectionLabel = "Tokenizer01 SECTION[" + secId + "]";
  if (verbose) console.log("*********************************************");
  if (verbose) console.log(testSectionLabel+": "+ ut_tokenizer.Tokenizer01.section[secIdx].name);
  for (let sentIdx = 0; sentIdx < ut_tokenizer.Tokenizer01.section[secIdx].sentence.length; sentIdx++) {
    sentId = ut_tokenizer.Tokenizer01.section[secIdx].sentence.id;
    testSentLabel = testSectionLabel + "[" + sentId + "]";
    if (verbose) console.log("---------------------------------------------");
    if (verbose) console.log(testSentLabel + ut_tokenizer.Tokenizer01.section[secIdx].name);
    if (verbose) console.log(testSentLabel + ut_tokenizer.Tokenizer01.section[secIdx].sentence[sentIdx].content);
    let input = ut_tokenizer.Tokenizer01.section[secIdx].sentence[sentIdx];
    let tokenizer = new Tokenizer(this);
    let result = tokenizer.insertMarkupTags(input.content);
    if (verbose) console.log(testSentLabel + result + " (Marked up)");
    let tokens = tokenizer.tokenize(result);
    /// Only needed to generate expected results
    unitTestSuccessful = tokenizer.unitTest(tokens, input.expected);
    if (unitTestSuccessful) passCount++;
    if (verbose) console.log(testSentLabel + ": " + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (utoutput) {
      utjson.id = sentIdx;
      utjson.content = ut_tokenizer.Tokenizer01.section[secIdx].sentence[sentIdx].content;
      utjson.expected = tokenizer.serializeForUnitTest(tokens);
      fs.appendFileSync(uttokenout, JSON.stringify(utjson) + "\n,");
    }
  }
  console.log(testSectionLabel + ": " + passCount + "/"
              + ut_tokenizer.Tokenizer01.section[secIdx].sentence.length + " PASSED");
  totalPassCount += passCount;
  totalCount += ut_tokenizer.Tokenizer01.section[secIdx].sentence.length;
}
console.log("Tokenizer01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED");

tokens = null;
totalPassCount = 0;
totalCount = 0;
if (verbose) console.log("*********************************************");
if (verbose) console.log("* P A R S E R *******************************");
if (utoutput) fs.writeFileSync(utparserout, timestamp+"\n");
for (let secIdx = 0; secIdx < ut_parser.Parser01.section.length; secIdx++) {
  passCount = 0;
  secId = ut_parser.Parser01.section[secIdx].id;
  testSectionLabel = "Parser01 SECTION[" + secId + "]";
  if (verbose) console.log("*********************************************");
  if (verbose) console.log(testSectionLabel+": "+ ut_parser.Parser01.section[secIdx].name);
//  console.log("UT01:SECTION["+secIdx+"]: "+testSource.UT01.section[secIdx].name);
  for(let sentIdx = 0; sentIdx < ut_parser.Parser01.section[secIdx].sentence.length; sentIdx++) {
    sentId = ut_parser.Parser01.section[secIdx].sentence.id;
    testSentLabel = testSectionLabel + "[" + sentId + "]";
    if (verbose) console.log("---------------------------------------------");
    if (verbose) console.log(testSectionLabel + ut_parser.Parser01.section[secIdx].name);
    if (verbose) console.log(testSentLabel + ut_parser.Parser01.section[secIdx].sentence[sentIdx].content);
    let input = ut_parser.Parser01.section[secIdx].sentence[sentIdx];
    tokenizer = new Tokenizer(this);
    let result = tokenizer.insertMarkupTags(input.content);
    if (verbose) console.log(testSentLabel + result + " (Marked up)");
    let tokens = tokenizer.tokenize(result);
    let parser = new Parser(this);
    let parserTree = parser.parseTokens(tokens);
    utjson.expected = parser.serializeForUnitTest(parserTree);
    unitTestSuccessful = parser.unitTest(parserTree, input.expected);
    if (unitTestSuccessful) passCount++;
    if (verbose) console.log(testSentLabel + ": " + ((unitTestSuccessful) ? "PASSED" : "FAILED"));
    if (utoutput) {
      utjson.id = sentIdx;
      utjson.content = ut_parser.Parser01.section[secIdx].sentence[sentIdx].content;
      utjson.expected = parser.serializeForUnitTest(parserTree);
      fs.appendFileSync(utparserout, JSON.stringify(utjson) + ",\n");
    }
  }
  console.log(testSectionLabel+": "+ passCount +"/"
              + ut_parser.Parser01.section[secIdx].sentence.length + " PASSED");
  totalPassCount += passCount;
  totalCount += ut_parser.Parser01.section[secIdx].sentence.length;
}
console.log("Parser01 Overall total: " + totalPassCount + "/" + totalCount + " PASSED");
