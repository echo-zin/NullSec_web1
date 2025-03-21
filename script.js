console.log("script.js 정상 로드");
// console.log() : 개발자가 자신의 코드에서 발생하는 이벤트나 상태를 관찰할 수 있도록 메시지를 콘솔에 출력하는 역할
// "script.js 정상 로드"라는 메시지를 출력하여 스크립트가 정상적으로 로드되었음을 알림

document.addEventListener("DOMContentLoaded", () => {
    // document.addEventListener() : 특정 이벤트가 발생했을 때 호출되는 함수 등록
    // "DOMContentLoaded" 이벤트에 대한 리스너를 추가
    // 이 이벤트는 HTML 문서의 초기 DOM이 완전히 로드되고, 모든 요소가 생성된 후에 발생함
    // 따라서 이후의 코드에서 HTML 요소를 안전하게 조작할 수 있음
    
    if (document.getElementById("dramaList")) {
        // document.getElementById() : 주어진 id를 가진 요소를 반환
        // 만약 "dramaList"라는 id를 가진 요소가 존재한다면,
        // true를 반환하며 loadDramas() 함수를 호출하여 드라마 목록을 불러옴
        loadDramas(); // 드라마 목록을 불러오는 함수를 실행
    }
    
    if (window.location.pathname.includes("detail.html")) {
        // window.location.pathname : 현재 문서의 URL 경로를 가져옴
        // includes() : 특정 문자열이 포함되어 있는지 확인하는데 사용됨
        // 만약 현재 URL 경로에 "detail.html"이 포함되어 있다면, loadDetail() 함수를 호출하여 상세 정보를 로드함
        loadDetail(); // 드라마의 상세 정보를 불러오는 함수를 호출
    }

    const title = document.querySelector("h1"); 
    // document.querySelector() : CSS 선택자를 사용하여 문서에서 첫 번째 요소를 선택
    // 여기서는 첫 번째 <h1> 요소를 선택하여 title 변수에 저장
    
    if (title) {
        // title 요소가 존재하는 경우
        title.addEventListener("click", () => {
            // addEventListener() : 특정 이벤트(여기서는 "click")에 대한 리스너를 추가
            // 사용자가 해당 요소를 클릭했을 때 아래의 함수를 실행
            window.location.href = "index.html"; 
            // window.location.href : 현재 페이지의 URL을 가져오거나 설정
            // 이를 통해 "index.html" 페이지로 리다이렉션하여 홈 페이지로 이동
        });
    }
});

// 드라마 목록 불러오기 함수 정의
async function loadDramas() {
    console.log("드라마 목록 불러오기 실행"); 
    // 드라마 목록을 불러오는 기능이 시작될 때, 시작을 알리는 메시지를 콘솔에 출력

    try { // 오류 처리를 위해 사용, try에 오류 발생하면 catch에서 처리
        let response = await fetch("http://127.0.0.1:5000/get-dramas");
        // fetch() : 네트워크 요청을 수행하여 서버에서 데이터를 가져오는 데 사용
        // 여기서는 지정된 URL(서버에서 드라마 목록을 제공하는 엔드포인트)로 
        // GET 요청을 보내 드라마 목록을 가져옴
        
        let dramas = await response.json();
        // fetch()의 응답은 JSON 형식 
        // .json() 메서드를 통해 JS 형식으로 변환하여 드라마 목록을 가져옴
        // 이 데이터는 드라마 제목, 내용을 포함

        let list = document.getElementById("dramaList");
        // id가 "dramaList"인 HTML 요소를 가져와서 드라마 목록을 표시할 공간을 마련
        // id="dramaList" : 드라마 목록을 표시할 ul
        // list 변수는 이 요소를 가리키며, 이곳에 드라마 목록을 동적으로 추가
        
        let emptyMessage = document.getElementById("emptyMessage"); 
        // id가 "emptyMessage"인 요소를 가져옴
        // 드라마가 존재하지 않을 경우 사용자에게 표시할 메시지를 포함
        
        list.innerHTML = ""; 
        // innerHTML : 해당 요소의 내용을 설정하거나 반환할 수 있음
        // 이 경우, 리스트의 내용을 비우기 위해 빈 문자열("")로 설정
        // list(ul) 안에 있는 내용(li)를 전부 비움

        if (dramas.length === 0) {
            // dramas 배열의 길이가 0이라면 즉, 드라마가 없는 경우
            emptyMessage.style.display = "block"; 
            // emptyMessage의 style.display 속성을 
            // "block"으로 변경하여 메시지를 화면에 표시
        } else {
            emptyMessage.style.display = "none"; 
            // 드라마가 있을 경우, emptyMessage를 숨기기 위해 
            // display 속성을 "none"으로 설정
            dramas.forEach((drama) => {
                // forEach() : 배열의 각 요소에 대해 제공된 함수를 실행, 
                // drama 배열의 각 드라마 객체에 대해 반복
                let li = document.createElement("li");
                // document.createElement() : 지정된 태그 이름의 새로운 요소를 생성
                // 여기서는 새로운 <li> 요소를 생성하여 li 변수를 선언

                li.innerHTML = `<strong>${drama.title}</strong>`;
                // innerHTML : 사용하여 리스트 항목에 드라마 제목을 추가
                // <strong> 태그를 사용해 제목을 강조하여 시각적으로 더 돋보이게 함
                        
                li.style.cursor = "pointer"; 
                // style.cursor : 마우스 커서의 모양을 변경
                // "pointer"로 설정하여 사용자가 해당 항목을 클릭할 수 있음을 알려줌
                
                li.addEventListener("click", () => {
                    // 클릭했을 때 이벤트 발생할 이벤트 리스너 등록
                    // 아래는 실행할 함수
                    window.location.href = `detail.html?id=${drama.id}`; 
                    // 클릭 시 해당 드라마의 상세 페이지로 리다이렉션하고, 
                    // 드라마의 id를 쿼리 문자열로 추가하여 전달
                    // drama.id : 해당 드라마의 고유 id, 이를 URL 파라미터로 전달하면
                    // 해당 드라마 식별 가능
                });
                
                list.appendChild(li);
                // appendChild() : 생성한 li 요소를 dramaList(ul)에 추가하여 
                // 드라마 목록으로 표시
            });
        }
    } catch (error) {
        console.error("드라마 목록 불러오기 실패:", error);
        // 오류 발생 시 오류 메시지를 콘솔에 출력
        // try-catch 블록을 통해 비동기 함수 내에서 발생할 수 있는 오류 처리
    }
}

// 드라마 추가 함수 정의
async function addDrama() {
    let title = document.getElementById("dramaTitle").value.trim();
    // id가 "dramaTitle"인 입력 필드에서 값을 가져와서 trim() 메서드로 앞뒤 공백을 제거
    // 빈 제목이 입력되지 않도록 하기 위한의 검사

    let content = document.getElementById("dramaContent").value.trim();
    // id가 "dramaContent"인 입력 필드에서 값을 가져오고
    // trim() 메서드를 사용하여 앞뒤 공백 제거
    // 빈 내용이 입력되지 않도록 하기 위한의 검사

    // 제목 또는 내용이 비어있을 경우 사용자에게 경고 메시지를 표시하고, 함수의 실행을 중지
    if (!title || !content) {
    // !title : 제목이 비거나 공백만 입력되면 true, !content : 마찬가지
        alert("제목과 내용을 모두 입력해주세요!");
        // 사용자가 입력하지 않은 경우 경고 대화상자를 띄워 알림
        return; // 함수 실행 종료
    }

    try {
        let response = await fetch("http://127.0.0.1:5000/add-drama", {
            // fetch() : 데이터를 POST 요청을 통해 서버에 전송하는 데 사용
            // 드라마 제목과 내용을 서버로 POST 요청을 보내는데 사용
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            // 서버에 전송할 데이터가 JSON 형식임을 알려줌
            body: JSON.stringify({ title, content }) 
            // 요청 본문에 담길 데이터
            // title과 content를 객체로 묶어 JSON 문자열로 변환하여 전송
        });

        let result = await response.json();
        // 서버의 응답 데이터를 JSON 형식으로 변환하여 result 변수에 저장

				// response.ok : 응답 상태가 200이면 true, 그 외는 false
        if (response.ok) {
            alert("드라마가 추가되었습니다!"); // 추가 성공 메시지 표시
            console.log("추가된 드라마 ID:", result.id); // 추가된 드라마 ID를 콘솔에 출력
            window.location.href = `detail.html?id=${result.id}`; 
            // 상세 페이지로 리다이렉션
            // result.id는 추가된 드라마의 id를 담고 있고 이를 URL의 쿼리로 넘겨줌
        } else {
            alert(`추가 실패: ${result.error}`); 
            // 추가 실패할 경우 사용자에게 메시지를 표시
        }
    } catch (error) {
        console.error("드라마 추가 실패:", error); 
        // 에러 발생 시 콘솔에 오류 메시지를 출력
        alert("드라마 추가 중 오류가 발생했습니다."); 
        // 오류 발생 시 사용자에게 알림 대화상자를 표시
    }
}

// 드라마 상세 보기 함수 정의
async function loadDetail() {
    let params = new URLSearchParams(window.location.search);
    // URLSearchParams : URL 쿼리 문자열에서 매개변수를 쉽게 다룰 수 있음
    // window.location.search는 현재 문서의 쿼리 문자열을 가져옴
    // 예) URL이 detail.html?id=123이라면 ?뒤부터인 ?id=123을 가져옴
    
    let id = params.get("id"); // URL에서 id 매개변수를 추출
    // 예) URL이 detail.html?id=123이라면 id는 123, id는 고유 id

    try {
        let response = await fetch(`http://127.0.0.1:5000/get-drama/${id}`);
        // 해당 ID의 드라마에 대한 GET 요청을 서버에 보냄
        // ${id}는 동적으로 id 값에 해당하는 드라마의 상세 정보를 요청하기 위한 URL
        // 예) id가 "123"이라면 fetch("123")과 같이 요청을 보냄
        
        if (!response.ok) throw new Error("데이터를 찾을 수 없음"); 
        // 응답 상태가 성공적이지 않은 경우 에러를 던져 처리
        
        let drama = await response.json(); 
        // 응답을 JS 형식으로 변환하여 드라마의 세부 정보를 가질 drama를 가져옴

        document.getElementById("dramaTitle").value = drama.title;
        // id가 dramaTitle인 요소를 드라마 제목을 제목 입력 필드에 설정

        document.getElementById("dramaContent").value = drama.content;
        // id가 dramaContent인 드라마 내용을 내용 입력 필드에 설정
    } catch (error) {
        // 에러 발생 시 아래 블록으로 이동
        document.getElementById("dramaTitle").value = "존재하지 않는 드라마";
        document.getElementById("dramaContent").value = "해당 드라마 정보가 없습니다.";
        // 해당 드라마와 관련된 정보가 없음을 입력 필드에 알리는 문구를 표시
        
        console.error("드라마 상세 불러오기 오류:", error);
        // 발생한 오류 메시지를 콘솔에 출력
    }
}

// 드라마 수정 함수 정의
function editDrama() {
// 드라마 수정 페이지로 이동하는 함수

    let params = new URLSearchParams(window.location.search);
    // URLSearchParams는 URL의 쿼리 문자열을 쉽게 조작할 수 있는 인터페이스
    // window.location.search는 현재 페이지의 URL에서 물음표(?) 뒤의 쿼리 문자열을 가져옴
    // 예를 들어, URL이 "edit.html?id=123"일 경우, params는 "id=123"을 포함
    // URLSearchParams은 저걸 쉽게 가져올 수 있게 도와줌

    let id = params.get("id"); // URL에서 드라마 ID를 추출
    // 위에서 만든 params 객체에서 id 값을 꺼냄
    // 문자열이니까 parseInt로 정수로 변환, index는 드라마의 인덱스를 나타냄
    // 예) edit.html?id=123 -> id=123

    window.location.href = `edit.html?id=${id}`; 
    // 수정하기 위한 edit.html 페이지로 이동하며 해당 ID를 쿼리 문자열로 추가
}

// 수정 페이지에서 기존 데이터 불러오기 함수 정의
async function loadEditData() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id"); // URL에서 수정할 드라마 ID를 가져옴
		// 예) URL이 detail.html?id=123이라면 id는 123, id는 고유 id

    if (!id) { // URL에 id 파라미터가 없거나 잘못된 값일 경우 오류 발생 시킴
        alert("수정할 드라마 ID를 찾을 수 없습니다."); // 없으면 메시지 표시하고
        window.location.href = "recommend.html"; // 목록 페이지로 이동함
        return; // 수정할 ID가 없으면 함수 종료
    }

    try {
        let response = await fetch(`http://127.0.0.1:5000/get-drama/${id}`);
        // 해당 ID의 드라마에 대한 GET 요청을 서버에 보냄
        // ${id}는 동적으로 id 값에 해당하는 드라마의 상세 정보를 요청하기 위한 URL
        // 예) id가 "123"이라면 fetch("123")과 같이 요청을 보냄
        
        // response.ok : 응답 상태가 200이면 true, 그 외는 false
        if (!response.ok) {
            throw new Error("드라마 정보를 찾을 수 없습니다."); 
            // 상태가 좋지 않으면 에러 표시
        }

        let drama = await response.json(); 
        // 응답을 JS 형식으로 변환하여 드라마 정보를 가져옴

        document.getElementById("editTitle").value = drama.title; 
        // id가 editTitle을 찾아 기존 드라마 제목을 편집 필드에 넣음
        document.getElementById("editContent").value = drama.content; 
        // id가 editContent를 찾아 기존 드라마 내용을 편집 필드에 넣음
    } catch (error) {
        console.error("드라마 데이터 불러오기 실패:", error); 
        // 오류 발생 시 콘솔에 오류 메시지를 출력
        alert("드라마 정보를 불러오는 중 오류가 발생했습니다."); // 사용자에게 오류 알리고
        window.location.href = "recommend.html"; // 목록 페이지로 이동함
    }
}

// 수정 페이지가 열릴 때 기존 내용 불러오기
if (window.location.pathname.includes("edit.html")) {
    // 현재 페이지의 경로에 "edit.html"이 포함되어 있는 경우에만 아래 실행
    document.addEventListener("DOMContentLoaded", loadEditData);
    // 페이지가 로드되면 loadEditData 함수를 호출하여 기존 데이터를 불러옴
}

// 수정 저장 함수 정의
async function saveEdit() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id"); // 수정할 드라마의 ID를 가져옴
    // 예) URL이 detail.html?id=123이라면 id는 123, id는 고유 id

    let newTitle = document.getElementById("editTitle").value.trim(); 
    // id가 editTitle을 찾아 수정하려는 새 제목을 입력받음 
    // 공백 제거해 오류 방지
    let newContent = document.getElementById("editContent").value.trim(); 
    // id가 editContent을 찾아 수정하려는 새 내용을 입력받음 
    // 공백 제거해 오류 방지

    if (!newTitle || !newContent) {
        alert("제목과 내용을 모두 입력해주세요."); 
        // 제목과 내용이 비어있을 경우 경고 메시지 표시
        return; // 함수 종료
    }

    try {
        let response = await fetch(`http://127.0.0.1:5000/edit-drama/${id}`, {
        // 서버에 put 요청을 보내 수정된 제목과 내용을 서버에 저장
        // id에 해당하는 드라마의 정보를 수정하는 요청 보냄 
            method: "PUT", // PUT 메서드 사용하여 기존 데이터 수정
            headers: { "Content-Type": "application/json" }, // 요청 데이터의 형식 설정
            body: JSON.stringify({ title: newTitle, content: newContent }), 
            // 수정된 데이터를 JSON 형식으로 변환하여 포함
            // 서버는 이 데이터 받아 수정 작업 진행
        });

				// response.ok : 응답 상태가 200이면 true, 그 외는 false
        if (response.ok) {
            alert("수정이 완료되었습니다!"); // 수정 성공 메시지 표시
            window.location.href = `detail.html?id=${id}`; 
            // 수정된 드라마의 상세 페이지로 리다이렉션하여 수정된 정보 확인
        } else {
            alert("수정 실패"); // 수정이 실패했을 경우 사용자에게 알림
        }
    } catch (error) {
        console.error("수정 오류:", error); // 오류 발생 시 메시지를 콘솔에 출력
        alert("수정 중 오류 발생"); // 사용자에게 오류 알림
    }
}

// 드라마 삭제 함수 정의
async function deleteDrama() {
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id"); // 삭제할 드라마 ID를 가져옴
    // 예) URL이 detail.html?id=123이라면 id는 123, id는 고유 id

    if (!confirm("정말 삭제하시겠습니까?")) return; 
    // 사용자에게 확인 대화상자를 표시하고 취소 시 종료

    try {
        let response = await fetch(`http://127.0.0.1:5000/delete-drama/${id}`, {
            method: "DELETE", // DELETE 메서드를 사용하여 삭제 요청을 보냄
            headers: { "Content-Type": "application/json" } // 요청 데이터의 형식을 JSON으로 설정
        });

        // response.ok : 응답 상태가 200이면 true, 그 외는 false
        if (response.ok) {
            alert("삭제가 완료되었습니다!"); // 삭제 성공 메시지 표시
            window.location.href = "recommend.html"; // 목록 페이지로 이동
        } else {
            let errorMsg = await response.json(); 
            // 실패한 경우 에러 메시지를 JS 형식으로 받아옴, 삭제 실패 원인 포함
            alert(`삭제 실패: ${errorMsg.error}`); // 삭제 실패 시 에러 메시지 표시
        }
    } catch (error) {
        console.error("삭제 오류:", error); // 오류 발생 시 메시지를 콘솔에 출력
        alert("삭제 중 오류 발생"); // 사용자에게 오류 알림
    }
}

// 검색 함수 정의
async function searchDrama() {
    let query = document.getElementById("searchInput").value.toLowerCase(); 
    // document.getElementById : id가 "searchInput"인 입력 필드에서 값을 가져 
    // .toLowerCase() : 대소문자를 무시하기 위해 소문자로 변환
    // 사용자가 입력한 검색어를 소문자로 변환하여 대소문자 구분 없이 검색할 수 있도록 함

    let searchType = document.getElementById("searchType").value; 
    // id가 "searchType"인 드롭다운 메뉴에서 선택된 검색 타입의 값을 가져옴

    try {
        let response = await fetch("http://127.0.0.1:5000/get-dramas");
        // 드라마 목록을 서버에서 가져오기 위해 GET 요청을 보냄
        // fetch : 서버에 네트워크 요청 보내고 응답 받는 함수
        // 비동기 함수이므로 await 사용하여 요청이 완료될 때까지 기다림
        // 받은 응답을 response에 저장

        let dramas = await response.json(); 
        // 응답 데이터를 JS 객체로 변환하여 dramas에 저장

        let filtered = dramas.filter((drama) => {
            // filter() 메서드는 주어진 조건을 만족하는 요소만으로 새로운 배열 drama 생성
            if (searchType === "all") {
                // 검색 타입이 "all"인 경우 (제목과 내용 모두 검색)
                return (
                    drama.title.toLowerCase().includes(query) || 
                    // 제목에 쿼리가 포함되는지 확인
                    drama.content.toLowerCase().includes(query) 
                    // 내용에 쿼리가 포함되는지 확인
                );
            } else {
                // 특정 필드에 대해 검색하는 경우 (제목 또는 내용만)
                return drama[searchType].toLowerCase().includes(query); 
                // 해당 필드에서 쿼리가 포함되는지 확인
                // 쿼리 : 질문이나 요청, 검색어나 필터링 조건
            }
        });

        let list = document.getElementById("dramaList"); 
        // id가 "dramaList"인 요소(여기서는 <ul> 요소)를 가져옴
        list.innerHTML = ""; // 이전 검색 결과를 비움
        // ul 안에 있는 li를 모두 비움

        filtered.forEach((drama) => {
            // forEach : filter() 메서드로 반환된 배열 drama를 하나씩 반복
            let li = document.createElement("li"); // 새로운 <li> 요소를 생성

            li.innerHTML = `<strong>${drama.title}</strong>`; 
            // li.innerHTML : 생성한 li 요소의 HTML 내용 설정
            // 드라마 제목을 가져와 strong으로 강조하여 리스트 항목에 추가
            li.style.cursor = "pointer"; 
            // 제목 외에 리스트 칸을 클릭 가능하게 만들기 위해
            // 커서를 포인터로 설정하여 클릭 가능한 요소임을 표시
            li.addEventListener("click", () => {
                window.location.href = `detail.html?id=${drama.id}`; 
                // addEventListener("click", ...) : 사용자가 클릭했을 때 실행할 함수 등록
                // window.location.href = `detail.html?id=${drama.id}`; : 
                // drama.id에 해당하는 드라마의 ID를 
                // detail.html페이지의 URL 파라미터로 전달하여 상세 페이지로 이동
                // id가 URL에 포함되어 해당 드라마를 구별할 수 있게 됨
                // 클릭 시 해당 드라마의 상세 페이지로 리다이렉션
            });
            list.appendChild(li); // 생성한 li 요소를 dramaList에 추가
        });
    } catch (error) {
        console.error("검색 실패:", error); // 오류 발생 시 메시지를 콘솔에 출력
    }
}