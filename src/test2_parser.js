/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/
 // Regroups, rearranges and applies markup attributes across tokens based
 // on markup and compensate for idiosyncracies of the Google Voice API

'use strict';
const  { ContentNodeType } = require('../src/test2_parsertypes.js');
const  { endMarkupTag, TokenType, TokenTag } = require('../src/test2_tokentypes.js');
const  { Tokenizer } = require('../src/test2_tokenizer.js');
const  { Logger } = require('../src/utilities.js');
//const ContentNPrefix = "ContentN_";

class BaseClass {
  constructor(parent) {
    this._parent = parent;
    this._logger = new Logger(this);
  }
  get logger() {
    return this._logger;
  }
  set logger(obj) {
    this._logger = obj;
  }
}
class Formatter extends BaseClass {
  // formatter (sub)classes strictly manage the transformation of Content, NOT the creation or
  // modification of Content.
    constructor() {
      this._content = null;
      this._logger = new Logger(this);
    }
    html() {
      this.logger.warning("abstract method referenced with no implementation");
    }
    set input(input) {
      this.logger.warning("abstract method referenced with no implementation");
    }
}
class ListFormatter extends Formatter {
  constructor(parent) {

  };
}
class FillinListFormatter extends ListFormatter {
  // List of items with fillin table at top of section
  constructor(parent) {

  };
}
class FillinSequenceListFormatter extends FillinListFormatter {
  // List of items with fillin table at top of section
  // e.g. fill in missing words from sentence
  constructor(parent) {

  };
}
class FillinRandomListFormatter extends FillinListFormatter {
  // List of items with fillin table at top of section
  // e.g. guess from a fill-in list
  constructor(parent) {

  };
}
class JournalFormatter extends Formatter {
  // Interprets input JSON section as captions for image assicated with each caption
  constructor(parent) {

  };
}
class JournalEntryFormatter extends Formatter {
    constructor(parent) {
      super(parent);
    }
  }
class StoryFormatter extends Formatter {
  // Interprets input JSON section as a paragraph with or without line numbers
  constructor(parent) {

  };
}
class TestFormatter extends Formatter {
  // Interprets input JSON section as a paragraph with or without line numbers
  constructor(parent) {

  };
}
class SentenceFormatter {
  constructor(parent, sentenceNode) {
    this._sentenceNode = sentenceNode;
  }
  set input(sentenceNode) {
    this._sentenceNode = sentenceNode;
  }
  html() {
  let htmlString = "";
  return htmlString;
  }
}
class ListItemFormatter extends SentenceFormatter {
  constructor(parent) {
    super(parent);
  }
}
class Content extends BaseClass {
  constructor(parent) {
    super(parent);
    this._id = "";
    this._name = "";
  }
  get id() {
    return this._id;
  }
  set id(id) {
    this._id = id;
  }
  get name() {
    return this._name;
  }
  set name(name) {
    this._name = name;
  }
  parse() {
      // should be emplemented in subclass
  }
}
class SectionContent extends Content {
  // a section is defined as a group of sentences or group of sections
  // aka (un)ordered list of sentences aka paragraph, aka journal entry (including images)
  // object is responsible for reading a section of a JSON object including the section details
  // and the associated sentences and return a parse tree.
    constructor(parent) {
      super(parent);
      this._sentenceNodes = new Array();
    }
    parseSentences(SentenceList) {
      SentenceList.forEach(sentence => {
//        this.logger.diagnosticMode = true;
        let sentenceNode = new SentenceContent(this);
        sentenceNode.input = sentence.content;
        this.logger.diagnostic(sentence.content);
        sentenceNode.parseSentence(sentence.content);
        this._sentenceNodes.push(sentenceNode);
      });
  }
  serializeAsTable(col1, col2, col3) {
    let table = "";
    this._sentenceNodes.forEach(sentenceNode => {
      table =  "\nsection["+this.id+"]: "+this.name+"\n"+sentenceNode.input + "\n" + sentenceNode.serializeAsTable(col1, col2, col3)+"\n";
    });
    return table.slice(0,-1);
  }
  transform() {
    let  outputString = "<br>"+this.name;
    this.logger.info("transforming section ("+this._sentenceNodes.length+" sentences)");
    this._sentenceNodes.forEach(sentence => {
      outputString = outputString + sentence.transform()+"\n";
      //this.logger.info(str);
    });
    return outputString.slice(0,-1);
  }
  unitTest(expectedValues) {
    let passCount = 0;
    let totalCount = this._sentenceNodes.length;
    for (let sentIdx = 0; sentIdx < totalCount; sentIdx++) {
      let actual = this._sentenceNodes[sentIdx].serializeForUnitTest();
      let expected = expectedValues[sentIdx].expected;
      if (this._sentenceNodes[sentIdx].unitTest(actual, expected)) passCount++;
    }
    return "section["+this.id+"]:" + this.name+": "+passCount +"/" + totalCount  + " PASSED";
  }
}
class SentenceContent extends Content {
  constructor(parent) {
    super(parent);
    this._input = "";
    this._tokenizer = new Tokenizer(this);
    this._parserNodes = new Array;
    this._tokens = tokens;
    // Generic token typesidentified by tokenizer
    this._ContentNodeClasses = {
      [TokenType.WORD]: ContentNode_WORD,
      [TokenType.NUMBER]: ContentNode_NUMBER,
      [TokenType.PUNCTUATION]: ContentNode_PUNCTUATION,
      [TokenType.MLTAG]: ContentNode_MLTAG,
      [TokenType.MLTAG_END]: ContentNode_MLTAG_END,
      [TokenType.MLTAG_SELFCLOSING]: ContentNode_MLTAG_SELFCLOSING,
      [TokenType.WHITESPACE]: ContentNode_WHITESPACE
    };
    // Application-specific markup tags and associated parser mode type
    this._ParserMarkupNodeClasses = {
      [TokenTag.EMAILADDRESS]: ContentNode_MLTAG_EMAILADDRESS,
      [TokenTag.PHONENUMBER]: ContentNode_MLTAG_PHONENUMBER,
      [TokenTag.TIME]: ContentNode_MLTAG_TIME,
      [TokenTag.DATE1]: ContentNode_MLTAG_DATE1,
      [TokenTag.DATE2]: ContentNode_MLTAG_DATE2,
      [TokenTag.DATE3]: ContentNode_MLTAG_DATE3,
      [TokenTag.CONTRACTION]: ContentNode_MLTAG_CONTRACTION,
      [TokenTag.NUMBER_WITHCOMMAS]: ContentNode_MLTAG_NUMBER_WITHCOMMAS,
      [TokenTag.TOKEN]: ContentNode_MLTAG_TOKEN,
      [TokenTag.USD]: ContentNode_MLTAG_USD
    };
    this.reset();
//    this._parserType = 0;  // derived in part from token type but more detailed
//    this._parserNodes = new Array;
//    this._tokens = null;
  };
  get input() {
    return this._input;
  }
  set input(sentence) {
    this._input = sentence;
  }
  parseSentence(sentence) {
    this.input = sentence;
    let result = this._tokenizer.insertMarkupTags(sentence);
    let tokens = this._tokenizer.tokenize(result);
    let parserTree = this.parseTokens(tokens);
    return parserTree;
  }
  parseTokens(tokens) {
///    this.logger.diagnosticMode = true;
    this._tokens = tokens;
    let tokenIdx = 0;
    while (tokenIdx < tokens.length) {
      let parserNode = null;  //declaration
      let token = tokens[tokenIdx];
      this.logger.diagnostic("token.name=" + token.text);
      this.logger.diagnostic("tokenIdx=" + tokenIdx);
      try {
        if ((token.type === TokenType.MLTAG)
            && (tokens[tokenIdx].text.toLowerCase() in this._ParserMarkupNodeClasses)) {
            this.logger.diagnostic("Encountered token type="+ token.type + " with markup tag=" + token.text);
            parserNode = new this._ParserMarkupNodeClasses[token.text.toLowerCase()](this, tokenIdx);
        }
        else if (token.type in this._ContentNodeClasses) {
          parserNode = new this._ContentNodeClasses[token.type](this, tokenIdx);
          this.logger.diagnostic("Encountered token type=" + token.type);
        }
        else {
          this.logger.diagnostic("Encountered unexpected token type=" + token.type);
        }
        if (parserNode !== null) {
          this.logger.diagnostic("Adding node=" + token.name);
          tokenIdx = parserNode.parse(tokenIdx);
          this._parserNodes.push(parserNode);
          ///console.log(this.constructor.name+".parseTokens():ContentNodeClasses tokenIdx="+tokenIdx);
        }
        else {
          this.logger.error("Encountered unhandled token type=" + token.type + "for token="+token.name);
          ///console.error(this.constructor.name+".parseTokens(): Unexpected token.type="+token.type+" token.tag="+tokens[tokenIdx].text);
          tokenIdx++;
        }
      }
      catch(e) {
        this.logger.error("Unexpected error: "+e.message);
        console.log(e.stack);
//        console.log(e.message);
        tokenIdx++; //
      }
    }
  return this._parserNodes;
  };
  applyHTMLtags() {

  }
  serializeAsTable(col1, col2, col3) {
    let result = "";
    for (let parserNode of this._parserNodes) {
      result = result + parserNode.serializeColumnar(col1, col2, col3)+"\n";
    }
    return result.slice(0,-1);
  }
  emitDom(){

  }
  reset() {
    this._parserType = 0;  // derived in part from token type but more detailed
    this._parserNodes = new Array;
    this._tokens = null;
  }
  serialize() {

  }
  serializeForUnitTest() {
    let nodeList = "";
      this._parserNodes.forEach(node => {
      nodeList = nodeList + node.serializeForUnitTest();
    } );
    return nodeList;
  } //serializeForUnitTest
transform() {
  this.logger.info("transforming sentence ("+this._tokens.length+" tokens)");
  let outputString = "<div>";
  this._parserNodes.forEach(node => {
      outputString = outputString + node.transform();
  });
  return outputString + "</div>";
}
unitTest(actual, expected) {
    return this.serializeForUnitTest(actual) === expected;
  } // unitTest

};
class ContentNode {
  constructor(parent, tokenIdx) {
//    this._tokenList = new Array;  // consider keeping link (by reference) to token list
    this.logger = new Logger(this);
    ///this.logger.diagnosticMode = true;
    this._parentNode = parent;
//    this._tokens = tokens;
    this._type = ""; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
    this._tokenStartIdx = null;
    this._tokenEndIdx = null;
    // get parentType parent.type;
  }
  serializeColumnar(colWidth1, colWidth2) {
    let tokenList = "";
    for (let idx = this._tokenStartIdx; idx <= this._tokenEndIdx; idx++) {
      tokenList = tokenList + this._parentNode._tokens[idx].text;
    }
    if (arguments.length < 1) colWidth1 = 25;
    if (arguments.length < 2) colWidth2 = 10;
    return ("{" + tokenList + "}").padEnd(colWidth1)
        + ("("+this._tokenStartIdx+".."+this._tokenEndIdx+") ").padEnd(colWidth2)
        + "("+this.constructor.name+")";
  }
  parse(tokenIdx) {
    this.logger.diagnostic("Parsing node ="+this._parentNode._tokens[tokenIdx].text);
    this._tokenStartIdx = tokenIdx;
    this._tokenEndIdx = tokenIdx;
    return ++tokenIdx;
  }
  serialize() {
    //each node produces its own output
  }
  serializeForUnitTest() {
    let nodeJson = { TYP: "", START: 0, END: 0 };
    nodeJson.TYP = this._type;
    nodeJson.START = this._tokenStartIdx;
    nodeJson.END = this._tokenEndIdx;
    return JSON.stringify(nodeJson);
  }
  transform() {
    this.logger.info("transforming content node ("+ this._type+")");
    // With the exception of this default, each subclass with determine the proper action
    let outputString = "<span>";
    for (let idx = this._tokenStartIdx; idx <= this._tokenEndIdx; idx++) {
      outputString = outputString + this._parentNode._tokens[idx].text;
    }
    return outputString = outputString + "</span>";
  }
}
class ContentNode_WORD extends ContentNode {
  constructor(parent, tokenIdx) {
    super(parent, tokenIdx);
    this._type = TokenType.WORD; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
  //
  parse(tokenIdx) {    // should be called parse
    return super.parse(tokenIdx);
//    this._tokenStartIdx = tokenIdx;
//    this._tokenEndIdx = tokenIdx;
//    return ++tokenIdx;
  }
}
class ContentNode_NUMBER extends ContentNode {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = TokenType.NUMBER; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
}
class ContentNode_WHITESPACE extends ContentNode {
  // not much to do here but is placeholder for any processing beyond them
  // base class
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = TokenType.WHITESPACE; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
}
class ContentNode_PUNCTUATION extends ContentNode {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = TokenType.PUNCTUATION; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }

}
class ContentNode_MLTAG extends ContentNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG;  // used by subclasses
    //console.log("inside " + this.constructor.name);
  }
}
class ContentNode_MLTAG_ extends ContentNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG;  // used by subclasses
    //console.log("inside " + this.constructor.name);
  };
  parse(tokenIdx) {
  this._tokenStartIdx = tokenIdx;
    let idx = 0;
    let markupTag = this._markupTag;
    let findIdx = this._parentNode._tokens.map(token => token.text).indexOf(endMarkupTag(this._markupTag), this._tokenStartIdx+1);
    if (findIdx < 0) {  // end tag not found
      this.logger.warning("No matching end tag found for "+this._markupTag);
      this._tokenEndIdx = this._tokenStartIdx; // If endTag is not found, then tag is standalone
    }
    else {
      this._tokenEndIdx = findIdx; // include closing tag iff found
    }
    ///console.log(this.constructor.name+"::ContentNode_MLTAG_ parse exit: tokenStartIdx="+this._tokenStartIdx);
    ///console.log(this.constructor.name+"::ContentNode_MLTAG_ parse exit: tokenEndIdx="+this._tokenEndIdx);
    return this._tokenEndIdx + 1;
  }
}
class ContentNode_MLTAG_END extends ContentNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG_END;  // used by subclasses
  };
}
class ContentNode_MLTAG_SELFCLOSING extends ContentNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG_SELFCLOSING;  // used by subclasses
  };
}
class ContentNode_MLTAG_EMAILADDRESS extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.EMAILADDRESS;  // used by subclasses
  }
}
class ContentNode_MLTAG_PHONENUMBER extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.PHONENUMBER;  // used by subclasses
  }
}
class ContentNode_MLTAG_TIME extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.TIME;  // used by subclasses
  }
}
class ContentNode_MLTAG_DATE1 extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE1;  // used by subclasses
  }
}
class ContentNode_MLTAG_DATE2 extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE2;  // used by subclasses
  }
}
class ContentNode_MLTAG_DATE3 extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE3;
  }
}
class ContentNode_MLTAG_CONTRACTION extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.CONTRACTION;
  }
}
class ContentNode_MLTAG_NUMBER_WITHCOMMAS extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.NUMBER_WITHCOMMAS;
  }
}
class ContentNode_MLTAG_TOKEN extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.TOKEN;
  }
}
class ContentNode_MLTAG_USD extends ContentNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.USD;
  }
}
module.exports = { SentenceContent, SectionContent };
