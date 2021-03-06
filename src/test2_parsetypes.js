const ParserNodeType = { // must be unique
  WORD: 'WORD',
  DATE: 'DATE',
  TIME: 'TIME',
  WHITESPACE: 'WHITESPACE',
  MLSELFCLOSINGTAG: 'HTMLSELFCLOSINGTAG',
  // Requires semantic analysis to recombine WORD+, PUNCTUATIONS+
  EMAILADDRESS: 'EMAILADDRESS',
  URL: 'URL',
  STREETNUMBER: 'STREETNUMBER', // 20680 pronounced "2","0","6","8","0"
  POSSESSIVE: 'POSSESSIVE',
  PHONENUMBER: 'PHONENUMBER',
  CONTRACTION: 'CONTRACTION',
  TOKEN: 'TOKEN', // EXPLICIT token <token>ABC</token> to escape further parsing
  USD: 'USD', // perhaps required to escape default pronunciation?
  NUMBER: 'NUMBER', // perhaps required to escape default pronunciation?
  DECIMAL: 'DECIMAL', // perhaps required to escape default pronunciation?
  TITLE: 'TITLE', // Mr. should be a single span ; should be special case of abbreviations

  // These HTMLtags and attributes will be propagated for FORMATTING ONLY
  MLSTARTTAG: 'MLSTARTTAG', //not necessarily HTML
  MLENDTAG: 'MLENDTAG',
  MLTAG: "MLTAG",
  MLSELFCLOSINGTAG: 'HTMLSELFCLOSINGTAG',
  HTMLSTARTTAG: "HTMLSTARTTAG",
  HTMLENDTAG: "HTMLENDTAG",
  HTMLATTRLIST: 'HTMLATTRLIST', // needed for propagation across span tree
  HTMLSELFCLOSINGTAG: 'HTMLTAG_SELFCLOSE', //not supported
  TBD: 'TBD',
  WORD: 'WORD'
};
//const testMap =  [
//  [TokenType.WORD, { tag: TokenTag.WORD, pattern: /([A-Za-z]+)/g }],
//  [TokenType.TOKEN, { tag: TokenTag.WORD, pattern: /([A-Za-z]+)/g }]
// ];

// Definition maps tokentype to parserNodeType used by parse(token)
const TokenToParserNodeDispatch = new Map( [
  [TokenType.WORD, this.parseWord(token)]
  [TokenType.NUMBER, this.parseNumber(token)],
  [TokenType.PUNCTUATION, this.parsePunctuation(token)],
  [TokenType.MLTAG, parseMLtag(token)]
]);
const MLtokenToParserNodeDispatch = new Map( [
  [TokenType.CONTRACTION, this.parseContraction(token)]
  [TokenType.NUMBER, this.parseNumber(token)],
  [TokenType.PUNCTUATION, this.parsePunctuation(token)],
  [TokenType.MLTAG, parseMLtag(token)]
]);

module.exports = { ParserNodeType };
