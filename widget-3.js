(function() {
    // Prevent the script from duplicating itself if the CMS fires it twice
    if (document.getElementById("mock-booking-inline")) return;

    // 1. Inject the CSS (No more modal overlays or fixed positioning)
    const styles = `
        #mock-booking-inline { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 10px; background: #fff; width: 100%; max-width: 400px; margin: 0 auto; box-sizing: border-box; }
        #mock-booking-inline * { box-sizing: border-box; }
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

    // 2. Pre-build the calendar days
    let daysHtml = '';
    for(let i = 1; i <= 31; i++) {
        const price = Math.floor(Math.random() * 100) + 50;
        daysHtml += `
            <div class="calendar-day" data-date="${i}" data-price="${price}">
                <span class="date-num">${i}</span>
                <span class="price">$${price}</span>
            </div>
        `;
    }

    // 3. Create the inline container
    const widgetDiv = document.createElement("div");
    widgetDiv.id = "mock-booking-inline";
    widgetDiv.innerHTML = `
        <div class="calendar-header">August 2026</div>
        <div class="calendar-grid" id="calendarGrid">
            <div class="day-name">Su</div><div class="day-name">Mo</div><div class="day-name">Tu</div>
            <div class="day-name">We</div><div class="day-name">Th</div><div class="day-name">Fr</div><div class="day-name">Sa</div>
            ${daysHtml}
        </div>
        <div class="modal-footer">
            <div id="selectedInfo">Please select a date above.</div>
            <a href="https://your-real-webpage.com/checkout" id="bookBtn" class="book-btn disabled" target="_blank">Book Now</a>
        </div>
    `;

    // 4. Inject right where the script is called in the CMS
    const currentScript = document.currentScript;
    if (currentScript && currentScript.parentNode) {
        currentScript.parentNode.insertBefore(widgetDiv, currentScript);
    } else {
        document.body.appendChild(widgetDiv);
    }

    // 5. Attach Logic
    const bookBtn = widgetDiv.querySelector("#bookBtn");
    const selectedInfo = widgetDiv.querySelector("#selectedInfo");
    const calendarDays = widgetDiv.querySelectorAll('.calendar-day');

    // Day Selection Logic
    calendarDays.forEach(day => {
        day.onclick = function() {
            // Deselect all
            calendarDays.forEach(el => el.classList.remove('selected'));
            // Select clicked
            this.classList.add('selected');
            // Enable button
            bookBtn.classList.remove('disabled');
            // Update info text
            selectedInfo.innerHTML = `Selected: <strong>Aug ${this.dataset.date}</strong> - Price: <strong>$${this.dataset.price}</strong>`;
        };
    });
})();