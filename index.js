let prayers = {};
let isOnline = navigator.onLine;

// Load prayers when the page loads
fetch('prayers.json')
    .then(response => response.json())
    .then(data => {
        prayers = data;
        const sortedPrayers = Object.fromEntries(
            Object.entries(prayers).sort(([a], [b]) => a.localeCompare(b))
        );
        prayers = sortedPrayers;
        
        // Calculate max title length and set CSS variable with 'ch'
        const maxLength = Math.max(...Object.keys(prayers).map(title => title.length));
        document.documentElement.style.setProperty('--max-title-length', `${maxLength}ch`);
        
        renderPrayerList();
    })
    .catch(error => console.error('Error loading prayers:', error));

window.addEventListener('online', function() {
    isOnline = true;
    updateOfflineStatus();
});

window.addEventListener('offline', function() {
    isOnline = false;
    updateOfflineStatus();
});

function updateOfflineStatus() {
    const offlineBar = document.getElementById('offline-notification');
    if (!isOnline) {
        offlineBar.classList.remove('hidden');
    } else {
        offlineBar.classList.add('hidden');
    }
}

const getPrayers = (searchTerm = '', category = '') => {
    const allPrayers = Object.keys(prayers);
    let filteredPrayers = allPrayers;

    // If search term exists, filter prayers
    if (searchTerm.trim()) {
        filteredPrayers = allPrayers.filter(prayerName => 
            prayerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    return filteredPrayers;
};

const renderPrayerList = (searchTerm = '') => {
    const prayerList = document.querySelector('ul');
    prayerList.innerHTML = ''; // Clear existing list

    const prayersToShow = getPrayers(searchTerm);
    
    if (prayersToShow.length === 0) {
        const li = document.createElement('li');
        li.className = 'text-xl font-bold';
        li.textContent = 'No prayers found';
        prayerList.appendChild(li);
        return;
    }

    prayersToShow.forEach(prayerName => {
        const li = document.createElement('li');
        li.className = 'text-xl font-bold';
        const button = document.createElement('button');
        button.onclick = () => showPrayer(prayerName);
        button.textContent = prayerName;
        li.appendChild(button);
        prayerList.appendChild(li);
    });
};

const showPrayer = (prayer) => {
    const prayerModal = document.getElementById('prayer-modal');
    const prayerTitle = document.getElementById('prayer-title');
    const prayerText = document.getElementById('prayer-text');
    const prayerSource = document.getElementById('prayer-source');

    prayerTitle.textContent = prayer;
    prayerText.innerHTML = prayers[prayer].text;
    prayerSource.href = prayers[prayer].source === "N/A" ? '' : prayers[prayer].source;
    prayerSource.textContent = prayers[prayer].source;
    prayerModal.showModal();
    prayerModal.scrollTop = 0;
}

const closePrayer = () => {
    const prayerModal = document.getElementById('prayer-modal');
    prayerModal.classList.add('closing');
    
    // Wait for animation to complete before actually closing
    setTimeout(() => {
        prayerModal.classList.remove('closing');
        prayerModal.close();
    }, 100); // Match this with animation duration (0.3s = 300ms)
}

document.addEventListener('DOMContentLoaded', () => {
    const prayerModal = document.getElementById('prayer-modal');
    prayerModal.addEventListener('click', (e) => {
        // Close only if clicking on backdrop (dialog itself), not its contents
        if (e.target === prayerModal) {
            closePrayer();
        }
    });
    
    // Check initial offline status
    updateOfflineStatus();
});

document.getElementById('search-input').addEventListener('input', (e) => {
    renderPrayerList(e.target.value);
});