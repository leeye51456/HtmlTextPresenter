var wnd;
var textArray = [];
var textFileContent = '';

function mainWndResize() {
  var h = 80;
  h += document.getElementsByTagName('h1')[0].offsetHeight;
  h += document.getElementsByTagName('h2')[0].offsetHeight;
  h += document.getElementById('pvw').offsetHeight;
  document.getElementById('pageListContainer').style.maxHeight = '' + (window.innerHeight - h) + 'px';
}
window.onresize = mainWndResize;


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
<title>송출.HtmlPresenter</title>\n\
<style>\n\
* {\n\
  font-family: 나눔바른고딕OTF, 나눔바른고딕, 나눔고딕, sans-serif;\n\
  word-break: keep-all;\n\
  word-wrap: break-word;\n\
  overflow: hidden;\n\
}\n\
body {\n\
  background-color: #000000;\n\
  margin: 0;\n\
  padding: 0;\n\
}\n\
table {\n\
  position: absolute;\n\
  left: 0;\n\
  top: 0;\n\
  width: 100vw;\n\
  height: 100vh;\n\
  margin: 0;\n\
  padding: 0;\n\
  border: none;\n\
  text-align: center;\n\
  border-collapse:collapse;\n\
}\n\
#txtOut {\n\
  background-color: #000000;\n\
  color: #ffffff;\n\
  vertical-align: middle;\n\
  max-width: 90vw;\n\
  max-height: 90vh;\n\
  padding: 5vh 5vw;\n\
  font-size: 10vh;\n\
  line-height: 1.4;\n\
}\n\
</style>\n\
</head>\n\
<body>\n\
<table><tr><td id=\"txtOut\"></td></tr></table>\n\
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
  wnd.onresize = function() {
    var w = wnd.innerWidth / wnd.innerHeight * 144;
    document.getElementById('pvwObj').style.maxWidth = '' + w + 'px';
    document.getElementById('pvwObj').style.width = '' + w + 'px';
    document.getElementById('pgmObj').style.maxWidth = '' + w + 'px';
    document.getElementById('pgmObj').style.width = '' + w + 'px';
    document.getElementById('pvwObj').style.padding = '7.2px ' + (w * 0.05) + 'px';
    document.getElementById('pgmObj').style.padding = '7.2px ' + (w * 0.05) + 'px';
  };
}

function wndOnOff() {
  if (!wnd || wnd.closed) {
    wndInit();
  } else if (confirm('송출 창을 닫을까요?')) {
    wnd.close();
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
function txtPvwChanged(radioNum) {
  var pvwRad = document.getElementById('pvwRadio' + radioNum);
  if (!pvwRad.disabled) {
    if (radioNum || radioNum === 0) {
      pvwRad.checked = true;
      document.getElementById('pageSelectNum').value = radioNum;
    }
    var txtNo = getTxtNo() - 1;
    document.getElementById('pvwObj').innerHTML = textArray[txtNo] ? textArray[txtNo] : '&nbsp;';
  }
}
function selectPgSelNm(newPage) {
  if ((newPage || newPage === 0) && newPage <= textArray.length + 1) {
    document.getElementById('pageSelectNum').value = newPage;
    document.getElementById('pvwRadio' + newPage).checked = true;
  }
  document.getElementById('pageSelectNum').select();
}
function updatePgSelNm() {
  var txtNo = document.getElementById('pageSelectNum');
  if (Number(txtNo.value) > textArray.length + 1) {
    txtNo.value = textArray.length + 1;
  } else if (Number(txtNo.value) < 0) {
    txtNo.value = 0;
  }
  txtNo.value = Math.floor(Number(txtNo.value));
  txtNo.select();
  try {
    document.getElementById('pvwRadio' + (txtNo.value)).click();
  } catch (typeError) {
  }
  txtPvwChanged();
}

function txtCut(dur) {
  if (!wnd || wnd.closed) {
    alert('현재 송출 창이 떠 있지 않거나, 스위처와 송출 창이 서로 통신할 수 없는 상태이므로 송출 창을 다시 띄워야 합니다.');
    document.getElementById('wndOnOffBtn').focus();
  } else {
    var txtNo = getTxtNo() - 1;
    if (txtNo < -1) {
      return;
    }
    document.getElementById('pgmRadio' + (txtNo + 1)).checked = true;
    document.getElementById('pvwObj').innerHTML = textArray[txtNo + 1] ? textArray[txtNo + 1] : '';
    var txtOut = wnd.document.getElementById('txtOut');
    if (txtNo == -1 || txtNo == textArray.length) {
      txtOut.innerHTML = '';
    } else {
      txtOut.innerHTML = textArray[txtNo];
    }
    document.getElementById('pgmObj').innerHTML = textArray[txtNo] ? textArray[txtNo] : '';
    selectPgSelNm(txtNo + 2);
  }
}

function txtClear() {
  if (!wnd || wnd.closed) {
    alert('현재 송출 창이 떠 있지 않거나, 스위처와 송출 창이 서로 통신할 수 없는 상태이므로 송출 창을 다시 띄워야 합니다.');
    document.getElementById('wndOnOffBtn').focus();
  } else {
    wnd.document.getElementById('txtOut').innerHTML = '';
    document.getElementById('pgmObj').innerHTML = '';
    selectPgSelNm();
  }
}

function displayTextFile() {
  var text = '<tr onclick="txtPvwChanged(0);">\
<td class="pageNum">0</td>\
<td><input type="radio" id="pvwRadio0" name="pvwRadio" checked></td>\
<td><input type="radio" id="pgmRadio0" name="pgmRadio" disabled></td>\
<td class="tdLeft" style="color: #a0a0a0">' + (document.getElementById('fileForm').files[0].name) + '</td>\
</tr>';
  if (textArray.length > 0) {
    for (i = 0; i < textArray.length; i++) {
      text += '<tr onclick="txtPvwChanged(' + (i + 1) + ');">\
<td class="pageNum">' + (i + 1) + '</td>\
<td><input type="radio" id="pvwRadio' + (i + 1) + '" name="pvwRadio"></td>\
<td><input type="radio" id="pgmRadio' + (i + 1) + '" name="pgmRadio" disabled></td>\
<td class="tdLeft">' + textArray[i] + '</td></tr>';
    }
  }
  text += '<tr onclick="txtPvwChanged(' + (i + 1) + ');">\
<td class="pageNum">' + (i + 1) + '</td>\
<td><input type="radio" id="pvwRadio' + (i + 1) + '" name="pvwRadio"></td>\
<td><input type="radio" id="pgmRadio' + (i + 1) + '" name="pgmRadio" disabled></td>\
<td class="tdLeft">&nbsp;</td></tr>';
  document.getElementById('textFileContent').innerHTML = text;
}

function readTextFile(e) {
  var contents = e.target.result.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\r\n/g, '\n').replace(/\n/g, '<br class="brFromNl">');
  textArray = contents.split('<br class="brFromNl"><br class="brFromNl">');
  for (i = 0; i < textArray.length; i++) {
    textArray[i] = textArray[i].replace(/^(<br class="brFromNl">)+/, '').replace(/(<br class="brFromNl">)+$/, '');
  }
  document.getElementById('pageSelectNum').max = textArray.length + 1;
  displayTextFile();
  if (wnd && !wnd.closed) {
    document.getElementById('pvwRadio0').click();
    document.getElementById('pgmRadio0').checked = true;
  }
}

function fileLoad() {
  var fileForm = document.getElementById('fileForm');
  if (fileForm.files.length != 1) {
    alert('텍스트 파일을 하나 선택하세요.');
    document.getElementById('fileForm').focus();
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
  } else {
    alert('정상 작동하는 웹 브라우저: Internet Explorer 10+, Microsoft Edge, Chrome 7+, FireFox 3.6+, Opera 12.02+, Safari 6.0.2+');
  }
}
