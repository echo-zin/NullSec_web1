console.log("script.js 정상 로드");

function goHome() {
  window.location.href = "recommend.html";
}

document.addEventListener("DOMContentLoaded", async () => {
  console.log("DOMContentLoaded 실행됨");

  // 로그인 상태 확인
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    const user = JSON.parse(storedUser);
    showUserInfo(user);
  }

  if (document.getElementById("dramaList")) {
    await loadDramas();
  }

  if (window.location.pathname.includes("detail.html")) {
    await loadDetail();
  }

  if (window.location.pathname.includes("edit.html")) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      alert("잘못된 접근입니다.");
      window.location.href = "recommend.html";
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:5000/get-drama/${id}`);
      const drama = await response.json();

      document.getElementById("editTitle").value = drama.title;
      document.getElementById("editContent").value = drama.content;

      if (drama.filename) {
        const fileLabel = document.createElement("p");
        fileLabel.textContent = `기존 파일: ${drama.filename}`;
        document.getElementById("editForm").prepend(fileLabel);
      }

      const secretCheckbox = document.getElementById("editIsSecret");
      const passwordInput = document.getElementById("editSecretPassword");

      secretCheckbox.checked = drama.is_secret;
      passwordInput.style.display = drama.is_secret ? "block" : "none";
      passwordInput.value = drama.password || "";

      secretCheckbox.addEventListener("change", () => {
        passwordInput.style.display = secretCheckbox.checked ? "block" : "none";
      });

      const form = document.getElementById("editForm");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        try {
          const res = await fetch(`http://127.0.0.1:5000/edit-drama/${id}`, {
            method: "POST",
            body: formData
          });
          const result = await res.json();
          if (res.ok) {
            alert("수정 완료!");
            window.location.href = `detail.html?id=${id}`;
          } else {
            alert("수정 실패: " + result.error);
          }
        } catch (err) {
          console.error("수정 요청 실패:", err);
          alert("수정 중 오류가 발생했습니다.");
        }
      });
    } catch (err) {
      console.error("드라마 불러오기 실패:", err);
      alert("데이터를 불러올 수 없습니다.");
    }
  }

  if (window.location.pathname.includes("create.html")) {
    const createForm = document.getElementById("createForm");
  
    // ✅ 로그인 사용자 가져오기
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      alert("로그인 후 이용 가능한 기능입니다.");
      window.location.href = "recommend.html";
      return;
    }
    const user = JSON.parse(storedUser);
    document.getElementById("hiddenUserId").value = user.id;
  
    // ✅ 비밀글 체크박스 제어
    const secretCheckbox = document.getElementById("isSecret");
    const passwordInput = document.getElementById("secretPassword");
    passwordInput.style.display = "none";
    secretCheckbox.addEventListener("change", () => {
      passwordInput.style.display = secretCheckbox.checked ? "block" : "none";
    });
  
    // ✅ 폼 제출 핸들러
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = new FormData(createForm);
      const title = formData.get("title")?.trim();
      const content = formData.get("content")?.trim();
      const isSecret = formData.get("is_secret") === "on";
      const password = formData.get("password");
  
      if (!title || !content) {
        alert("제목과 내용을 모두 입력해주세요!");
        return;
      }
  
      if (isSecret && !password) {
        alert("비밀글 비밀번호를 입력해주세요!");
        return;
      }
  
      try {
        const response = await fetch("http://127.0.0.1:5000/add-drama", {
          method: "POST",
          body: formData
        });
  
        const result = await response.json();
        if (response.ok) {
          alert("드라마가 추가되었습니다!");
          window.location.href = `detail.html?id=${result.id}`;
        } else {
          alert("등록 실패: " + result.error);
        }
      } catch (err) {
        console.error("등록 요청 실패:", err);
        alert("등록 중 오류가 발생했습니다.");
      }
    });
  }  

  // h1 클릭 시 홈으로 이동
  const title = document.querySelector("h1");
  if (title) {
    title.addEventListener("click", () => {
      goHome();
    });
  }

  // 회원가입 처리
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    const profileInput = document.getElementById("signupProfileImage");
    const previewImage = document.getElementById("previewImage");

    if (profileInput) {
      profileInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            previewImage.src = ev.target.result;
            previewImage.style.display = "block";
          };
          reader.readAsDataURL(file);
        } else {
          previewImage.src = "";
          previewImage.style.display = "none";
        }
      });
    }

    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(signupForm);
      try {
        const response = await fetch("http://127.0.0.1:5000/signup", {
          method: "POST",
          body: formData
        });
        const result = await response.json();
        if (response.ok) {
          alert("회원가입 성공!");
          window.location.href = "recommend.html";
        } else {
          alert("회원가입 실패: " + result.error);
        }
      } catch (error) {
        console.error("회원가입 요청 실패:", error);
        alert("회원가입 중 오류가 발생했습니다.");
      }
    });
  }
});



  async function loadUserEditData(userId) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/user/${userId}`);
      if (!response.ok) throw new Error("사용자 정보를 가져올 수 없습니다.");
      const user = await response.json();
      document.getElementById("editName").value = user.name || "";
      document.getElementById("editSchool").value = user.school || "";
      const previewImg = document.getElementById("editPreviewImage");
      if (user.profile_image) {
        previewImg.src = `http://127.0.0.1:5000/uploads/${user.profile_image}`;
        previewImg.style.display = "block";
      } else {
        previewImg.style.display = "none";
      }
    } catch (error) {
      console.error("사용자 정보 불러오기 실패:", error);
      alert("사용자 정보를 불러오는 중 오류가 발생했습니다.");
      window.location.href = "recommend.html";
    }
  }


// ---------------- 공통 기능 함수들 ----------------

async function loadDramas() {
  console.log("드라마 목록 불러오기 실행");
  try {
    const response = await fetch("http://127.0.0.1:5000/get-dramas");
    const dramas = await response.json();
    const list = document.getElementById("dramaList");
    const emptyMessage = document.getElementById("emptyMessage");
    list.innerHTML = "";
    if (dramas.length === 0) {
      emptyMessage.style.display = "block";
    } else {
      emptyMessage.style.display = "none";
      dramas.forEach((drama) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${drama.title}${drama.is_secret ? " 🔐" : ""}</strong>`;
        li.style.cursor = "pointer";
        li.addEventListener("click", () => {
          window.location.href = `detail.html?id=${drama.id}`;
        });
        list.appendChild(li);
      });
    }
  } catch (error) {
    console.error("드라마 목록 불러오기 실패:", error);
  }
}

async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  let drama;

  try {
    const response = await fetch(`http://127.0.0.1:5000/get-drama/${id}`);
    if (!response.ok) throw new Error("데이터를 찾을 수 없음");
    drama = await response.json();

    if (drama.is_secret) {
      const inputPw = prompt("이 글은 비밀글입니다. 비밀번호를 입력하세요:");
      const verifyResponse = await fetch("http://127.0.0.1:5000/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, password: inputPw })
      });

      if (!verifyResponse.ok) {
        alert("비밀번호가 틀렸거나 접근할 수 없습니다.");
        window.location.href = "recommend.html";
        return;
      }
    }

    // 제목과 내용 표시
    document.getElementById("dramaTitle").value = drama.title;
    document.getElementById("dramaContent").value = drama.content;

    // 작성자 정보 불러오기
    if (drama.user_id) {
      try {
        const userResponse = await fetch(`http://127.0.0.1:5000/user/${drama.user_id}`);
        if (userResponse.ok) {
          const user = await userResponse.json();
          const authorSpan = document.getElementById("dramaAuthor");
          authorSpan.textContent = user.name || "알 수 없음";
          authorSpan.style.fontWeight = "bold";
          authorSpan.style.cursor = "pointer";
    
          // ✅ 작성자 이름 클릭 시 프로필 보기로 이동
          authorSpan.addEventListener("click", () => {
            window.location.href = `user_profile_readonly.html?id=${user.id}`;
          });
    
          // ✅ 로그인한 사용자와 작성자가 같은지 확인해서 버튼 표시 제어
          const storedUser = localStorage.getItem("user");
          const currentUser = storedUser ? JSON.parse(storedUser) : null;
          const buttonGroup = document.querySelector(".button-group");
    
          if (!currentUser || currentUser.id !== user.id) {
            // 작성자가 아니면 버튼 숨기기
            if (buttonGroup) buttonGroup.style.display = "none";
          }
    
        }
      } catch (err) {
        console.error("작성자 정보 불러오기 실패:", err);
      }
    }
    

    // 첨부파일 다운로드
    if (drama.filename) {
      const downloadLink = document.getElementById("fileDownload");
      downloadLink.href = `http://127.0.0.1:5000/uploads/${drama.filename}`;
      downloadLink.setAttribute("download", drama.filename);

      // ✅ 원래 파일 이름만 보여주기
      const originalName = drama.filename.substring(drama.filename.indexOf('_') + 1);
      downloadLink.textContent = originalName;

      downloadLink.style.display = "inline-block";
    }
  } catch (error) {
    document.getElementById("dramaTitle").value = "존재하지 않는 드라마";
    document.getElementById("dramaContent").value = "해당 드라마 정보가 없습니다.";
    console.error("드라마 상세 불러오기 오류:", error);
  }
}

function editDrama() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  window.location.href = `edit.html?id=${id}`;
}

async function loadEditData() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id) {
    alert("수정할 드라마 ID를 찾을 수 없습니다.");
    window.location.href = "recommend.html";
    return;
  }
  try {
    const response = await fetch(`http://127.0.0.1:5000/get-drama/${id}`);
    if (!response.ok) throw new Error("드라마 정보를 찾을 수 없습니다.");
    const drama = await response.json();
    document.getElementById("editTitle").value = drama.title;
    document.getElementById("editContent").value = drama.content;
  } catch (error) {
    console.error("드라마 데이터 불러오기 실패:", error);
    alert("드라마 정보를 불러오는 중 오류가 발생했습니다.");
    window.location.href = "recommend.html";
  }
}

async function saveEdit() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const newTitle = document.getElementById("editTitle").value.trim();
  const newContent = document.getElementById("editContent").value.trim();
  if (!newTitle || !newContent) {
    alert("제목과 내용을 모두 입력해주세요.");
    return;
  }
  try {
    const response = await fetch(`http://127.0.0.1:5000/edit-drama/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, content: newContent })
    });
    if (response.ok) {
      alert("수정이 완료되었습니다!");
      window.location.href = `detail.html?id=${id}`;
    } else {
      alert("수정 실패");
    }
  } catch (error) {
    console.error("수정 오류:", error);
    alert("수정 중 오류 발생");
  }
}

async function deleteDrama() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const response = await fetch(`http://127.0.0.1:5000/delete-drama/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    if (response.ok) {
      alert("삭제가 완료되었습니다!");
      window.location.href = "recommend.html";
    } else {
      const errorMsg = await response.json();
      alert(`삭제 실패: ${errorMsg.error}`);
    }
  } catch (error) {
    console.error("삭제 오류:", error);
    alert("삭제 중 오류 발생");
  }
}

async function searchDrama() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const searchType = document.getElementById("searchType").value;
  try {
    const response = await fetch("http://127.0.0.1:5000/get-dramas");
    const dramas = await response.json();
    const filtered = dramas.filter((drama) => {
      if (searchType === "all") {
        return drama.title.toLowerCase().includes(query) ||
               drama.content.toLowerCase().includes(query);
      } else {
        return drama[searchType].toLowerCase().includes(query);
      }
    });
    const list = document.getElementById("dramaList");
    list.innerHTML = "";
    filtered.forEach((drama) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${drama.title}${drama.is_secret ? " 🔐" : ""}</strong>`;
      li.style.cursor = "pointer";
      li.addEventListener("click", () => {
        window.location.href = `detail.html?id=${drama.id}`;
      });
      list.appendChild(li);
    });
  } catch (error) {
    console.error("검색 실패:", error);
  }
}

// ---------------- 로그인 관련 기능 ----------------
async function portalLogin() {
  const id = document.getElementById("loginId").value.trim();
  const pw = document.getElementById("loginPw").value.trim();
  if (!id || !pw) {
    alert("아이디와 비밀번호를 모두 입력해주세요.");
    return;
  }
  try {
    const response = await fetch("http://127.0.0.1:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, password: pw })
    });
    const result = await response.json();
    if (response.ok) {
      alert("로그인 성공!");
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));
      showUserInfo(user);
    } else {
      alert(`로그인 실패: ${result.error}`);
    }
  } catch (error) {
    console.error("로그인 요청 실패:", error);
    alert("로그인 중 오류가 발생했습니다.");
  }
}

function showUserInfo(user) {
  const sideLoginBox = document.getElementById("sideLoginBox");
  const userInfoBox = document.getElementById("userInfoBox");
  const userName = document.getElementById("userName");
  const profilePic = document.getElementById("profilePic");

  // 요소 중 하나라도 없으면 함수 종료
  if (!sideLoginBox || !userInfoBox || !userName || !profilePic) {
    console.warn("로그인 UI 요소가 없어서 showUserInfo 실행 중단됨");
    return;
  }

  sideLoginBox.style.display = "none";
  userInfoBox.style.display = "block";
  userName.textContent = user.name || user.username;

  if (user.profile_image) {
    profilePic.src = `http://127.0.0.1:5000/uploads/${user.profile_image}`;
  } else {
    profilePic.src = "";
    profilePic.style.backgroundColor = "#eee";
  }
}

function logout() {
  localStorage.removeItem("user");
  window.location.reload();
}

function goProfile() {
  window.location.href = "user_profile.html";
}

// ---------------- 글로벌 회원탈퇴 함수 ----------------
async function deleteAccount() {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    alert("로그인 정보가 없습니다.");
    return;
  }
  const user = JSON.parse(storedUser);
  if (!confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) return;
  try {
    const response = await fetch(`http://127.0.0.1:5000/delete-user/${user.id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    if (response.ok) {
      alert("회원탈퇴가 완료되었습니다.");
      localStorage.removeItem("user");
      window.location.href = "recommend.html";
    } else {
      alert("탈퇴 실패: " + result.error);
    }
  } catch (err) {
    console.error("회원탈퇴 요청 실패:", err);
    alert("탈퇴 중 오류가 발생했습니다.");
  }
}
