let prayers = {};

// Load prayers when the page loads
fetch('prayers.json')
    .then(response => response.json())
    .then(data => {
        prayers = data;
        const sortedPrayers = Object.fromEntries(
            Object.entries(prayers).sort(([a], [b]) => a.localeCompare(b))
        );
        prayers = sortedPrayers;
        renderPrayerList();
    })
    .catch(error => console.error('Error loading prayers:', error));

const getPrayers = (searchTerm = '', perPage = 100) => {
    const allPrayers = Object.keys(prayers);
    let filteredPrayers = allPrayers;

    // If search term exists, filter prayers
    if (searchTerm.trim()) {
        filteredPrayers = allPrayers.filter(prayerName => 
            prayerName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Return first n results based on perPage parameter
    return filteredPrayers.slice(0, perPage);
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

    prayerTitle.textContent = prayers[prayer].title;
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
});

document.getElementById('search-input').addEventListener('input', (e) => {
    renderPrayerList(e.target.value);
});