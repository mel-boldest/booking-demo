(function() {
    // 1. Inject the CSS (Modal defaults to display: block)
    const styles = `
        * { box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .modal { display: block; position: fixed; z-index: 99999; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.6); }
        .modal-content { background-color: #fff; margin: 5% auto; padding: 25px; border-radius: 12px; width: 90%; max-width: 420px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        .close { color: #aaa; float: right; font-size: 28px; font-weight: bold; cursor: pointer; line-height: 1; }
        .close:hover { color: #333; }
        .calendar-header { text-align: center; margin-bottom: 20px; font-size: 1.4em; font-weight: bold; color: #333; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center; }
        .day-name { font-weight: bold; font-size: 0.85em; color: #777; padding-bottom: 10px; }
        .calendar-day { padding: 10px 5px; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; }
        .calendar-day:hover { background-color: #f0f8ff; border-color: #007bff; }
        .calendar-day.selected { background-color: #007bff; color: white; border-color: #007bff; transform: scale(1.05); }
        .calendar-day.selected .price { color: #e6f2ff; }
        .date-num { font-size: 1em; font-weight: bold; }
        .price { font-size: 0.75em; color: #28a745; margin-top: 4px; font-weight: 600; }
        .modal-footer { margin-top: 25px; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        #selectedInfo { margin-bottom: 15px; font-size: 0.95em; color: #555; min-height: 20px;}
        .book-btn { display: inline-block; padding: 14px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; width: 100%; transition: background 0.3s; }
        .book-btn:hover { background-color: #218838; }
        .book-btn.disabled { background-color: #cccccc; cursor: not-allowed; pointer-events: none; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. Create the Modal
    const modalDiv = document.createElement("div");
    modalDiv.id = "bookingModal";
    modalDiv.className = "modal";
    modalDiv.innerHTML = `
        <div class="modal-content">
            <span class="close" id="closeModal">&times;</span>
            <div class="calendar-header">August 2026</div>
            <div class="calendar-grid" id="calendarGrid">
                <div class="day-name">Su</div><div class="day-name">Mo</div><div class="day-name">Tu</div>
                <div class="day-name">We</div><div class="day-name">Th</div><div class="day-name">Fr</div><div class="day-name">Sa</div>
            </div>
            <div class="modal-footer">
                <div id="selectedInfo">Please select a date above.</div>
                
                <!-- CUSTOMIZE YOUR DESTINATION LINK HERE -->
                <a href="https://your-real-webpage.com/checkout" id="bookBtn" class="book-btn disabled" target="_blank">Book Now</a>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);

    // 3. Attach Logic
    const modal = document.getElementById("bookingModal");
    const closeBtn = document.getElementById("closeModal");
    const calendarGrid = document.getElementById("calendarGrid");
    const bookBtn = document.getElementById("bookBtn");
    const selectedInfo = document.getElementById("selectedInfo");

    // Close logic (clicking the X or outside the modal)
    closeBtn.onclick = () => modal.style.display = "none";
    window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; }

    // Generate 31 days for the calendar
    for(let i = 1; i <= 31; i++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "calendar-day";
        const price = Math.floor(Math.random() * 100) + 50;

        dayDiv.innerHTML = `<span class="date-num">${i}</span><span class="price">$${price}</span>`;

        dayDiv.onclick = () => {
            document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
            dayDiv.classList.add('selected');
            bookBtn.classList.remove('disabled');
            selectedInfo.innerHTML = `Selected: <strong>Aug ${i}</strong> - Price: <strong>$${price}</strong>`;
        };
        calendarGrid.appendChild(dayDiv);
    }
})();