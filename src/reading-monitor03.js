/*******************************************
 * Reading Monitor v0.1.0
 * (c) 2017 by Wen Eng. All rights reserved.
 ********************************************/
"use strict";
// ECMASCript6 class syntax only

// types of tokens // kludge because ES6 does not allow encapsulation


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
class PronunciationMap {
  constructor(parent) {
    this._parent = parent;
    this._pronunicationMap = new Map();
  }
  set(key, value) {
    this._pronunicationMap.set(key, value);
  };
  alternative(key) { // returns parameter if no match
    var value = this._pronunicationMap.value(key);
    if (typeof alternative == "undefined") {
      return key;
    }
    else {
      return value;
    }
  }
  value(key) { // returns undefined  if no match
    return  this._pronunicationMap.get(key);
  }
}
class SpeechRecognition {
  constructor(parent) {
    this._parent = parent;
    this._recognitionPattern = new PronunciationMap(this);
    // should be stored externally in a xml/html file
    this._recognitionPattern.set("Ronlyn", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1})$");
    this._recognitionPattern.set("Goo", "^(g[ou])");
    this._recognitionPattern.set("Wen", "^(wh{0,1}en)$");
    this._recognitionPattern.set("Aruna", "^([ai]runa)$");
    this._recognitionPattern.set("Gambhir", "^(gamb[ie]e{0,1}r)$");
    this._recognitionPattern.set("shao", "^(sh[ae]ll)$");
    this._recognitionPattern.set("mai", "^(my)");
    this._recognitionPattern.set("cheung", "^(ch[euo]ng)$");
    this._recognitionPattern.set("gaw", "^(g[ao]{lw])$");
    this._recognitionPattern.set("negin", "^(n[ei]ge{1,2}ne{0,1})$");
    this._recognitionPattern.set("Jaylynne", "^(ja[yi]l[ey]n{1,2}e{0,1})$");
    this._recognitionPattern.set("Lynda", "^(l[iy]nda)$");
    this._recognitionPattern.set("Melisse", "^(m[ei]lis{1,2}e{0,1})$");
    this._recognitionPattern.set("Meilan", "^(m[aei]y{0,1}land{0,1})$");
    this._recognitionPattern.set("Ag", "^([ae]g{1,2})$");
    this._recognitionPattern.set("Seaton", "^(sea{0,1}ton)$");
    this._recognitionPattern.set("Ave", "^(avenue)$");
    this._recognitionPattern.set("St", "^(street)$");
  }
  wordRecognitionPattern(writtenWord) {
      return this._recognitionPattern.value(writtenWord);
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
  initialize() {
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
        if (!MyReadingMonitor.listening.isActive) {
          MyReadingMonitor.diagnosticMsg = "listenBtn:onclick(): not listening";
          MyReadingMonitor.timer.start();
          MyReadingMonitor.diagnosticMsg = 'listenBtn::onclick(): user started speech recognition';
          MyReadingMonitor.listening.buttonActivate();
          MyReadingMonitor.speaking.say("listening");
          recognition.start();
        }
        else {
          MyReadingMonitor.diagnosticMsg = "listenBtn:onclick(): listening";
          MyReadingMonitor.timer.cancel();
          recognition.stop();
          MyReadingMonitor.diagnosticMsg = 'listenBtn::onclick(): user terminated';
          MyReadingMonitor.listening.buttonDeactivate();
//          MyReadingMonitor.speaking.say("no longer listening");
        }
        event.stopPropagation();
      }
      recognition.onresult = function(event) {
  //      ////////////
  //      implement these interfaces someday when the following references are available. Until then, just split the transcript
  //        var spokenEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
  //        var SpeechRecognition = SpeechRecognitionAlternative || webkitSpeechRecognitionAlternative
  //      Perhaps the grammar object will be available by then too.
  //      ////////////
        try {
//          MyReadingMonitor.diagnosticMsg = "recognition.onresult: triggered";
          var spokenResults = event.results[0].isFinal;
          var spokenWords = event.results[event.results.length - 1][0].transcript.split(" ");
          var isFinalResult = event.results[0].isFinal;
//           MyReadingMonitor.diagnosticMsg = "recognition.onresult: is Final?: "+event.results[0].isFinal;
           var w;
           for (w = 0; w < spokenWords.length; w++) {
//             MyReadingMonitor.diagnosticMsg = "recognition.onresult: written word: "+MyReadingMonitor.currentWord;
             MyReadingMonitor.diagnosticMsg = "recognition.onresult: spoken words["+ w.toString()+"]:"+spokenWords[w];
             if (MyReadingMonitor.matchWord(spokenWords[w])) { //should strip blanks too
               MyReadingMonitor.moveToNextWord();
             } //
           } // for
           MyReadingMonitor.diagnosticMsg = 'Result received: ' + spokenWords;
          //         console.log('confidence: ' + event.results[0][0].confidence);
          //         console.log("result[last]:"+spokenWords);
          //         if ((event.results.length - 1) >= 1)
          //         console.log('result[0]: ' + event.results[0][0].transcript);
        } //try
        catch(e) {
          if (typeof MyReadingMonitor == "undefined") {
            alert("recognition:onresult: MyReadingMonitor does not exist in global scope")
          }
          else {
            MyReadingMonitor.diagnosticMsg = 'recognition:onresult: '+e.message;

          }
        }
      } // onresult

      recognition.onspeechend = function() {
  //         thisMonitor.diagnosticMsg = "recognition.onspeechend";

         if (MyReadingMonitor.timer.isActive) {
           MyReadingMonitor.diagnosticMsg = "recognition.onspeechend: keep listening";
  //           recognition.start();
         }
         else {
  //            listenBtn.defaultValue = "listen to me read";
            MyReadingMonitor.diagnosticMsg = "recognition.onspeechend: timer expired or cancelled";
          }
       }
       recognition.onend = function() {
  //          thisMonitor.diagnosticMsg = "recognition.onend";
  //          thisMonitor.diagnosticMsg = "timerElapsedTime: "+ thisMonitor.timerElapsedTime;
          if (MyReadingMonitor.timer.isActive) {
            MyReadingMonitor.listening.buttonActivate();
            MyReadingMonitor.diagnosticMsg = "recognition.onend: continue listening";
            recognition.start();
          }
          else {
            if (!MyReadingMonitor.timer.isActive)
             MyReadingMonitor.diagnosticMsg = "recognition.onend: timer expired or cancelled";
             MyReadingMonitor.listening.buttonDeactivate();
             MyReadingMonitor.speaking.say("no longer listening");
           }
        }
       recognition.onsoundend = function() {
         // event fires immediately after onspeechend
         MyReadingMonitor.diagnosticMsg = "recognition.onsoundend";
         recognition.stop();
//         MyReadingMonitor.speaking.say("no longer listening");
         MyReadingMonitor.listening.buttonDeactivate();
       }
       recognition.onnomatch = function(event) {
         MyReadingMonitor.diagnosticMsg = "recognition.onnomatch:";
       }
       recognition.onerror = function(event) {
         MyReadingMonitor.diagnosticMsg = 'recognition.onerror: ' + event.error;
         // timeout with no sound triggers this event
       }

       // can the existing html support the prescribed format?
  //      document.getElementsByClassName("sentence")[this._sentenceIdx].getElementsByClassName("word")[this._wordIdx].style.textDecoration = "underline";
       this.buttonDeactivate();  // starting state

        // insert code to change current word and sentence
    }
    catch(e) {
      if (typeof MyReadingMonitor == 'undefined') {
        alert("No global variable MyReadingMonitor found.");
      }
      else {
        MyReadingMonitor.diagnosticMsg =" Could not initialize Speech Recognition object";
      }
    }
  }
}
class SpeechSynthesis {
  constructor(parent) {
    this._parent = parent;
    this._alternatePronunication = new PronunciationMap(this);
    this._alternatePronunication.set("Caden", "Kayden")
    this._alternatePronunication.set("Elan", "Elon")
    this._alternatePronunication.set("Melisse", "Meh-leese")
    this._alternatePronunication.set("Bodapati", "Boda-potti")
    this._alternatePronunication.set("Meilan", "May-lon")
    this._alternatePronunication.set("Jaylynne", "Jayleen")
    this._alternatePronunication.set("Gambhir", "gambeer")
    this._alternatePronunication.set("SCVMC", "santa clara valley medical center")
    this._alternatePronunication.set("CSUEB", "cal state east bay")
    this._alternatePronunication.set("frappocino", "frappachino")
    this._alternatePronunication.set("quiche", "keesch")
    this._alternatePronunication.set("bathing", "batheing")
    this._alternatePronunication.set("Auntie", "anty")
    this._alternatePronunication.set("Ag", "agg")
    this._alternatePronunication.set("Manuel", "manual")
    this._alternatePronunication.set("Berna", "burrna")
    this._alternatePronunication.set("Giovanola", "geo-ven-nola")
    this._alternatePronunication.set("Giovanolas", "geo-ven-nolas")
    this._alternatePronunication.set("Lagos", "loggos")
    this._alternatePronunication.set("PE", "P.E.")
    this._alternatePronunication.set("Negin", "negeen")
    this._alternatePronunication.set("408", "4 0 8")
    this._alternatePronunication.set("206", "2 0 6")
    this._alternatePronunication.set("5963", "5 9 6 3")
    this._alternatePronunication.set("267", "2 6 7")
    this._alternatePronunication.set("6076", "6 0 7 6")
    this._alternatePronunication.set("20680", "2 0 6 8 0")
    this._alternatePronunication.set("95070", "9 5 0 7 0")

    this._defaultVoice = 'Microsoft Zira Desktop - English (United States)';
  }
  betterAlternative(spokenWord) {
      return this._alternatePronunication.value(spokenWord);
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
      //try touching it and testing for the proper range
      var vol = parseFloat(MyReadingMonitor.speaking.volumeControlElement.value);
      if (isNaN(vol) || vol > 1 || vol < 0)
        this._parent.diagnosticMsg = "volumeControlElementId setter: invalid element type or range for "+id;
    }
    catch(e) {
      this._parent.diagnosticMsg = "volumeControlElementId setter: invalid element id "+id;
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
  respelledWord(word) {
  // returns phonetic word for "word" and speaking
    return word;
  }
  voiceSelectorPopulate() {
     var  v,voice,voices, option;
     try {
        if (speechSynthesis.onvoiceschanged == null) {
          // wait for speechRecognition to be available -- chrome kludge
           speechSynthesis.onvoiceschanged = MyReadingMonitor.speaking.voiceSelectorPopulate;
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
            option.selected = (voice.name == MyReadingMonitor.speaking.defaultVoice);
            MyReadingMonitor.speaking.voiceSelectorElement.appendChild(option);
         }); // foreach
       }
     }
     catch(e) {
       if (typeof MyReadingMonitor == "undefined") {
         alert("voiceSelectorPopulate(): MyReadingMonitor does not exist in global scope")
       }
       else {
          MyReadingMonitor.diagnosticMsg = "voiceSelectorPopulate: could not populate voices";
       }
     }
  }
  initialize() {
    try {
      this._synthesis = new SpeechSynthesisUtterance();
      this._synthesis.lang = 'en-US';
      this._synthesis.rate = 1;
      this._synthesis.pitch = 1;
      this.voiceSelectorPopulate();
    }
    catch(e) {
      if (typeof MyReadingMonitor == 'undefined') {
        alert("No global variable MyReadingMonitor found.");
      }
      else {
        MyReadingMonitor.diagnosticMsg =" Could not initialize Speech Recognition object";
      }
    }
  }
  say(words) {
    //    this._synthesis.speak(words);
      var voices = speechSynthesis.getVoices();
      var myvoice = voices.filter(
        function(voice) {
          return voice.name == MyReadingMonitor.speaking.voiceSelectorElement.value;
        });
      var currentVoice = speechSynthesis.getVoices().filter(function(voice) { return voice.name == MyReadingMonitor.speaking.voiceSelectorElement.value; })[0];
      this._synthesis.voice = currentVoice;
      this._synthesis.volume = parseFloat(MyReadingMonitor.speaking.volumeControlElement.value);
      this._synthesis.text = words;
      window.speechSynthesis.speak(this._synthesis);
  }
}
class ReadingMonitor {
    // class variables
    constructor(name) {
      this._name = name;
      this._timer = new Timer(this);
      this._speechRecognition = new SpeechRecognition(this);
      this._speechSynthesis = new SpeechSynthesis(this);

      this._punctuationPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()\"\?\.!]/);
      this._tokenSeparatorPattern = new RegExp(/[\s]/);
      this._whitespacePattern = new RegExp(/[\s]/);
      this._wordSeparatorPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()\"\.\?!\t\s]/);
      // var tokenPattern = new RegExp(/[A-Z]{2,}(?![a-z])|[A-Z][a-z]+(?=[A-Z])|[\'\w\-]+/);
    }
    get punctuationPattern() {
      return this._punctuationPattern;
    }
    get tokenSeparatorPattern() {
      return this._tokenSeparatorPattern;
    }
    get whitespacePattern() {
      return this._whitespacePattern;
    }
    get wordSeparatorPattern() {
      return this._wordSeparatorPattern;
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
    get respelling() {
      return this._alternatePronunication;
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
    set sentenceIdElementId(id) {
      try {
        this._sentenceIdElement  = document.getElementById(id);
        this._sentenceIdElement.innerText = "0"; // touch test
      }
      catch(e) {
        this.diagnosticMsg = "sentenceIdElementId setter: invalid Element id "+id;
      };
    }
    set wordIdxElementId(id) {
        //check typeof parameter
        try {
          this._tokenIdxElement  = document.getElementById(id);
          this._tokenIdxElement.innerText = "0"; // touch test
        }
        catch(e) {
          this.diagnosticMsg = "wordIdxElementId setter: invalid Element id "+id;
        };
      }
      set wordIdElementId(id) {
          //check typeof parameter
          try {
            this._wordIdElement  = document.getElementById(id);
            this._wordIdElement.innerText = "0"; // touch test
          }
          catch(e) {
            this.diagnosticMsg = "wordIdElementId setter: invalid Element id "+id;
          };
        }
    set diagnosticElementId(id) {
        this._diagnosticElement = document.getElementById(id);
    }
    set diagnosticMsg(msg) {
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
        return Number(this._sentenceIdx);
    }
    set currentSentenceIdx(sentenceIdx) {
        // check if Idx is valid based on DOM
        try {
          this.currentWordIndicatorOff();
          this._sentenceIdx = Number(sentenceIdx);
          this._sentenceIdxElement.innerText = sentenceIdx.toString();

          this._lastWordIdx = document.getElementsByClassName("rm_sentence")[this._sentenceIdx].childElementCount - 1;
          var rm_wordLastIdx = document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word").length - 1;
          this._lastWordId = document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word")[rm_wordLastIdx].getAttribute("id");
        }
        catch(e) {
          this.diagnosticMsg = "currentSentenceIdx setter: failed to set value to "+sentenceIdx+ " because "+e.message;
        }
    }
    get currentWordId() {
        return this._wordId;
    }
    set currentWordId(wordId) {
      // check if Idx is valid based on DOM
      try {
        this.currentWordIndicatorOff();
        this._wordId = wordId;
        this.currentWordIndicatorOn();
        this._wordIdElement.innerText = wordId.toString();
      }
      catch(e) {
        this.diagnosticMsg = "currentWordId setter: failed to set value to "+wordId+ " because "+e.message;
      }
    }
    get lastWordIdx() {
      return this._lastWordIdx;
    }
    get lastWordId() {
      return this._lastWordId;
    }
    isLastWord() {
      return this._wordId >= this._lastWordId;
    }
    endOfSentence() {
      return this._tokenIdx >= this._lastWordIdx;
    }
    isLastSentence() {
      return this._sentenceIdx >= this._lastSentenceIdx;
    }
    get currentWord() {
      try {
        return document.getElementsByClassName("rm_sentence")[this.currentSentenceIdx].getElementsByClassName("rm_word")[this._wordId].innerText;
      }
      catch(e) {
        this.diagnosticMsg = "currentWord getter: failed to get value to "+wordId+ " because "+e.message;
        return null;
      }
    }
     currentWordAttribute(tag) {
      try {
        return document.getElementsByClassName("rm_sentence")[this.currentSentenceIdx].getElementsByClassName("rm_word")[this._wordId].getAttribute(tag);
      }
      catch(e) {
        this.diagnosticMsg = "currentWord getter: failed to get value of tag="+tag+" to "+wordId+ " because "+e.message;
        return null;
      }
    }
    currentRespelledWord(wordTag) {
      try {
        return document.getElementsByClassName("rm_sentence")[this.currentSentenceIdx].getElementsByClassName("rm_word")[this._wordId].getAttribute(wordTag);
      // converts source html sentence <div>s into sentence containers <div>s/word <span>s
      }
      catch(e) {
        this.diagnosticMsg = "currentRespelledWord getter: failed to get value to "+wordId+ " because "+e.message;
        return null;
      }
    }
    /***
    get nextWord() {
      // does not change current word position
      try {
        return document.getElementsByClassName("rm_sentence")[this.currentSentenceIdx].getElementsByClassName("rm_word")[this._wordId+1].innerText;
        // need to add nextSentence transition
      }
      catch(e) {
        return null;
      }
    }
    get currentTokenIdx() {
        return this._tokenIdx;
    }
    set currentTokenIdx(wordIdx) {
      // check if Idx is valid based on DOM
        this._tokenIdx = wordIdx;
        if (typeof this._tokenIdxElement != 'undefined' & this._tokenIdxElement != null)
          this._tokenIdxElement.innerText = wordIdx.toString();
    }
    isLastToken() {
      return this._tokenIdx >= this._lastWordIdx;
    }
    isNextToLastToken() {
      return (this._tokenIdx+1) >= this._lastWordIdx;
    }
    */
/*
    parseSentences_Deprecated(sentenceTag) {
          // can the existing html support parsing into the prescribed format?
      var sentences;
      var srcSentence, srcNonword, classLabel, dstSentence;
      var c, s, w;

       // With \s pattern, trailing punctuation is included with word token and is handled as a special case
       var tokenSeparators = new RegExp(/[\s]/);
       var wordSeparators = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()\"\.\?!\t\s]/);
       var whitespaceSeparators = new RegExp(/[\s]/);
       var words;
       var currentPos, wordPos, wordLength;
       var srcSentence, srcNonword, classLabel, dstSentence;
       var wordIdx = 0;
       var span;
       var previousWordIdx = -1;
      sentences = document.getElementsByClassName(sentenceTag)
      this._lastSentenceIdx = sentences.length -1;
      for (s = 0; s < sentences.length; s++) {  // replaceWith bug prevents iteration
//        for (s = sentences.length - 1; s >= 0; s--) {  // replaceWith bug prevents iteration
          dstSentence = document.createElement("div");
           dstSentence.setAttribute("class", "rm_sentence");
           dstSentence.setAttribute("id", s);
          srcSentence = sentences[s].innerText;
       //   sentences[s].setAttribute("style", "display:inline;"); //style="display: inline"
          words = srcSentence.split(wordSeparators).filter(item => item.length > 0); // remove null
          currentPos = 0; // beginning of sentence
          wordIdx = 0;
          previousWordIdx = -1;
          for (w = 0; w < words.length; w++) {
            wordPos  = srcSentence.indexOf(words[w], currentPos);
            wordLength = words[w].length;
            if (wordPos > currentPos) { // punctuation or whitespace before word
              srcNonword = srcSentence.substring(currentPos, wordPos);
              if (whitespaceSeparators.test(srcNonword)) {
                classLabel = "rm_whitespace";
              }
              else {
                classLabel = "rm_punctuation";
              }
//              sentenceHTML = sentenceHTML + '<span class="'+classLabel+'">'+srcNonword+"</span>";
              currentPos = wordPos; // advance passed current word
              span = document.createElement("span");
              span.setAttribute("class", classLabel);
              span.setAttribute("idx", wordIdx++);
              span.innerText = srcNonword;
              dstSentence.appendChild(span);
            }
            if (wordPos == currentPos) { // positioned at beginning of word
  //            sentenceHTML = sentenceHTML + '<span class="rm_word" id='+w+">"+words[w]+"</span>";
              currentPos = currentPos + wordLength; // advance passed current word
              span = document.createElement("span");
              span.setAttribute("class", "rm_word");
              span.setAttribute("idx", wordIdx);
              if (previousWordIdx != -1) span.setAttribute("prevWordIdx", previousWordIdx);
              previousWordIdx = wordIdx;
              span.setAttribute("id", w);
              span.innerText = words[w];
              dstSentence.appendChild(span);
              wordIdx++;
            }
          } // for
          if (currentPos < srcSentence.length) { // no more words just punctuations?
//            sentenceHTML = sentenceHTML + '<span class="rm_punctuation">'+srcSentence.substring(currentPos, srcSentence.length)+"</span>";
            span = document.createElement("span");
            span.innerText = srcSentence.substring(currentPos, srcSentence.length);
            span.setAttribute("class", "rm_punctuation");
            span.setAttribute("idx", wordIdx);
            dstSentence.appendChild(span);
          }
          // set nextWordIdx from prevWordIdx
          for (c = dstSentence.childElementCount - 1; c >=0; c--) {
             var prevIdx = dstSentence.children[c].getAttribute("prevWordIdx");
            if (prevIdx !== null && prevIdx != -1) { // rm_word
              dstSentence.children[prevIdx].setAttribute("nextWordIdx", c);
            }
          }
//          sentenceHTML = sentenceHTML + "</span>";
          sentences[s].outerHTML = dstSentence.innerHTML;
//          sentences[s].replaceWith(dstSentence);
//          sentences[s].innerHTML = sentenceHTML;  // replace existing sentence with new one
        }

    } // parseSentences
***/
    rm_wordSpanOnClick(e) {
      try {
        var sentenceElement = e.target.parentElement;
        var sentenceIdx = sentenceElement.getAttribute("id");
        var wordId = e.target.getAttribute("id");
        var wordsToBeSpoken = "";
        MyReadingMonitor.moveToThisWordPosition(sentenceIdx, wordId);
        var partialSentenceInput = document.getElementById('partialSentence');
        if (partialSentenceInput.checked) {
          var w, hasFoundWordId = false;
          //could be simplified by iterating through sentenceElement.getElementsByClass("rm_word")
          //should hide rm_word_speaking in loop
          for (w = 0; !hasFoundWordId && w < sentenceElement.childElementCount; w++) {
            if (sentenceElement.children[w].getAttribute("class").indexOf("rm_word") != -1) {
              hasFoundWordId = sentenceElement.children[w].getAttribute("id").indexOf(wordId) != -1;
//              wordsToBeSpoken = wordsToBeSpoken  + " " +sentenceElement.children[w].innerText;
              var nextWord = sentenceElement.children[w].getAttribute("rm_word_betterPronunciation")
              if (nextWord == null) nextWord = sentenceElement.children[w].innerText;
              wordsToBeSpoken = wordsToBeSpoken  + " " + nextWord;
            }
          }
        }
        else {
          var betterAlternative = MyReadingMonitor.currentWordAttribute("rm_word_betterPronunciation");
          if (betterAlternative != null) {
            wordsToBeSpoken = betterAlternative;
          }
          else {
            wordsToBeSpoken = MyReadingMonitor.currentWord;
          }
        }
       MyReadingMonitor.speaking.say(wordsToBeSpoken);
       e.stopPropagation(); // stop bubbling
      }
      catch(e) {
        MyReadingMonitor.diagnosticMsg = "rm_word_spanOnClick: Unexpected error: "+e.message;
      }
    }
    parseSentences(sentenceTag) {
      var srcSentence, srcNonword, classLabel;
      var dstSentenceElement, srcSentenceElement;
      var c, s, w;
      var words;
      var currentPos, wordPos, wordLength;
      var wordIdx = 0;
      var span;
      var previousWordIdx = -1;
      var alternateRecognitionAttribute;
      var alternateSynthesisAttribute;

      for(s = 0, srcSentenceElement = document.getElementsByClassName(sentenceTag)[0];
          typeof srcSentenceElement != 'undefined';
          srcSentenceElement = document.getElementsByClassName(sentenceTag)[0], s++) {
          srcSentence = srcSentenceElement.innerText;

          dstSentenceElement = document.createElement(srcSentenceElement.tagName);
          dstSentenceElement.setAttribute("class", "rm_sentence");
          dstSentenceElement.setAttribute("id", s);

//        sentences[s].setAttribute("style", "display:inline;"); //style="display: inline"
          words = srcSentence.split(MyReadingMonitor.wordSeparatorPattern).filter(item => item.length > 0); // remove null
          currentPos = 0; // beginning of sentence
          wordIdx = 0;
          previousWordIdx = -1;
          for (w = 0; w < words.length; w++) {
            wordPos  = srcSentence.indexOf(words[w], currentPos);
            wordLength = words[w].length;
            if (wordPos > currentPos) { // punctuation or whitespace before word
              srcNonword = srcSentence.substring(currentPos, wordPos);
              if (MyReadingMonitor.whitespacePattern.test(srcNonword)) {
                classLabel = "rm_whitespace";
              } // must add other tests when other rm_* types are added
              else {
                classLabel = "rm_punctuation";
              }
              currentPos = wordPos; // advance to current word
              span = document.createElement("span");
              span.setAttribute("class", classLabel);
              span.setAttribute("idx", wordIdx++);
              span.innerText = srcNonword;
              dstSentenceElement.appendChild(span);
            }
            if (wordPos == currentPos) { // positioned at beginning of word
              currentPos = currentPos + wordLength; // advance passed current word
              span = document.createElement("span");
              span.setAttribute("class", "rm_word");
              span.setAttribute("idx", wordIdx);
              if (previousWordIdx != -1) span.setAttribute("prevWordIdx", previousWordIdx);
              previousWordIdx = wordIdx;
              span.setAttribute("id", w);
              span.onclick = function() { MyReadingMonitor.rm_wordSpanOnClick(event) };

              var pattern = this.listening.wordRecognitionPattern(words[w]);
              if (typeof pattern != "undefined") span.setAttribute("rm_word_recognitionPattern", pattern);
              var alternative = this.speaking.betterAlternative(words[w]);
              if (typeof alternative != "undefined") span.setAttribute("rm_word_betterPronunciation", alternative);

              span.innerText = words[w];
              dstSentenceElement.appendChild(span);
              wordIdx++;
            }
          } // for loop of words
          if (currentPos < srcSentence.length) { // no more words just punctuations?
            span = document.createElement("span");
            span.innerText = srcSentence.substring(currentPos, srcSentence.length);
            span.setAttribute("class", "rm_punctuation");
            span.setAttribute("idx", wordIdx);
            dstSentenceElement.appendChild(span);
          }
          // set nextWordIdx from prevWordIdx
          for (c = dstSentenceElement.childElementCount - 1; c >= 0; c--) {
             var prevIdx = dstSentenceElement.children[c].getAttribute("prevWordIdx");
            if (prevIdx !== null && prevIdx != -1) { // rm_word
              dstSentenceElement.children[prevIdx].setAttribute("nextWordIdx", c);
              srcSentence = document.getElementsByClassName(sentenceTag)
            }
          }
          srcSentenceElement.parentNode.replaceChild(dstSentenceElement, srcSentenceElement);
        } // for loop of sentences
        this._lastSentenceIdx = document.getElementsByClassName("rm_sentence").length -1;
    } // parseSentences1
    moveToNextWord() {
      // position to the next word as opposed to token (word, punctuation or whitespace)
      // getElementsByClassName returns a HTMLCollection of matching elements.
      // According to w3.org 2015, "[t]he collection then represents a view of the
      // subtree rooted at the collection's root, containing only nodes that match
      // the given filter. The view is linear. In the absence of specific
      // requirements to the contrary, the nodes within the collection must be
      // sorted in tree order:" top-down, depth first OR HTML WYSIWYG.
  if (this.isLastWord()) {
        this.moveToNextSentence();
      }
      else {
        this.currentWordId++;
      }
//      document.getElementsByClassName("sentence")[this._sentenceIdx].getElementsByClassName("word")[this._wordIdx].style.textDecoration = "underline";
    }
    moveToFirstSentence() {
      // check for last sentence
      this.moveToSentence(0);
      this.currentWordId = 0;
    }
    moveToNextSentence() {
      // check for last sentence
      if (this.isLastSentence()) {
      }
      else {
        this.moveToSentence(Number(this.currentSentenceIdx) + 1);
      }
    }
    moveToSentence(sentenceIdx) {
      // check for last sentence
      if (sentenceIdx != this.currentSentenceIdx) {
        this.currentSentenceIdx = Number(sentenceIdx);
        this.currentToken = 0;
        this.currentWordId = 0;
      }
    }
    moveToThisWordPosition(sentenceIdx, wordId) {
      try {
        this.moveToSentence(sentenceIdx)
        this.currentWordId = Number(wordId);
      }
      catch(e) {
        this.diagnosticMsg = "moveToThisWordPosition(): could not change word";
      }
    }
    set currentWordIndicator(state) {
      try {
        document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word")[this._wordId].style.textDecoration = state;
      }
      catch(e) {
        this.diagnosticMsg = "currentWordIndicator(): could not change word indicator";
      }
//      document.getElementsByClassName("rm_sentence")[this._sentenceIdx].getElementsByClassName("rm_word")[this._tokenIdx].style.textDecoration = state;
    }
    currentWordIndicatorOff() {
      this.currentWordIndicator = "none";
    }
    currentWordIndicatorOn() {
      this.currentWordIndicator = "underline";
    }
/****
    nextToken_deprecated() {
      const  TOKEN_WORD = 0;
      const  TOKEN_NEWSENTENCE = 1;
      const  TOKEN_INTERIMPUNCTUATION = 2;
      const  TOKEN_PROPERNOUN = 3;      // consider this a lexical analyzer
      // positions to the next valid word. Because the speech recognitionengine does not recognize punctuations
      // this method skips punctuations marks and also positions to the first word of a new sentence when
      // trailing punctation is encountered. The method will return the type of token it encountered though.
      var interimPunctuationPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()]\"/);
//      var eosPunctuationPattern = new RegExp(/[\.!\?]/);
      var returnVal = TOKEN_WORD; // assume the token is a word
      //      var properNamePattern = new RegExp(/^[A-Z]/); first letter uppercase... less conficent if at beginning of sentence
      //      var possessivePattern = new RegExp(/^[A-Z]/); first letter uppercase... less conficent if at beginning of sentence
  //    this.currentWordIndicatorOff();

      if (this.isLastToken()) {
        // state: last token that is not a trailing punctuation
        // action: goto the next sentence.
        this.diagnosticMsg = "warning: last token in sentence is not a end-of-sentence punctuation"
        this.moveToNextSentence();
        returnVal = TOKEN_NEWSENTENCE;
      }
      else if (this.isNextToLastToken() && MyReadingMonitor.eosPunctuationPattern.test(this.nextWord)) {
        // state: next to last token followed by trailing punctuation
        // action: goto the next sentence.
        this.moveToNextSentence();
        returnVal = TOKEN_NEWSENTENCE;
      }
      else if (interimPunctuationPattern.test(this.nextWord)) {
        // state: next token is a interim punctuation
        //action: goto the next word.
        this.moveToNextWord();  //skip but assumes only a single punctuation
        returnVal = TOKEN_INTERIMPUNCTUATION;
      }
      else {
        // state: next token is a word
        //action: goto the next word.
        this.moveToNextWord();
        returnVal = TOKEN_NEXTWORD;
      }
      return returnVal;
    }
***/
    matchWord(spokenWord) {
      // matches spoken word to written word
      // need code to manage special cases: proper noun not already recognized
      // inn parsing phase, embed possible surrogates for matching proper names:
      // Ronlyn = { Rollin | Rowland | ronlin | ron lin }
      var properNamePattern = new RegExp(/^[A-Z]/); //first letter uppercase... less conficent if at beginning of sentence
      // try lexical match
      if (spokenWord.toLowerCase() == this.currentWord.toLowerCase()) {
        return true;
      }
      else {
        // try pattern match
        var pattern = this.currentWordAttribute("rm_word_recognitionPattern");
        if (pattern != null) {
          var recognitionPattern = new RegExp(pattern);
          return recognitionPattern.test(spokenWord.toLowerCase());
        }
        else {
          //add to list of words to be added to pronunciationPattern
          this.diagnosticMsg = "matchWord() cannot match " + spokenWord.toLowerCase();
        }
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
//       MyReadingMonitor.speaking.say("try again");
     }
    } // initialize()
} // MyReadingMonitor
