var wnd;
var textArray = [];
var textFileContent = '';


function viewportUnitConverter(pWidth, pHeight, pSource) {
  var result = pSource;
  var patt = /(<.+?\s+style\s*=\s*)(['"])([^\2]*?)([0-9.]+)(\s*)(v[hw])([^\2]*?\2.*?>)/;
  var stringCut = '';
  var sizeUnit = '';
  var newValue = 0;
  while (patt.test(result)) {
    stringCut = result.match(patt)[0];
    sizeUnit = stringCut.replace(patt, '$6');
    sizeValue = Number(stringCut.replace(patt, '$4'));
    newValue = 11 * pHeight / 75 * sizeValue / 8.75;
    if (sizeUnit == 'vw') {
      newValue = newValue * 4 / 3;
    }
    result = result.replace(patt, '$1$2$3' + newValue + '$5px$7');
  }
  return result;
}


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

var pvw = (function() {
  var pageNum = 0;
  return {
    getPageNum: function() {
      return this.pageNum;
    },
    updatePage: function(page) {
      var temp = Number(page);
      if (page === '0') {
        this.updatePage(this.getPageNum() - 1);
        return;
      } else if (temp < 1 || temp > textArray.length + 1) {
        return;
      }
      this.pageNum = temp;
      for (i = 1; i <= textArray.length + 1; i++) {
        document.getElementById('pageListCell' + i).style.outline = '';
      }
      if (this.getPageNum()) {
        document.getElementById('pageListCell' + this.pageNum).style.outline = '#00a000 solid 4px';
        document.getElementById('pvwObj').innerHTML = viewportUnitConverter(240, 120, textArray[this.pageNum - 1] ? textArray[this.pageNum - 1] : '');
        document.getElementById('pvwPageNum').innerHTML = '' + this.pageNum;
      }
      if (pgm.getPageNum()) {
        document.getElementById('pageListCell' + pgm.getPageNum()).style.outline = '#ff4040 solid 4px';
      }
    }
  };
})();

var pgm = (function() {
  var pageNum = 0;
  return {
    getPageNum: function() {
      return this.pageNum;
    },
    updatePage: function(page) {
      var temp = Number(page);
      if (temp < 0 || temp > textArray.length + 1) {
        return;
      }
      this.pageNum = temp;
      for (i = 1; i <= textArray.length + 1; i++) {
        document.getElementById('pageListCell' + i).style.outline = '';
      }
      if (pvw.getPageNum()) {
        document.getElementById('pageListCell' + pvw.getPageNum()).style.outline = '#00a000 solid 4px';
      }
      if (this.getPageNum()) {
        wnd.document.getElementById('txtOut').innerHTML = textArray[this.pageNum - 1] ? textArray[this.pageNum - 1] : '';
        document.getElementById('pageListCell' + this.pageNum).style.outline = '#ff4040 solid 4px';
        document.getElementById('pgmObj').innerHTML = viewportUnitConverter(240, 120, textArray[this.pageNum - 1] ? textArray[this.pageNum - 1] : '');
        document.getElementById('pgmPageNum').innerHTML = this.pageNum;
        document.getElementById('pgm').style.outline = '#ff4040 solid 5px';
      } else {
        wnd.document.getElementById('txtOut').innerHTML = '';
        document.getElementById('pgmObj').innerHTML = '';
        document.getElementById('pgmPageNum').innerHTML = '';
        document.getElementById('pgm').style.outline = '';
      }
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


function txtCut() {
  if (!wnd || wnd.closed) {
    alert('현재 송출 창이 떠 있지 않거나, 스위처와 송출 창이 서로 통신할 수 없는 상태이므로 송출 창을 다시 띄워야 합니다.');
    return;
  }
  pgm.updatePage(pvw.getPageNum());
  pvw.updatePage(pvw.getPageNum() + 1);
}

function txtClear() {
  if (!wnd || wnd.closed) {
    alert('현재 송출 창이 떠 있지 않거나, 스위처와 송출 창이 서로 통신할 수 없는 상태이므로 송출 창을 다시 띄워야 합니다.');
    return;
  }
  pgm.updatePage(0);
}

function cannotControlWnd() {
  if (confirm('스위처와 송출 창이 서로 통신할 수 없는 상태입니다.\n송출 창을 닫을까요?')) {
    wnd = window.open('', 'wnd', 'scrollbar=no');
    wnd.close();
  }
}

function wndInit() {
  wnd = window.open('', 'wnd', 'scrollbar=no');
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
<div id=\"txtContainer\"><div id=\"txtOut\"></div></div>\n\
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

function wndOnOff() {
  if (!wnd || wnd.closed) {
    wndInit();
  } else if (confirm('송출 창을 닫을까요?')) {
    if (textArray.length > 0) {
      pgm.updatePage(0);
    }
    wnd.close();
  }
}

function displayTextFile() {
  var text = '';
  if (textArray.length > 0) {
    for (i = 0; i < textArray.length; i++) {
      text += '<div id="pageListCell' + (i + 1) + '" class="pageListCell" onclick="pvw.updatePage(' + (i + 1) + ');" ondblclick="txtCut();">\
<div class="pageListCellContent">' + viewportUnitConverter(150, 75, textArray[i]) + '</div>\
<div class="pageNum">' + (i + 1) + '</div></div>';
    }
  }
  text += '<div id="pageListCell' + (i + 1) + '" class="pageListCell" onclick="pvw.updatePage(' + (i + 1) + ');" ondblclick="txtCut();">\
<div class="pageListCellContent"></div>\
<div class="pageNum">' + (i + 1) + '</div></div>';
  document.getElementById('pageListContainer').innerHTML = text;
}

function readTextFile(e) {
  var contents = e.target.result
    .replace(/\r\n/g, '\n')
    .replace(/^\n+/g, '')
    .replace(/\n+$/g, '')
    .replace(/&(?!(amp;|nbsp;|#\d+;|#x[0-9A-Fa-f]+;))/g, '&amp;')
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
    pvw.updatePage(1);
  }
}

function fileLoad(isReload) {
  var fileForm = document.getElementById('fileForm');
  if (fileForm.files.length != 1) {
    if (isReload) {
      alert('텍스트 파일을 다시 선택해 주세요.');
      document.getElementById('fileForm').click();
    }
    return;
  }
  if (FileReader) {
    var fr = new FileReader();
    var encoding = document.getElementById('encodingTxt').value;
    if (!encoding) {
      encoding = 'euc-kr';
    }
    document.getElementById('pgmPageNum').innerHTML = '';
    fr.onload = readTextFile;
    fr.readAsText(fileForm.files[0], encoding);
    return;
  }
  alert('정상 작동하는 웹 브라우저: Internet Explorer 10+, Microsoft Edge, Chrome 7+, FireFox 3.6+, Opera 12.02+, Safari 6.0.2+');
}
