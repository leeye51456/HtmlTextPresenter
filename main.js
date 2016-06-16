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
      $('#select-page-label').html(log === '' ? '&nbsp;' : log);
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
      if (pageNum >= textArray.length) {
        return textArray.length - 1;
      } else if (pageNum < 0) {
        return 0;
      }
      return (this.pageNumber = pageNum);
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
      if (pageNum >= textArray.length) {
        return textArray.length - 1;
      } else if (pageNum < 1) {
        return 1;
      }
      return (this.pageNumber = pageNum);
    }
  };
}());


// functions

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
    .find('[data-page="' + pageNum + '"]')
      .addClass('pvw-border')
      .end()
    .find('[data-page="' + pgmControl.getPageNumber() + '"]')
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
    if (pageNum) {
      $('#pagelist-div')
        .find('.pagelist-cell')
          .removeClass('pgm-border');
    } else {
      $('#pagelist-div')
        .find('.pagelist-cell')
          .removeClass('pvw-border')
          .removeClass('pgm-border')
          .end()
        .find('[data-page="' + pageNum + '"]')
          .addClass('pgm-border');
    }
  }
}

function textCut() {
  var
    pgmPage = +pvwControl.getPageNumber(),
    pvwPage = pgmPage + 1;
  if (wnd && !wnd.closed) {
    pvwControl.setPageNumber(pvwPage);
    pgmControl.setPageNumber(pgmPage);
    $(wnd.document)
      .find('#text-div')
      .html(textArray[pgmPage]);
    updatePgm();
    updatePvw();
  }
}
function pageNumZeroFilter() {
  var
    pageNum = +keyboardControl.clearLog(),
    len = textArray.length;
  if (pageNum === 0) {
    return pvwControl.getPageNumber() - 1;
  } else if (pageNum < 1) {
    return 1;
  } else {
    return pageNum;
  }
}
function textCutBtnClick(e) {
  if (e) {
    $(e.target).trigger('blur');
  }
  if (keyboardControl.getLog()) {
    pvwControl.setPageNumber(pageNumZeroFilter());
    updatePvw();
  } else {
    textCut();
  }
}
function textClear(e) {
  if (e) {
    $(e.target).trigger('blur');
  }
  if (wnd && !wnd.closed) {
    pgmControl.setPageNumber(0);
    $(wnd.document)
      .find('#text-div')
      .html('');
    updatePgm();
    updatePvw();
  }
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
      .replace(/^###### *(.*?) *#* *$/gm, '<h6>$1</h6>')
      .replace(/^##### *(.*?) *#* *$/gm, '<h5>$1</h5>')
      .replace(/^#### *(.*?) *#* *$/gm, '<h4>$1</h4>')
      .replace(/^### *(.*?) *#* *$/gm, '<h3>$1</h3>')
      .replace(/^## *(.*?) *#* *$/gm, '<h2>$1</h2>')
      .replace(/^# *(.*?) *#* *$/gm, '<h1>$1</h1>')
      .replace(/(\*\*|__)(.+?)\1/g, '<strong>$2</strong>')
      .replace(/(\*|_)(.+?)\1/g, '<em>$2</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>');
  }
  $('#last-page-label').text('/' + (textArrayLength - 1));
  updatePagelistHtml();
  if (wnd && !wnd.closed) {
    pvwControl.setPageNumber(1);
    updatePvw();
  }
}

function fileLoad(e) {
  if (e) {
    $(e.target).trigger('blur');
  }
  try {
    var
      fileForm = document.getElementById('select-file'),
      fr = new window.FileReader(),
      encoding = $('#encoding-text').val(),
      pf = navigator.platform,
      lang = navigator.language;
    if (fileForm.files.length !== 1) {
      alert('텍스트 파일이 선택되지 않았습니다.');
      return;
    }
    if (!encoding) {
      if (pf.match(/win/i) !== null && lang.match(/ko/i) !== null) {
        encoding = 'euc-kr';
      } else {
        encoding = 'utf-8';
      }
    }
    $('#pgm-div').find('.pagenum-display').html('');
    fr.onload = readTextFile;
    fr.readAsText(fileForm.files[0], encoding);
  } catch (err) {
    console.log('something wrong in fileLoad() function. ' + err);
  }
  return;
}

function documentKeyDown(e) {
  if ($(':focus').attr('id') !== 'encoding-text') {
    var st = $('#pagelist-div').scrollTop();
    if (e.keyCode === 38) { // Up
      $('#pagelist-div').scrollTop(st - 87);
      e.preventDefault();
    } else if (e.keyCode === 40) { // Down
      $('#pagelist-div').scrollTop(st + 87);
      e.preventDefault();
    }
    if (!wnd || wnd.closed) {
      return;
    }
    if (textArray.length > 1 && keyboardControl.enabled) {
      if (keyboardControl.useKeypad) {
        if (e.keyCode === 13) { // enter
          if (keyboardControl.getLog()) {
            pvwControl.setPageNumber(pageNumZeroFilter());
            updatePvw();
          } else {
            textCut();
          }
        } else if (e.keyCode >= 96 && e.keyCode <= 105) { // 0-9
          keyboardControl.addLog(e.keyCode - 96);
        } else if (e.keyCode === 107) { // +
          pvwControl.setPageNumber(+pvwControl.getPageNumber() + 1);
          updatePvw();
        } else if (e.keyCode === 109) { // -
          pvwControl.setPageNumber(+pvwControl.getPageNumber() - 1);
          updatePvw();
        } else if (e.keyCode === 110) { // .
          textClear();
        }
      } else if (!keyboardControl.useKeypad) {
        if (e.keyCode === 13) { // enter
          if (keyboardControl.getLog()) {
            pvwControl.setPageNumber(pageNumZeroFilter());
            updatePvw();
          } else {
            textCut();
          }
        } else if (e.keyCode === 77) { // Mm=0
          keyboardControl.addLog(0);
        } else if (e.keyCode === 74) { // Jj=1
          keyboardControl.addLog(1);
        } else if (e.keyCode === 75) { // Kk=2
          keyboardControl.addLog(2);
        } else if (e.keyCode === 76) { // Ll=3
          keyboardControl.addLog(3);
        } else if (e.keyCode === 85) { // Uu=4
          keyboardControl.addLog(4);
        } else if (e.keyCode === 73) { // Ii=5
          keyboardControl.addLog(5);
        } else if (e.keyCode === 79) { // Oo=6
          keyboardControl.addLog(6);
        } else if (e.keyCode >= 55 && e.keyCode <= 57) { // 7-9
          keyboardControl.addLog(e.keyCode - 48);
        } else if (e.keyCode === 219) { // [
          pvwControl.setPageNumber(+pvwControl.getPageNumber() - 1);
          updatePvw();
        } else if (e.keyCode === 221) { // ]
          pvwControl.setPageNumber(+pvwControl.getPageNumber() + 1);
          updatePvw();
        } else if (e.keyCode === 190) { // .
          textClear();
        }
      }
    }
  }
}
function documentKeyPress(e) {
  if ($(':focus').attr('id') === 'encoding-text') {
    if (e.keyCode === 13) {
      fileLoad();
      e.preventDefault();
    }
  }
}

function wndInit(e) {
  if (e) {
    $(e.target).trigger('blur');
  }
  if (wnd && !wnd.closed && confirm('송출 창을 닫을까요?')) {
    wnd.close();
    return;
  }
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
  $('#pgm-div').css('outline-color', '#e00000');
  
  $(wnd)
    .on('keydown', documentKeyDown)
    .on('keypress', documentKeyPress)
    .on('unload', function () {
      $('#pgm-div').css('outline-color', '');
      pgmControl.setPageNumber(0);
      textClear();
      $(wnd).off();
    });
}

function updateKeyboardSettings() {
  var $section = $('#output-section');
  keyboardControl.enabled = $section.find('#use-keyboard').is(':checked');
  keyboardControl.useKeypad = $section.find('#use-keypad').is(':checked');
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

function afterResize() {
  var pagelistHeight = $(window).height() - $('#pagelist-div').offset().top - 40;
  $('#pagelist-div')
    .css('height', String(pagelistHeight));
}


// event listeners
$(document).ready(function () {
  var
    timer,
    pagelistHeight = $(window).height() - $('#pagelist-div').offset().top - 40;
  
  $('#window-button').on('click', wndInit);
  
  $('#select-file').on('change', fileLoad);
  $('#update-list-button').on('click', fileLoad);
  
  $('#output-section').on('change', 'input[type="checkbox"]', updateKeyboardSettings);
  
  $('#text-cut-button').on('click', textCutBtnClick);
  $('#text-clear-button').on('click', textClear);
  
  $('#pagelist-div')
    .css('height', String(pagelistHeight))
    .on('click', '.pagelist-cell', setPvwFromPagelist)
    .on('dblclick', '.pagelist-cell', setPgmFromPagelist);
  
  $(document)
    .on('keydown', documentKeyDown)
    .on('keypress', documentKeyPress);
  $(window).on('beforeunload', function () {
    return '';
  });
  $(window).on('resize', function () {
    window.clearTimeout(timer);
    timer = window.setTimeout(afterResize, 200);
    console.log(timer);
  });
});
