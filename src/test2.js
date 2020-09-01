
var  { Tokenizer }    = require('../src/test2_tokenizer.js');
var  { Parser }    = require('../src/test2_parser.js');
const { TokenTypes }  = require('../src/test2_tokentypes.js');
const sentenceSource  = require('../data/test2.json');
//const testSource      = require('../data/testcases_tokenizer.json');
const testSource     = require('../data/test2_unittest.json');
var fs = require('fs');

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

let tokenizer = new Tokenizer(this);
let parser = new Parser(this);
console.log("*********************************************");
console.log("* T O K E N I Z E R *************************");
console.log("*********************************************\n");
//console.log("");
let utout = "D:\\users\\wen\\documents\\personal\\ronlyn\\medical\\therapy\\SLP\\apps\\data\\sb01test.txt";
fs.writeFileSync(utout, "SB01");
for (let secIdx = 0; secIdx < sentenceSource.sentencebank01.section.length; secIdx++) {
//  console.log("*********************************************");
  console.log("SB01:SECTION["+secIdx+"]: "+sentenceSource.sentencebank01.section[secIdx].name+"*********************************************");
  for (let sentIdx = 0; sentIdx < sentenceSource.sentencebank01.section[secIdx].sentence.length; sentIdx++) {
    console.log("-------------------------------------------");
    console.log("SB01:SECTION["+sentenceSource.sentencebank01.section[secIdx].id+"]:SENTENCE["+sentIdx+"]: "+sentenceSource.sentencebank01.section[secIdx].sentence[sentIdx].content);
    let input = sentenceSource.sentencebank01.section[secIdx].sentence[sentIdx];
    let result = tokenizer.insertMarkupTags(input.content);
    console.log("SB01:SECTION["+testSource.UT01.section[secIdx].id+"]:SENTENCE["+sentIdx+"]: "+result + " (Marked up)");
    let tokens = tokenizer.tokenize(result);
    utjson.id = sentIdx;
    utjson.content = sentenceSource.sentencebank01.section[secIdx].sentence[sentIdx].content;
    utjson.expected = tokenizer.formatForUT(tokens);
//    console.log(JSON.stringify(utjson));
//    fs.appendFileSync(utout, JSON.stringify(utjson)+"\n,");
    console.log(tokenizer.unitTest(tokens, input.expected) ? "PASSED" : "FAILED");
//    tokens.forEach(token => console.log("+-"+token.dump(20, 20)));
//    let parseTree = parser.parse(sentence);
    let parseTree = parser.parse(tokens);
    parser.serialize(parseTree);
//    tokens.forEach(token => console.log("+-"+token.dump(20, 20)));
//    tokens.forEach(token => console.log(token));
    // (let token = 0; tokenIdx < tokens.length; tokenIdx++)
///      console.log("token["+tokenIdx+"]: '"+tokens[tokenIdx].text + "'  ("+tokens[tokenIdx].position +":"+tokens[tokenIdx].length+") ("+tokens[tokenIdx].type+")");
  }
}
tokenizer = new Tokenizer(this);
tokens = null;

for (let secIdx = 0; secIdx < testSource.UT01.section.length; secIdx++) {
  console.log("*********************************************");
  console.log("UT01:SECTION["+secIdx+"]: "+testSource.UT01.section[secIdx].name);
  for(let sentIdx = 0; sentIdx < testSource.UT01.section[secIdx].sentence.length; sentIdx++) {
    console.log("-------------------------------------------");
    console.log("UT01:SECTION["+testSource.UT01.section[secIdx].id+"]:SENTENCE["+sentIdx+"]: "+testSource.UT01.section[secIdx].sentence[sentIdx].content);
    let input = testSource.UT01.section[secIdx].sentence[sentIdx];
    let result = tokenizer.insertMarkupTags(input.content);
//     result = tokenizer.insertMarkupTags(result);
    console.log("UT01:SECTION["+testSource.UT01.section[secIdx].id+"]:SENTENCE["+sentIdx+"]: "+result + " (Marked up)");
    let tokens = tokenizer.tokenize(result);
//    tokenizer.dump(tokens);
//    console.log(tokenizer.formatForUT(tokens));
    utjson.id = sentIdx;
    utjson.content = testSource.UT01.section[secIdx].sentence[sentIdx].content;
    utjson.expected = tokenizer.formatForUT(tokens);
//    console.log(JSON.stringify(utjson));
    fs.appendFileSync(utout, JSON.stringify(utjson)+",\n");
    console.log(tokenizer.unitTest(tokens, input.expected) ? "PASSED" : "FAILED");
//    tokens.forEach(token => console.log("+-"+token.dump(20, 20)));
///    for (let tokenIdx = 0; tokenIdx < tokens.length; tokenIdx++)
///      console.log("token["+tokenIdx+"]: '"+tokens[tokenIdx].text + "'\t\t("+tokens[tokenIdx].position +":"+tokens[tokenIdx].length+") ("+tokens[tokenIdx].type+")");
  }
}
