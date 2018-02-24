/*******************************************
 * Reading Monitor v0.3.0
 * (c) 2017, 2018 by Wen Eng. All rights reserved.
 ********************************************/
"use strict";
// ECMAScript6 class syntax only
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
class Stack {
  constructor() {
    this._itmes = [];
    this._depth = 0;
  }
  length() {
    return this._depth;
  }
  pop() {
    if (this._depth > 0) {
      this._depth--;
    }
  }
  push(item) {
    this._items.push(item);
    this._depth++;
  }
}
// derived from Map() to specifically increment and decrement value field
class CounterMap {
  constructor() {
    this._tokenCounter = new Map();
  }
  decrement(key) {
    var counterValue = this._tokenCounter.get(key);
    if (typeof(counterValue) == "undefined") {  // if key does not exist
      counterValue = 1;
    }
    this._tokenCounter.set(key, counterValue-1);
  }
  entries() {
    return this._tokenCounter.entries();
  }
  increment(key) {
    var counterValue = this._tokenCounter.get(key);
    if (typeof(counterValue) == "undefined") {  // if key does not exist
      counterValue = 0;
    }
    this._tokenCounter.set(key, counterValue+1);
  }
}
class Timer {
  constructor(parent) {
    this._parent = parent;
  }
  set timeout(secs) {
    // period of time from start() to onspeechend
    this._timeout = Number(secs) * 1000; //msecs
  }
  start() {
    this._startTime = new Date();
    this._timerOn = true;
    this._parent.parent.diagnosticMsg = "timer.start: " + this._startTime;
  }
  cancel() {
    this._timerOn = false;
    this._startTime = new Date();
    this._parent.parent.diagnosticMsg = "timer.cancel: " + this._startTime;
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
    this._buttonImgInactive = "img/mic1-inactive-xparent.gif"
    this._buttonImgActive = "img/mic1-250ms.gif"
    this._buttonImgGhosted = "img/mic1-ghosted-xparent.gif"
//    this._recognitionPattern = new wordCountMap(this);

    this._timer = new Timer(this);
    this._mismatchedWordCounterMap = new CounterMap();
    this._recognitionPattern = new PronunciationMap(this);
    this._currentWordExpected = ""; //strictly for reporting and NOT processing
    this._previousSpokenWord = "";
    // should be stored externally in a xml/html file
    // pairs of written word that SpeechRecognition would match the second
    this._recognitionPattern.set("Ronlyn", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1})$");
    this._recognitionPattern.set("Ronlyn's", "^(ron|ro[ns]a{0,1}l[aiye]nd{0,1}'s)$");
    this._recognitionPattern.set("Goo", "^(g[ou])");
    this._recognitionPattern.set("Wen", "^(wh{0,1}en)$");
    this._recognitionPattern.set("Wen's", "^(wh{0,1}en's)$");
    this._recognitionPattern.set("Aruna", "^([ai]runa)$");
    this._recognitionPattern.set("Berna", "^(b[eu]rn[ae]t{0,2})$");
    this._recognitionPattern.set("Berna's", "^(b[eu]rn[ae]t{0,2}s)$");
    this._recognitionPattern.set("Bett", "^(bet{1,2})$");
    this._recognitionPattern.set("Bett's", "^(bet{1,2}s)$");
    this._recognitionPattern.set("Gambhir", "^(gamb[ie]e{0,1}r)$");
    this._recognitionPattern.set("shao", "^(sh[ae]ll)$");
    this._recognitionPattern.set("mai", "^(my)");
    this._recognitionPattern.set("cheung", "^(ch[euo]ng)$");
    this._recognitionPattern.set("gaw", "^(ga{0,1}o{0,1}l{0,1}w{0,1})$");
    this._recognitionPattern.set("negin", "^(n[ei]ge{1,2}ne{0,1})$");
    this._recognitionPattern.set("Jaylynne", "^(ja[yi]l[ey]n{1,2}e{0,1})$");
    this._recognitionPattern.set("Lynda", "^(l[iy]nda)$");
    this._recognitionPattern.set("Melisse", "^(m[ei]lis{1,2}e{0,1})$");
    this._recognitionPattern.set("Meilan", "^(m[aei]y{0,1}land{0,1})$");
    this._recognitionPattern.set("Popo's", "^(popo'{0,1}s)$");
    this._recognitionPattern.set("Auntie", "^([ant{1,2}[iy])$");
    this._recognitionPattern.set("Ag", "^([ae]g{1,2})$");
    this._recognitionPattern.set("Seaton", "^(sea{0,1}ton)$");
    this._recognitionPattern.set("Ave", "^(avenue)$");
    this._recognitionPattern.set("St", "^(street)$");
    this._recognitionPattern.set("one", "1");
    this._recognitionPattern.set("two", "2");
    this._recognitionPattern.set("three", "3");
    this._recognitionPattern.set("four", "4");
    this._recognitionPattern.set("five", "5");
    this._recognitionPattern.set("six", "6");
    this._recognitionPattern.set("seven", "7");
    this._recognitionPattern.set("eight", "8");
    this._recognitionPattern.set("nine", "9");
    this._recognitionPattern.set("ten", "10");
    this._recognitionPattern.set("twenty", "20");
    this._recognitionPattern.set("thirty", "30");
    this._recognitionPattern.set("forty", "40");
    this._recognitionPattern.set("fifty", "50");
    this._recognitionPattern.set("sixty", "60");
    this._recognitionPattern.set("seventy", "70");
    this._recognitionPattern.set("eighty", "80");
    this._recognitionPattern.set("ninety", "90");
    this._recognitionPattern.set("eleven", "11");
    this._recognitionPattern.set("twelve", "12");
    this._recognitionPattern.set("thirteen", "13");
    this._recognitionPattern.set("fourteen", "14");
    this._recognitionPattern.set("fifteen", "15");
    this._recognitionPattern.set("sixteen", "16");
    this._recognitionPattern.set("seventeen", "17");
    this._recognitionPattern.set("eighteen", "18");
    this._recognitionPattern.set("nineteen", "19");
    this._recognitionPattern.set("char", "^(char{0,1})$");
    this._recognitionPattern.set("siu", "^(si{0,1}ue{0,1})$");
    this._recognitionPattern.set("bao", "^(ba{0,1}ow{0,1})$");
    this._recognitionPattern.set("chueng", "^(chu[mn]g{0,1})$");
    this._recognitionPattern.set("Popeye's", "^(popeyes)$");
    this._recognitionPattern.set("Talkfest", "^(fest)$");
    this._recognitionPattern.set("Giovanola", "(v[ae]nt{0,1}[io]l{0,1}a)$");
    this._recognitionPattern.set("Dianne", "^(dian{1,2}e)$");
    this._recognitionPattern.set("Dori", "^(dor[iy])$");
    this._recognitionPattern.set("Dr", "dr.");
    this._recognitionPattern.set("Theatre", "theater");
    this._recognitionPattern.set("pm", "p.m.");
    this._recognitionPattern.set("am", "a.m.");
    this._recognitionPattern.set("flour", "^(flo[uw]e{0,1}r)$");
    this._recognitionPattern.set("Cyndi", "c[iy]nd[yi]");
    this._recognitionPattern.set("Cyndi's", "c[iy]nd[yi]'s");
    this._recognitionPattern.set("Aileen", "[ae]ileen");
    this._recognitionPattern.set("to", "to{1,2}");
    this._recognitionPattern.set("Mex", "max");
    this._recognitionPattern.set("Aqui", "a{0,1}c{0,1}ke[ey]");
  }
  set errorMsg(msg) {
    this._parent.errorMsg = msg;
  }
  get timer() {
    return this._timer;
  }
  get mismatchedWordCounterMap() {
    return this._mismatchedWordCounterMap;
  }
  resetMismatchedWordCounterMap() {
    this._mismatchedWordCounterMap = new CounterMap();
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
    this._isActive = active;  // CAREFUL...set asynchronously
  }
  get isSupported() {
    return (window.hasOwnProperty('SpeechRecognition') || window.hasOwnProperty('webkitSpeechRecognition'));
  }
  set buttonElementId(buttonId) {
    try {
      this._buttonElement = document.getElementById(buttonId);
      if (this._buttonElement == null) { throw "invalid button id" }
    }
    catch(e) { // intercept
      this.errorMsg = "buttonElementId setter: "+e.message+"="+buttonId;
      // throw(e); // iff fatal error
    }
  }
  get buttonElement() {
    return this._buttonElement
  }
  set buttonImgElementId(buttonImgId) {
    try {
      this._buttonImgElement = document.getElementById(buttonImgId);
      if (this._buttonImgElement == null) { throw "invalid buttonImg id" }
    }
    catch(e) {
      this.errorMsg = "buttonImgElementId setter: "+e+"="+buttonImgId;
      // throw(e); // iff fatal error
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
      this.errorMsg = "buttonLabel setter: Could not set button label because "+e;
      // throw(e); // iff fatal error
    }
  }
  set buttonImgActive(imgName) {
    try {
      // does file exist?

      this._buttonImgActive = imgName;
    }
    catch(e) {
      this.errorMsg = "listening.buttonImgActive setter: Error setting listening.buttonImgActive with "+imgName;
      // throw(e); // iff fatal error
    }
  }
  set buttonImgInactive(imgName) {
    try {
      this._buttonImgInactive = imgName;
    }
    catch(e) {
      this.errorMsg = "listening.buttonImgInactive setter: Error setting listening.buttonImgInactive with "+imgName;
      // throw(e); // iff fatal error
    }
  }
  get checkboxStopAtEosElement() {
    return this._checkboxStopAtEosElement;
  }
  set checkboxStopAtEosElementId(id) {
      try {
        this._checkboxStopAtEosElement = document.getElementById(id);
        //try touching it and testing for the proper type
        var checked = this._checkboxStopAtEosElement.checked;
      }
      catch(e) {
        this.errorMsg = "checkboxStopAtEosElementId setter: invalid element id "+id;
        // throw(e); // iff fatal error
      }
  }
  buttonActivate() {
    try {
      this._buttonImgElement.src = this._buttonImgActive;
      this._isActive = true;
    }
    catch(e) {
      this.errorMsg = "buttonActivate(): unexpected error "+e.message;
      // throw(e); // iff fatal error
    }
  }
  buttonDeactivate() {
    try {
      this._buttonImgElement.src = this._buttonImgInactive;
      this.timer.cancel();
      this._isActive = false;
    }
    catch(e) {
      this.errorMsg = "buttonDeactivate(): unexpected error "+e.message;
      // throw(e); // iff fatal error
    }
  }
  buttonDisabled() {
    try {
      this._buttonImgElement.src = this._buttonImgGhosted;
      this._isActive = false;
    }
    catch(e) {
      this.errorMsg = "listening.buttonDisabled(): unexpected error "+e.message;
      // throw(e); // iff fatal error
    }
  }
  get previouslySpokenWord() {
    return this._previouslySpokenWord;
  }
  set previouslySpokenWord(word) {
    this._previouslySpokenWord = word;
  }
  get currentWordExpected() {
    return this._currentWordExpected;
  }
  set currentWordExpected(word) {
    this._currentWordExpected = word;
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
      var readingMonitor = this.parent;
      this._buttonElement.onclick = function(event) {
        // listening && timer active: STOP LISTENING
        // listening && timer inactive STOP LISTENING
        // not listening && timer isActive START LISTENING
        // not listening && timer active: START LISTENING
        if (!readingMonitor.listening.isActive) {
          readingMonitor.listening.currentWordExpected = "";
          readingMonitor.listening.previouslySpokenWord = "";
          readingMonitor.listening.resetMismatchedWordCounterMap();

          readingMonitor.diagnosticMsg = "listenBtn:onclick(): not listening";
          readingMonitor.listening.timer.start();
          readingMonitor.diagnosticMsg = 'listenBtn::onclick(): user started speech recognition';
          readingMonitor.listening.buttonActivate();
          readingMonitor.speaking.say("listening");

          var time = new Date();
          var timestamp = time.toLocaleTimeString();
          readingMonitor.userMsg = "<u>Reading session started at "+timestamp+"</u>";
          recognition.start();
        }
        else {
          readingMonitor.diagnosticMsg = "listenBtn:onclick(): listening";
          readingMonitor.listening.timer.cancel();
          recognition.stop();
          readingMonitor.diagnosticMsg = 'listenBtn::onclick(): user terminated';
          readingMonitor.listening.buttonDeactivate();
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
          var spokenWords = event.results[event.results.length - 1][0].transcript.split(" ");
          var isFinalResult = event.results[0].isFinal;
//           MyReadingMonitor.diagnosticMsg = "recognition.onresult: is Final?: "+event.results[0].isFinal;
           var w;
           if (isFinalResult) readingMonitor.diagnosticMsg = "recognition.onresult: isfinal";
           for (w = 0; w < spokenWords.length; w++) {
//             MyReadingMonitor.diagnosticMsg = "recognition.onresult: written word: "+MyReadingMonitor.currentWord;
             readingMonitor.diagnosticMsg = "recognition.onresult: spoken words["+ w.toString()+"]:"+spokenWords[w];
             if (readingMonitor.matchWord(spokenWords[w])) { //should strip blanks too
               var stopAfterMoveToNextWord = (readingMonitor.isLastWordOfSentence() && readingMonitor.listening.checkboxStopAtEosElement.checked);
               readingMonitor.moveToNextWord();
               if (stopAfterMoveToNextWord) {
                 readingMonitor.listening.buttonDeactivate();
                 recognition.stop();
               }
             }
             else if (spokenWords[w].length > 0) { // detected a word albeit the wrong one
               if (isFinalResult && w == spokenWords.length - 1) {
                  if (readingMonitor.listening.previouslySpokenWord != spokenWords[w]) {
                   if (readingMonitor.currentWord != readingMonitor.listening.currentWordExpected) {
                     readingMonitor.userMsg = "Expected: <em>"+readingMonitor.currentWord + "</em>, heard: <em>"+spokenWords[w]+"</em>";
                     readingMonitor.listening.currentWordExpected = readingMonitor.currentWord;
                   }
                   else {
                     readingMonitor.userMsgAppend = ", "+" <em>"+spokenWords[w]+"</em>";
                   }
                   readingMonitor.listening.mismatchedWordCounterMap.increment(readingMonitor.currentWord);
                   readingMonitor.listening.previouslySpokenWord = spokenWords[w];
                 }
               }
             // change class=RM_WORD_CURRENT style or change the RM_WORD_CURRENT to _ESCALATE1, 2 where do you reset this style though?
             }

           } // for
//           readingMonitor.diagnosticMsg = 'Result received: ' + spokenWords;
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
            readingMonitor.errorMsg = 'recognition:onresult: '+e.message;
            // throw(e) iff fatal error
          }
        }
      } // onresult

      recognition.onspeechend = function() {
  //         thisMonitor.diagnosticMsg = "recognition.onspeechend";

         if (readingMonitor.listening.isActive && readingMonitor.listening.timer.isActive) {
           readingMonitor.diagnosticMsg = "recognition.onspeechend: keep listening";
//         recognition.start();
         }
         else {
           if (!readingMonitor.listening.isActive) {
  //            listenBtn.defaultValue = "listen to me read";
              readingMonitor.diagnosticMsg = "recognition.onspeechend: user cancelled";
            }
           else if (!readingMonitor.listening.timer.isActive){
     //            listenBtn.defaultValue = "listen to me read";
               readingMonitor.diagnosticMsg = "recognition.onspeechend: timer expired";
            }
           else {
             readingMonitor.diagnosticMsg = "recognition.onspeechend: unknown end state";
            }
         }
       }
       recognition.onend = function() {
  //          thisMonitor.diagnosticMsg = "recognition.onend";
  //          thisMonitor.diagnosticMsg = "timerElapsedTime: "+ thisMonitor.timerElapsedTime;
          if (readingMonitor.listening.isActive && readingMonitor.listening.timer.isActive) {
            readingMonitor.diagnosticMsg = "recognition.onend: restart listening";
            readingMonitor.speaking.say("still listening");
            recognition.start();
          }
          else {
            var time = new Date();
            var timestamp = time.toLocaleTimeString();
            var htmlMapString = "<br>Summary "+timestamp+":";
            var word = "";
            var count;
            for ([word, count] of readingMonitor.listening.mismatchedWordCounterMap.entries()) {
                if (count > 0) htmlMapString = htmlMapString + "<br><em>"+word + "</em> = "+count
            }
            readingMonitor.userMsg =  htmlMapString;

            if (!readingMonitor.listening.isActive) {
              readingMonitor.diagnosticMsg = "recognition.onend: user cancelled";
            }
            else if (!readingMonitor.listening.timer.isActive) {
                readingMonitor.diagnosticMsg = "recognition.onend: timer expired";
            }
            else {
              readingMonitor.diagnosticMsg = "recognition.onend: unknown end state";
            }
           readingMonitor.speaking.say("no longer listening");
           readingMonitor.listening.buttonDeactivate();
           recognition.stop();
         }
      }
       recognition.onsoundend = function() {
         // event fires immediately after onspeechend
         readingMonitor.diagnosticMsg = "recognition.onsoundend";
//         recognition.stop();
//         MyReadingMonitor.speaking.say("no longer listening");
//         readingMonitor.listening.buttonDeactivate();
       }
       recognition.onnomatch = function(event) {
         readingMonitor.diagnosticMsg = "recognition.onnomatch:";
       }
       recognition.onerror = function(event) {
         readingMonitor.diagnosticMsg = 'recognition.onerror: ' + event.error;
         // timeout with no sound triggers this event
       }
       this.buttonDeactivate();  // starting state
    }
    catch(e) {
      if (typeof MyReadingMonitor == 'undefined') {
        alert("No global variable MyReadingMonitor found.");
      }
      else {
        MyReadingMonitor.errorMsg =" Could not initialize Speech Recognition object";
      }
      throw(e);
    }
  } // initialize
} // Speech Recognition class
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
    this._alternatePronunication.set("Rummikub", "rummy cube")
    this._alternatePronunication.set("Dr", "doctor")
  }
  set errorMsg(msg) {
    this._parent.errorMsg = msg;
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
  get checkboxPartialSentenceElement() {
      return this._checkBoxPartialSentenceElement;
  }
  set checkboxPartialSentenceElementId(id) {
      try {
        this._checkBoxPartialSentenceElement = document.getElementById(id);
        //try touching it and testing for the proper type
        var checked = this._checkBoxPartialSentenceElement.checked;
      }
      catch(e) {
        this.errorMsg = "checkboxPartialSentenceElementId setter: invalid element id "+id;
      }
    }
  set volumeControlElementId(id) {
    try {
      this._volumeControlElement = document.getElementById(id);
      //try touching it and testing for the proper range
//      var vol = parseFloat(MyReadingMonitor.speaking.volumeControlElement.value);
      var vol = parseFloat(this._volumeControlElement.value);
      if (isNaN(vol) || vol > 1 || vol < 0)
        this._parent.diagnosticMsg = "volumeControlElementId setter: invalid element type or range for "+id;
    }
    catch(e) {
      this.errorMsg = "volumeControlElementId setter: invalid element id "+id;
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
      this.errorMsg = "voiceSelectorElementId setter: invalid Element id "+id;
    }
  }
  get voiceSelectorElement() {
      return this._voiceSelectorElement;
  }
  voiceSelectorPopulate() {
     var  v,voice,voices, option;
     try {
        var myClass = this;
        if (speechSynthesis.onvoiceschanged == null) {
          // wait for speechRecognition to be available -- chrome kludge
           speechSynthesis.onvoiceschanged = function(e) { myClass.voiceSelectorPopulate(); };
         }
        else {
         // Iterate through each of the voices.
          voices = speechSynthesis.getVoices();
          voices.forEach(function(voice, v) {
            option = document.createElement('option');
            option.value = voice.name;
            option.innerHTML = voice.name;
            option.selected = (voice.name == MyReadingMonitor.speaking.defaultVoice);
            myClass.voiceSelectorElement.appendChild(option);
           }); // foreach
         }
     }
     catch(e) {
       if (typeof MyReadingMonitor == "undefined") {
         alert("voiceSelectorPopulate(): MyReadingMonitor does not exist in global scope")
       }
       else {
          MyReadingMonitor.errorMsg = "voiceSelectorPopulate(): could not populate voices";
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
      if (getOS() == "iOS") { // kludge for iOS
        MyReadingMonitor.diagnosticMsg = "voiceSelectorPopulate() called for iOS";
        this.voiceSelectorPopulate();
      }
    }
    catch(e) {
      if (typeof MyReadingMonitor == 'undefined') {
        alert("No global variable MyReadingMonitor found.");
      }
      else {
        this.errorMsg =" Could not initialize Speech Recognition object";
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
class Token {
/*
  constructor(text) {
    this._text = text;
    this._position = 0;
    this._type = "";
  }
  */
  constructor(text, type, position) {
    this._text = text;
    this._type = type;
    this._subtype = "";
    this._attributes = "";
    this._position = position;
  }
  get text() {
    return this._text;
  }
  get attributes() {
    return this._attributes;
  }
  set attributes(attr) {
    this._attributes = attr;
  }
  get position() {
    return this._position;
  }
  set position(position) {
    this._position = position;
  }
  get subtype() {
    return this._subtype;
  }
  set subtype(tokenType) {
    this._subtype = tokenType;
  }
  get type() {
    return this._type;
  }
  set type(tokenType) {
    this._type = tokenType;
  }
}
class Tokenizer {
  constructor(parent) {
    this._parent = parent;
//    this._punctuationPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()\"\?\.!]/);
//    this._tokenSeparatorPattern = new RegExp(/[\s]/);
//    this._whitespacePattern = new RegExp(/[\s]/);

//    this._wordSeparatorPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()\"\.\?!\t\s]/);
//    this._wordPattern = new RegExp(/([A-Za-z0-9]+)/g);

//    this._tokenPattern = new RegExp(/([A-Za-z0-9]+)|([,\/#$%\^&\*;:{}=\-_`~()\"\?\.!@])|(<\/?[\w\s="/.':;#-\/\?]+>)/g);

     this._wordTokenPattern = new RegExp(/([A-Za-z0-9]+)/);
     this._punctuationTokenPattern = new RegExp(/([,\/#$%\^&\*;:{}=\-_`~()\"\?\.!@])/);
     this._htmlTagTokenPattern = new RegExp(/(<\/?[\w\s="/.':;#-\/\?]+>)/);
//     this._htmlTagOpenTokenPattern = new RegExp(/(<[\w\s="/.':;#-\/\?]+>)/);
//     this._htmlTagCloseTokenPattern = new RegExp(/(<\/[\w\s="/.':;#-\/\?]+>)/);

     this._tokenPattern = new RegExp(this._wordTokenPattern.source
                               +"|"+this._punctuationTokenPattern.source
                               +"|"+this._htmlTagTokenPattern.source,"g");

    this._numberWithCommaPattern = new RegExp(/[0-9]/);
    this._UsdPattern = new RegExp(/[0-9]/);
    this._date1Pattern = new RegExp(/[0-9]/);
    this._date2Pattern = new RegExp(/[0-9]/);
    this._timePattern = new RegExp(/[0-9]/);
    this._htmlTagPattern = new RegExp(/<\/?[\w\s="/.':;#-\/\?]+>/);
// search for complex patterns with embedded punctations before simple punctuations
// e.g. timePattern 1:30 before just ":".
  }
  get TOKEN_TBD() {
    return "TOKEN_tbd";
  }
  get TOKEN_HTMLTAG() {
    return "TOKEN_htmlTag";
  }
  get TOKEN_HTMLTAG_ABBREV() {
    return "TOKEN_htmlTag";
  }
  get TOKEN_HTMLTAG_SELFCLOSE() {
    // AKA void elements
    return "TOKEN_htmlTagSelfClose";
  }
  get TOKEN_HTMLTAG_CLOSE() {
    return "TOKEN_htmlTagClose";
  }
  get TOKEN_HTMLTAG_OPEN() {
    return "TOKEN_htmlTagOpen";
  }
  get TOKEN_PUNCTUATION() {
    return "TOKEN_punctuation";
  }
  get TOKEN_PUNCTUATION_COMMA() {
    // for pausing
    return "TOKEN_punctuationComma";
  }
  get TOKEN_PUNCTUATION_SEMICOLON() {
    // for pausing
    return "TOKEN_punctuationSemicolon";
  }
  get TOKEN_WORD() {
    return "TOKEN_word";
  }
  get TOKEN_PUNCTUATION_USD() {
    //
    return "TOKEN_punctuationUsd";
  }
  get TOKEN_WORD_DATE() {
    return "TOKEN_wordDate";
  }
  get TOKEN_WORD_TIME() {
    return "TOKEN_wordTime";
  }
  get TOKEN_WORD_COMMASEPARATEDNUMBER() {
    // keep together
    return "TOKEN_wordCommaSeparatedNumber";
  }
  get TOKEN_WHITESPACE() {
    return "TOKEN_whitespace";
  }
  tokens1(sentence) {
    var parser = new DOMParser().parseFromString(sentence,"text/html");
    var body = parser.getElementsByTagName("body");
    var tokens = body[0].childNodes;

    // span attribute
//    var el = document.createElement('html');
//    el.innerHTML = sentence;
//    var tokens = el.getElementsByTagName("*");

  }
  tokens(sentence) {
    var tokens = Array(), tokenList;
    var currentPos = 0, tokenPos, tokenLength, t = 0, tl;
    tokenList = this.tokenListSansWhitespace(sentence);
    for (tl = 0; tl < tokenList.length; tl++) {
      tokenPos  = sentence.indexOf(tokenList[tl], currentPos);
      if (currentPos < tokenPos) {
        // whitespace before token
        tokens[t++] = new Token(sentence.substring(currentPos, tokenPos), this.TOKEN_WHITESPACE, currentPos);
        currentPos = tokenPos;
      }
      if (currentPos == tokenPos) {
        // positioned at token
        tokens[t] = new Token(tokenList[tl], this.TOKEN_TBD, currentPos);
        currentPos = tokenPos + tokenList[tl].length;

        // tests for subtype: more specific to least specific
        if (tokenList[tl].substring(0,1).toLowerCase() =="'") {
          tokens[t].type = this.TOKEN_PUNCTUATION;
          tokens[t].subtype = "'";
        }
        else if (tokenList[tl].substring(0,1) =="$") {
          tokens[t].type = this.TOKEN_PUNCTUATION_USD;
          tokens[t].subtype = "$";
        }
        // HTML tag
        else if (tokenList[tl].match(this._htmlTagTokenPattern)) {
          if (tokenList[tl].substring(1,2) == "/") {
            tokens[t].type = this.TOKEN_HTMLTAG_CLOSE;
          }
          else { // opening HMTL TAG
            tokens[t].type = this.TOKEN_HTMLTAG_OPEN;
            if (tokenList[tl].substring(1,5).toLowerCase() =="span") {
              tokens[t].subtype = "span";
              tokens[t].attributes = tokenList[tl].substring(6,tokenList[tl].length-1) ;
            }
          }
        }
        else if (tokenList[tl].match(this._punctuationTokenPattern)) {
          tokens[t].type = this.TOKEN_PUNCTUATION;
        }
        else {
          tokens[t].type = this.TOKEN_WORD; // catch all
        }
        t++;
        // Word comma
        // Word semicolon
        // Number
      }
      // catch trailing whitespace, if any
      if (currentPos < sentence.length) {
        tokens[t] = new Token(sentence.substring(currentPos, sentence.length), this.TOKEN_WHITESPACE, currentPos);
      }
    }
    return tokens;
  }
  tokenListSansWhitespace(sentence) {
    return sentence.match(this._tokenPattern);
  }
  htmlTagClosingFromOpening(htmlTagOpening) {
    // assume format <TAG> | <TAG attributes>
    // returns "</TAG>" or "</TAG "
    try {
      htmlTagClosing = "</"
      blankPos = htmlTagOpening.indexOf(" ");

      if (blankPos > 0) {
       htmlTagClosing = htmlTagClosing + htmlTagOpening.substring(1, blankPos) +"/>";
     }
      else {
        htmlTagClosing = htmlTagClosing + htmlTagOpening.substring(1, htmlTagOpening.length)
      }
      return htmlTagOpening;
    }
    catch (e) {
      return "";
    }
  }
  htmlOpeningTag(htmlTag) {
    // 1) not an HTML tag => return htmlTag
    // 2) tag with attributes => strip attributes
    // 3) closing tag => remove /
    var openingTag = htmlTag;
    try {
      if (htmlTag.slice(0,1) == "<") {
        if (htmlTag.slice(-1) != ">") {
        // not just html tag
        }
        if (htmlTag.slice(1,2) == "/") {
            openingTag = htmlTag.slice(0,1)+htmlTag.slice(2,htmlTag.length);
        }
        var blankPos = htmlTag.indexOf(" "); // should be pattern for \s
        if (blankPos > 0) {
            openingTag = htmlTag.slice(0,blankPos-1)+">";
        }
      }
      return openingTag;
    }
    catch (e) {
      return openingTag;
    }
  }
}
class ReadingMonitor {
    // class variables
    constructor(name) {
      this._name = name;
      this._tokenizer = new Tokenizer(this);
      this._speechRecognition = new SpeechRecognition(this);
      this._speechSynthesis = new SpeechSynthesis(this);
//      this._punctuationPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()\"\?\.!]/);
//      this._tokenSeparatorPattern = new RegExp(/[\s]/);
      this._whitespacePattern = new RegExp(/[\s]/);
      this._wordSeparatorPattern = new RegExp(/[,\/#$%\^&\*;:{}=\-_`~()\"\.\?!\t\s]/);
//      this._htmlTagPattern = new RegExp(/<\/?[\w\s="/.':;#-\/\?]+>/);
      this._wordId = 0; // manages the initial condition where sentence idx is set without wordId
      // var tokenPattern = new RegExp(/[A-Z]{2,}(?![a-z])|[A-Z][a-z]+(?=[A-Z])|[\'\w\-]+/);
    }
    get TOKEN_HTMLTAG() {
      return this._tokenizer.TOKEN_HTMLTAG;
    }
    get TOKEN_PUNCTUATION() {
      return this._tokenizer.TOKEN_PUNCTUATION;
    }
    get RM_HTMLTAG() {
      return "rm_htmltag";
    }
    get RM_PUNCTUATION() {
      return "rm_punctuation";
    }
    get RM_SENTENCE() {
      return "rm_sentence";
    }
    get RM_TBD() {
      return "rm_tbd";
    }
    get RM_WORD() {
      return "rm_word";
    }
    get RM_WORD_BETTERPRONUNCIATION() {
      return "rm_word_betterPronunciation";
    }
    get RM_WORD_CURRENT() {
      return "rm_word_current";
    }
    get RM_WORD_HIDDEN() {
      return "rm_word_hidden";
    }
    get RM_WHITESPACE() {
      return "rm_whitespace";
    }
    get RM_RECOGNITIONPATTERN() {
      return "rm_recognitionPattern";
    }
    get htmlTagPattern() {
      return this._htmlTagPattern;
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
    get speaking() {
        return this._speechSynthesis;
    }
    get tokenizer() {
      return this._tokenizer;
    }
    set name(newName) {
        this._name = newName;
    }
    //
    // HTML Element registration
    //
    set diagnosticElementId(id) {
      try {
        this._diagnosticElement = document.getElementById(id);
        if (this._diagnosticElement == null) {throw("invalid element id") }
      }
      catch(e){
        this.errorMsg = "diagnosticMsgElementId setter: No diagnostic messages using element id="+id+" because "+e.message;
      }
    }
    set errorMsgElementId(id) {
        this._errorMsgElement = document.getElementById(id);
        var time = new Date();
        var timestamp = time.toLocaleTimeString();
        this._errorMsgElement.textContent = "["+timestamp+"]: Error messaging initialized."
        // allow uncaught exception to bubble up
    }
    set sentenceIdxElementId(id) {
      try {
        this._sentenceIdxElement  = document.getElementById(id);
        this._sentenceIdxElement.innerText = "0"; // touch test
      }
      catch(e) {
        this.errorMsg = "sentenceIdxElementId setter: Could not access element id="+id+" because " + e.message;
      };
    }
    set sentenceIdElementId(id) {
      try {
        this._sentenceIdElement  = document.getElementById(id);
        this._sentenceIdElement.innerText = "0"; // touch test
      }
      catch(e) {
        this.errorMsg = "sentenceIdElementId setter: Could not access element id="+id+" because "+e.message;
      };
    }
    set userMsgElementId(id) {
      try {
        this._userMsgElement = document.getElementById(id);
        if (this._userMsgElement == null) {throw("invalid element id") }
      }
      catch(e) {
        this.errorMsg = "userMsgElementId setter:  No user messages using element id="+id+" because "+e.message;
      }
    }
    set wordIdElementId(id) {
      //check typeof parameter
      try {
        this._wordIdElement  = document.getElementById(id);
        this._wordIdElement.innerText = "0"; // touch test
      }
      catch(e) {
        this.errorMsg = "wordIdElementId setter: Could not access element "+id+" because "+e.message;

      };
    }
    set wordIdxElementId(id) {
      //check typeof parameter
      try {
        this._tokenIdxElement  = document.getElementById(id);
        this._tokenIdxElement.innerText = "0"; // touch test
      }
      catch(e) {
        this.errorMsg = "wordIdxElementId setter: Could not access element id="+id+" because "+e.message;
      };
    }
    set diagnosticMsg(msg) {
      try {
        if (this._diagnosticElement != null) {
          var time = new Date();
          var timestamp = time.toLocaleTimeString();
          this._diagnosticElement.textContent = "["+timestamp + "]:" + msg;
        }
      }
      catch(e) {
//        fail silently
      }
      finally {
        console.log("RMdiag-"+timestamp + ": " + msg);
      };
    }
    set userMsg(msg) {
      try {
          if (this._userMsgElement != null)
            this._userMsgElement.innerHTML = this._userMsgElement.innerHTML+"<br>"+ msg;
      }
      catch(e) {
        this.errorMsg = "userMsg setter: Could not access field because "+e.message;
      }
    }
    set userMsgAppend(msg) {
      try {
          if (this._userMsgElement != null)
            this._userMsgElement.innerHTML = this._userMsgElement.innerHTML+msg;
      }
      catch(e) {
        this.errorMsg = "userMsgAppend setter: Could not access field because "+e.message;
      }
    }
    /*
    get userMsg() {
      try {
//            this._userMsgElement.textContent = this._userMsgElement.textContent+";<br> "+ msg;
            var msg = this._userMsgElement.innerHTML;
            if (typeof msg == "undefined") msg = "";
            return msg;
      }
      catch(e) {
        parent.errorMsg = "userMsg getter: Could not access field because "+e.message;
      }
    }*/
    set errorMsg(msg) {
      try {
        var time = new Date();
        var timestamp = time.toLocaleTimeString();
        this._errorMsgElement.innerHTML = "["+timestamp+"]: "+ msg +"<br>"+ this._errorMsgElement.innerHTML;
      }
      catch(e) {
        console.log("[]"+timestamp+"]: errorMsg (uninitialized): "+msg);
      }
    }
    get currentSentenceIdx() {
        return Number(this._sentenceIdx);
    }
    set currentSentenceIdx(sentenceIdx) {
        // check if Idx is valid based on DOM
        try {
//          if (sentenceIdx != this._sentenceIdx) this.currentWordIndicatorOff();
          this._sentenceIdx = Number(sentenceIdx);
          this._sentenceIdxElement.innerText = sentenceIdx.toString();

          this._lastWordIdx = document.getElementsByClassName(this.RM_SENTENCE)[this._sentenceIdx].childElementCount - 1;
          var rm_wordLastIdx = document.getElementsByClassName(this.RM_SENTENCE)[this._sentenceIdx].getElementsByClassName(this.RM_WORD).length - 1;
          this._lastWordId = document.getElementsByClassName(this.RM_SENTENCE)[this._sentenceIdx].getElementsByClassName(this.RM_WORD)[rm_wordLastIdx].getAttribute("id");
        }
        catch(e) {
          this.errorMsg = "currentSentenceIdx setter: failed to set value to "+sentenceIdx+ " because "+e.message;
        }
    }
    get currentWordId() {
      if (typeof this._wordId == "undefined") {
        return 0;
      }
        return this._wordId;
    }
    set currentWordId(wordId) {
      // check if Idx is valid based on DOM
      try {
//        this.currentWordIndicatorOff();
        this._wordId = wordId;
  //      this.currentWordIndicatorOn();
        this._wordIdElement.innerText = wordId.toString();
      }
      catch(e) {
        this._wordId = wordId;
        this.errorMsg = "currentWordId setter: failed to set value to "+wordId+ " because "+e.message;
        // is this fatal (unrecoverable)?
      }
    }
    get lastWordIdx() {
      return this._lastWordIdx;
    }
    get lastWordId() {
      return this._lastWordId;
    }
    isLastWordOfSentence() {
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
        return document.getElementsByClassName(this.RM_SENTENCE)[this.currentSentenceIdx].getElementsByClassName(this.RM_WORD)[this._wordId].innerText;
      }
      catch(e) {
        this.errorMsg = "currentWord getter: failed to get value to "+wordId+ " because "+e.message;
        return null;
        // is this fatal (unrecoverable)?
      }
    }
     currentWordAttribute(tag) {
      try {
        return document.getElementsByClassName(this.RM_SENTENCE)[this.currentSentenceIdx].getElementsByClassName(this.RM_WORD)[this._wordId].getAttribute(tag);
      }
      catch(e) {
        this.errorMsg = "currentWordAttribute: failed to get value of tag="+tag+" to "+wordId+ " because "+e.message;
        return null;
        // is this fatal (unrecoverable)?
      }
    }
    rm_wordSpanOnClick(e) {
      try {
        var spanElement, sentenceElement;
        for (sentenceElement = e.target; sentenceElement.className != this.RM_SENTENCE; sentenceElement = sentenceElement.parentElement) {
          spanElement = sentenceElement;
        };
//        if (sentenceElement.className != this.RM_SENTENCE) sentenceElement = sentenceElement.parentElement;
        var sentenceIdx = sentenceElement.getAttribute("id");
//        var wordId = e.target.getAttribute("id");
        var wordId = spanElement.getAttribute("id");
        var wordsToBeSpoken = "";
        MyReadingMonitor.moveToThisWordPosition(sentenceIdx, wordId);
        var partialSentenceInput = this.speaking.checkboxPartialSentenceElement;
        if (partialSentenceInput.checked) {
          var w, hasFoundWordId = false;
          //could be simplified by iterating through sentenceElement.getElementsByClass("rm_word")
          //should hide rm_word_speaking in loop
          for (w = 0; !hasFoundWordId && w < sentenceElement.childElementCount; w++) {
            if (sentenceElement.children[w].getAttribute("class").indexOf(this.RM_WORD) != -1) {
              hasFoundWordId = sentenceElement.children[w].getAttribute("id").indexOf(wordId) != -1;
//              wordsToBeSpoken = wordsToBeSpoken  + " " +sentenceElement.children[w].innerText;
              var nextWord = sentenceElement.children[w].getAttribute(this.RM_WORD_BETTERPRONUNCIATION)
              if (nextWord == null) nextWord = sentenceElement.children[w].innerText;
              wordsToBeSpoken = wordsToBeSpoken  + " " + nextWord;
            }
          }
        }
        else {
          var betterAlternative = MyReadingMonitor.currentWordAttribute(this.RM_WORD_BETTERPRONUNCIATION);
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
        MyReadingMonitor.errorMsg = "rm_word_spanOnClick: Unexpected error: "+e.message;
      }
    } //rm_wordSpanOnClick
    parseSentences(sentenceTag) {
      for(var s = 0, srcSentenceElement = document.getElementsByClassName(sentenceTag)[0];
        typeof srcSentenceElement != 'undefined';
        srcSentenceElement = document.getElementsByClassName(sentenceTag)[0], s++) {

        var tokens = this._tokenizer.tokens(srcSentenceElement.innerHTML);
//        var tokens = this._tokenizer.tokens1(srcSentenceElement.innerHTML);
        var htmlTagCounterMap = new CounterMap(); // map for htmltags with not specific attributes
        var spanTagStack = new Array(); // stack containing span/attributes
        //
        var dstSentenceElement = document.createElement(srcSentenceElement.tagName);
        // transfer all attributes from source sentence
        dstSentenceElement.setAttribute("id", s);
        for (var a = 0; a < srcSentenceElement.attributes.length; a++) {
            dstSentenceElement.setAttribute(srcSentenceElement.attributes[a].name, srcSentenceElement.attributes[a].value);
        }
        // except className
        dstSentenceElement.setAttribute("class", this.RM_SENTENCE);

        var spanIdx = 0; // sequential index of all spans
        var wordId = 0; // sequential index of spans of type rm_word's

        // could be modified to accommodate semantic analysis
        // where states (cases) can be dependent on prvious ones
        for (var t = 0; t < tokens.length; t++) {
          var tokenType = tokens[t].type;
          var tokenText = tokens[t].text;
          var classLabel = this.RM_TBD;
          var span = document.createElement("span");

          switch (tokenType) {
            case this._tokenizer.TOKEN_PUNCTUATION: {
              classLabel = this.RM_PUNCTUATION;
              span.setAttribute("idx", spanIdx++);
              break;
            }
            case this._tokenizer.TOKEN_WHITESPACE: {
              classLabel = this.RM_WHITESPACE;
              span.setAttribute("idx", spanIdx++);
              break;
            }
            case this._tokenizer.TOKEN_HTMLTAG_OPEN: {
              classLabel = this.RM_HTMLTAG;
              // span only
              var htmlTag = tokenText; // potentially case sensitive
              if (htmlTag.indexOf("<span") == 0) {
                  spanTagStack.push(htmlTag)
//                  spanfillin(tokenText);
              }
              else {
                // all tags without attributes
                htmlTag = htmlTag.toLowerCase();
                htmlTagCounterMap.increment(htmlTag);
              }
              break;
            }
            case this._tokenizer.TOKEN_HTMLTAG_CLOSE: {
              classLabel = this.RM_HTMLTAG;
              var htmlOpeningTag = this._tokenizer.htmlOpeningTag(tokenText).toLowerCase();
              if (htmlOpeningTag == "<span>") {
                  spanTagStack.pop();
              }
              else {  //look up tag by opening tag and decrement count
                htmlTagCounterMap.decrement(htmlTag);
              }
              break;
            }
            case this._tokenizer.TOKEN_HTMLTAG: {
              classLabel = this.RM_HTMLTAG;
              // create/duplicate open and close html for each word span
              //when <> is encountered, push into stack
              // rm_word state needs to look at stack to determine if word requires tags
              //remember each span must contain a proper html pair
              //when </> is encountered pop stack
              break;
            }
            case this._tokenizer.TOKEN_PUNCTUATION: {
              classLabel = this.RM_PUNCTUATION;
              span.setAttribute("idx", spanIdx++);
              break;
            }
            default: {
              classLabel = this.RM_WORD;
              if (t < (tokens.length - 2)
                && (tokens[t+1].text == "'")
                && (tokens[t+2].text.toLowerCase() == "s")) {
                  tokenText = tokenText + "'"+tokens[t+2].text;
                  t = t + 2;
                }
              // lookahead to see if next two tokens are an apostrophe followed by an s
              span.setAttribute("idx", spanIdx++);
              span.setAttribute("id", wordId++);
              var readingMonitor = this;
              span.onclick = function() { readingMonitor.rm_wordSpanOnClick(event) };

              var pattern = this.listening.wordRecognitionPattern(tokenText);
              if (typeof pattern != "undefined") span.setAttribute(this.RM_RECOGNITIONPATTERN, pattern);
              var alternative = this.speaking.betterAlternative(tokenText);
              if (typeof alternative != "undefined") span.setAttribute(this.RM_WORD_BETTERPRONUNCIATION, alternative);
              break;
            }
          }
          if (classLabel == this.RM_HTMLTAG) {
              // skip htmltags
          }

          else {
            span.setAttribute("class", classLabel);
            // add htmlTagsOpen and allow browser to render well-formed span by automatically
            // including closing tags even for self closing html tags.
            var htmlTagMapString = "";
            var tags = "";
            var count;
            for ([tags, count] of htmlTagCounterMap.entries()) {
                if (count > 0) htmlTagMapString = htmlTagMapString + tags;
            }
            if (classLabel != this.RM_WHITESPACE) {
                // skip htmltags
              htmlTagMapString = spanTagStack.join("") + htmlTagMapString;
            }
            span.innerHTML = htmlTagMapString+tokenText;
            // need to clean up code here: very kludgy
            // span.innerText = opening tags + tokens[t].text + closing tags           span.innerText = HTMLTAGS
            dstSentenceElement.appendChild(span);
          }
        } //tokens
        srcSentenceElement.parentNode.replaceChild(dstSentenceElement, srcSentenceElement);
      } // for loop of sentences
      this._lastSentenceIdx = document.getElementsByClassName(this.RM_SENTENCE).length -1;
    } // parseSentences
    moveToNextWord() {
      // position to the next word as opposed to token (word, punctuation, HTML tag or whitespace)
      // getElementsByClassName returns a HTMLCollection of matching elements.
      // According to w3.org 2015, "[t]he collection then represents a view of the
      // subtree rooted at the collection's root, containing only nodes that match
      // the given filter. The view is linear. In the absence of specific
      // requirements to the contrary, the nodes within the collection must be
      // sorted in tree order:" top-down, depth first OR HTML WYSIWYG.
      if (this.isLastWordOfSentence()) {
        this.moveToNextSentence();
      }
      else {
        this.moveToThisWordPosition(this.currentSentenceIdx, Number(this.currentWordId)+1);
      }
    }
    moveToFirstSentence() {
      // check for last sentence
      this.moveToThisWordPosition(0, 0);
    }
    moveToNextSentence() {
      // check for last sentence
      if (this.isLastSentence()) {
        this.currentWordIndicatorOff();
        this.diagnosticMsg = "End of last sentence readed."
      }
      else {
//        this.moveToSentence(Number(this.currentSentenceIdx) + 1);
        this.moveToThisWordPosition(Number(this.currentSentenceIdx)+1, 0);
      }
    }
    moveToThisWordPosition(sentenceIdx, wordId) {
      try {
        this.currentWordIndicatorOff(); // reset current word before changing sentence
        this.currentSentenceIdx = sentenceIdx;
        this.currentWordId = Number(wordId);
        this.currentWordIndicatorOn(); // reset current word before changing sentence
      }
      catch(e) {
        this.errorMsg = "moveToThisWordPosition(): could not change word";
      }
    }
    currentWordIndicatorOff() {
      try {
        var spanElement = document.getElementsByClassName(this.RM_SENTENCE)[this._sentenceIdx].getElementsByClassName(this.RM_WORD)[this._wordId];
        spanElement.classList.remove(this.RM_WORD_CURRENT);
        if (spanElement.childElementCount > 0) {
          // find child with rm_word*
          spanElement.childNodes[0].classList.remove(this.RM_WORD_HIDDEN);
          // more than 1 child span under rm_word?
        }
      }
      catch(e) {
        if (typeof this._sentenceIdx == "undefined" && this._wordId == 0) {
//          this.diagnosticMsg = "currentWordIndicatorOff(): initializing."
        }
        else {
          this.errorMsg = "currentWordIndicatorOff(): could not reset rm_word_current because "+e.message;
        }
      }
    }
    currentWordIndicatorOn() {
      try {
        document.getElementsByClassName(this.RM_SENTENCE)[this._sentenceIdx].getElementsByClassName(this.RM_WORD)[this._wordId].classList.add(this.RM_WORD_CURRENT);
      }
      catch(e) {
        this.errorMsg = "currentWordIndicatorOn(): could not add rm_word_current";
      }
    }
    currentWordIndicatorEscalated() {
      try {
  //      document.getElementsByClassName(this.RM_SENTENCE)[this._sentenceIdx].getElementsByClassName(this.RM_WORD)[this._wordId].classList.add(this.RM_WORD_CURRENT);
        document.getElementsByClassName(this.RM_SENTENCE)[this._sentenceIdx].getElementsByClassName(this.RM_WORD)[this._wordId].classList.add(this.RM_WORD_CURRENT+"_1");
      }
      catch(e) {
        this.errorMsg = "currentWordIndicatorOn(): could not add rm_word_current";
      }
    }
    matchWord(spokenWord) {
      // matches spoken word to written word
      // need code to manage special cases: proper noun not already recognized
      // inn parsing phase, embed possible surrogates for matching proper names:
      // Ronlyn = { Rollin | Rowland | ronlin | ron lin }
  //    var properNamePattern = new RegExp(/^[A-Z]/); //first letter uppercase... less conficent if at beginning of sentence
      // try lexical match
      if (spokenWord.toLowerCase() == this.currentWord.toLowerCase()) {
        return true;
      }
      else {
        // try pattern match
        var pattern = this.currentWordAttribute(this.RM_RECOGNITIONPATTERN);
        if (pattern != null) {
          var recognitionPattern = new RegExp(pattern);
          return recognitionPattern.test(spokenWord.toLowerCase());
        }
        else {
          //add to list of words to be added to pronunciationPattern
          this.diagnosticMsg = "matchWord() cannot match: " + spokenWord.toLowerCase() +" to "+this.currentWord.toLowerCase();
        }
      }
    }
    initialize() {
      this.diagnosticMsg = "Initializing reading monitor.";
//      if (this.SpeechSynthesisIsSupported()) {
      if (this.listening.isSupported) {
        this.listening.initialize();
      }
      else {
        this.listening.buttonDisabled();
        this.diagnosticMsg = "SpeechRecognition is not supported on " + getOS();
        alert("Speech Recognition is not supported on "+ getOS());
      }
      if (this.speaking.isSupported) {
        this.speaking.initialize();
      }
      else {
        this.diagnosticMsg = "Speech Synthesis is not supported on "+ getOS();
        alert("Speech Synthesis is not supported on "+ getOS());
      }
      this.diagnosticMsg = "Initialized reading monitor.";

//      this.parseSentences("sentence");
      this.parseSentences("sentence");
      this.moveToFirstSentence();

    // ReadingMonitor event handlers

    document.body.onclick = function(e) {   //when the document body is clicked
//       MyReadingMonitor.speaking.say("try again");
     }
   } // initialize()
} // MyReadingMonitor
