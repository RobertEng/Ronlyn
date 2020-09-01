/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/
 // Regroups, rearranges and applies markup attributes across tokens based
 // on markup and compensate for idiosyncracies of the Google Voice API

'use strict';
const  { TokenType, endMarkupTag, TokenTag } = require('../src/test2_tokentypes.js');

class Parser {
  constructor(parent) {
    this._parent;
    this._parseType = 0;  // derived in part from token type but more detailed
    const wordtoken = TokenType.WORD;
    const puncttoken = TokenType.PUNCTUATION;
    const tokentoken = TokenType.MLTAG;
/*
    const _parseDispatchTable = {
        wordtoken: this.parseWord,
        puncttoken: this.parsePunctuation,
        tokentoken: this.parseMarkupTag,
    };
    */

  };
  parseWord() {

  };
  parsePunctuation() {

  };
  parseMarkupTag() {

  };
  parse(tokens) {
    // if a typeof(string) is passed, then tokenize first.
    // Look at tagging types other enbedded tagging types (e.g.,fillin, list entries)
    // 1) ingle parse node for pass thru tokens (that do not require any interpretation)
    for (let token of tokens) {
      console.log("parsing: "+token.text);
      switch (token.type) {
        case TokenType.DATE1:
        case TokenType.DATE2:
        case TokenType.DATE3:
        case TokenType.DATE3:

      }
    }
    //return parseTree;
  };
  applyHTMLtags() {

  }
  serialize() {

  }
  iterator() {

  }
};
class ListParser extends Parser {
  // tokenizes single sentence at a time
  constructor(parent) {
  };
}
class StoryParser extends Parser {
  // tokenizes blocks of sentences as paragrpahs and chapters
  // should be able to change paragraph form into list of ordered
  // and perhaps numbered sentences.
  constructor(parent) {

  };
}
class JournalParser extends Parser {
  // tokenizes images and captions consolidated by date and date range.
  constructor(parent) {

  };
}
class ParserNode {
  constructor() {
    this._tokenList = new Array;  // one or more tokens associated with parse node
    this._type = ""; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
  serialize() {
    //each node produces its own output
  }
}
class WordParserNode extends ParserNode {
  //
}
class WhitespaceParserNode extends ParserNode {
  // not much to do here but is placeholder for any processing beyond them
  // base calss

}
class PunctuationParserNode extends ParserNode {

}
class MarkupParserNode extends ParserNode {
  // 1) manages the stack of markup
  /*
    parse behavior
    TokenTag.USD: single span with leading USdollar sign with the entire number
    TokenTag.EMAILADDRESS: separate spans username, "at" domain name "dot" "com"
    TokenTag.PHONENUMBER: single spans for each digit
    TokenTag.TIME: single span 230, 145, 1259 matching with or without ":"
    For add dates, mut handle abbreviation of month and ordinal number pronunciation 1st, 2nd
    TokenTag.DATE1: DD MMM YYYY
    TokenTag.DATE2: MMM DD, YYYY
    TokenTag.DATE3, MMM DD.
    TokenTag.CONTRACTION: Keep all tokens within markuptags together
    TokenTag.NUMBER_WITHCOMMAS: change match to number without comma
    */
}
module.exports = { Parser };
