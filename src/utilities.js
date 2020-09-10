class AppError extends Error {
  constructor(args) {
    super(args);
  }
  set name(name) {
    this.name = "AppError";
  }
}
class Logger { // logging from within supported objects
  constructor(parent) {
    this._parent = parent; // required to find proper stack frame
    this._diagnosticMode = false;  // do not show debug messages
    this._showTimestamp = false;  // do not show timestamp in messages
    this._errorObject = null;
  }
  assert(message) {
    console.log(message);
  }
  diagnostic(message) {
    if (this._diagnosticMode) {
      let timestamp = new MyDate().yyyymmddhhmmss();
      console.log("DIAG: "+this.getMethodName()+(this._showTimestamp ? " (at "+timestamp+") " : " ") +"in module "+this.getModuleLocation()+": "+message);
    }
  }
  showTimestamp(onOff) {
    this._showTimestamp = onOff;
  }
  info(message) {
    console.log(message);
  }
  error(message) { // Operational or programmatic try to fix
    let timestamp = new MyDate().yyyymmddhhmmss();
    console.error("ERROR: "+this.getMethodName()+(this._showTimestamp ? " (at "+timestamp+") " : " ") +"in module "+this.getModuleLocation()+": "+message);
    // should throw AppError here
  }
  fatal(message) { //unrecoverable error
    console.log(message);
    // should throw AppError here
  }
  trace(message) { //
    console.log(message);
  }
  warning(message) {
    let timestamp = new MyDate().yyyymmddhhmmss();
    console.log("WARNING: "+this.getMethodName()+(this._showTimestamp ? " (at "+timestamp+") " : " ") + "in module "+this.getModuleLocation()+": "+message);
  }
  set diagnosticMode(onOff)
  {
    this._diagnosticMode = onOff;
  }
  getMethodName() {
    // search back through call stack for certain patterns.
    // A convenience and NOT robust
    var methodName = "<unknown method>";
    let stackFrames = new Error().stack.split("\n");
    if (this._parent !== null) {
      let objectNameLocator = " at "+this._parent.constructor.name+".";
      let frame = stackFrames[stackFrames.findIndex(element => element.includes(objectNameLocator))];
      methodName = frame.substring(frame.indexOf(objectNameLocator)+4).split(" ")[0];
    }
    else {
      // fail quietly
    }
    return methodName;
  }
  getModuleLocation() {
    let moduleLocation = "<unknown module location>";
    let stackFrames = new Error().stack.split("\n");
    if (this._parent !== null) {
      let objectNameLocator = " at "+this._parent.constructor.name+".";
      let frameIdx = stackFrames.findIndex(element => element.includes(objectNameLocator));
      let modulePath = stackFrames[frameIdx].split(" ").slice(-1)[0].slice(0,-1).split(":")[1];
      let frame = stackFrames[stackFrames.findIndex(element => element.includes(modulePath))];
      moduleLocation = frame.split("\\").slice(-1)[0].slice(0,-1).split(":").slice(0,-1).join(":");
    }
    return moduleLocation;
  }
}
class MyDate extends Date {
  constructor() {
    super();
  }
  yyyymmdd() {
    let yyyy = this.getFullYear();
    let mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
    let dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
//    return "".concat(yyyy).concat("/").concat(mm).concat("/").concat(dd);
    return yyyy+"/"+mm+"/"+dd;
  }
  yyyymmddhhmmss() {
    var yyyymmdd = this.yyyymmdd();
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    var sec = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
//    return "".concat(yyyymmdd).concat(" ").concat(hh).concat(":").concat(min);
    return yyyymmdd+" "+hh+":"+min+":"+sec;
  }
}
function logEntry(message) {
    var stack = new Error().stack,
        caller = stack.split('\n')[2].trim();
        console.log("duh "+stack.toString());
//    console.log(caller + ":" + message);
}
module.exports = { AppError, Logger, MyDate };
