const TokenType = {
  WORD: 'WORD',
  NUMBER: 'NUMBER',
  STARTTAG: 'STARTTAG', // <token>
  ENDTAG: 'ENDTAG',  // </token>
  FILLINSTARTTAG: 'FILLINSTARTTAG', // <token>
  FILLINENDTAG: 'FILLINENDTAG',  // </token>
  MLSTARTTAG: 'MLSTARTTAG',
  MLENDTAG: 'MLENDTAG',
  MLSELFCLOSINGTAG: 'MLSELFCLOSINGTAG'
};
  const TokenType = {
  WHITESPACE: 'WHITESPACE',
  PUNCTUATION: 'PUNCTUATION', // unhandled lexical punctuation
  PUNCTUATION_APOSTROPHE: 'PUNCTUATION_APOSTROPHE', // for possessives and contractions
  PUNCTUATION_DOT: 'PUNCTUATION_DOT', // for decimals
  PUNCTUATION_COMMA: 'PUNCTUATION_COMMA', // for numbers
  PUNCTUATION_DASH: 'PUNCTUATION_DASH', // for phone numbers
  PUNCTUATION_COLON: 'PUNCTUATION_COLON', // for time
  PUNCTUATION_USD: 'PUNCTUATION_USD', // for US currency
  PUNCTUATION_FORWARDSLASH: 'PUNCTUATION_FORWARDSLASH', // for dates, URLs
  PUNCTUATION_ATSIGN: 'PUNCTUATION_ATSIGN', // for emails voice recognizes "at"
  PUNCTUATION_DOUBLEQUOTE: 'PUNCTUATION_DOUBLEQUOTE',
  PUNCTUATION_LPAREN: 'PUNCTUATION_LPAREN', // for phone numbers
  PUNCTUATION_RPAREN: 'PUNCTUATION_RPAREN', // for phone numbers
  TBD: 'TBD', // initial state
  UNHANDLED: '*****UNHANDLED*****'  // no explicit token type
};
const MLtokenTag = {  // markup tokens only
  GENERIC: "<token>",
  PHONENUMBER: "<telephone number>",
  FILLIN: "<fillin>",
  CHARACTER: "<character>"
};
  const TokenTag = {
  APOSTROPHE: "'", // for possessives and contractions
  COMMA: ',', // for numbers
  DASH: '-', // for phone numbers
  DOT: '.', // for decimals, doman names
  COLON: ':', // for time
  USD: '$', // for US currency
  FORWARDSLASH: '/',
  ATSIGN: '@',
  LPAREN: '(', // for phone numbers
  RPAREN: ')', // for phone numbers
  DOUBLEQUOTE: '""',
  TBD:""
};
const ParseType = {
  WORD: 'WORD',
  DATE: 'DATE',
  TIME: 'TIME',
  WHITESPACE: 'WHITESPACE',
  MLSELFCLOSINGTAG: "HTMLSELFCLOSINGTAG",
  // Requires semantic analysis to recombine WORD+, PUNCTUATIONS+
  EMAILADDRESS: 'EMAILADDRESS',
  URL: 'URL',
  STREETNUMBER: 'STREETNUMBER', // 20680 pronounced "2","0","6","8","0"
  POSSESSIVENOUN: "POSSESSIVENOUN",
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
  MLSELFCLOSINGTAG: 'HTMLSELFCLOSINGTAG',
  HTMLSTARTTAG: "HTMLSTARTTAG",
  HTMLENDTAG: "HTMLENDTAG",
  HTMLATTRLIST: 'HTMLATTRLIST', // needed for propagation across span tree
  HTMLSELFCLOSINGTAG: 'HTMLTAG_SELFCLOSE', //not supported

  TBD: 'TBD'
};
module.exports = { TokenType, ParseType, TokenTag };
