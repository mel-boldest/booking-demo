(function() {
    const targetDiv = document.getElementById("my-mock-widget");
    if (!targetDiv) return; 

    // Reset display in case it was hidden by a previous close action
    targetDiv.style.display = "block";
    targetDiv.innerHTML = "";

    // 1. Inject the CSS (Added scroll area to keep the X button visible)
    const styles = `
        #my-mock-widget { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 10px; background: #fff; width: 100%; max-width: 400px; margin: 0 auto; box-sizing: border-box; }
        #my-mock-widget * { box-sizing: border-box; }
        .demo-header { text-align: center; margin-bottom: 15px; }
        .demo-logo { max-width: 150px; height: auto; margin-bottom: 10px; }
        .demo-text { font-size: 13px; color: #666; font-style: italic; line-height: 1.4; margin: 0; padding: 0 10px; }
        
        /* Internal scrolling keeps the widget height compact */
        .calendar-scroll-area { max-height: 40vh; overflow-y: auto; padding-right: 5px; margin-bottom: 15px; }
        .calendar-scroll-area::-webkit-scrollbar { width: 6px; }
        .calendar-scroll-area::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }

        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center; }
        .calendar-day { padding: 10px 5px; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; }
        
        .calendar-day:hover:not(.disabled) { background-color: #f0f8ff; border-color: #007bff; }
        .calendar-day.selected { background-color: #007bff; color: white; border-color: #007bff; transform: scale(1.05); }
        .calendar-day.selected .price { color: #e6f2ff; }
        
        .calendar-day.disabled { background-color: #f4f4f4; border-color: #eaeaea; cursor: not-allowed; opacity: 0.6; }
        .calendar-day.disabled .date-num { color: #999; }
        
        .date-num { font-size: 1em; font-weight: bold; }
        .price { font-size: 0.75em; color: #28a745; margin-top: 4px; font-weight: 600; }
        .modal-footer { text-align: center; border-top: 1px solid #eee; padding-top: 15px; }
        #selectedInfo { margin-bottom: 15px; font-size: 0.95em; color: #555; min-height: 20px;}
        .book-btn { display: inline-block; padding: 14px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: bold; width: 100%; transition: background 0.3s; }
        .book-btn:hover { background-color: #218838; }
        .book-btn.disabled { background-color: #cccccc; cursor: not-allowed; pointer-events: none; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 2. Build Dates
    let today = new Date();
    today.setHours(0, 0, 0, 0); 
    let loopDate = new Date(today);
    loopDate.setDate(today.getDate() - 4);

    let daysHtml = '';
    for(let i = 0; i < 35; i++) {
        let isPastOrToday = loopDate <= today;
        let dayNum = loopDate.getDate();
        let monthStr = loopDate.toLocaleString('default', { month: 'short' }); 
        let price = Math.floor(Math.random() * 100) + 50;
        
        if (isPastOrToday) {
            daysHtml += `<div class="calendar-day disabled"><span class="date-num">${dayNum}</span></div>`;
        } else {
            daysHtml += `<div class="calendar-day" data-date="${monthStr} ${dayNum}" data-price="${price}"><span class="date-num">${dayNum}</span><span class="price">$${price}</span></div>`;
        }
        loopDate.setDate(loopDate.getDate() + 1);
    }

    // 3. Inject HTML
    targetDiv.innerHTML = `
        <div class="demo-header">
            <img src="https://www.boldest.io/wp-content/uploads/2025/06/Boldest-Eggplant.png" alt="Boldest Logo" class="demo-logo">
            <p class="demo-text">This is only a demo. Your booking platform can provide a widget that can be embedded here.</p>
        </div>
        <div class="calendar-scroll-area">
            <div class="calendar-grid" id="calendarGrid">
                ${daysHtml}
            </div>
        </div>
        <div class="modal-footer">
            <div id="selectedInfo">Please select a date above.</div>
            <a href="https://www.boldest.io" id="bookBtn" class="book-btn disabled" target="_blank">Book Now</a>
        </div>
    `;

    // 4. Attach Logic
    const bookBtn = targetDiv.querySelector("#bookBtn");
    const selectedInfo = targetDiv.querySelector("#selectedInfo");
    const activeCalendarDays = targetDiv.querySelectorAll('.calendar-day:not(.disabled)');

    // Helper Function: Tells the CMS to close the modal
    function closeCMSModal() {
        const closeBtns = document.querySelectorAll('button[class*="close" i], button[aria-label*="close" i], a[class*="close" i], .close-modal, .popup-close');
        let clicked = false;
        
        for (let btn of closeBtns) {
            btn.click();
            clicked = true;
        }
        // Fallback if the CMS button cannot be found
        if (!clicked) {
            targetDiv.style.display = 'none';
        }
    }

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeCMSModal();
        }
    });

    // Date Selection
    activeCalendarDays.forEach(day => {
        day.onclick = function() {
            activeCalendarDays.forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            bookBtn.classList.remove('disabled');
            selectedInfo.innerHTML = `Selected: <strong>${this.dataset.date}</strong> - Price: <strong>$${this.dataset.price}</strong>`;
        };
    });

    // Close when Book Now is clicked
    bookBtn.onclick = function(e) {
        if (!this.classList.contains('disabled')) {
            // Slight delay ensures the new tab opens before the modal disappears
            setTimeout(closeCMSModal, 150); 
        }
    };
})();