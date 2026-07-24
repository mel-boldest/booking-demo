(function() {
    // 1. Find the target container we will place in the CMS
    const targetDiv = document.getElementById("my-mock-widget");
    if (!targetDiv) return; 

    // Clear it out in case the CMS fires the script twice
    targetDiv.innerHTML = "";

    // 2. Inject the CSS (Added logo and disabled state styles)
    const styles = `
        #my-mock-widget { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 10px; background: #fff; width: 100%; max-width: 400px; margin: 0 auto; box-sizing: border-box; }
        #my-mock-widget * { box-sizing: border-box; }
        .demo-header { text-align: center; margin-bottom: 20px; }
        .demo-logo { max-width: 150px; height: auto; margin-bottom: 12px; }
        .demo-text { font-size: 13px; color: #666; font-style: italic; line-height: 1.4; margin: 0; padding: 0 10px; }
        .calendar-header { text-align: center; margin-bottom: 15px; font-size: 1.2em; font-weight: bold; color: #333; }
        .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; text-align: center; }
        .calendar-day { padding: 10px 5px; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; }
        
        /* Hover and Selected states for active days */
        .calendar-day:hover:not(.disabled) { background-color: #f0f8ff; border-color: #007bff; }
        .calendar-day.selected { background-color: #007bff; color: white; border-color: #007bff; transform: scale(1.05); }
        .calendar-day.selected .price { color: #e6f2ff; }
        
        /* Disabled state for past dates */
        .calendar-day.disabled { background-color: #f4f4f4; border-color: #eaeaea; cursor: not-allowed; opacity: 0.6; }
        .calendar-day.disabled .date-num { color: #999; }
        
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

    // 3. Dynamically build the calendar days (35 days total to make a clean grid)
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate comparisons
    
    // Start the loop 4 days ago
    let loopDate = new Date(today);
    loopDate.setDate(today.getDate() - 4);

    let daysHtml = '';
    
    for(let i = 0; i < 35; i++) {
        let isPastOrToday = loopDate <= today;
        let dayNum = loopDate.getDate();
        let monthStr = loopDate.toLocaleString('default', { month: 'short' }); // Gets 'Jan', 'Feb', etc.
        let price = Math.floor(Math.random() * 100) + 50;
        
        if (isPastOrToday) {
            // Render greyed out unclickable box (no price)
            daysHtml += `
                <div class="calendar-day disabled">
                    <span class="date-num">${dayNum}</span>
                </div>
            `;
        } else {
            // Render active clickable box with price
            daysHtml += `
                <div class="calendar-day" data-date="${monthStr} ${dayNum}" data-price="${price}">
                    <span class="date-num">${dayNum}</span>
                    <span class="price">$${price}</span>
                </div>
            `;
        }
        // Move to the next day
        loopDate.setDate(loopDate.getDate() + 1);
    }

    // 4. Inject the HTML into the target div
    targetDiv.innerHTML = `
        <div class="demo-header">
            <img src="https://www.boldest.io/wp-content/uploads/2025/06/Boldest-Eggplant.png" alt="Boldest Logo" class="demo-logo">
            <p class="demo-text">This is only a demo. Your booking platform can provide a widget that can be embedded here.</p>
        </div>
        <div class="calendar-grid" id="calendarGrid">
            ${daysHtml}
        </div>
        <div class="modal-footer">
            <div id="selectedInfo">Please select a date above.</div>
            <a href="https://www.boldest.io" id="bookBtn" class="book-btn disabled" target="_blank">Book Now</a>
        </div>
    `;

    // 5. Attach Logic (Only attach to active days, ignoring disabled ones)
    const bookBtn = targetDiv.querySelector("#bookBtn");
    const selectedInfo = targetDiv.querySelector("#selectedInfo");
    const activeCalendarDays = targetDiv.querySelectorAll('.calendar-day:not(.disabled)');

    activeCalendarDays.forEach(day => {
        day.onclick = function() {
            // Deselect all
            activeCalendarDays.forEach(el => el.classList.remove('selected'));
            // Select clicked
            this.classList.add('selected');
            // Enable button
            bookBtn.classList.remove('disabled');
            // Update info text with the dynamic month and day
            selectedInfo.innerHTML = `Selected: <strong>${this.dataset.date}</strong> - Price: <strong>$${this.dataset.price}</strong>`;
        };
    });
})();