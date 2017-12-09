/*******************************************
 * Reading Monitor v0.1.0
 * (c) 2017 by Wen Eng. All rights reserved.
 ********************************************/
'use strict';
// ECMASCript6 class syntax only

// types of tokens // kludge because ES6 does not allow encapsulation
const  TOKEN_WORD = 0;
const  TOKEN_TERMINALPUNCTUATION = 1;
const  TOKEN_INTERIMPUNCTUATION = 2;
const  TOKEN_PROPERNOUN = 3;

class ReadingMonitor {
    // class variables
    constructor(name) {
      this._name = name;
    }
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
    set timeout(msecs) {
      // period of time from start() to onspeechend
      this._timeout = msecs;
    }
    setTimerStart() {
      this._startTime = new Date();
      this._timerOn = true;
      this.diagnosticMsg = "timerStart: " + this._startTime;
    }
    timerCancel() {
      this._timerOn = false;
      this._startTime = new Date();
      this.diagnosticMsg = "timerCancel: " + this._startTime;
    }
    timerIsActive() {
      var current  = new Date();
      // period of time of silences
//      this.diagnosticMsg = "timerIsActive(): " + this.timerElapsedTime < this._timeout;
      this._timerOn = ((this.timerElapsedTime < this._timeout) && this._timerOn) ;
      return (this._timerOn);
    }
    get timerElapsedTime() {
      var current  = new Date();
      return current - this._startTime;
    }
    set retries(retries) {
      // how many (re)tries before hint
      this._retries = retries;
    }
    set sentenceIdxElementId(id) {
      try {
        this._sentenceIdxElement  = document.getElementById(id);
        this._sentenceIdxElement.innerText = "0"; // touch test
      }
      catch(e) {
        this.diagnosticMsg = "sentenceIdxElementId setter: invalid Element id "+id;
      };
    }
    set wordIdxElementId(id) {
        //check typeof parameter
        try {
          this._wordIdxElement  = document.getElementById(id);
          this._wordIdxElement.innerText = "0"; // touch test
        }
        catch(e) {
          this.diagnosticMsg = "wordIdxElementId setter: invalid Element id "+id;
        };
      }
    set diagnosticElementId(id) {
        this._diagnosticElement = document.getElementById(id);
    }
    set diagnosticMsg(msg) {
        //check typeof parameter
        try {
          var time = new Date();
          var timestamp = time.toLocaleTimeString();
//          header = time.getHours()+":"+time.getMinutes()+":"+time.getSeconds()+"."+time.getMilliseconds();
          this._diagnosticElement.textContent = timestamp + ":" + msg;
        }
        catch(e) {
          console.log("diagnosticMsg: cannot access diagnostic field");
        }
        finally {
          console.log("RMdiag-"+timestamp + ": " + msg);
        };

      }
      set listenButtonElementId(buttonId) {
        try {
          this._listenButtonElement = document.getElementById(buttonId);
        }
        catch(e) {
          this.diagnosticMsg = "listenButtonElementId setter: Invalid element id "+buttonId;
        }
      }
      set listenButtonImgElementId(buttonImgId) {
        try {
          this._listenButtonImgElement = document.getElementById(buttonImgId);
        }
        catch(e) {
          this.diagnosticMsg = "listenButtonImgElementId setter: Invalid element id "+buttonId;
        }
      }
    set listenButtonLabel(label) {
      try {
        this._listenButtonElement.defaultValue = label;
      }
      catch(e) {
        this.diagnosticMsg = "listenButtonLabel setter: Error setting listentButtonLabel with "+imgName;
      }
    }
      set listenButtonImgActive(imgName) {
        try {
          // does file exist?

          this._listenButtonImgActive = imgName;
        }
        catch(e) {
          this.diagnosticMsg = "listenButtonLabel setter: Error setting listentButtonImgActive with "+imgName;
        }
    }
    set listenButtonImgInactive(imgName) {
      try {
        this._listenButtonImgInactive = imgName;
        this._listenButtonImgElement.src = this._listenButtonImgInactive;
      }
      catch(e) {
        this.diagnosticMsg = "listenButtonImgInactive setter: Error setting listentButtonImgInactive with "+imgName;
      }
  }
    listenButtonActivate() {
      try {
        this._listenButtonImgElement.src = this._listenButtonImgActive;
      }
      catch(e) {
        this.diagnosticMsg = "listentButtonActivate(): unexpected error";
      }
    }
    listenButtonDeactivate() {
      try {
        this._listenButtonImgElement.src = this._listenButtonImgInactive;
      }
      catch(e) {
        this.diagnosticMsg = "listentButtonDeactivate(): unexpected error";
      }
  }
    get currentSentenceIdx() {
        return this._sentenceIdx;
    }
    set currentSentenceIdx(sentenceIdx) {
        // check if Idx is valid based on DOM
        this._sentenceIdx = sentenceIdx;
        if (typeof this._sentenceIdxElement != 'undefined' && this._sentenceIdxElement != null)
          this._sentenceIdxElement.innerText = sentenceIdx.toString();
        this._lastWordIdx = document.getElementsByClassName("rm_sentence")[this._sentenceIdx].childElementCount - 1;
    }
    get currentWordIdx() {
        return this._wordIdx;
    }
    set currentWordIdx(wordIdx) {
      // check if Idx is valid based on DOM
        this._wordIdx = wordIdx;
        if (typeof this._wordIdxElement != 'undefined' & this._wordIdxElement != null)
          this._wordIdxElement.innerText = wordIdx.toString();
    }
    get currentWord() { // should be assigned only when sentence or word idx changed is set or changed
      return document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word")[this._wordIdx].innerHTML;
      // converts source html sentence <div>s into sentence containers <div>s/word <span>s
    }
    get lastWordIdx() {
      return this._lastWordIdx;
    }
    isLastWord() {
      return this._wordIdx >= this._lastWordIdx;
    }
    endOfSentence() {
      return this._wordIdx >= this._lastWordIdx;
    }
    isLastSentence() {
      return this._sentenceIdx >= this._lastSentenceIdx;
    }
    parseSentences() {
          // can the existing html support parsing into the prescribed format?
        var sentences = document.getElementsByClassName("sentence");
        var s, w;
        var sentenceHTML;
        var words;
        var terminalPunctuationPattern = new RegExp(/[.!?]$/);
     //   var tokenSeparators = new RegExp(/\s*\b\s*/);
     //  var tokenSeparators = new RegExp(/\s*\b/); // too aggressive: tokenizes all punctuation and special characters

         // With \s pattern, terminal punctuation is included with word token and is handled as a special case
         var tokenSeparators = new RegExp(/\s/);
     //   var leftDelimiters = new RegExp(/\(\[\{/);
     //   var rightDelimiters = new RegExp(/\)\]\}/);
        for (s = 0; s < sentences.length; s++) {
          sentenceHTML = '<div class="rm_sentence" id=' + s + ">";
       //   sentences[s].setAttribute("style", "display:inline;"); //style="display: inline"
          words = sentences[s].innerText.split(tokenSeparators); // not preserving space count
          for (w = 0; w < words.length; w++) {
               // not on the first word
               if (w == words.length-1  && terminalPunctuationPattern.test(words[w])) {
                 // remove terminal punctuation off end of current sentence and add separate span for terminal punctuation
               sentenceHTML = sentenceHTML
               + '<span class="rm_word onclick-word" id=' + w + ">" + words[w].substring(0,words[w].length-1) +"</span>"
               + '<span class="rm_word rm_punctuation" id=' + (w+1) + ">" + words[w].substring(words[w].length-1,words[w].length)+"</span>";
               }
               // else if  all other special characters: no onclick-word or specially formatted rm_word
                 // phone Numbers
                 // proper nouns requiring XSAMPA hints
               else {
                 sentenceHTML = sentenceHTML+'<span class="rm_word onclick-word" id='+w+">"+words[w]+"</span>"+ "&nbsp";
               }
               //manage spacing especially for terminal punctuation
          }
           sentenceHTML = sentenceHTML + "</div>";
           sentences[s].innerHTML = sentenceHTML;  // replace existing sentence with new one
        }
        this._lastSentenceIdx = sentences.length - 1;
    }
    thisSentence() {
      this._lastWordIdx = document.getElementsByClassName("rm_sentence")[this._sentenceIdx].childElementCount - 1;
      this.currentWordIndicator("underline");
//      document.getElementsByClassName("sentence")[this._sentenceIdx].getElementsByClassName("word")[this._wordIdx].style.textDecoration = "underline";
    }
    firstSentence() {
      // check for last sentence
      this.currentSentenceIdx = 0;
      this.currentWordIdx = 0;
      this.thisSentence();
    }
    nextSentence() {
      // check for last sentence
      if (this.isLastSentence()) {
        this.diagnosticMsg = "nextSentence(): last sentence encountered"
      }
      else {
        this.currentSentenceIdx += 1;
        this.currentWordIdx = 0;
        this.thisSentence();
      }
    }
    currentWordIndicator(state) {
      document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word")[this._wordIdx].style.textDecoration = state;
    }
    nextToken() {
      // consider this a lexical analyzer
      // positions to the next valid word. Because the speech recognitionengine does not recognize punctuations
      // this method skips punctuations marks and also positions to the first word of a new sentence when
      // terminal punctation is encountered. The method will return the type of token it encountered though.
      var interimPunctuationPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()]\"/);
      var terminalPunctuationPattern = new RegExp(/.!?/);
      var returnVal = TOKEN_WORD; // assume the token is a word
      //      var properNamePattern = new RegExp(/^[A-Z]/); first letter uppercase... less conficent if at beginning of sentence
      //      var possessivePattern = new RegExp(/^[A-Z]/); first letter uppercase... less conficent if at beginning of sentence
      this.currentWordIndicator("none");
//      document.getElementsByClassName("sentence")[this._sentenceIdx].getElementsByClassName("word")[this._wordIdx].style.textDecoration = "none";
      this.currentWordIdx += 1; // lookahead to the next token to be read
      if (this.isLastWord()) { // last word in sentence encountered
//        if (terminalPunctuationPattern.test(this._wordIdx)) {
      if (terminalPunctuationPattern.test(this.currentWord)) {
          this.nextSentence();
          returnVal = TOKEN_TERMINALPUNCTUATION;
        }
        else {
          // corner case where last word/token is not a terminal punctuation and must be a word
          this.diagnosticMsg = "warning: last token in sentence is not a terminal punctuation"
        }
        // else if proper noun
        // else if possessive noun
      }
      else {  // not last word in sentence
        if (interimPunctuationPattern.test(this._wordIdx)) {
          this.nextToken(); // skip recursively
          // handle contractions
          returnVal = TOKEN_INTERIMPUNCTUATION;

        }
        else {
          this.currentWordIndicator("underline");
        }
      }
      return returnVal;
    }
    matchWord(spokenWord) {
      // need code to manage special cases: proper noun not already recognized
      var properNamePattern = new RegExp(/^[A-Z]/); //first letter uppercase... less conficent if at beginning of sentence
      if (spokenWord.toLowerCase() == this.currentWord.toLowerCase()) {
        return true;
      }
      else if (properNamePattern.test(this.currentWord)) {
        this.diagnosticMsg = "possible proper noun encountered "+this.currentWord;
      }
    }
    SpeechRecognitionIsSupported() {

      return (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));

    }
    SpeechSynthesisIsSupported() {
      return ('SpeechSynthesisUtterance' in window);

    }
    initialize() {
      this.diagnosticMsg = "Initializing reading monitor...";
      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

      // can the existing html support the prescribed format?
      if (!this.SpeechRecognitionIsSupported()) alert("Speech Recognition is not supported on " + windows.navigator.UserAgent);
      if (!this.SpeechSynthesisIsSupported()) alert("Speech synthesis utterance is not supported on " + windows.navigator.UserAgent);
//      document.getElementsByClassName("sentence")[this._sentenceIdx].getElementsByClassName("word")[this._wordIdx].style.textDecoration = "underline";

alert ("init 0");

      this._recognition = new SpeechRecognition();
      this._recognition.lang = 'en-US';
      this._recognition.interimResults = true;
      this._recognition.continuous = true;
      this._recognition.maxAlternatives = 1;
      var recognition = this._recognition;
      var thisMonitor = this; // listener context will reference MyReadingMonitor as self

alert ("init 1");

      myReadingMonitor.listenButtonDeactivate();  // starting state

      //
      // Define event handling
      //
      this._listenButtonElement.onclick = function(event) {
        if (!thisMonitor.timerIsActive()) {
          myReadingMonitor.setTimerStart();

alert ("onclick");

          myReadingMonitor.diagnosticMsg = 'listenBtn::onclick(): user started speech recognition';
          myReadingMonitor.listenButtonActivate();
          recognition.start();
        }
        else {
          myReadingMonitor.timerCancel();
          recognition.stop();
          myReadingMonitor.diagnosticMsg = 'listenBtn::onclick(): user terminated';
          myReadingMonitor.listenButtonDeactivate();
        }
      }

      recognition.onresult = function(event) {
//      ////////////
//      implement these interfaces someday when the following references are available. Until then, just split the transcript
//        var spokenEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
//        var SpeechRecognition = SpeechRecognitionAlternative || webkitSpeechRecognitionAlternative
//      Perhaps the grammar object will be available by then too.
//      ////////////
        thisMonitor.diagnosticMsg = "recognition.onresult: triggered";
        var spokenResults = event.results[0].isFinal;
        var spokenWords = event.results[event.results.length - 1][0].transcript.split(" ");
        var isFinalResult = event.results[0].isFinal;
         thisMonitor.diagnosticMsg = "recognition.onresult: is Final?: "+event.results[0].isFinal;
         var w;
         var nextTokenType;
         for (w = 0; w < spokenWords.length; w++) {
           thisMonitor.diagnosticMsg = "recognition.onresult: written word: "+thisMonitor.currentWord;
           thisMonitor.diagnosticMsg = "recognition.onresult: spoken word["+ w.toString()+"]:"+spokenWords[w];
           if (thisMonitor.matchWord(spokenWords[w])) { //should strip blanks too
              nextTokenType = thisMonitor.nextToken();
              if (nextTokenType == TOKEN_TERMINALPUNCTUATION) {
                  thisMonitor.diagnosticMsg = "recognition.onresult: end of sentence";
                  recognition.abort();
                  thisMonitor.diagnosticMsg = "recognition.onresult: aborted at end of sentence";
                  thisMonitor.listenButtonLabel = "listen to me read";
              }
           }
         }

//         thisMonitor.listenButtonLabel = "listen to me read";
         thisMonitor.diagnosticMsg = 'Result received: ' + spokenWords;
//         console.log('confidence: ' + event.results[0][0].confidence);
//         console.log("result[last]:"+spokenWords);
//         if ((event.results.length - 1) >= 1)
//         console.log('result[0]: ' + event.results[0][0].transcript);
      } // onresult

      recognition.onspeechend = function() {
//         thisMonitor.diagnosticMsg = "recognition.onspeechend";

         if (thisMonitor.timerIsActive()) {
           thisMonitor.diagnosticMsg = "recognition.onspeechend: keep listening";
//           recognition.start();
         }
         else {
//            listenBtn.defaultValue = "listen to me read";
            thisMonitor.diagnosticMsg = "recognition.onspeechend: timer expired or cancelled";
          }
       }

       recognition.onend = function() {
//          thisMonitor.diagnosticMsg = "recognition.onend";
//          thisMonitor.diagnosticMsg = "timerElapsedTime: "+ thisMonitor.timerElapsedTime;
          if (thisMonitor.timerIsActive()) {
            listenBtn.defaultValue = "stop listening";
            thisMonitor.diagnosticMsg = "recognition.onend: keep listening";
            recognition.start();
          }
          else {
             listenBtn.defaultValue = "listen to me read";
             thisMonitor.diagnosticMsg = "recognition.onend: timer expired or cancelled";
             myReadingMonitor.listenButtonDeactivate();
           }
        }

       recognition.onsoundend = function() {
         // event fires immediately after onspeechend
         thisMonitor.diagnosticMsg = "recognition.onsoundend";
         recognition.stop();
         listenBtn.defaultValue = "listen to me read";
       }

       recognition.onnomatch = function(event) {
         thisMonitor.diagnosticMsg = "recognition.onnomatch:";
       }

       recognition.onerror = function(event) {
         thisMonitor.diagnosticMsg = 'recognition.onerror: ' + event.error;
         // timeout with no sound triggers this event
       }

       // insert code to change current word and sentence
       alert ("init 2");

       this.diagnosticMsg = "Initialized reading monitor.";
    } // initialize()
} // MyReadingMonitor
