// 공연 데이터
const performances = [
    {
        id: 1,
        title: "뮤지컬 알라딘",
        category: "musical",
        venue: "샤롯데씨어터",
        period: "2025.06.01 ~ 2025.09.30",
        price: "77,000원~",
        description: "브로드웨이의 거대한 스펙타클! 마법같은 무대와 화려한 의상으로 꾸며진 환상적인 뮤지컬",
        image: "./assets/sub8.jpg",
    },
    {
        id: 2,
        title: "뮤지컬 위키드",
        category: "musical",
        venue: "예스24스테이지",
        period: "2025.07.15 ~ 2025.10.31",
        price: "99,000원~",
        description: "오즈의 마법사의 숨겨진 이야기. 엘파바와 글린다의 우정을 그린 감동적인 작품",
        image: "./assets/sub7.jpg",

    },
    {
        id: 3,
        title: "하이라이트 콘서트",
        category: "concert",
        venue: "올림픽공원 체조경기장",
        period: "2025.08.20 ~ 2025.08.21",
        price: "121,000원~",
        description: "HIGHLIGHT LIVE 2025 [RIDE OR DIE] - 팬들과 함께하는 특별한 밤",
        image: "./assets/sub6.jpg",

    },
    {
        id: 4,
        title: "연극 자취",
        category: "play",
        venue: "대학로 소극장",
        period: "2025.06.10 ~ 2025.08.31",
        price: "35,000원~",
        description: "혼자 사는 청춘들의 리얼한 이야기를 담은 공포 코미디 연극",
        image: "./assets/sub5.jpg",

    },
    {
        id: 5,
        title: "베토벤 교향곡 9번",
        category: "classic",
        venue: "세종문화회관",
        period: "2025.07.01 ~ 2025.07.03",
        price: "30,000원~",
        description: "KBS교향악단과 함께하는 베토벤의 대표작 '합창' 교향곡",
        image: "./assets/sub4.jpg",

    },
    {
        id: 6,
        title: "디지털 아트 전시",
        category: "exhibition",
        venue: "동대문디자인플라자",
        period: "2025.06.01 ~ 2025.12.31",
        price: "25,000원~",
        description: "최신 디지털 기술로 구현한 몰입형 미디어 아트 전시",
        image: "./assets/sub3.jpg",

    },
    {
        id: 7,
        title: "뮤지컬 구텐버그",
        category: "musical",
        venue: "대학로 자유극장",
        period: "2025.06.05 ~ 2025.08.30",
        price: "55,000원~",
        description: "대학로 대표 깔깔극! 진심 가득한 땀방울로 빚어낸 코미디 뮤지컬",
        image: "./assets/sub2.jpg",

    },
    {
        id: 8,
        title: "아이유 콘서트",
        category: "concert",
        venue: "KSPO DOME",
        period: "2025.09.14 ~ 2025.09.15",
        price: "132,000원~",
        description: "아이유의 감성 가득한 콘서트 'Love wins all'",
        image: "./assets/sub1.jpg",

    }
];


// 슬라이드 데이터 배열
const slidesData = [
    {
        id: 1,
        title: "뮤지컬 알라딘",
        description: "브로드웨이의 거대한 스펙타클이 한국에 상륙했습니다!",
        backgroundImage: "./assets/main1.jpg",
        buttonText: "자세히 보기"
    },
    {
        id: 2,
        title: "뮤지컬 위키드",
        description: "마법 같은 이야기가 펼쳐지는 환상적인 무대",
        backgroundImage: "./assets/main2.jpg",
        buttonText: "예매하기"
    },
    {
        id: 3,
        title: "콘서트 하이라이트",
        description: "HIGHLIGHT LIVE 2025 [RIDE OR DIE] 티켓 오픈!",
        backgroundImage: "./assets/main3.jpg",
        buttonText: "티켓 구매"
    }
];

let totalSlides = slidesData.length;
let currentSlideIndex = 0;
let currentFilter = 'all';
let searchTerm = '';

// DOM 로드 완료 후 실행
document.addEventListener('DOMContentLoaded', function () {
    renderPerformances();
    // startSlideShow();
    // 자동 슬라이드 (5초마다)  
    showSlide(0);
    setInterval(() => {
        changeSlide(1);
    }, 5000);
    setupEventListeners();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 네비게이션 메뉴 클릭
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.category;
            filterPerformances();
        });
    });

    // 카테고리 필터 버튼 클릭
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.filter-btn')
            .forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            filterPerformances();
        });
    });

    // 검색 입력 엔터키
    document.getElementById('searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // 모달 외부 클릭 시 닫기
    document.getElementById('detailModal').addEventListener('click', function (e) {
        if (e.target === this) {
            closeModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// 공연 목록 렌더링
function renderPerformances() {
    const grid = document.getElementById('performanceGrid');
    const filteredPerformances = getFilteredPerformances();

    if (filteredPerformances.length === 0) {
        grid.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">검색 결과가 없습니다.</div>';
        return;
    }

    grid.innerHTML = filteredPerformances.map(performance => `
                <div class="performance-card" onclick="openDetail('${performance.title}', ${performance.id})" data-category="${performance.category}">
                    <div class="card-image" style="background-image: url('${performance.image}');">
                        <div class="card-category">${getCategoryName(performance.category)}</div>
                    </div>
                    <div class="card-content">
                        <div class="card-title">${performance.title}</div>
                        <div class="card-info">📍 ${performance.venue}</div>
                        <div class="card-info">📅 ${performance.period}</div>
                        <div class="card-price">${performance.price}</div>
                    </div>
                </div>
            `).join('');
}

// 필터링된 공연 목록 가져오기
function getFilteredPerformances() {
    return performances.filter(performance => {
        const matchesCategory = currentFilter === 'all' || performance.category === currentFilter;
        const matchesSearch = searchTerm === '' ||
            performance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            performance.venue.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
}

// 카테고리명 변환
function getCategoryName(category) {
    const names = {
        'musical': '뮤지컬',
        'concert': '콘서트',
        'play': '연극',
        'classic': '클래식',
        'exhibition': '전시'
    };
    return names[category] || '기타';
}

// 공연 필터링
function filterPerformances() {
    showLoading();
    setTimeout(() => {
        renderPerformances();
        hideLoading();
    }, 500);
}

// 검색 기능
function performSearch() {
    searchTerm = document.getElementById('searchInput').value.trim();
    showLoading();
    setTimeout(() => {
        renderPerformances();
        hideLoading();
    }, 800);

    // 검색어가 있으면 전체 카테고리로 변경
    if (searchTerm) {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
        currentFilter = 'all';
    }
}

// 로딩 표시/숨김
function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('performanceGrid').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('performanceGrid').style.display = 'grid';
}

// 상세 페이지 열기
function openDetail(title, id) {
    const performance = performances.find(p => p.id === id) || performances[0];

    document.getElementById('modalTitle').textContent = performance.title;
    document.getElementById('modalPeriod').textContent = performance.period;
    document.getElementById('modalVenue').textContent = performance.venue;
    document.getElementById('modalRuntime').textContent = '120분 (인터미션 15분)';
    document.getElementById('modalAge').textContent = '8세 이상';
    document.getElementById('modalDescription').textContent = performance.description;
    document.getElementById('modalImage').style.backgroundImage = `url('${performance.image}')`;

    const modalImage = document.getElementById('modalImage');
    modalImage.style.backgroundImage = `url('${performance.image}')`;
    modalImage.style.backgroundSize = 'cover';
    modalImage.style.backgroundPosition = 'center';
    modalImage.textContent = ''; // 기존 텍스트 제거

    document.getElementById('detailModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// // 모달 닫기
function closeModal() {
    hideBookingSection();
    document.getElementById('detailModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 슬라이드 데이터 업데이트 함수
function updateSlideContent(index) {
    const data = slidesData[index];
    const slide = document.querySelector('.slide');

    // 텍스트 내용 업데이트
    document.getElementById('slide-title').textContent = data.title;
    document.getElementById('slide-description').textContent = data.description;
    document.getElementById('slide-button').textContent = data.buttonText;

    // 배경 이미지 업데이트
    slide.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${data.backgroundImage}')`;

    // 버튼 클릭 이벤트 업데이트
    document.getElementById('slide-button').onclick = function () {
        openDetail(data.title, data.id);
    };
}

// 슬라이드 변경
function changeSlide(direction) {
    currentSlideIndex += direction;

    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }

    showSlide(currentSlideIndex);
}

// 특정 슬라이드로 이동
function currentSlide(n) {
    currentSlideIndex = n - 1;
    showSlide(currentSlideIndex);
}

// 슬라이드 표시 (데이터 업데이트 포함)
function showSlide(n) {
    const dots = document.querySelectorAll('.dot');

    // 점 활성화 상태 업데이트
    dots.forEach(dot => dot.classList.remove('active'));
    dots[n].classList.add('active');

    // 슬라이드 내용 업데이트
    updateSlideContent(n);
}


// 브라우저 객체 모델 활용 (12주차 내용)
function getDeviceInfo() {
    const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        screenWidth: screen.width,
        screenHeight: screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
        location: window.location.href
    };
    console.log('디바이스 정보:', info);
    return info;
}


// 로컬 스토리지 활용 (최근 본 상품 - 메모리 저장으로 대체)
let recentlyViewed = [];

function addToRecentlyViewed(performanceId) {
    const performance = performances.find(p => p.id === performanceId);
    if (performance) {
        // 중복 제거
        recentlyViewed = recentlyViewed.filter(p => p.id !== performanceId);
        // 맨 앞에 추가
        recentlyViewed.unshift(performance);
        // 최대 5개까지만 저장
        if (recentlyViewed.length > 5) {
            recentlyViewed = recentlyViewed.slice(0, 5);
        }
        console.log('최근 본 상품:', recentlyViewed);
    }
}

// String 메소드 활용 (9주차 내용)
function formatPerformanceTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();
}

function validateSearchInput(input) {
    // 공백 제거 및 유효성 검사
    const cleaned = input.trim().replace(/\s+/g, ' ');
    return cleaned.length >= 1 && cleaned.length <= 50;
}

// 추가 이벤트 리스너들
window.addEventListener('resize', function () {
    // 반응형 대응
    console.log('화면 크기 변경:', window.innerWidth, 'x', window.innerHeight);
});

window.addEventListener('scroll', function () {
    // 스크롤 이벤트 처리
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// 페이지 로드 시 디바이스 정보 출력
window.onload = function () {
    getDeviceInfo();
    console.log('YES24 티켓 클론 사이트가 로드되었습니다.');
};

// 개발자 도구용 함수들
window.debugFunctions = {
    showAllPerformances: () => console.table(performances),
    getCurrentFilter: () => console.log('현재 필터:', currentFilter),
    getRecentlyViewed: () => console.log('최근 본 상품:', recentlyViewed),
    testGeolocation: getNearbyVenues,
    clearSearch: () => {
        document.getElementById('searchInput').value = '';
        searchTerm = '';
        renderPerformances();
    }
};



// 예매 페이지 닫기
function closeBooking() {
    document.getElementById('bookingModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    resetBookingForm();
}

// 예매 폼 초기화
function resetBookingForm() {
    selectedBookingDate = null;
    selectedBookingTime = null;
    selectedSeatGrade = null;
    document.getElementById('selectedDate').textContent = '날짜를 선택해주세요';
    document.getElementById('selectedTime').textContent = '시간을 선택해주세요';
    document.getElementById('selectedGrade').textContent = '등급을 선택해주세요';
    document.getElementById('totalPrice').textContent = '0원';
    document.getElementById('confirmBookingBtn').disabled = true;

    // 선택 상태 초기화
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });
}

// 달력 생성
function generateCalendar() {
    const calendar = document.getElementById('calendarGrid');
    const monthElement = document.getElementById('calendarMonth');

    const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    monthElement.textContent = `${currentCalendarYear}. ${monthNames[currentCalendarMonth]}`;

    const firstDay = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const today = new Date();

    let calendarHTML = '';

    // 요일 헤더
    const dayHeaders = ['일', '월', '화', '수', '목', '금', '토'];
    dayHeaders.forEach(day => {
        calendarHTML += `<div class="calendar-day-header">${day}</div>`;
    });

    // 빈 칸 채우기
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += '<div class="calendar-day"></div>';
    }

    // 날짜 채우기
    for (let day = 1; day <= daysInMonth; day++) {
        const currentDate = new Date(currentCalendarYear, currentCalendarMonth, day);
        const isToday = currentDate.toDateString() === today.toDateString();
        const isPast = currentDate < today && !isToday;

        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isPast) classes += ' disabled';

        const onclick = isPast ? '' : `onclick="selectDate(${day})"`;

        calendarHTML += `<div class="${classes}" ${onclick}>${day}</div>`;
    }

    calendar.innerHTML = calendarHTML;
}

// 달 변경
function changeMonth(direction) {
    currentCalendarMonth += direction;
    if (currentCalendarMonth > 11) {
        currentCalendarMonth = 0;
        currentCalendarYear++;
    } else if (currentCalendarMonth < 0) {
        currentCalendarMonth = 11;
        currentCalendarYear--;
    }
    generateCalendar();
}

// 날짜 선택
function selectDate(day) {
    document.querySelectorAll('.calendar-day.selected').forEach(d => {
        d.classList.remove('selected');
    });

    event.target.classList.add('selected');
    selectedBookingDate = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const monthNames = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
    document.getElementById('selectedDate').textContent = `${currentCalendarYear}년 ${monthNames[currentCalendarMonth]} ${day}일`;

    updateBookingConfirmButton();
}

// 시간 선택
function selectTime(element, time, vipPrice, rPrice) {
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });

    element.classList.add('selected');
    selectedBookingTime = time;

    document.getElementById('selectedTime').textContent = time;

    // 좌석 등급 선택 (임시로 VIP석 자동 선택)
    selectedSeatGrade = 'VIP';
    document.getElementById('selectedGrade').textContent = `VIP석 ${parseInt(vipPrice).toLocaleString()}원`;
    document.getElementById('totalPrice').textContent = `${parseInt(vipPrice).toLocaleString()}원`;

    updateBookingConfirmButton();
}

// 예매 확인 버튼 활성화 체크
function updateBookingConfirmButton() {
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (selectedBookingDate && selectedBookingTime && selectedSeatGrade) {
        confirmBtn.disabled = false;
    } else {
        confirmBtn.disabled = true;
    }
}



