/*******************************************
 * Page nav v0.1.0
 * (c) 2017-2018 by Wen Eng. All rights reserved.
 ********************************************/
 /**

 assumes standard header (across the top of page),
 navbar down the left hand side of page below the header, and
 main that occupies the balance of the Page

 **/
 "use strict";
 // ECMAScript6 class syntax only

class navbar {
  constructor() {

  }
  lastSpokenWord_CheckboxChanged(e) {
    var label = lastSpokenWordLabel.innerText;
    var apos = label.indexOf(":");
    if (apos >-1) lastSpokenWordLabel.innerText = label.substring(0, apos);
    if (lastSpokenWordCheckbox.checked) {
      lastSpokenWordLabel.innerText = lastSpokenWordLabel.innerText +": ";
      lastSpokenWordspan.style.visibility = "";
    }
    else {
      lastSpokenWordspan.style.visibility = "hidden";

    }
  //    lastSpokenWordspan.setAttribute("hidden", true);
  }
  navbarDiv_onclick(e) {
    var id = e.target.id;
    window.location.href = "#"+id; //goto anchor
    if (MyReadingMonitor) MyReadingMonitor.speaking.say(e.target.innerText);
  }
  populate() {
    var div_navbar = document.getElementById('navbar-items');
    //scan main for <h1> to build navbar
    //get main element some day
//    var navbarItemList = document.getElementsByClassName("navbar-item"); // from <h1>
    var navbarItemList = document.querySelectorAll(".navbar-itemByHeadingLevel");
    for (var nb = 0; nb < navbarItemList.length; nb++) {
      var div = document.createElement('div'); // var forces creation of new tr
      div.className = "navbar-li li onclick-href";
      div.id = navbarItemList[nb].id;
      var me = this;
      div.onclick = function() { me.navbarDiv_onclick(event) } ;  //kludge for iOS
      div.innerHTML = navbarItemList[nb].innerHTML;
      div_navbar.append(div);
    }
  } // populateNavbar
}
class header {

}
class main {

}
