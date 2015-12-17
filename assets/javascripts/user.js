/*jslint node: true */
/*jslint browser: true */
"use strict";

window.onload = function() {
//user edit page
  var element = document.getElementById('changepass');
  element.onclick = function() {
    var passwordBlock = document.getElementById('edit-password');
    if(this.checked === true) {
      passwordBlock.className = passwordBlock.className.replace('hide', 'show');
    } else {
      passwordBlock.className = passwordBlock.className.replace('show', 'hide');
    }
  };
};