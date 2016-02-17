# HtmlTextPresenter

이것은 웹 브라우저를 이용하여 간단한 텍스트를 송출하는 도구입니다. 이 내용은 3.1.0.160217 버전 기준으로 작성되었습니다.

## 사용법

1. main.html을 실행합니다.
  - 가능하면 최신 버전의 웹 브라우저로 실행하여 주십시오. Internet Explorer 9 등 오래된 웹 브라우저를 사용하면 오작동할 위험이 큽니다.
  - 작동 확인한 사용 환경
    - Chrome 48 (Windows 10, 64-bit)
    - Firefox 44 (Windows XP)
  - 자바스크립트 FileReader 객체를 지원하지 않는 웹 브라우저에서는 제대로 작동하지 않습니다.
1. 텍스트 파일(`*.txt`)을 선택하여 불러옵니다. 파일 선택 폼이나 아래 페이지 리스트 영역을 클릭하면 대화 상자가 나타납니다.
  - 기본적으로는 euc-kr 인코딩으로 불러옵니다. Windows 환경에서 메모장으로 텍스트 파일을 만들면 euc-kr 인코딩으로 저장됩니다.
  - OS X이나 리눅스 등의 환경에서 작업한 텍스트 파일을 불러올 때는 인코딩을 utf-8로 지정하고 불러오세요.
  - 텍스트 파일 작성 방법은 아래를 참고하세요.
1. 오른쪽 위의 **송출 창 띄우기/닫기** 버튼을 눌러서 송출 창을 띄우고, 내보내려는 모니터로 보낸 뒤, `F11` 키를 눌러 전체화면으로 전환합니다.
1. 아래의 송출 방법을 참고하여 텍스트를 내보냅니다.

### 키보드를 이용한 송출

- 아무 것도 입력하지 않은 상태에서 `Enter` 키를 누르면 PVW에 대기 중인 페이지가 PGM으로 넘어오면서 송출 창으로 송출됩니다.
- 내보낸 텍스트를 지우려면 `.` 키를 누르세요.
- 키패드의 `0`-`9` 키 또는 `M`, `J`, `K`, `L`, `U`, `I`, `O`, `7`, `8`, `9`(각각 키패드의 `0`-`9` 키에 대응) 키를 눌러 숫자를 입력하고 `Enter` 키를 누르면 해당 페이지가 PVW로 올라옵니다.
  - `0`을 입력한 상태에서 `Enter` 키를 누르면 현재 PVW에 대기 중인 페이지의 앞 페이지가 PVW로 올라옵니다.
  - 존재하지 않는 페이지를 입력한 상태에서 `Enter` 키를 누르면 입력한 내용만 사라지고 아무 일도 일어나지 않습니다.
- `-`/`+` 또는 `[`/`]` 키를 누르면 현재 PVW에 대기 중인 페이지의 이전/다음 페이지가 PVW로 올라옵니다.
- '키패드 사용'에 체크가 되어 있으면 오른쪽 키패드로만 작동하며, 그렇지 않으면 오른쪽 키패드로는 작동하지 않습니다.
- 방향키 `↑`, `↓` 키를 누르면 페이지 리스트 영역이 스크롤됩니다.

### 마우스를 이용한 송출

- 페이지 리스트에서 아무 페이지를 클릭하면 그 페이지가 PVW로 올라옵니다.
- **CUT** 버튼을 누르면 PVW에 대기 중인 페이지가 PGM으로 넘어오면서 송출 창으로 송출됩니다.
- 내보낸 텍스트를 지우려면 **CLEAR** 버튼을 누르세요.
- 페이지 리스트에서 특정 페이지를 바로 내보내려면 그 페이지를 더블클릭하세요.

### 텍스트 파일 작성 방법

- txt 파일로 작업하세요. Windows 환경에서는 메모장(notepad)로 작업하면 됩니다.
```
	파일의 맨 앞과 맨 뒤의
화이트스페이스(스페이스, 줄바꿈, 탭 등의 모든 공백 문자)는 무시됩니다.   
  
```
```
행 사이에 한 줄을 더 띄우면

페이지가 분리됩니다.
```
```
한 페이지 안에서 줄바꿈을 연속 두 번 이상 하려면
 
빈 줄에 공백을 한 칸씩 넣으세요.
 
 
공백 또한 내용을 채운 것으로 인정되어
 
이 내용들이 모두 한 페이지 안에 들어옵니다.
```
```
<h1>HTML 태그 일부 지원</h1>
<strong>일부</strong> HTML 태그를 사용할 수 있습니다.
<br>, <table> 등 일부 태그는 사용할 수 없고, 그대로 표시됩니다.
```
