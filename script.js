// 방명록에 새로운 항목을 추가하는 함수 정의
function addGuestbookEntry() {
    let input = document.getElementById("guestbookInput"); // id가 "guestbookInput"인 요소(입력창)를 가져옴
    let list = document.getElementById("guestbookList"); // id가 "guestbookList"인 요소(방명록 목록)를 가져옴

    if (input.value.trim() !== "") { // 사용자가 입력한 값이 공백이 아닐 때만 실행 (trim()을 사용하여 공백 제거)
        let newEntry = document.createElement("li"); // 새로운 리스트 항목(li 태그)을 생성
        newEntry.textContent = input.value; // 생성한 li 요소에 입력창의 내용을 텍스트로 추가
        list.appendChild(newEntry); // 방명록 목록(ul)에 새로운 li 항목 추가

        let entries = JSON.parse(localStorage.getItem("guestbook")) || []; // 기존에 저장된 방명록 데이터를 가져오거나 빈 배열을 생성
        entries.push(input.value); // 새롭게 입력된 내용을 배열에 추가
        localStorage.setItem("guestbook", JSON.stringify(entries)); // 데이터를 문자열(JSON 형식)로 변환하여 로컬스토리지에 저장

        input.value = ""; // 입력창을 비움 (초기화)
    }
}

// 페이지가 로드될 때 방명록 데이터를 불러오는 기능
window.onload = function() {
    let list = document.getElementById("guestbookList"); // 방명록 목록을 가져옴
    let entries = JSON.parse(localStorage.getItem("guestbook")) || []; // 로컬스토리지에서 데이터를 가져오거나 빈 배열을 설정
    entries.forEach(entry => { // 저장된 방명록 데이터를 반복하여 화면에 추가
        let newEntry = document.createElement("li"); // 새로운 리스트 항목(li 태그) 생성
        newEntry.textContent = entry; // 저장된 데이터를 li 요소의 텍스트로 설정
        list.appendChild(newEntry); // 방명록 목록(ul)에 추가
    });
};