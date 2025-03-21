console.log("script.js 정상 로드"); 
// 스크립트가 정상적으로 로드되었음을 콘솔에 출력합니다.
// 이는 개발자가 스크립트가 제대로 실행되고 있는지 확인하는 데 유용합니다.

// 페이지 로드 후 실행될 코드
document.addEventListener("DOMContentLoaded", () => {
    // DOMContentLoaded 이벤트는 HTML 문서의 로딩이 완료되었을 때 발생
    // DOM이 완전히 구성되었고, 스크립트에서 HTML 요소를 안전하게 조작할 수 있음
    
    if (document.getElementById("dramaList")) {
        // id가 "dramaList"인 요소를 찾음
        // 존재하면 loadDramas 함수를 호출하여 드라마 목록을 불러옴
        loadDramas(); 
    }

    if (window.location.pathname.includes("detail.html")) {
        // window.location.pathname은 현재 URL의 경로를 반환합니다.
        // 만약 "detail.html"이 포함되어 있다면 loadDetail 함수를 호출하여 드라마의 상세 정보를 불러옵니다.
        loadDetail(); 
    }

    // zinuuei BLOG 클릭 시 홈으로 이동
    const title = document.querySelector("h1"); 
    // document.querySelector("h1")는 첫 번째 h1 요소를 선택합니다.
    // 해당 요소가 존재하면 클릭 이벤트 리스너를 추가합니다.
    
    if (title) {
        title.addEventListener("click", () => {
            // title 요소를 클릭할 경우 실행될 함수입니다.
            window.location.href = "index.html"; // 홈 페이지로 이동
            // 사용자가 블로그 제목을 클릭하면 홈 페이지로 리다이렉션됩니다.
        });
    }
});

// 드라마 목록 불러오기 (recommend.html)
function loadDramas() {
    console.log("드라마 목록 불러오기 실행"); 
    // 드라마 목록을 불러오는 시작 멘트를 콘솔에 출력

    let dramas = JSON.parse(localStorage.getItem("dramas")) || []; 
    // localStorage에서 "dramas" 키로 저장된 데이터를 불러와 배열로 변환
    // localStorage.getItem("dramas")는 localStorage에서 "dramas" 항목을 가져옴
    // 만약 "dramas"가 존재하지 않으면 빈 배열을 기본값으로 사용
    
    let list = document.getElementById("dramaList"); 
    // id가 "dramaList"인 ul 요소를 선택하여 드라마 목록을 표시할 공간을 확보
    
    let emptyMessage = document.getElementById("emptyMessage"); 
    // id가 "emptyMessage"인 요소를 선택하여 드라마가 없을 경우 표시할 메시지를 가져옴

    list.innerHTML = ""; // 리스트를 초기화하여 이전 내용을 지움, ul 자식 li를 비움

    if (dramas.length === 0) {
        // dramas 배열의 길이를 확인하여 저장된 드라마가 없으면
        console.log("저장된 드라마 없음"); 
        // 콘솔에 출력
        
        emptyMessage.style.display = "block"; 
        // 메시지를 표시하여 드라마 목록이 비어 있을 경우 "아직 추천된 드라마가 없습니다." 메시지를 표시
    } else {
        emptyMessage.style.display = "none"; 
        // 드라마가 있을 경우 메시지를 숨김
        
        dramas.forEach((drama, index) => {
            // dramas 배열의 각 드라마 객체를 반복하여 처리
            // drama는 현재 드라마 객체, index는 해당 객체의 인덱스
            
            let li = document.createElement("li"); 
            // 새로운 리스트 항목을 생성합니다.
            
            li.innerHTML = `<strong>${drama.title}</strong>`; 
            // 드라마 제목을 리스트 항목에 추가
            // drama.title은 현재 드라마 객체의 제목 속성을 가져옴
            
            li.style.cursor = "pointer"; 
            // 마우스 커서를 포인터로 변경하여 사용자가 클릭할 수 있음을 나타냄
            
            li.addEventListener("click", () => {
                // 리스트 항목을 클릭할 경우 실행될 함수입니다.
                window.location.href = `detail.html?index=${index}`; 
                // 클릭 시 상세 페이지로 이동합니다.
                // 각 드라마 항목을 클릭하면 해당 드라마의 상세 페이지로 이동합니다.
                // index는 현재 드라마의 인덱스입니다.
            });
            list.appendChild(li); 
            // 리스트 항목을 ul에 추가하여 최종적으로 생성한 li 요소를 드라마 목록에 추가합니다.
        });
    }
}

// 드라마 추가하기 (create.html)
window.addDrama = function () {
    console.log("addDrama() 실행"); 
    // 드라마 추가 함수 시작을 콘솔에 출력

    let title = document.getElementById("dramaTitle").value.trim(); 
    // id가 "dramaTitle"인 요소(제목 입력 필드)의 값을 가져오고 앞뒤 공백 제거
    
    let content = document.getElementById("dramaContent").value.trim(); 
    // id가 "dramaContent"인 요소(내용 입력 필드)의 값을 가져오고 앞뒤 공백 제거

    let dramas = JSON.parse(localStorage.getItem("dramas")) || []; 
    // 기존 드라마 목록을 localStorage에서 배열로 변환해서 가져오고, 없으면 빈 배열을 사용

    if (title && content) { // 제목과 내용이 모두 입력되었는지 확인
        dramas.push({ title, content }); 
        // 새로운 드라마 객체를 배열에 추가
        // 드라마 제목과 내용을 포함하는 객체를 배열에 추가
        
        localStorage.setItem("dramas", JSON.stringify(dramas)); 
        // localStorage에 업데이트된 드라마 목록 저장
        // JSON.stringify()는 배열을 문자열로 변환하여 localStorage에 저장

        console.log("드라마 저장 완료 :", dramas); 
        // 저장된 드라마 목록을 콘솔에 출력

        let newIndex = dramas.length - 1; 
        // 새로 추가된 드라마의 인덱스 계산
        // dramas.length는 배열의 길이를 반환하므로, 새로 추가된 드라마의 인덱스는 배열의 마지막 요소
        
        setTimeout(() => {
            window.location.href = `detail.html?index=${newIndex}`; 
            // 300ms 후 상세 페이지로 이동
            // 드라마가 추가된 후 해당 드라마의 상세 페이지로 이동
        }, 300);
    } else {
        alert("제목과 내용을 모두 입력해주세요!"); 
        // 입력이 부족할 경우 경고 메시지를 표시
        // 제목이나 내용이 비어있을 경우 사용자에게 입력을 요구하는 경고를 표시
    }
}

// 드라마 상세 보기 (detail.html)
function loadDetail() {
    // 드라마 상세 정보를 불러오는 함수
    
    let params = new URLSearchParams(window.location.search);
    // URLSearchParams는 URL의 쿼리 문자열을 쉽게 조작할 수 있는 인터페이스
    // window.location.search는 현재 페이지의 URL에서 물음표(?) 뒤의 쿼리 문자열을 가져옴
    // 예를 들어, URL이 "detail.html?index=0"일 경우, params는 "index=0"을 포함
    // URLSearchParams은 저걸 쉽게 가져올 수 있게 도와줌
    
    let index = parseInt(params.get("index"));
    // 위에서 만든 params 객체에서 index 값을 꺼냄
    // 문자열이니까 parseInt로 정수로 변환, index는 드라마의 인덱스를 나타냄
    // 예) detail.html?index=2 -> index=2
    
    console.log("불러온 index 값 :", index);
    // 불러온 인덱스를 콘솔에 출력하여 디버깅에 사용

    let dramas = JSON.parse(localStorage.getItem("dramas")) || [];
    // localStorage에서 "dramas" 항목을 가져옴
    // "dramas"를 배열로 변환, 없으면 빈 배열 사용

    console.log("현재 localStorage에 저장된 데이터 :", dramas);
    // 현재 저장된 드라마 목록을 콘솔에 출력하여 디버깅에 사용

    if (!isNaN(index) && dramas[index]) {
		    // isNan(index)는 index가 숫자가 아니면 true고 !를 붙였으니 숫자면 true
        // dramas[index]는 해당 인덱스에 드라마가 존재하는지 확인
        // 정상적인 index고, 해당 드라마가 있다면 아래 코드 실행
        
        document.getElementById("dramaTitle").value = dramas[index].title;
        // id가 "dramaTitle"인 요소(input 박스)에 해당 드라마의 제목 넣음
        
        document.getElementById("dramaContent").value = dramas[index].content;
        // id가 "dramaContent"인 요소(textarea)에 해당 드라마의 내용 넣음
    } else {
        // 인덱스가 유효하지 않거나 해당 드라마가 존재하지 않을 경우
        document.getElementById("dramaTitle").value = "존재하지 않는 드라마";
        // 제목 필드에 "존재하지 않는 드라마"라는 메시지 설정
        
        document.getElementById("dramaContent").value = "해당 드라마 정보가 없습니다.";
        // 내용 필드에 "해당 드라마 정보가 없습니다."라는 메시지 설정

        console.error("드라마 정보를 찾을 수 없음! index:", index, "dramas 배열:", dramas);
        // 오류 메시지를 콘솔에 출력하여 디버깅에 사용
    }
}

// 수정 버튼 클릭 시 수정 페이지로 이동
function editDrama() {
    // 드라마 수정 페이지로 이동하는 함수
    
    let params = new URLSearchParams(window.location.search);
    // URLSearchParams는 URL의 쿼리 문자열을 쉽게 조작할 수 있는 인터페이스
    // window.location.search는 현재 페이지의 URL에서 물음표(?) 뒤의 쿼리 문자열을 가져옴
    // 예를 들어, URL이 "detail.html?index=0"일 경우, params는 "index=0"을 포함
    // URLSearchParams은 저걸 쉽게 가져올 수 있게 도와줌
    
    let index = params.get("index"); // URL에서 index 가져오기
    // 위에서 만든 params 객체에서 index 값을 꺼냄
    // 문자열이니까 parseInt로 정수로 변환, index는 드라마의 인덱스를 나타냄
    // 예) detail.html?index=2 -> index=2

    if (index !== null) {
        // index가 null이 아닌 경우
        window.location.href = `edit.html?index=${index}`; // 수정 페이지로 이동
        // 수정 페이지로 이동하며 쿼리 문자열로 index를 전달
    } else {
        alert("수정할 드라마를 찾을 수 없습니다.");
        // index가 null인 경우 경고 메시지를 표시
    }
}

// 수정 페이지 로드 시 기존 데이터 불러오기
function loadEditData() {
    // 드라마 수정 페이지에서 기존 데이터를 불러오는 함수
    
    let params = new URLSearchParams(window.location.search);
    // URLSearchParams는 URL의 쿼리 문자열을 쉽게 조작할 수 있는 인터페이스
    // window.location.search는 현재 페이지의 URL에서 물음표(?) 뒤의 쿼리 문자열을 가져옴
    // 예를 들어, URL이 "detail.html?index=0"일 경우, params는 "index=0"을 포함
    // URLSearchParams은 저걸 쉽게 가져올 수 있게 도와줌
    
    let index = params.get("index");
    // 위에서 만든 params 객체에서 index 값을 꺼냄
    // 문자열이니까 parseInt로 정수로 변환, index는 드라마의 인덱스를 나타냄
    // 예) detail.html?index=2 -> index=2
    
    let dramas = JSON.parse(localStorage.getItem("dramas")) || [];
    // localStorage에서 드라마 목록을 가져오고 배열로 변환

    if (index !== null && dramas[index]) {
        // index가 null이 아니고 해당 인덱스의 드라마가 존재하는 경우
        document.getElementById("editTitle").value = dramas[index].title;
        // id가 "editTitle"인 요소(수정 제목 입력 필드)에 해당 드라마의 제목 설정
        
        document.getElementById("editContent").value = dramas[index].content;
        // id가 "editContent"인 요소(수정 내용 입력 필드)에 해당 드라마의 내용 설정
    } else {
        // 인덱스가 유효하지 않거나 해당 드라마가 존재하지 않을 경우
        alert("수정할 드라마 정보를 찾을 수 없습니다.");
        // 경고 메시지 표시
        
        window.location.href = "recommend.html"; // 목록 페이지로 이동
        // 목록 페이지로 리다이렉션
    }
}

// 수정 페이지가 열릴 때 기존 내용 불러오기
if (window.location.pathname.includes("edit.html")) {
    // 현재 페이지의 경로에 "edit.html"이 포함되어 있는 경우
    document.addEventListener("DOMContentLoaded", loadEditData);
    // 페이지가 로드되었을 때 loadEditData 함수를 호출하여 기존 데이터를 불러옴
}

// 수정 페이지에서 저장 버튼을 눌렀을 때 동작
function saveEdit() {
    // 드라마 수정 내용을 저장하는 함수
    
    let params = new URLSearchParams(window.location.search);
    // URLSearchParams는 URL의 쿼리 문자열을 쉽게 조작할 수 있는 인터페이스
    // window.location.search는 현재 페이지의 URL에서 물음표(?) 뒤의 쿼리 문자열을 가져옴
    // 예를 들어, URL이 "detail.html?index=0"일 경우, params는 "index=0"을 포함
    // URLSearchParams은 저걸 쉽게 가져올 수 있게 도와줌

    let index = params.get("index");
    // 위에서 만든 params 객체에서 index 값을 꺼냄
    // 문자열이니까 parseInt로 정수로 변환, index는 드라마의 인덱스를 나타냄
    // 예) detail.html?index=2 -> index=2

    let newTitle = document.getElementById("editTitle").value.trim();
    // id가 "editTitle"인 요소(수정 제목 입력 필드)의 값을 가져오고 앞뒤 공백을 제거
    
    let newContent = document.getElementById("editContent").value.trim();
    // id가 "editContent"인 요소(수정 내용 입력 필드)의 값을 가져오고 앞뒤 공백을 제거

    if (index !== null && newTitle && newContent) {
        // index가 null이 아니고 제목과 내용이 모두 입력되었는지 확인
        let dramas = JSON.parse(localStorage.getItem("dramas")) || [];
        // localStorage에서 드라마 목록을 가져오고 배열로 변환
        
        dramas[index] = { title: newTitle, content: newContent };
        // 해당 인덱스의 드라마 정보를 수정된 제목과 내용으로 업데이트
        
        localStorage.setItem("dramas", JSON.stringify(dramas));
        // localStorage에 업데이트된 드라마 목록을 저장

        alert("수정이 완료되었습니다!");
        // 수정 완료 메시지를 표시
        
        window.location.href = `detail.html?index=${index}`;
        // 수정된 드라마의 상세 페이지로 이동
    } else {
        alert("제목과 내용을 모두 입력해주세요.");
        // 제목이나 내용이 비어있을 경우 경고 메시지를 표시
    }
}

// 드라마 삭제
function deleteDrama() {
    // 드라마를 삭제하는 함수
    
    let params = new URLSearchParams(window.location.search);
    // URLSearchParams는 URL의 쿼리 문자열을 쉽게 조작할 수 있는 인터페이스
    // window.location.search는 현재 페이지의 URL에서 물음표(?) 뒤의 쿼리 문자열을 가져옴
    // 예를 들어, URL이 "detail.html?index=0"일 경우, params는 "index=0"을 포함
    // URLSearchParams은 저걸 쉽게 가져올 수 있게 도와줌
    
    let index = parseInt(params.get("index"));
    // 위에서 만든 params 객체에서 index 값을 꺼냄
    // 문자열이니까 parseInt로 정수로 변환, index는 드라마의 인덱스를 나타냄
    // 예) detail.html?index=2 -> index=2

    let dramas = JSON.parse(localStorage.getItem("dramas")) || [];
    // localStorage에서 "dramas" 항목을 가져옴
    // "dramas"를 배열로 변환, 없으면 빈 배열 사용
    
    if (confirm("정말 삭제하시겠습니까?")) {
		    // confitm : 확인/취소 버튼이 있는 팝업
        // 사용자가 삭제 확인 대화상자에 "확인"을 클릭한 경우
        dramas.splice(index, 1); 
        // 해당 인덱스의 드라마를 배열에서 삭제
        // index 위치의 요소부터 1개 삭제
        // 취소는 아무 일도 안 일어남
        
        localStorage.setItem("dramas", JSON.stringify(dramas));
        // localStorage에 업데이트된 드라마 목록을 문자열로 변환하여 저장
        
        alert("삭제가 완료되었습니다.");
        // 삭제 완료 메시지를 표시
        
        window.location.href = "recommend.html"; // 목록 페이지로 이동
        // 목록 페이지로 리다이렉션
    }
}

// 검색 기능
function searchDrama() {
    // 드라마를 검색하는 함수
    
    let query = document.getElementById("searchInput").value.toLowerCase();
    // id가 "searchInput"인 요소(검색 입력 필드)의 값을 가져오고 소문자로 변환
    // 사용자가 입력한 검색어를 소문자로 변환하여 대소문자 구분 없이 검색할 수 있도록 함
    
    let searchType = document.getElementById("searchType").value;
    // id가 "searchType"인 요소(검색 타입 선택 필드)의 값을 가져옴
    // 사용자가 선택한 검색 기준(예: 제목, 내용 등)을 저장
    
    let dramas = JSON.parse(localStorage.getItem("dramas")) || [];
    // localStorage에서 dramas 항목을 가져오고, 배열로 변환
    // 만약 dramas가 존재하지 않으면 빈 배열을 기본값으로 사용

    let filtered = []; // 필터링 변수 먼저 선언
    // 검색 결과를 저장할 빈 배열을 선언

    if (searchType === "all") {
        // 사용자가 "all"을 선택한 경우
        filtered = dramas.filter(drama => 
            // dramas 배열에서 각 드라마 객체를 필터링
            drama.title.toLowerCase().includes(query) || 
            // 드라마 제목이 검색어를 포함하는지 확인
            drama.content.toLowerCase().includes(query)
            // 드라마 내용이 검색어를 포함하는지 확인
        );
    } else {
        // "all" 이외의 검색 타입이 선택된 경우
        filtered = dramas.filter(drama => 
            // dramas 배열에서 해당 검색 타입의 속성을 필터링
            drama[searchType].toLowerCase().includes(query)
            // 선택된 속성(예: 제목 또는 내용)이 검색어를 포함하는지 확인
        );
    }

    console.log("검색된 결과:", filtered); // 검색된 결과 디버깅
    // 필터링된 결과를 콘솔에 출력하여 디버깅에 사용

    let list = document.getElementById("dramaList"); 
    // id가 "dramaList"인 요소(드라마 목록을 표시할 공간, ul 요소)를 가져와서 
    // list에 저장, list 변수는 ul태그 조작 가능

    
    list.innerHTML = ""; 
    // 이전 검색 결과를 지우기 위해 목록의 내용을 초기화
    // innerHTML : 요소의 안쪽 내용(자식 요소들)
    // ul 안에 있는 li 전부 지우겠다.

    filtered.forEach((drama, index) => {
        // 필터링된 드라마 목록을 반복하여 처리
        
        let li = document.createElement("li");
        // 새로운 리스트 항목(li)을 생성
        
        li.innerHTML = `<strong>${drama.title}</strong>`;
        // 드라마 제목을 강한 텍스트(<strong>)로 감싸서 리스트 항목에 추가
        
        li.style.cursor = "pointer"; 
        // 마우스 커서를 포인터로 변경하여 사용자가 클릭할 수 있음을 나타냄냄
        
        li.addEventListener("click", () => {
            // 리스트 항목을 클릭할 경우 실행될 함수
            window.location.href = `detail.html?index=${index}`;
            // 클릭한 드라마의 상세 페이지로 이동
            // 여기서 index는 필터링된 드라마의 인덱스
        });
        
        list.appendChild(li);
        // 생성한 li 요소를 드라마 목록에 추가
    });
}