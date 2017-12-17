/*******************************************
 * Reading Monitor v0.1.0
 * (c) 2017 by Wen Eng. All rights reserved.
 ********************************************/
"use strict";
// ECMASCript6 class syntax only

// types of tokens // kludge because ES6 does not allow encapsulation
const  TOKEN_WORD = 0;
const  TOKEN_NEWSENTENCE = 1;
const  TOKEN_TERMINALPUNCTUATION = 2;
const  TOKEN_INTERIMPUNCTUATION = 3;
const  TOKEN_PROPERNOUN = 4;

function getOS() {
   var userAgent = window.navigator.userAgent,
   platform = window.navigator.platform,
   macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
   windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
   iosPlatforms = ['iPhone', 'iPad', 'iPod'],
   os = null; // initalize string

   if (macosPlatforms.indexOf(platform) != -1) {
      os = 'Mac OS'; }
   else if (iosPlatforms.indexOf(platform) != -1) {
      os = 'iOS'; }
   else if (windowsPlatforms.indexOf(platform) != -1) {
      os = 'Windows'; }
   else if (/Android/.test(userAgent)) {
      os = 'Android'; }
   else if (!os && /Linux/.test(platform)) {
      os = 'Linux'; }
   return os;
}
class Timer {
  constructor(parent) {
    this._parent = parent;
  }
  set timeout(secs) {
    // period of time from start() to onspeechend
    this._timeout = secs * 1000; //msecs
  }
  start() {
    this._startTime = new Date();
    this._timerOn = true;
    this.diagnosticMsg = "timer.start: " + this._startTime;
  }
  cancel() {
    this._timerOn = false;
    this._startTime = new Date();
    this.diagnosticMsg = "cancel: " + this._startTime;
  }
  get isActive() {
    var current  = new Date();
    // period of time of silences
//      this.diagnosticMsg = "timerIsActive(): " + this.timerElapsedTime < this._timeout;
    this._timerOn = ((this.elapsedTime < this._timeout) && this._timerOn) ;
    return (this._timerOn);
  }
  get elapsedTime() {
    var current  = new Date();
    return current - this._startTime;
  }
  set retries(retries) {
    // how many (re)tries before hint
    this._retries = retries;
  }
}
class SpeechRecognition {
  constructor(parent) {
    this._parent = parent;
  }
  get parent() {
      return this._parent;
  }
  get isActive() {
    return (this._isActive);  // CAREFUL...set asynchronously
  }
  set isActive(active) {
    this._isActive - active;  // CAREFUL...set asynchronously
  }
  get isSupported() {
    return (window.hasOwnProperty('SpeechRecognition') || window.hasOwnProperty('webkitSpeechRecognition'));
  }
  set buttonElementId(buttonId) {
    try {
      this._buttonElement = document.getElementById(buttonId);
    }
    catch(e) {
      this.diagnosticMsg = "listening.buttonElementId setter: Invalid element id "+buttonId;
    }
  }
  get buttonElement() {
    return this._buttonElement
  }
  set buttonImgElementId(buttonImgId) {
    try {
      this._buttonImgElement = document.getElementById(buttonImgId);
    }
    catch(e) {
      this.diagnosticMsg = "listening.buttonImgElementId setter: Invalid element id "+buttonId;
    }
  }
  get buttonImgElement() {
    return this._buttonImgElement
  }
  set buttonLabel(label) {
    try {
      this._buttonElement.defaultValue = label;
    }
    catch(e) {
      this.diagnosticMsg = "listening.buttonLabel setter: Error setting listening.buttonLabel with "+imgName;
    }
  }
  set buttonImgActive(imgName) {
    try {
      // does file exist?

      this._buttonImgActive = imgName;
    }
    catch(e) {
      this.diagnosticMsg = "listening.buttonLabel setter: Error setting listening.buttonImgActive with "+imgName;
    }
  }
  set buttonImgInactive(imgName) {
    try {
      this._buttonImgInactive = imgName;
      this._buttonImgElement.src = this._buttonImgInactive;
    }
    catch(e) {
      this.diagnosticMsg = "listening.buttonImgInactive setter: Error setting listening.buttonImgInactive with "+imgName;
    }
  }
  buttonActivate() {
    try {
      this._buttonImgElement.src = this._buttonImgActive;
      this._isActive = true;
    }
    catch(e) {
      this.diagnosticMsg = "listening.buttonActivate(): unexpected error";
    }
  }
  buttonDeactivate() {
    try {
      this._buttonImgElement.src = this._buttonImgInactive;
      this._isActive = false;
    }
    catch(e) {
      this.diagnosticMsg = "listening.buttonDeactivate(): unexpected error";
    }
  }

  initialize(){
    try {

      var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

      this._recognition = new SpeechRecognition();
      this._recognition.lang = 'en-US';
      this._recognition.interimResults = true;
      this._recognition.continuous = true;
      this._recognition.maxAlternatives = 1;
      this.isActive = false;
      var recognition = this._recognition;
      //
      // Define event handling
      //
      //event handlers
      this._buttonElement.onclick = function(event) {
        // listening && timer active: STOP LISTENING
        // listening && timer inactive STOP LISTENING
        // not listening && timer isActive START LISTENING
        // not listening && timer active: START LISTENING
        if (!myReadingMonitor.listening.isActive) {
          myReadingMonitor.diagnosticMsg = "listenBtn:onclick(): not listening";
          myReadingMonitor.timer.start();
          myReadingMonitor.diagnosticMsg = 'listenBtn::onclick(): user started speech recognition';
          myReadingMonitor.listening.buttonActivate();
          recognition.start();
        }
        else {
          myReadingMonitor.diagnosticMsg = "listenBtn:onclick(): listening";
          myReadingMonitor.timer.cancel();
          recognition.stop();
          myReadingMonitor.diagnosticMsg = 'listenBtn::onclick(): user terminated';
          myReadingMonitor.listening.buttonDeactivate();
        }
      }
      recognition.onresult = function(event) {
  //      ////////////
  //      implement these interfaces someday when the following references are available. Until then, just split the transcript
  //        var spokenEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
  //        var SpeechRecognition = SpeechRecognitionAlternative || webkitSpeechRecognitionAlternative
  //      Perhaps the grammar object will be available by then too.
  //      ////////////
        try {
//          myReadingMonitor.diagnosticMsg = "recognition.onresult: triggered";
          var spokenResults = event.results[0].isFinal;
          var spokenWords = event.results[event.results.length - 1][0].transcript.split(" ");
          var isFinalResult = event.results[0].isFinal;
//           myReadingMonitor.diagnosticMsg = "recognition.onresult: is Final?: "+event.results[0].isFinal;
           var w;
           var nextTokenType;
           for (w = 0; w < spokenWords.length; w++) {
//             myReadingMonitor.diagnosticMsg = "recognition.onresult: written word: "+myReadingMonitor.currentWord;
             myReadingMonitor.diagnosticMsg = "recognition.onresult: spoken word["+ w.toString()+"]:"+spokenWords[w];
             if (myReadingMonitor.matchWord(spokenWords[w])) { //should strip blanks too
                nextTokenType = myReadingMonitor.nextToken();
                if (nextTokenType == TOKEN_NEWSENTENCE) {
                    myReadingMonitor.diagnosticMsg = "recognition.onresult: end of sentence";
                    recognition.abort();
                    myReadingMonitor.diagnosticMsg = "recognition.onresult: aborted at end of sentence";
                    myReadingMonitor.listening.buttonDeactivate();
                }
             }
           }
           myReadingMonitor.diagnosticMsg = 'Result received: ' + spokenWords;
          //         console.log('confidence: ' + event.results[0][0].confidence);
          //         console.log("result[last]:"+spokenWords);
          //         if ((event.results.length - 1) >= 1)
          //         console.log('result[0]: ' + event.results[0][0].transcript);
        }
        catch(e) {
          if (typeof myReadingMonitor == "undefined") {
            alert("recognition:onresult: myReadingMonitor does not exist in global scope")
          }
          else {
            myReadingMonitor.diagnosticMsg = 'recognition:onresult: failed';

          }
        }
      } // onresult

      recognition.onspeechend = function() {
  //         thisMonitor.diagnosticMsg = "recognition.onspeechend";

         if (myReadingMonitor.timer.isActive) {
           myReadingMonitor.diagnosticMsg = "recognition.onspeechend: keep listening";
  //           recognition.start();
         }
         else {
  //            listenBtn.defaultValue = "listen to me read";
            myReadingMonitor.diagnosticMsg = "recognition.onspeechend: timer expired or cancelled";
          }
       }
       recognition.onend = function() {
  //          thisMonitor.diagnosticMsg = "recognition.onend";
  //          thisMonitor.diagnosticMsg = "timerElapsedTime: "+ thisMonitor.timerElapsedTime;
          if (myReadingMonitor.timer.isActive) {
            myReadingMonitor.listening.buttonActivate();
            myReadingMonitor.diagnosticMsg = "recognition.onend: continue listening";
            recognition.start();
          }
          else {
            if (myReadingMonitor.timer.isActive)
             myReadingMonitor.diagnosticMsg = "recognition.onend: timer expired or cancelled";
             myReadingMonitor.listening.buttonDeactivate();
           }
        }
       recognition.onsoundend = function() {
         // event fires immediately after onspeechend
         myReadingMonitor.diagnosticMsg = "recognition.onsoundend";
         recognition.stop();
         myReadingMonitor.listening.buttonDeactivate();
       }
       recognition.onnomatch = function(event) {
         myReadingMonitor.diagnosticMsg = "recognition.onnomatch:";
       }
       recognition.onerror = function(event) {
         myReadingMonitor.diagnosticMsg = 'recognition.onerror: ' + event.error;
         // timeout with no sound triggers this event
       }

       // can the existing html support the prescribed format?
  //      document.getElementsByClassName("sentence")[this._sentenceIdx].getElementsByClassName("word")[this._wordIdx].style.textDecoration = "underline";
       this.buttonDeactivate();  // starting state

        // insert code to change current word and sentence
    }
    catch(e) {
      myReadingMonitor.diagnosticMsg =" Could not initialize Speech Recognition object";
    }
  }
}
class SpeechSynthesis {
  constructor(parent) {
    this._parent = parent;
    this._defaultVoice = 'Microsoft Zira Desktop - English (United States)';
  }
  get parent() {
    return this._parent;
  }
  get defaultVoice() {
    return this._defaultVoice;
  }
  get isSupported() {
    return (window.hasOwnProperty('SpeechSynthesisUtterance') && 'speechSynthesis' in window);
  }
  set volumeControlElementId(id) {
    try {
      this._volumeControlElement = document.getElementById(id);
    }
    catch(e) {
      this._parent.diagnosticMsg = "volumeControlElementId setter: invalid Element id "+id;
    }
  }
  get volumeControlElement() {
      return this._volumeControlElement;
  }
  set voiceSelectorElementId(id) {
    try {
      this._voiceSelectorElement = document.getElementById(id);
      if (getOS() == 'iOS') {
         this._defaultVoice = "Fred"; }
      else {
         this._defaultVoice = "Microsoft Zira Desktop - English (United States)"
       }
    }
    catch(e) {
      this._parent.diagnosticMsg = "voiceSelectorElementId setter: invalid Element id "+id;
    }
  }
  get voiceSelectorElement() {
      return this._voiceSelectorElement;
  }
  voiceSelectorPopulate() {
     var  v,voice,voices, option;
     try {
        if (speechSynthesis.onvoiceschanged == null) {
          // wait for speechRecognition to be available -- chrome kludge
           speechSynthesis.onvoiceschanged = myReadingMonitor.speaking.voiceSelectorPopulate;
         }
        else {
         // Iterate through each of the voices.
         voices = speechSynthesis.getVoices();
         voices.forEach(function(voice, v) {
            // Create a new option element.
            // Set the options value and text.
            option = document.createElement('option');
            option.value = voice.name;
            option.innerHTML = voice.name;
            option.selected = (voice.name == myReadingMonitor.speaking.defaultVoice);
            myReadingMonitor.speaking.voiceSelectorElement.appendChild(option);
         }); // foreach
       }
     }
     catch(e) {
       if (typeof myReadingMonitor == "undefined") {
         alert("voiceSelectorPopulate(): myReadingMonitor does not exist in global scope")
       }
       else {
          myReadingMonitor.diagnosticMsg = "voiceSelectorPopulate: could not populate voices";
       }
     }
  }
  initialize() {

    this._synthesis = new SpeechSynthesisUtterance();
    this._synthesis.lang = 'en-US';
    this._synthesis.rate = 1;
    this._synthesis.pitch = 1;
    this.voiceSelectorPopulate();
  }
  say(words) {
    //    this._synthesis.speak(words);
      var voices = speechSynthesis.getVoices();
      var myvoice = voices.filter(
        function(voice) {
          return voice.name == myReadingMonitor.speaking.voiceSelectorElement.value;
        });
      var currentVoice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == myReadingMonitor.speaking.voiceSelectorElement.value; })[0];
      this._synthesis.voice = currentVoice;
      this._synthesis.volume = parseFloat(myReadingMonitor.speaking.volumeControlElement.value);
      this._synthesis.text = words;
      window.speechSynthesis.speak(this._synthesis);
  }
}
class ReadingMonitor {
    // class variables
    constructor(name) {
      this._name = name;
      this._timer = new Timer (this);
      this._speechRecognition = new SpeechRecognition(this);
      this._speechSynthesis = new SpeechSynthesis(this);
    }
    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
    }
    get listening() {
      return this._speechRecognition;
    }
    get speaking() {
        return this._speechSynthesis;
    }
    get timer() {
      return this._timer;
    }
    set name(newName) {
        this._name = newName;
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
    get currentWord() {
      return document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word")[this._wordIdx].innerHTML;
      // converts source html sentence <div>s into sentence containers <div>s/word <span>s
    }
    get nextWord() {
      // does not change current word position
      try {
        return document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word")[this._wordIdx+1].innerHTML;
      }
      catch(e) {
        return null;
      }
    }
    get lastWordIdx() {
      return this._lastWordIdx;
    }
    isLastToken() {
      return this._wordIdx >= this._lastWordIdx;
    }
    isNextToLastToken() {
      return (this._wordIdx+1) >= this._lastWordIdx;
    }
    endOfSentence() {
      return this._wordIdx >= this._lastWordIdx;
    }
    isLastSentence() {
      return this._sentenceIdx >= this._lastSentenceIdx;
    }
    parseSentences(sentenceTag) {
          // can the existing html support parsing into the prescribed format?
        var sentences = document.getElementsByClassName(sentenceTag);
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
    moveToNextWord() {
      this.currentWordIdx++;
      this.currentWordIndicatorOn();
//      document.getElementsByClassName("sentence")[this._sentenceIdx].getElementsByClassName("word")[this._wordIdx].style.textDecoration = "underline";
    }
    moveToFirstSentence() {
      // check for last sentence
      this.currentSentenceIdx = 0;
      this.currentWordIdx = 0;
      this._lastWordIdx = document.getElementsByClassName("rm_sentence")[this._sentenceIdx].childElementCount - 1;
      this.currentWordIndicatorOn();
    }
    moveToNextSentence() {
      // check for last sentence
      if (this.isLastSentence()) {
        this.diagnosticMsg = "nextSentence(): last sentence encountered"
      }
      else {
        this.currentSentenceIdx += 1;
        this.currentWordIdx = 0;
        this._lastWordIdx = document.getElementsByClassName("rm_sentence")[this._sentenceIdx].childElementCount - 1;
        this.currentWordIndicatorOn();
      }
    }
    moveToThisWordPosition(sentenceId, wordId) {
      try {
        this.currentWordIndicatorOff();
        this.currentSentenceIdx = Number(sentenceId);
        this.currentWordIdx = Number(wordId);
        this.currentWordIndicatorOn();
      }
      catch(e) {
        this.diagnosticMsg = "moveToThisWordPosition(): could not change word";
      }
    }
    set currentWordIndicator(state) {
      document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word")[this._wordIdx].style.textDecoration = state;
    }
    currentWordIndicatorOff() {
      this.currentWordIndicator = "none";
    }
    currentWordIndicatorOn() {
      this.currentWordIndicator = "underline";
    }
    nextToken() {
      // consider this a lexical analyzer
      // positions to the next valid word. Because the speech recognitionengine does not recognize punctuations
      // this method skips punctuations marks and also positions to the first word of a new sentence when
      // terminal punctation is encountered. The method will return the type of token it encountered though.
      var interimPunctuationPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()]\"/);
      var terminalPunctuationPattern = new RegExp(/[\.!\?]/);
      var returnVal = TOKEN_WORD; // assume the token is a word
      //      var properNamePattern = new RegExp(/^[A-Z]/); first letter uppercase... less conficent if at beginning of sentence
      //      var possessivePattern = new RegExp(/^[A-Z]/); first letter uppercase... less conficent if at beginning of sentence
      this.currentWordIndicatorOff();

      if (this.isLastToken()) {
        // state: last token that is not a terminal punctuation
        // action: goto the next sentence.
        this.diagnosticMsg = "warning: last token in sentence is not a terminal punctuation"
        this.moveToNextSentence();
        returnVal = TOKEN_NEWSENTENCE;
      }
      else if (this.isNextToLastToken() && terminalPunctuationPattern.test(this.nextWord)) {
        // state: next to last token followed by terminal punctuation
        // action: goto the next sentence.
        this.moveToNextSentence();
        returnVal = TOKEN_NEWSENTENCE;
      }
      else if (interimPunctuationPattern.test(this.nextWord)) {
        // state: next token is a interim punctuation
        //action: goto the next word.
        this.moveToNextWord();  //skip but assumes only a single punctuation
        returnVal = TOKEN_NEXTWORD;
      }
      else {
        // state: next token is a word
        //action: goto the next word.
        this.moveToNextWord();
        returnVal = TOKEN_NEXTWORD;
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
    initialize() {
      this.diagnosticMsg = "Initializing reading monitor.";
//      if (this.SpeechSynthesisIsSupported()) {
      if (this.speaking.isSupported) {
        this.speaking.initialize();
      }
      else {
        this.diagnosticMsg = "Speech Synthesis is not supported on "+ getOS();
        alert("Speech Synthesis is not supported on "+ getOS());
      }
      if (this.listening.isSupported) {
        this.listening.initialize();
      }
      else {
        this.diagnosticMsg = "SpeechRecognition is not supported on " + getOS();
        alert("Speech Recognition is not supported on "+ getOS());
    }
      this.diagnosticMsg = "Initialized reading monitor.";

     // event handlers
     //onclick rm_word changes currentword
     //and potentially triggers events in listening and speaking object
       document.body.onclick = function(e) {   //when the document body is clicked
         if (window.event) {
             e = event.srcElement; }          //assign the element clicked to e (IE 6-8)
         else {
             e = e.target; }                  //assign the element clicked to e
         if (e.className) {
           if (e.className.indexOf('rm_word') != -1) {
             //get rm_sentence and rm_word ids
             var sentenceId = e.parentElement.getAttribute("id");
             var wordId = e.getAttribute("id");
             myReadingMonitor.moveToThisWordPosition(sentenceId, wordId);
             var partialSentenceInput = document.getElementById('partialSentence');
             if (partialSentenceInput.checked) {
               var w,  wordsToBeSpoken = "";
               parent = e.parentElement;
               for (w = 0; w <= wordId && w < parent.childElementCount; w++)
                 wordsToBeSpoken = wordsToBeSpoken  + " " +parent.children[w].innerText;
             }
             else {
               wordsToBeSpoken = myReadingMonitor.currentWord;
             }
            myReadingMonitor.speaking.say(wordsToBeSpoken);
          }
          else if (e.className.indexOf('data-speak-onclick') != -1) {
             spelling = e.getAttribute("XSAMPA");
             if (!spelling) {
               spelling = e.getAttribute("data-speak");
             }
             speak(spelling);
           }

//////////////////////////////
           else if (e.className.indexOf('speak-onclick') != -1) { //should use switch
     /*        spelling = e.getAttribute("XSAMPA");
              if (!spelling) {
                spelling = e.innerHTML
              }
     */
              partialSentenceInput = document.getElementById('partialSentence');
              if (partialSentenceInput.checked) {
                spelling = e.getAttribute("partial");
              }
              else {
                spelling = e.getAttribute("word");
              }
              speak(spelling);
           }
           else if (e.className.indexOf('onclick') != -1
             && e.className.indexOf('onclick-href') != -1) { //need an additional conditional here
             speak(e.innerHTML);
             window.location.href = "#"+e.id; } //goto anchor

           else if (e.className.indexOf('href-onclick') != -1) {
     //        window.location.href = "#"+e.innerHTML;  //goto anchor
              alert("oops href-onclick");
             window.location.href = "#"+e.id; } //goto anchor

           else if (e.className.indexOf('headertitle') != -1) {
             spelling = e.getAttribute("XSAMPA");
             if (!spelling) {
               spelling = e.innerHTML;
             }
             speak(spelling);
           }
/////////////////////////////////////////////////////
           else {
             myReadingMonitor.speaking.say("choose again");
           }
          }
         } //onclick
    } // initialize()
} // MyReadingMonitor
