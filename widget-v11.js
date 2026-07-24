(function() {
    const targetDiv = document.getElementById("my-mock-widget");
    if (!targetDiv) return; 

    targetDiv.style.display = "block";
    targetDiv.innerHTML = "";

    // 1. Inject the CSS (Removed forced scroll areas, added aggressive shrinking for mobile)
    const styles = `
        #my-mock-widget { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 10px; background: #fff; width: 100%; max-width: 400px; margin: 0 auto; box-sizing: border-box; overflow: hidden; }
        #my-mock-widget * { box-sizing: border-box; }
        #my-mock-widget .demo-header { text-align: center; margin-bottom: 10px; }
        #my-mock-widget .demo-logo { max-width: 140px; height: auto; margin-bottom: 8px; }
        #my-mock-widget .demo-text { font-size: 12px; color: #666; font-style: italic; line-height: 1.3; margin: 0; padding: 0; }
        
        #my-mock-widget .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; text-align: center; margin-bottom: 15px; }
        #my-mock-widget .day-name { font-weight: bold; font-size: 0.85em; color: #777; padding-bottom: 5px; }
        #my-mock-widget .calendar-day { padding: 8px 2px; border: 1px solid #e0e0e0; border-radius: 6px; cursor: pointer; transition: all 0.2s ease; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fafafa; }
        
        #my-mock-widget .calendar-day:hover:not(.disabled) { background-color: #f5eef5; border-color: #3C0C3D; }
        #my-mock-widget .calendar-day.selected { background-color: #3C0C3D; color: white; border-color: #3C0C3D; transform: scale(1.05); }
        #my-mock-widget .calendar-day.selected .price { color: #FF3366; }
        
        #my-mock-widget .calendar-day.disabled { background-color: #f4f4f4; border-color: #eaeaea; cursor: not-allowed; opacity: 0.6; }
        #my-mock-widget .calendar-day.disabled .date-num { color: #999; }
        
        #my-mock-widget .date-num { font-size: 0.95em; font-weight: bold; }
        #my-mock-widget .price { font-size: 0.7em; color: #28a745; margin-top: 3px; font-weight: 600; }
        
        #my-mock-widget .modal-footer { text-align: center; border-top: 1px solid #eee; padding-top: 15px; }
        #my-mock-widget #selectedInfo { margin-bottom: 12px; font-size: 0.9em; color: #555; min-height: 18px;}
        
        #my-mock-widget .book-btn { display: inline-block; padding: 12px 20px; background-color: #3C0C3D; color: white; text-decoration: none; border-radius: 6px; font-size: 15px; font-weight: bold; width: 100%; transition: background 0.3s; }
        #my-mock-widget .book-btn:hover { background-color: #240725; }
        #my-mock-widget .book-btn.disabled { background-color: #cccccc; cursor: not-allowed; pointer-events: none; }

        /* --- AGGRESSIVE MOBILE RESPONSIVENESS --- */
        @media (max-width: 480px) {
            #my-mock-widget { padding: 5px; }
            #my-mock-widget .calendar-grid { gap: 2px; margin-bottom: 10px; }
            #my-mock-widget .day-name { font-size: 0.7em; padding-bottom: 3px; }
            #my-mock-widget .calendar-day { padding: 4px 1px; border-radius: 4px; }
            #my-mock-widget .date-num { font-size: 0.8em; }
            #my-mock-widget .price { font-size: 0.6em; margin-top: 2px; }
            #my-mock-widget .demo-logo { max-width: 110px; }
            #my-mock-widget .demo-text { font-size: 11px; }
            #my-mock-widget .book-btn { padding: 10px 15px; font-size: 14px; }
            #my-mock-widget .modal-footer { padding-top: 10px; }
            #my-mock-widget #selectedInfo { margin-bottom: 10px; font-size: 0.85em; }
        }
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

    // 3. Inject HTML (Removed the calendar-scroll-area div completely)
    targetDiv.innerHTML = `
        <div class="demo-header">
            <img src="https://www.boldest.io/wp-content/uploads/2025/06/Boldest-Eggplant.png" alt="Boldest Logo" class="demo-logo">
            <p class="demo-text">This is only a demo. Your booking platform can provide a widget that can be embedded here.</p>
        </div>
        <div class="calendar-grid" id="calendarGrid">
            <div class="day-name">Su</div><div class="day-name">Mo</div><div class="day-name">Tu</div>
            <div class="day-name">We</div><div class="day-name">Th</div><div class="day-name">Fr</div><div class="day-name">Sa</div>
            ${daysHtml}
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

    function closeCMSModal() {
        const elements = document.querySelectorAll('button, a, div, span, i');
        let clicked = false;
        
        for (let el of elements) {
            if (el.id === 'bookBtn') continue; 
            
            const aria = (el.getAttribute('aria-label') || '').toLowerCase();
            const cls = (el.className && typeof el.className === 'string') ? el.className.toLowerCase() : '';
            const txt = el.textContent.trim().toLowerCase();
            
            if (aria.includes('close') || cls.includes('close') || txt === 'x' || txt === '×') {
                if (typeof el.click === 'function') {
                    el.click();
                    clicked = true;
                    break;
                }
            }
        }
        
        if (!clicked && targetDiv.parentNode) {
            const parentButtons = targetDiv.parentNode.querySelectorAll('button');
            for (let btn of parentButtons) {
                if (btn.id !== 'bookBtn') {
                    btn.click();
                    break;
                }
            }
        }
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' || e.keyCode === 27) {
            closeCMSModal();
        }
    });

    activeCalendarDays.forEach(day => {
        day.onclick = function() {
            activeCalendarDays.forEach(el => el.classList.remove('selected'));
            this.classList.add('selected');
            bookBtn.classList.remove('disabled');
            selectedInfo.innerHTML = `Selected: <strong>${this.dataset.date}</strong> - Price: <strong>$${this.dataset.price}</strong>`;
        };
    });

    bookBtn.onclick = function(e) {
        if (!this.classList.contains('disabled')) {
            setTimeout(closeCMSModal, 150); 
        }
    };
})();