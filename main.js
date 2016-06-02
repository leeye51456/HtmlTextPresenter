/*jslint node:true regexp:true*/
/*global $, jQuery, alert, confirm */
'use strict';

var wnd, textArray = [''];

var keyboardControl = (function () {
  var
    log = '',
    cutLog = function () {
      if (log.length > 4) {
        log = log.slice(-4);
      }
      log = log.replace(/^0+(?=\d)/, '');
    },
    updateSelectPageLabel = function () {
      $('#select-page-label').text(log === '' ? '&nbsp;' : log);
    };
  return {
    enabled: true,
    useKeypad: true,
    addLog: function (l) {
      if (typeof l === 'string') {
        log += l;
        cutLog();
        updateSelectPageLabel();
        return l;
      } else if (typeof l === 'number') {
        log += String(l);
        cutLog();
        updateSelectPageLabel();
        return String(l);
      }
      return '';
    },
    getLog: function () {
      return log;
    },
    clearLog: function () {
      var logTemp = log;
      log = '';
      updateSelectPageLabel();
      return logTemp;
    }
  };
}());

var pgmControl = (function () {
  var pageNumber = 0;
  return {
    getPageNumber: function () {
      return this.pageNumber;
    },
    setPageNumber: function (pageNum) {
      if (pageNum < textArray.length) {
        return (this.pageNumber = pageNum);
      }
      return textArray.length - 1;
    }
  };
}());

var pvwControl = (function () {
  var pageNumber = 0;
  return {
    getPageNumber: function () {
      return this.pageNumber;
    },
    setPageNumber: function (pageNum) {
      if (pageNum < textArray.length) {
        return (this.pageNumber = pageNum);
      }
      return textArray.length - 1;
    }
  };
}());


// functions

function updatePagelist() {
  $('#pagelist-div')
    .find('.pagelist-cell')
      .removeClass('pvw-border')
      .removeClass('pgm-border')
      .end()
    .find('#pagelist-cell-' + pvwControl.getPageNumber())
      .addClass('pvw-border')
      .end()
    .find('#pagelist-cell-' + pgmControl.getPageNumber())
      .removeClass('pvw-border')
      .addClass('pgm-border');
}
function updatePvw() {
  var pageNum = pvwControl.getPageNumber();
  $('#pvw-div')
    .find('.content-display')
      .html(textArray[pageNum])
      .end()
    .find('.pagenum-display')
      .text(pageNum);
  $('#pagelist-div')
    .find('.pagelist-cell')
      .removeClass('pvw-border')
      .removeClass('pgm-border')
      .end()
    .find('#pagelist-cell-' + pvwControl.getPageNumber())
      .addClass('pvw-border')
      .end()
    .find('#pagelist-cell-' + pgmControl.getPageNumber())
      .removeClass('pvw-border')
      .addClass('pgm-border');
}
function updatePgm() {
  var pageNum = pgmControl.getPageNumber();
  if (wnd && !wnd.closed) {
    $('#pgm-div')
      .find('.content-display')
        .html(textArray[pageNum])
        .end()
      .find('.pagenum-display')
        .text(Boolean(pageNum) ? pageNum : '');
    $('#pagelist-div')
      .find('.pagelist-cell')
        .removeClass('pvw-border')
        .removeClass('pgm-border')
        .end()
      .find('#pagelist-cell-' + pgmControl.getPageNumber())
        .addClass('pgm-border');
  }
}

function textCut() {
  var
    pgmPage = pvwControl.getPageNumber(),
    pvwPage = pgmPage + 1;
  if (wnd && !wnd.closed) {
    pvwControl.setPageNumber(pvwPage);
    pgmControl.setPageNumber(pgmPage);
    $(wnd.document)
      .find('#text-div')
      .html(textArray[pgmPage]);
    updatePvw();
    updatePgm();
  }
}
function textClear() {
  if (wnd && !wnd.closed) {
    pgmControl.setPageNumber(0);
    $(wnd.document)
      .find('#text-div')
      .html('');
    updatePvw();
    updatePgm();
  }
}

function wndInit() {
  wnd = window.open('', 'wnd', 'scrollbar=no');
  try {
    wnd.document.write('<!doctype html>' +
      '<html>' +
      '<head>' +
      '<meta charset="utf-8">' +
      '<title>[송출] HtmlTextPresenter</title>' +
      '<link rel="stylesheet" href="presenter.css" type="text/css">' +
      '</head>' +
      '<body>' +
      '<section id="text-section">' +
      '<div id="text-div"></div>' +
      '</section>' +
      '</body>' +
      '</html>');
  } catch (err) {
    if (confirm('스위처와 송출 창이 서로 통신할 수 없는 상태입니다.\n송출 창을 다시 띄울까요?')) {
      wnd = window.open('', 'wnd', '');
      wnd.close();
      wndInit();
    }
    return;
  }
  
  pgmControl.setPageNumber(1);
  textClear();
  pvwControl.setPageNumber(1);
  updatePvw();
  
  //wnd.onkeydown = documentKeyDown;
  //wnd.onkeypress = documentKeyPress;
  wnd.onunload = function () {
    pgmControl.setPageNumber(0);
    textClear();
  };
}


function updatePagelistHtml() {
  var
    i = 0,
    html = '',
    textArrayLength = textArray.length;
  if (textArrayLength > 0) {
    for (i = 1; i < textArrayLength; i += 1) {
      html += '<div class="pagelist-cell" data-page="' + i + '">' +
        '<div class="pagelist-cell-content">' + textArray[i] + '</div>' +
        '<div class="pagelist-cell-pagenum">' + i + '</div></div>';
    }
  }
  $('#pagelist-div').html(html);
}

function readTextFile(e) {
  var
    i, textArrayLength,
    contents = e.target.result
    .replace(/\r\n/g, '\n')
    .replace(/^\n+/g, '')
    .replace(/\n+$/g, '')
    .replace(/&(?!(amp;|nbsp;|#\d+;|#x[0-9a-f]+;))/gi, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
  textArray = [''].concat(contents.split('<br><br>'), ['']);
  textArrayLength = textArray.length;
  for (i = 1; i < textArrayLength; i += 1) {
    textArray[i] = textArray[i]
      .replace(/^(<br>)+/, '')
      .replace(/(<br>)+$/, '')
      .replace(/^###### *(.*) *#* *$/gm, '<h6>$1</h6>')
      .replace(/^##### *(.*) *#* *$/gm, '<h5>$1</h5>')
      .replace(/^#### *(.*) *#* *$/gm, '<h4>$1</h4>')
      .replace(/^### *(.*) *#* *$/gm, '<h3>$1</h3>')
      .replace(/^## *(.*) *#* *$/gm, '<h2>$1</h2>')
      .replace(/^# *(.*) *#* *$/gm, '<h1>$1</h1>')
      .replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>')
      .replace(/(\*|_)(.+?)\1/g, '<em>$2</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  }
  $('#last-page-label').text('/' + (textArrayLength));
  updatePagelistHtml();
  if (wnd && !wnd.closed) {
    pvwControl.setPageNumber(1);
    updatePvw();
  }
}

function fileLoad() {
  try {
    var
      fileForm = document.getElementById('select-file'),
      fr = new window.FileReader(),
      encoding = $('#encoding-text').val();
    if (fileForm.files.length !== 1) {
      alert('텍스트 파일이 선택되지 않았습니다.');
      return;
    }
    if (!encoding) {
      encoding = 'euc-kr';
    }
    $('#pgm-div').find('.pagenum-display').html('');
    fr.onload = readTextFile;
    fr.readAsText(fileForm.files[0], encoding);
  } catch (err) {
    console.log('something wrong in fileLoad() function. ' + err);
  }
  return;
}

function updateKeyboardSettings() {
}

function setPvwFromPagelist(e) {
  pvwControl.setPageNumber(+(
    $(e.target)
      .closest('.pagelist-cell')
      .data('page')
  ));
  updatePvw();
}
function setPgmFromPagelist(e) {
  if (wnd && !wnd.closed) {
    pgmControl.setPageNumber(+(
      $(e.target)
        .closest('.pagelist-cell')
        .data('page')
    ));
    textCut();
  }
}


// event listeners
$(document).ready(function () {
  var pagelistHeight = $(window).height() - $('#pagelist-div').offset().top - 40;
  
  $('#window-button').on('click', wndInit);
  
  $('#select-file').on('change', fileLoad);
  $('#update-list-button').on('click', fileLoad);
  
  $('#output-section').on('change', 'input[type="checkbox"]', updateKeyboardSettings);
  
  $('#text-cut-button').on('click', textCut);
  $('#text-clear-button').on('click', textClear);
  
  $('#pagelist-div').css('height', String(pagelistHeight));
  $('#pagelist-div').on('click', '.pagelist-cell', setPvwFromPagelist);
  $('#pagelist-div').on('dblclick', '.pagelist-cell', setPgmFromPagelist);
});


/*

var wnd;
var textArray = [];
var textFileContent = '';


var kbdCtrl = (function() {
  var numLog = '';
  var chkLog = function() {
    if (numLog.length > 4) {
      numLog = numLog.slice(-4);
    }
    numLog = numLog.replace(/^0+(\d)/, '$1');
  };
  var updatePvwNumInput = function() {
    document.getElementById('txtPvwDisplayTxt').value = '' + numLog;
  };
  return {
    enabled: true,
    useKeypad: true,
    addLog: function(l) {
      if (typeof l == 'string') {
        numLog += l;
        chkLog();
        updatePvwNumInput();
        return l;
      } else if (typeof l == 'number') {
        numLog += String(l);
        chkLog();
        updatePvwNumInput();
        return String(l);
      }
      return '';
    },
    getLog: function() {
      return numLog;
    },
    clearLog: function() {
      var numLogTemp = numLog;
      numLog = '';
      updatePvwNumInput();
      return numLogTemp;
    }
  };
})();


function mainWndResize() {
  var h = 200;
  h += document.getElementsByTagName('h1')[0].offsetHeight;
  h += document.getElementById('switcherContainer').offsetHeight;
  document.getElementById('pageListContainer').style.height = '' + (window.innerHeight - h) + 'px';
}
window.onresize = mainWndResize;
window.onbeforeunload = function() {
  return '새로 고침 동작을 하거나 이 페이지에서 나올 경우 스위처와 통신 창이 서로 통신할 수 없는 상태가 되어, 이후에 다른 페이지를 송출하려면 송출 창을 다시 띄워야 합니다.';
};

function documentKeyDown(e) {
  if (e.keyCode == 116) { // F5
    return false;
  }
  if (document.activeElement.id != 'encodingTxt') {
    if (e.keyCode == 38) { // Up
      document.getElementById('pageListContainer').scrollTop -= 90;
      return false;
    } else if (e.keyCode == 40) { // Down
      document.getElementById('pageListContainer').scrollTop += 90;
      return false;
    }
  }
  if (e.ctrlKey) {
    switch (e.keyCode) {
      case 65: case 68: case 69: case 70: case 71: case 72: case 74: case 75: case 76: case 78: case 79: case 80: case 82: case 83: case 84: case 85: case 87:
        return false;
    }
  }
}
function documentKeyPress(e) {
  if (document.activeElement.id == 'encodingTxt') {
    if (e.keyCode == 13) {
      document.getElementById('fileLoadBtn').click();
    }
    return;
  }
  if (!wnd || wnd.closed) {
    return;
  }
  if (textArray.length > 0 && kbdCtrl.enabled) {
    if (kbdCtrl.useKeypad && e.location == 3) {
      if (e.keyCode == 13) { // enter
        if (kbdCtrl.getLog()) {
          pvw.updatePage(kbdCtrl.clearLog());
        } else {
          txtCut();
        }
      } else if (e.keyCode >= 48 && e.keyCode <= 57) { // 0-9
        kbdCtrl.addLog(e.keyCode - 48);
      } else if (e.keyCode == 43) { // +
        pvw.updatePage(pvw.getPageNum() + 1);
      } else if (e.keyCode == 45) { // -
        pvw.updatePage(pvw.getPageNum() - 1);
      } else if (e.keyCode == 46) { // .
        txtClear();
      }
    } else if (!kbdCtrl.useKeypad && e.location != 3) {
      if (e.keyCode == 13) { // enter
        if (kbdCtrl.getLog()) {
          pvw.updatePage(kbdCtrl.clearLog());
        } else {
          txtCut();
        }
      } else if (e.keyCode == 109 || e.keyCode == 77) { // Mm=0
        kbdCtrl.addLog(0);
      } else if (e.keyCode == 106 || e.keyCode == 74) { // Jj=1
        kbdCtrl.addLog(1);
      } else if (e.keyCode == 107 || e.keyCode == 75) { // Kk=2
        kbdCtrl.addLog(2);
      } else if (e.keyCode == 108 || e.keyCode == 76) { // Ll=3
        kbdCtrl.addLog(3);
      } else if (e.keyCode == 117 || e.keyCode == 85) { // Uu=4
        kbdCtrl.addLog(4);
      } else if (e.keyCode == 105 || e.keyCode == 73) { // Ii=5
        kbdCtrl.addLog(5);
      } else if (e.keyCode == 111 || e.keyCode == 79) { // Oo=6
        kbdCtrl.addLog(6);
      } else if (e.keyCode >= 55 && e.keyCode <= 57) { // 7-9
        kbdCtrl.addLog(e.keyCode - 48);
      } else if (e.keyCode == 91) { // [
        pvw.updatePage(pvw.getPageNum() + 1);
      } else if (e.keyCode == 93) { // ]
        pvw.updatePage(pvw.getPageNum() - 1);
      } else if (e.keyCode == 46) { // .
        txtClear();
      }
    }
  }
}

function bodyLoad() {
  mainWndResize();
  document.onkeydown = documentKeyDown;
  document.onkeypress = documentKeyPress;
}

function wndInit() {
  wnd = window.open('', 'wnd', 'scrollbar=no');
  try {
    wnd.document.write('<!doctype html>\n' + 
                       '<html>\n' + 
                       '<head>\n' + 
                       '<meta charset=\"utf-8\">\n' + 
                       '<link rel=\"stylesheet\" type=\"text/css\" href=\"presenter.css\">\n' + 
                       '<title>송출.HtmlTextPresenter</title>\n' + 
                       '</head>\n' + 
                       '<body>\n' + 
                       '<div id=\"txtContainer\"><div id=\"txtOut\"></div></div>\n' + 
                       '</body>\n' + 
                       '</html>');
  } catch (err) {
    if (confirm('스위처와 송출 창이 서로 통신할 수 없는 상태입니다.\n송출 창을 다시 띄울까요?')) {
      wnd = window.open('', 'wnd', 'scrollbar=no');
      wnd.close();
      wndInit();
      return;
    }
  }
  if (textArray.length > 0) {
    txtClear();
    pvw.updatePage(1);
  }
  wnd.onkeydown = documentKeyDown;
  wnd.onkeypress = documentKeyPress;
  wnd.onunload = function() {
    pgm.updatePage(0);
  };
}

*/
