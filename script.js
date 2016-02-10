var wnd;
var textArray = [];
var textFileContent = '';

var kbdCtrl = function() {
  var numLog = '';
  var chkLog = function() {
    if (numLog.length > 4) {
      numLog = numLog.slice(-4);
    }
    numLog = numLog.replace(/^0*(\d)/, '$1');
  };
  var updatePvwNum = function() {
    document.getElementById('txtPvwDisplayTxt').value = '' + numLog;
  };
  return {
    enabled: true,
    useKeypad: true,
    addLog: function(l) {
      if (typeof l == 'string') {
        numLog += l;
        chkLog();
        updatePvwNum();
        return l;
      } else if (typeof l == 'number') {
        numLog += String(l);
        chkLog();
        updatePvwNum();
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
      updatePvwNum();
      return numLogTemp;
    }
  };
}();


function mainWndResize() {
  var h = 100;
  h += document.getElementsByTagName('h1')[0].offsetHeight;
  h += document.getElementsByTagName('h2')[0].offsetHeight;
  h += document.getElementById('pvw').offsetHeight;
  document.getElementById('pageListContainer').style.maxHeight = '' + (window.innerHeight - h) + 'px';
}
window.onresize = mainWndResize;

function txtPvwChanged(pageNum) {
  if (pageNum < 0 || pageNum > textArray.length + 1) {
    return;
  }
  var pvwRad = document.getElementById('pvwRadio' + (pageNum));
  if (pvwRad) {
    pvwRad.click();
    document.getElementById('pvwObj').innerHTML = textArray[pageNum - 1] ? textArray[pageNum - 1] : '&nbsp;';
    document.getElementById('pvwPageNum').innerHTML = 'PVW ' + pageNum;
  }
}

function getTxtNo() {
  try {
    for (i = textArray.length + 1; i >= 0; i--) {
      if (document.getElementById('pvwRadio' + i).checked) {
        return i;
      }
    }
    alert('아무 것도 선택하지 않았습니다.');
  } catch (TypeError) {
  }
  return -1;
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
  if (kbdCtrl.enabled) {
    if (kbdCtrl.useKeypad && e.location == 3) {
      if (e.keyCode == 13) { // enter
        if (kbdCtrl.getLog()) {
          txtPvwChanged(kbdCtrl.clearLog());
        } else {
          txtCut();
        }
      } else if (e.keyCode >= 48 && e.keyCode <= 57) { // 0-9
        kbdCtrl.addLog(e.keyCode - 48);
      } else if (e.keyCode == 43) { // +
        txtPvwChanged(getTxtNo() + 1);
      } else if (e.keyCode == 45) { // -
        txtPvwChanged(getTxtNo() - 1);
      } else if (e.keyCode == 46) { // .
        txtClear();
      }
    } else if (!kbdCtrl.useKeypad && e.location != 3) {
      if (e.keyCode == 13) { // enter
        if (kbdCtrl.getLog()) {
          txtPvwChanged(kbdCtrl.clearLog());
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
        txtPvwChanged(getTxtNo() + 1);
      } else if (e.keyCode == 93) { // ]
        txtPvwChanged(getTxtNo() - 1);
      } else if (e.keyCode == 46) { // .
        txtClear();
      }
    }
  }
}

function bodyLoad() {
  mainWndResize();
  document.onkeypress = documentKeyPress;
}


function txtCut() {
  if (!wnd || wnd.closed) {
    alert('현재 송출 창이 떠 있지 않거나, 스위처와 송출 창이 서로 통신할 수 없는 상태이므로 송출 창을 다시 띄워야 합니다.');
  } else {
    var txtNo = getTxtNo() - 1;
    if (txtNo < -1) {
      return;
    }
    var txtOut = wnd.document.getElementById('txtOut');
    if (txtNo == -1 || txtNo == textArray.length) {
      txtOut.innerHTML = '';
    } else {
      txtOut.innerHTML = textArray[txtNo];
    }
    document.getElementById('pgmObj').innerHTML = textArray[txtNo] ? textArray[txtNo] : '';
    document.getElementById('pgmRadio' + (txtNo + 1)).checked = true;
    document.getElementById('pgmPageNum').innerHTML = 'PGM ' + (txtNo + 1);
    try {
      txtPvwChanged(txtNo + 2);
    } catch (TypeError) {
    }
  }
}

function txtClear() {
  if (!wnd || wnd.closed) {
    alert('현재 송출 창이 떠 있지 않거나, 스위처와 송출 창이 서로 통신할 수 없는 상태이므로 송출 창을 다시 띄워야 합니다.');
  } else {
    wnd.document.getElementById('txtOut').innerHTML = '';
    document.getElementById('pgmObj').innerHTML = '';
    document.getElementById('pgmPageNum').innerHTML = 'PGM ';
    for (i = 0; i <= textArray.length + 1; i++) {
      document.getElementById('pgmRadio' + i).checked = false;
    }
  }
}

function cannotControlWnd() {
  if (confirm('스위처와 송출 창이 서로 통신할 수 없는 상태입니다.\n송출 창을 닫을까요?')) {
    wnd = window.open('', 'wnd', 'scrollbar=no');
    wnd.close();
  }
}

function wndInit() {
  txtPgm = 0;
  wnd = window.open('', 'wnd', 'scrollbar=no');
  if (document.getElementById('pvwRadio0')) {
    document.getElementById('pvwRadio0').click();
    document.getElementById('pgmRadio0').checked = true;
  }
  try {
    wnd.document.write('\
<!doctype html>\n\
<html>\n\
<head>\n\
<meta charset=\"utf-8\">\n\
<link rel=\"stylesheet\" type=\"text/css\" href=\"styleWnd.css\">\n\
<title>송출.HtmlTextPresenter</title>\n\
</head>\n\
<body>\n\
<table id=\"mainTable\"><tr><td id=\"txtOut\"></td></tr></table>\n\
</body>\n\
</html>');
  } catch (err) {
    if (confirm('스위처와 송출 창이 서로 통신할 수 없는 상태입니다.\n송출 창을 다시 띄울까요?')) {
      wnd = window.open('', 'wnd', 'scrollbar=no');
      wnd.close();
      wndInit();
      return;
    }
  }
  txtClear();
  txtPvwChanged(0);
  wnd.onresize = function() {
    var w = wnd.innerWidth / wnd.innerHeight * 144;
    var p = w * 0.05;
    var wi = '' + (w - p * 2) + 'px';
    w = '' + w + 'px';
    p = '7.2px ' + p + 'px';
    document.getElementById('pvwObj').style.maxWidth = wi;
    document.getElementById('pvwObj').style.width = wi;
    document.getElementById('pvwObj').style.padding = p;
    document.getElementById('pvwPageNum').style.width = w;
    document.getElementById('pgmObj').style.maxWidth = wi;
    document.getElementById('pgmObj').style.width = wi;
    document.getElementById('pgmObj').style.padding = p;
    document.getElementById('pgmPageNum').style.width = w;
  };
}

function wndOnOff() {
  if (!wnd || wnd.closed) {
    wndInit();
  } else if (confirm('송출 창을 닫을까요?')) {
    wnd.close();
  }
}

function blurElement() {
  this.blur();
}
function displayTextFile() {
  var text = '<tr onclick="txtPvwChanged(0);" ondblclick="txtCut();">\
<td class="pageNum">0</td>\
<td><input type="radio" id="pvwRadio0" name="pvwRadio" checked></td>\
<td><input type="radio" id="pgmRadio0" name="pgmRadio" checked disabled></td>\
<td class="pageListCell" style="color: #a0a0a0">' + (document.getElementById('fileForm').files[0].name) + '</td>\
</tr>';
  if (textArray.length > 0) {
    for (i = 0; i < textArray.length; i++) {
      text += '<tr onclick="txtPvwChanged(' + (i + 1) + ');" ondblclick="txtCut();">\
<td class="pageNum">' + (i + 1) + '</td>\
<td><input type="radio" id="pvwRadio' + (i + 1) + '" name="pvwRadio"></td>\
<td><input type="radio" id="pgmRadio' + (i + 1) + '" name="pgmRadio" disabled></td>\
<td class="pageListCell">' + textArray[i] + '</td></tr>';
    }
  }
  text += '<tr onclick="txtPvwChanged(' + (i + 1) + ');" ondblclick="txtCut();">\
<td class="pageNum">' + (i + 1) + '</td>\
<td><input type="radio" id="pvwRadio' + (i + 1) + '" name="pvwRadio"></td>\
<td><input type="radio" id="pgmRadio' + (i + 1) + '" name="pgmRadio" disabled></td>\
<td class="pageListCell">&nbsp;</td></tr>';
  document.getElementById('textFileContent').innerHTML = text;
  for (i = 0; i <= textArray.length + 1; i++) {
    document.getElementById('pvwRadio' + i).onfocus = blurElement;
  }
}

function readTextFile(e) {
  var contents = e.target.result
    .replace(/\r\n/g, '\n')
    .replace(/^\n+/g, '')
    .replace(/\n+$/g, '')
    .replace(/&/g, '&amp;')
    .replace(/<(\/?)(\!doctype|a|audio|body|br|button|canvas|details|dialog|embed|fieldset|form|head|html|iframe|input|keygen|link|meta|object|output|script|select|style|textarea|title|video)(.*?\s*?\/?\s*?)>/gi, '&lt;$1$2$3&gt;')
    .replace(/\n/g, '<br>');
  textArray = contents.split('<br><br>');
  for (i = 0; i < textArray.length; i++) {
    textArray[i] = textArray[i]
      .replace(/^(<br>)+/, '')
      .replace(/(<br>)+$/, '');
  }
  document.getElementById('txtPvwEndTxt').value = '/' + (textArray.length + 1);
  displayTextFile();
  if (wnd && !wnd.closed) {
    document.getElementById('pvwRadio0').click();
    document.getElementById('pgmRadio0').checked = true;
  }
}

function fileLoad(isReload) {
  var fileForm = document.getElementById('fileForm');
  if (fileForm.files.length != 1) {
    if (isReload) {
      alert('텍스트 파일을 다시 선택해 주세요.');
    }
    return;
  }
  if (FileReader) {
    var fr = new FileReader();
    var encoding = document.getElementById('encodingTxt').value;
    if (!encoding) {
      encoding = 'euc-kr';
    }
    fr.onload = readTextFile;
    fr.readAsText(fileForm.files[0], encoding);
    return;
  }
  alert('정상 작동하는 웹 브라우저: Internet Explorer 10+, Microsoft Edge, Chrome 7+, FireFox 3.6+, Opera 12.02+, Safari 6.0.2+');
}
