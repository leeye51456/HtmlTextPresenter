var wnd;
var textArray = [];
var txtPgm = 0;
var defaultAuto = false;
var delay = 50;
var takeDuration = 0.25;
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
  width: 100%;\n\
  height: 100%;\n\
  margin: 0;\n\
  padding: 0;\n\
  border: none;\n\
  text-align: center;\n\
  border-collapse:collapse;\n\
}\n\
#src1,#src2 {\n\
  opacity: 0;\n\
  background-color: #000000;\n\
  color: #ffffff;\n\
  vertical-align: middle;\n\
  padding: 5vh 5vw;\n\
  font-size: 10vh;\n\
  line-height: 1.4;\n\
  word-break: keep-all;\n\
}\n\
</style>\n\
</head>\n\
<body>\n\
<table><tr><td id=\"src1\"></td></tr></table>\n\
<table><tr><td id=\"src2\"></td></tr></table>\n\
</body>\n\
</html>');
    wnd.onresize = function() {
      var w = wnd.innerWidth / wnd.innerHeight * 144;
      document.getElementById('pvwObj').style.width = '' + w + 'px';
      document.getElementById('pgmObj').style.width = '' + w + 'px';
      document.getElementById('pvwObj').style.padding = '7.2px ' + (w * 0.05) + 'px';
      document.getElementById('pgmObj').style.padding = '7.2px ' + (w * 0.05) + 'px';
      /*
      if (document.getElementById('pvwObjInner')) {
        document.getElementById('pvwObjInner').style.width = document.getElementById('pvwObj').style.width;
        document.getElementById('pvwObjInner').style.fontSize = '14.4px';
      }
      if (document.getElementById('pgmObjInner')) {
        document.getElementById('pgmObjInner').style.width = document.getElementById('pgmObj').style.width;
        document.getElementById('pgmObjInner').style.fontSize = '14.4px';
      }
      */
    };
  } catch (err) {
    if (confirm('스위처와 송출 창이 서로 통신할 수 없는 상태입니다.\n송출 창을 다시 띄울까요?')) {
      wnd = window.open('', 'wnd', 'scrollbar=no');
      wnd.close();
      wndInit();
    }
  }
}

function wndOnOff() {
  if (!wnd || wnd.closed) {
    wndInit();
  } else if (confirm('송출 창을 닫을까요?')) {
    wnd.close();
    for (i = textArray.length; i >= 0; i--) {
      document.getElementById('pvwRadio' + i).disabled = undefined;
      document.getElementById('pgmRadio' + i).checked = false;
    }
    document.getElementById('pvwRadio0').checked = true;
    document.getElementById('pvwRadio0').checked = false;
  }
}

function settingsToggle() {
  var settingsDiv = document.getElementById('settings');
  if (settingsDiv.style.display == 'block') {
    settingsDiv.style.display = 'none';
  } else {
    settingsDiv.style.display = 'block';
  }
}
function applySettings() {
  defaultAuto = Boolean(document.getElementById('isDefaultAuto').checked);
  delay = Number(document.getElementById('delayNum').value);
  takeDuration = Number(document.getElementById('takeDurationNum').value);
  document.getElementById('isSettingChanged').innerHTML = '';
  document.getElementById('settings').style.display = 'none';
}
function restoreSettings() {
  document.getElementById('isDefaultAuto').checked = defaultAuto;
  document.getElementById('delayNum').value = delay;
  document.getElementById('takeDurationNum').value = takeDuration;
  document.getElementById('isSettingChanged').innerHTML = '';
  document.getElementById('settings').style.display = 'none';
}
function settingChanged() {
  document.getElementById('isSettingChanged').innerHTML = '*';
}

function focusTransBtn() {
  if (defaultAuto) {
    document.getElementById('txtAutoBtn').focus();
  } else {
    document.getElementById('txtCutBtn').focus();
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
    focusTransBtn();
  }
}
function selectPgSelNm() {
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
    document.getElementById('pvwRadio' + (txtNo.value)).checked = true;
  } catch (typeError) {
  }
  txtPvwChanged();
}

function afterSrc1Load() {
  setTimeout(function() {
    wnd.document.getElementById('src2').style.opacity = 0;
  }, delay);
}
function afterSrc2Load() {
  setTimeout(function() {
    wnd.document.getElementById('src1').style.opacity = 1;
    wnd.document.getElementById('src2').style.opacity = 1;
  }, delay);
}

function txtTrans(dur) {
  if (!wnd || wnd.closed) {
    alert('현재 송출 창이 떠 있지 않거나, 스위처와 송출 창이 서로 통신할 수 없는 상태이므로 송출 창을 다시 띄워야 합니다.');
    document.getElementById('wndOnOffBtn').focus();
  } else {
    var txtNo = getTxtNo() - 1;
    if (txtNo < -1) {
      return;
    }
    document.getElementById('pgmRadio' + (txtNo + 1)).checked = true;
    setTimeout(function() {
      var txtNoTemp = txtNo;
      document.getElementById('txtAutoBtn').disabled = undefined;
      document.getElementById('txtCutBtn').disabled = undefined;
      document.getElementById('pageSelectNum').disabled = undefined;
      document.getElementById('txtClearBtn').disabled = undefined;
      for (i = textArray.length; i >= 0; i--) {
        document.getElementById('pvwRadio' + i).disabled = undefined;
        document.getElementById('pvwRadio' + i).checked = false;
        document.getElementById('pgmRadio' + i).checked = false;
      }
      document.getElementById('pgmRadio' + (txtNoTemp + 1)).checked = true;
      document.getElementById('pvwObj').innerHTML = textArray[txtNoTemp + 1];
    }, delay + dur * 1000);
    document.getElementById('pageSelectNum').disabled = 'disabled';
    document.getElementById('txtAutoBtn').disabled = 'disabled';
    document.getElementById('txtCutBtn').disabled = 'disabled';
    document.getElementById('txtClearBtn').disabled = 'disabled';
    for (i = textArray.length; i >= 0; i--) {
      document.getElementById('pvwRadio' + i).disabled = 'disabled';
    }
    var src1 = wnd.document.getElementById('src1');
    var src2 = wnd.document.getElementById('src2');
    src1.style.transition = 'opacity ' + dur + 's';
    src2.style.transition = 'opacity ' + dur + 's';
    if (txtNo == -1 || txtNo == textArray.length) {
      if (txtPgm == 2) {
        txtPgm = 1;
        src1.innerHTML = '';
        afterSrc1Load();
      } else if (txtPgm == 1) {
        txtPgm = 2;
        src2.innerHTML = '';
        afterSrc2Load();
      }
    } else {
      if (txtPgm == 0) {
        txtPgm = 2;
        src2.innerHTML = textArray[txtNo];
        src1.innerHTML = '';
        afterSrc2Load();
      } else if (txtPgm == 2) {
        txtPgm = 1;
        src1.innerHTML = textArray[txtNo];
        afterSrc1Load();
      } else if (txtPgm == 1) {
        txtPgm = 2;
        src2.innerHTML = textArray[txtNo];
        afterSrc2Load();
      }
    }
    document.getElementById('pgmObj').innerHTML = textArray[txtNo];
    selectPgSelNm();
  }
}

function txtClear() {
  if (!wnd || wnd.closed) {
    alert('현재 송출 창이 떠 있지 않거나, 스위처와 송출 창이 서로 통신할 수 없는 상태이므로 송출 창을 다시 띄워야 합니다.');
    document.getElementById('wndOnOffBtn').focus();
  } else {
    var src1 = wnd.document.getElementById('src1');
    var src2 = wnd.document.getElementById('src2');
    src1.style.transition = 'opacity 0s';
    src2.style.transition = 'opacity 0s';
    if (txtPgm == 2) {
      txtPgm = 1;
      src1.innerHTML = '';
      afterSrc1Load();
    } else if (txtPgm == 1) {
      txtPgm = 2;
      src2.innerHTML = '';
      afterSrc2Load();
    }
    document.getElementById('pgmObj').innerHTML = '';
    selectPgSelNm();
  }
}

function displayTextFile() {
  var text = '<tr onclick="txtPvwChanged(0);">\
<td class="pageNum">0</td>\
<td><input type="radio" id="pvwRadio0" name="pvwRadio" checked></td>\
<td><input type="radio" id="pgmRadio0" class="pgmRadio" disabled></td>\
<td class="tdLeft" style="color: #a0a0a0">' + (document.getElementById('fileForm').files[0].name) + '</td>\
</tr>';
  if (textArray.length > 0) {
    for (i = 0; i < textArray.length; i++) {
      text += '<tr onclick="txtPvwChanged(' + (i + 1) + ');">\
<td class="pageNum">' + (i + 1) + '</td>\
<td><input type="radio" id="pvwRadio' + (i + 1) + '" name="pvwRadio"></td>\
<td><input type="radio" id="pgmRadio' + (i + 1) + '" class="pgmRadio" disabled></td>\
<td class="tdLeft">' + textArray[i] + '</td></tr>';
    }
  }
  text += '<tr onclick="txtPvwChanged(' + (i + 1) + ');">\
<td class="pageNum">' + (i + 1) + '</td>\
<td><input type="radio" id="pvwRadio' + (i + 1) + '" name="pvwRadio"></td>\
<td><input type="radio" id="pgmRadio' + (i + 1) + '" class="pgmRadio" disabled></td>\
<td class="tdLeft">&nbsp;</td></tr>';
  document.getElementById('textFileContent').innerHTML = text;
}

function readTextFile(e) {
  var contents = e.target.result.replace(/^\s+/, '').replace(/\s+$/, '').replace(/\r\n/g, '<br>');
  textArray = contents.split('<br><br>');
  document.getElementById('pageSelectNum').max = textArray.length + 1;
  displayTextFile();
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
