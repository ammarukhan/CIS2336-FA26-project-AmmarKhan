/* Phase 2 booking demonstration.
   - Validates all required fields in JavaScript.
   - Compares the selected time against sample reservations for all five rooms.
   - Keeps new demo bookings in memory only (cleared on page reload).
   - No network request or real booking occurs in Phase 2.
   Phase 3 will replace checkDemoAvailability/submitDemoBooking with
   GET/POST requests to the Express backend. */
(() => {
  'use strict';
  const form = document.getElementById('booking-form');
  if (!form) return;

  const room = document.getElementById('room');
  const date = document.getElementById('date');
  const time = document.getElementById('time');
  const duration = document.getElementById('duration');
  const name = document.getElementById('student-name');
  const email = document.getElementById('student-email');
  const purpose = document.getElementById('purpose');
  const sidebar = document.getElementById('availability-status');
  const placeholder = document.getElementById('availability-placeholder');
  const formStatus = document.getElementById('booking-status');
  const roomButtons = Array.from(document.querySelectorAll('.room-option'));

  const roomNames = {
    'study-a': 'Quiet Study Room A',
    'study-b': 'Group Study Room B',
    collaboration: 'Collaboration Suite',
    meeting: 'Meeting Room',
    multipurpose: 'Multipurpose Room'
  };
  const openMinute = 8 * 60;
  const closeMinute = 20 * 60;

  function localDateString(day) {
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const number = String(day.getDate()).padStart(2, '0');
    return `${year}-${month}-${number}`;
  }
  function dayAfter(offset) {
    // Start from noon to avoid daylight-saving transitions near midnight.
    const day = new Date();
    day.setHours(12, 0, 0, 0);
    day.setDate(day.getDate() + offset);
    return localDateString(day);
  }
  function toMinutes(value) {
    const [hours, minutes] = value.split(':').map(Number);
    return hours * 60 + minutes;
  }
  function formatTime(value) {
    const [hours, minutes] = value.split(':').map(Number);
    const hour = ((hours + 11) % 12) + 1;
    return `${hour}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
  }
  function showStatus(element, state, message) {
    element.dataset.state = state;
    element.textContent = message;
    if (element === sidebar) placeholder.hidden = true;
  }
  function clearStatus(element) {
    element.removeAttribute('data-state');
    element.textContent = '';
    if (element === sidebar) placeholder.hidden = false;
  }
  function clearFieldError(input) {
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
    const message = document.getElementById(`${input.id}-error`);
    if (message) message.textContent = '';
  }
  function fieldError(input, message) {
    input.setAttribute('aria-invalid', 'true');
    input.setAttribute('aria-describedby', `${input.id}-error`);
    document.getElementById(`${input.id}-error`).textContent = message;
    return false;
  }
  function validateSelection() {
    const today = dayAfter(0);
    const maximum = dayAfter(90);
    const errors = [];
    [room, date, time, duration].forEach(clearFieldError);

    if (!roomNames[room.value]) errors.push([room, 'Please select one of the five rooms.']);
    if (!date.value) {
      errors.push([date, 'Please choose a date.']);
    } else if (date.value < today || date.value > maximum) {
      errors.push([date, 'Select a date between today and 90 days from today.']);
    }
    if (!time.value) errors.push([time, 'Please choose a start time.']);
    if (!duration.value) errors.push([duration, 'Please choose a duration.']);

    if (time.value && duration.value) {
      const start = toMinutes(time.value);
      const minutes = Number(duration.value);
      if (!Number.isInteger(start) || ![30, 60, 90, 120].includes(minutes) ||
          start < openMinute || start + minutes > closeMinute) {
        errors.push([duration, 'The reservation must finish by 8:00 PM.']);
      }
    }
    if (date.value && time.value && date.value === today) {
      const requestedTime = new Date(`${date.value}T${time.value}:00`);
      if (requestedTime <= new Date()) errors.push([time, 'Please select a future start time.']);
    }
    errors.forEach(([input, message]) => fieldError(input, message));
    if (errors.length) {
      errors[0][0].focus();
      return null;
    }
    return {
      room: room.value,
      date: date.value,
      start: toMinutes(time.value),
      end: toMinutes(time.value) + Number(duration.value)
    };
  }
  function validateStudentInfo() {
    const errors = [];
    [name, email, purpose].forEach(clearFieldError);
    if (name.value.trim().length < 2) errors.push([name, 'Enter your full name (at least 2 characters).']);
    if (name.value.length > 80) errors.push([name, 'Name must be 80 characters or fewer.']);
    const emailValue = email.value.trim();
    if (!emailValue || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue) || emailValue.length > 120) {
      errors.push([email, 'Enter a valid email address.']);
    }
    if (!purpose.value) errors.push([purpose, 'Select a purpose for the booking.']);
    errors.forEach(([input, message]) => fieldError(input, message));
    return errors.length === 0;
  }

  // Five sample reservations ensure the conflict logic is demonstrable
  // on every room, regardless of when the evaluator opens this website.
  const demoReservations = [
    { room: 'study-a', date: dayAfter(1), start: 9 * 60, end: 9 * 60 + 30 },
    { room: 'study-b', date: dayAfter(1), start: 10 * 60, end: 11 * 60 },
    { room: 'collaboration', date: dayAfter(2), start: 13 * 60, end: 14 * 60 },
    { room: 'meeting', date: dayAfter(1), start: 14 * 60, end: 15 * 60 + 30 },
    { room: 'multipurpose', date: dayAfter(3), start: 16 * 60, end: 17 * 60 }
  ];
  function checkDemoAvailability(request) {
    // Time intervals overlap iff existing.start < requested.end
    // AND requested.start < existing.end. Adjacent slots are allowed.
    return !demoReservations.some((booking) =>
      booking.room === request.room && booking.date === request.date &&
      booking.start < request.end && request.start < booking.end
    );
  }
  function showAvailability(request, available) {
    const label = `${roomNames[request.room]} on ${request.date} at ${formatTime(time.value)}`;
    if (available) {
      showStatus(sidebar, 'success', `Available in the demo: ${label}. You can submit a sample request.`);
    } else {
      showStatus(sidebar, 'error', `Unavailable in the demo: ${label} overlaps a sample reservation. Choose another time or room.`);
    }
  }
  function updateRoomSelection() {
    roomButtons.forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.room === room.value));
    });
  }

  date.min = dayAfter(0);
  date.max = dayAfter(90);
  for (let minutes = openMinute; minutes < closeMinute; minutes += 30) {
    const value = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
    const option = document.createElement('option');
    option.value = value;
    option.textContent = formatTime(value);
    time.append(option);
  }

  // Any edited field invalidates an earlier availability result.
  [name, email, room, date, time, duration, purpose].forEach((input) => {
    ['input', 'change'].forEach((type) => input.addEventListener(type, () => {
      clearFieldError(input);
      clearStatus(sidebar);
      clearStatus(formStatus);
      if (input === room) updateRoomSelection();
    }));
  });
  roomButtons.forEach((button) => {
    button.addEventListener('click', () => {
      room.value = button.dataset.room;
      room.dispatchEvent(new Event('change', { bubbles: true }));
      document.querySelector('.booking-layout').scrollIntoView({ behavior: 'smooth', block: 'start' });
      room.focus({ preventScroll: true });
    });
  });
  document.getElementById('check-availability').addEventListener('click', () => {
    clearStatus(formStatus);
    const request = validateSelection();
    if (!request) {
      showStatus(sidebar, 'neutral', 'Complete the room, date, time and duration fields to check availability.');
      return;
    }
    showAvailability(request, checkDemoAvailability(request));
  });
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearStatus(formStatus);
    const studentValid = validateStudentInfo();
    const request = validateSelection();
    if (!studentValid || !request) {
      showStatus(formStatus, 'error', 'Please correct the highlighted fields and try again.');
      if (!studentValid) [name, email, purpose].find((input) => input.getAttribute('aria-invalid') === 'true')?.focus();
      return;
    }
    const available = checkDemoAvailability(request);
    showAvailability(request, available);
    if (!available) {
      showStatus(formStatus, 'error', 'Demo request declined: that room already has a sample reservation during your chosen time.');
      return;
    }
    // Simulated confirmation, stored in this page's JavaScript array only.
    demoReservations.push(request);
    showStatus(formStatus, 'success', `Demo request accepted for ${roomNames[request.room]} on ${request.date} at ${formatTime(time.value)}. This is not a real booking. Refresh the page to reset sample reservations.`);
    showStatus(sidebar, 'neutral', 'This time is now reserved in your current demo session only. Refresh the page to reset.');
  });
})();
