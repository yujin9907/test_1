// 로그인 모달 함수들
function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
}

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    alert('로그인 성공! (데모)');
    closeLoginModal();

    // 로그인 후 헤더 업데이트 (예시)
    updateHeaderAfterLogin();
}

function socialLogin(provider) {
    alert(`${provider} 로그인 (데모)`);
    closeLoginModal();
    updateHeaderAfterLogin();
}

function showSignup() {
    alert('회원가입 페이지로 이동 (데모)');
}

function updateHeaderAfterLogin() {
    // 로그인 후 헤더의 로그인 링크를 마이페이지로 변경하는 예시
    const loginLink = document.querySelector('.login-link');
    if (loginLink) {
        loginLink.textContent = '마이페이지';
        loginLink.onclick = null;
    }
}
