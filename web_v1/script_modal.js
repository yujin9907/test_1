let currentDate = new Date();
let selectedDate = null;
let selectedTime = null;

// 예매 가능한 시간표 데이터 
const showTimes = {
    // 요일별 상영시간 (0: 일요일, 1: 월요일, ...)
    0: ['10:00', '14:00', '17:00'], // 일요일
    1: ['19:30'], // 월요일
    2: ['14:00', '19:30'], // 화요일
    3: ['14:00', '19:30'], // 수요일
    4: ['14:00', '19:30'], // 목요일
    5: ['14:00', '19:30'], // 금요일
    6: ['10:00', '14:00', '17:00', '20:00'] // 토요일
};


function showBookingSection() {
    document.getElementById('bookingSection').style.display = 'block';
    document.getElementById('initialBookBtn').style.display = 'none';
    generateCalendar();
}

function hideBookingSection() {
    document.getElementById('bookingSection').style.display = 'none';
    document.getElementById('initialBookBtn').style.display = 'block';
    selectedDate = null;
    selectedTime = null;
    updateBookButton();
}

function generateCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    document.getElementById('calendarTitle').textContent =
        `${year}. ${String(month + 1).padStart(2, '0')}`;

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay());

    const calendarGrid = document.getElementById('calendarGrid');
    calendarGrid.innerHTML = '';

    // 요일 헤더
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day-header';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });

    // 달력 날짜 생성
    const today = new Date();
    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date.getDate();

        // 다른 달 날짜 처리
        if (date.getMonth() !== month) {
            dayElement.classList.add('other-month');
        }

        // 오늘 날짜 표시
        if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
        }

        // 과거 날짜 비활성화
        if (date < today.setHours(0, 0, 0, 0)) {
            dayElement.style.color = '#ccc';
            dayElement.style.cursor = 'not-allowed';
        } else if (date.getMonth() === month) {
            // 요일별 클래스 추가
            if (date.getDay() === 0) {
                dayElement.classList.add('sunday');
            } else if (date.getDay() === 6) {
                dayElement.classList.add('saturday');
            }

            dayElement.addEventListener('click', () => selectDate(date));
        }

        calendarGrid.appendChild(dayElement);
    }
}

function changeMonth(direction) {
    currentDate.setMonth(currentDate.getMonth() + direction);
    generateCalendar();
    // 월이 바뀌면 선택된 날짜 초기화
    selectedDate = null;
    selectedTime = null;
    updateTimeSlots();
    updateBookButton();
}

function selectDate(date) {
    // 이전 선택 제거
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });

    // 새로운 선택 추가
    event.target.classList.add('selected');
    selectedDate = new Date(date);
    selectedTime = null;

    updateTimeSlots();
    updateSelectedDateDisplay();
    updateBookButton();
}

function updateSelectedDateDisplay() {
    const selectedDateEl = document.getElementById('selectedDate');
    if (selectedDate) {
        const month = selectedDate.getMonth() + 1;
        const day = selectedDate.getDate();
        const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
        const dayName = dayNames[selectedDate.getDay()];
        selectedDateEl.textContent = `${month}월 ${day}일 (${dayName})`;
    } else {
        selectedDateEl.textContent = '날짜를 선택하세요';
    }
}

function updateTimeSlots() {
    const timeSlotsContainer = document.getElementById('timeSlots');

    if (!selectedDate) {
        timeSlotsContainer.innerHTML = '<div class="no-shows">날짜를 먼저 선택해주세요</div>';
        return;
    }

    const dayOfWeek = selectedDate.getDay();
    const times = showTimes[dayOfWeek] || [];

    if (times.length === 0) {
        timeSlotsContainer.innerHTML = '<div class="no-shows">선택하신 날짜에는 공연이 없습니다</div>';
        return;
    }

    timeSlotsContainer.innerHTML = '';

    times.forEach(time => {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'time-slot';

        // 랜덤으로 매진 상태 생성 (데모용)
        const isSoldOut = Math.random() < 0.2;
        const availableSeats = isSoldOut ? 0 : Math.floor(Math.random() * 150) + 50;

        if (isSoldOut) {
            timeSlot.classList.add('sold-out');
        }

        timeSlot.innerHTML = `
                    <div class="time-text">${time}</div>
                    <div class="seats-text">${isSoldOut ? '매진' : `${availableSeats}석 남음`}</div>
                `;

        if (!isSoldOut) {
            timeSlot.addEventListener('click', () => selectTime(time, timeSlot));
        }

        timeSlotsContainer.appendChild(timeSlot);
    });
}

function selectTime(time, element) {
    // 이전 선택 제거
    document.querySelectorAll('.time-slot.selected').forEach(el => {
        el.classList.remove('selected');
    });

    // 새로운 선택 추가
    element.classList.add('selected');
    selectedTime = time;
    updateBookButton();
}

function updateBookButton() {
    const bookBtn = document.getElementById('bookFinalBtn');
    if (selectedDate && selectedTime) {
        bookBtn.disabled = false;
        bookBtn.textContent = `${selectedTime} 공연 예매하기`;
    } else {
        bookBtn.disabled = true;
        bookBtn.textContent = '예매하기';
    }
}

function finalBooking() {
    if (selectedDate && selectedTime) {
        const month = selectedDate.getMonth() + 1;
        const day = selectedDate.getDate();
        alert(`${month}월 ${day}일 ${selectedTime} 공연 예매가 완료되었습니다!`);
        closeModal();
    }
}

// 모달 외부 클릭 시 닫기
window.addEventListener('click', function (event) {
    const modal = document.getElementById('detailModal');
    if (event.target === modal) {
        closeModal();
    }
});