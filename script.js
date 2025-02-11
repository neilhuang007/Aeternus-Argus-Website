document.addEventListener('DOMContentLoaded', function() {
    // ========== Full Page Variables ==========
    const pages = document.querySelectorAll('.page');
    let currentPage = 0;
    let isAnimating = false;
    const animDuration = 800; // in milliseconds (should match your CSS animation duration)

    // ========== Subpage Variables ==========
    // These will be set if the current full page contains subpages.
    let subpages = [];
    let currentSubpage = 0;

    // ========== Initialization for Full Pages ==========
    pages.forEach((page, index) => {
        if (index === currentPage) {
            page.style.display = "flex"; // Use your original flex formatting.
            page.classList.add("active");
        } else {
            page.style.display = "none";
            page.classList.remove("active");
        }
    });

    // ========== Helper: Update Subpages ==========
    // If the current full page contains an XGB-info container, update the subpages list.
    function updateSubpages() {
        const currentContainer = pages[currentPage];
        const xgbInfo = currentContainer.querySelector('.XGB-info');
        if (xgbInfo) {
            subpages = xgbInfo.querySelectorAll('.subpage');
            currentSubpage = 0;
            // Ensure only the first subpage is active.
            subpages.forEach((sp, idx) => {
                if (idx === 0) sp.classList.add('active');
                else sp.classList.remove('active');
            });
        } else {
            subpages = [];
            currentSubpage = 0;
        }
    }

    // Call once on load.
    updateSubpages();

    // ========== Full Page Transition Function ==========
    function changeFullPage(newIndex, direction) {
        if (isAnimating || newIndex < 0 || newIndex >= pages.length || newIndex === currentPage) return;
        isAnimating = true;
        const current = pages[currentPage];
        const next = pages[newIndex];

        // Prepare the next page.
        next.style.display = "flex";
        next.style.zIndex = "1";
        current.style.zIndex = "2";

        // Add animation classes based on direction.
        if (direction === 'down') {
            current.classList.add('slide-out-up');
            next.classList.add('slide-in-up');
        } else if (direction === 'up') {
            current.classList.add('slide-out-down');
            next.classList.add('slide-in-down');
        }

        // After the animation, clean up.
        setTimeout(() => {
            current.classList.remove('slide-out-up', 'slide-out-down', 'active');
            next.classList.remove('slide-in-up', 'slide-in-down');
            current.style.display = "none";
            current.style.zIndex = "";
            next.style.zIndex = "";
            next.classList.add("active");
            currentPage = newIndex;
            isAnimating = false;
            updateSubpages(); // Update subpages if the new full page contains them.
        }, animDuration);
    }

    // ========== Subpage Transition Function ==========
    // Returns true if a subpage transition occurred; false otherwise.
    function changeSubpage(newIndex) {
        if (newIndex < 0 || newIndex >= subpages.length) return false;
        subpages[currentSubpage].classList.remove('active');
        currentSubpage = newIndex;
        subpages[currentSubpage].classList.add('active');
        return true;
    }

    // ========== Next/Previous Button Event Listeners ==========
    // They now first check for subpages in the current full page.
    const nextButton = document.querySelector('.primary-button.nextpage');
    const prevButton = document.querySelector('.primary-button.previouspage');

    if (nextButton) {
        nextButton.addEventListener('click', function() {
            // If the current full page contains subpages and we're not at the last one, cycle through them.
            if (subpages.length > 0 && currentSubpage < subpages.length - 1) {
                changeSubpage(currentSubpage + 1);
            } else {
                // Otherwise, trigger a full-page transition (if possible).
                if (!isAnimating && currentPage < pages.length - 1) {
                    changeFullPage(currentPage + 1, 'down');
                }
            }
        });
    }

    if (prevButton) {
        prevButton.addEventListener('click', function() {
            // If the current full page contains subpages and we're not at the first one, cycle back.
            if (subpages.length > 0 && currentSubpage > 0) {
                changeSubpage(currentSubpage - 1);
            } else {
                // Otherwise, trigger a full-page transition to the previous page.
                if (!isAnimating && currentPage > 0) {
                    changeFullPage(currentPage - 1, 'up');
                }
            }
        });
    }

    // ========== Wheel (Scroll) Event Listener ==========
    // Similarly, the wheel event checks for subpage transitions first.
    window.addEventListener('wheel', function(e) {
        if (isAnimating) return;
        if (e.deltaY > 0) {
            // On scroll down, try to go to next subpage first.
            if (subpages.length > 0 && currentSubpage < subpages.length - 1) {
                changeSubpage(currentSubpage + 1);
            } else if (currentPage < pages.length - 1) {
                changeFullPage(currentPage + 1, 'down');
            }
        } else if (e.deltaY < 0) {
            // On scroll up, try to go to previous subpage first.
            if (subpages.length > 0 && currentSubpage > 0) {
                changeSubpage(currentSubpage - 1);
            } else if (currentPage > 0) {
                changeFullPage(currentPage - 1, 'up');
            }
        }
    });
});
