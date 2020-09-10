/*******************************************
 * Reading Monitor v2.0
 * (c) 2017, 2018, 2019, 2020 by Wen Eng. All rights reserved.
 ********************************************/
 // Regroups, rearranges and applies markup attributes across tokens based
 // on markup and compensate for idiosyncracies of the Google Voice API

'use strict';
const  { ParserNodeType } = require('../src/test2_parsertypes.js');
const  { endMarkupTag, TokenType, TokenTag } = require('../src/test2_tokentypes.js');
const  { Logger } = require('../src/utilities.js');
const ParserNodePrefix = "ParserNode_";

// Definition maps tokentype to parserNodeType used by parse(token)
class Parser {
  constructor(tokens) {
    this._logger = new Logger(this);
    this._nodes = new Array;
    this._tokens = tokens;
    // Generic token typesidentified by tokenizer
    this._ParserNodeClasses = {
      [TokenType.WORD]: ParserNode_WORD,
      [TokenType.NUMBER]: ParserNode_NUMBER,
      [TokenType.PUNCTUATION]: ParserNode_PUNCTUATION,
      [TokenType.MLTAG]: ParserNode_MLTAG,
      [TokenType.MLTAG_END]: ParserNode_MLTAG_END,
      [TokenType.MLTAG_SELFCLOSING]: ParserNode_MLTAG_SELFCLOSING,
      [TokenType.WHITESPACE]: ParserNode_WHITESPACE
    };
    // Application-specific markup tags and associated parser mode type
    this._ParserMarkupNodeClasses = {
      [TokenTag.EMAILADDRESS]: ParserNode_MLTAG_EMAILADDRESS,
      [TokenTag.PHONENUMBER]: ParserNode_MLTAG_PHONENUMBER,
      [TokenTag.TIME]: ParserNode_MLTAG_TIME,
      [TokenTag.DATE1]: ParserNode_MLTAG_DATE1,
      [TokenTag.DATE2]: ParserNode_MLTAG_DATE2,
      [TokenTag.DATE3]: ParserNode_MLTAG_DATE3,
      [TokenTag.CONTRACTION]: ParserNode_MLTAG_CONTRACTION,
      [TokenTag.NUMBER_WITHCOMMAS]: ParserNode_MLTAG_NUMBER_WITHCOMMAS,
      [TokenTag.TOKEN]: ParserNode_MLTAG_TOKEN,
      [TokenTag.USD]: ParserNode_MLTAG_USD
    };
    this.reset();
//    this._parserType = 0;  // derived in part from token type but more detailed
//    this._nodes = new Array;
//    this._tokens = null;
  };
  get logger() {
    return this._logger;
  }
  set logger(obj) {
    this._logger = obj;
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
        else if (token.type in this._ParserNodeClasses) {
          parserNode = new this._ParserNodeClasses[token.type](this, tokenIdx);
          this.logger.diagnostic("Encountered token type=" + token.type);
        }
        else {
          this.logger.diagnostic("Encountered unexpected token type=" + token.type);
        }
        if (parserNode !== null) {
          this.logger.diagnostic("Adding node=" + token.name);
          tokenIdx = parserNode.parse(tokenIdx);
          this._nodes.push(parserNode);
          ///console.log(this.constructor.name+".parseTokens():ParserNodeClasses tokenIdx="+tokenIdx);
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
  return this._nodes;
  };
  applyHTMLtags() {

  }
  dump() {
    for (let parserNode of this._nodes) {
      parserNode.dump();
    }
  }
  emitDom(){

  }
  reset() {
    this._parserType = 0;  // derived in part from token type but more detailed
    this._nodes = new Array;
    this._tokens = null;
  }
  serialize() {

  }
  serializeForUnitTest(parserTree) {
    let nodeList = "";
    parserTree.forEach(node => {
      nodeList = nodeList + node.serializeForUnitTest();
    } );
    return nodeList;
  } //serializeForUnitTest
  unitTest(actual, expected) {
    return this.serializeForUnitTest(actual) === expected;
  } // unitTest

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
  constructor(parent, tokenIdx) {
//    this._tokenList = new Array;  // consider keeping link (by reference) to token list
    this.logger = new Logger(this);
    ///this.logger.diagnosticMode = true;
    this._parser = parent;
//    this._tokens = tokens;
    this._type = ""; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
    this._tokenStartIdx = null;
    this._tokenEndIdx = null;
    // get parentType parent.type;
  }
  get logger() {
    return this._logger;
  }
  set logger(obj) {
    this._logger = obj;
  }
  dump(colWidth1, colWidth2) {
    let tokenList = "";
    for (let idx = this._tokenStartIdx; idx <= this._tokenEndIdx; idx++) {
      tokenList = tokenList + this._parser._tokens[idx].text;
    }
    if (arguments.length < 1) colWidth1 = 25;
    if (arguments.length < 2) colWidth2 = 10;
    console.log(("{" + tokenList + "}").padEnd(colWidth1)
        + ("("+this._tokenStartIdx+".."+this._tokenEndIdx+") ").padEnd(colWidth2)
        + "("+this.constructor.name+")");
  }
  parse(tokenIdx) {
    this.logger.diagnostic("Parsing node ="+this._parser._tokens[tokenIdx].text);
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
}
class ParserNode_WORD extends ParserNode {
  constructor(parent, tokenIdx) {
    super(parent, tokenIdx);
    this._type = TokenType.WORD; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
  //
  parse(tokenIdx){    // should be called parse
    return super.parse(tokenIdx);
//    this._tokenStartIdx = tokenIdx;
//    this._tokenEndIdx = tokenIdx;
//    return ++tokenIdx;
  }
}
class ParserNode_NUMBER extends ParserNode {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = TokenType.NUMBER; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
}
class ParserNode_WHITESPACE extends ParserNode {
  // not much to do here but is placeholder for any processing beyond them
  // base class
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = TokenType.WHITESPACE; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }
}
class ParserNode_PUNCTUATION extends ParserNode {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._type = TokenType.PUNCTUATION; // determined based on token type (e.g., MLTAG) and token value (<contraction>)
  }

}
class ParserNode_MLTAG extends ParserNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG;  // used by subclasses
    //console.log("inside " + this.constructor.name);
  }
}
class ParserNode_MLTAG_ extends ParserNode {
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
    let findIdx = this._parser._tokens.map(token => token.text).indexOf(endMarkupTag(this._markupTag), this._tokenStartIdx+1);
    if (findIdx < 0) {  // end tag not found
      this.logger.warning("No matching end tag found for "+this._markupTag);
      this._tokenEndIdx = this._tokenStartIdx; // If endTag is not found, then tag is standalone
    }
    else {
      this._tokenEndIdx = findIdx; // include closing tag iff found
    }
    ///console.log(this.constructor.name+"::ParserNode_MLTAG_ parse exit: tokenStartIdx="+this._tokenStartIdx);
    ///console.log(this.constructor.name+"::ParserNode_MLTAG_ parse exit: tokenEndIdx="+this._tokenEndIdx);
    return this._tokenEndIdx + 1;
  }
}
class ParserNode_MLTAG_END extends ParserNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG_END;  // used by subclasses
  };
}
class ParserNode_MLTAG_SELFCLOSING extends ParserNode {
  // 1) manages the stack of markup
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.MLTAG_SELFCLOSING;  // used by subclasses
  };
}
class ParserNode_MLTAG_EMAILADDRESS extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.EMAILADDRESS;  // used by subclasses
  }
}
class ParserNode_MLTAG_PHONENUMBER extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.PHONENUMBER;  // used by subclasses
  }
}
class ParserNode_MLTAG_TIME extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.TIME;  // used by subclasses
  }
}
class ParserNode_MLTAG_DATE1 extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE1;  // used by subclasses
  }
}
class ParserNode_MLTAG_DATE2 extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE2;  // used by subclasses
  }
}
class ParserNode_MLTAG_DATE3 extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.DATE3;
  }
}
class ParserNode_MLTAG_CONTRACTION extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.CONTRACTION;
  }
}
class ParserNode_MLTAG_NUMBER_WITHCOMMAS extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.NUMBER_WITHCOMMAS;
  }
}
class ParserNode_MLTAG_TOKEN extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.TOKEN;
  }
}
class ParserNode_MLTAG_USD extends ParserNode_MLTAG_ {
  constructor(parent, tokenIdx) {
    super(parent,tokenIdx);
    this._markupTag = TokenTag.USD;
  }
}
module.exports = { Parser };
