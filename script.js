// DOM elements
const euroInput = document.getElementById('euro');
const rateInput = document.getElementById('rate');
const form = document.getElementById('converterForm');
const resultText = document.getElementById('resultText');
const fetchRateBtn = document.getElementById('fetchRate');

// Set current year in footer
document.getElementById('year').textContent = new Date().getFullYear();

// Fetch Euro to INR rate from an API (Open Exchange Rates or exchangerate-api.com, fallback: fixed rate)
async function fetchEuroToInrRate() {
    try {
        // Free API endpoint (please use your own key for production)
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/EUR');
        if (!response.ok) throw new Error('Failed to fetch rate');
        const data = await response.json();
        return data.rates.INR || null;
    } catch (err) {
        return null; // fallback
    }
}

// Handle 'Get Live Rate' button
fetchRateBtn.addEventListener('click', async () => {
    fetchRateBtn.disabled = true;
    fetchRateBtn.textContent = 'Getting...';
    const rate = await fetchEuroToInrRate();
    if (rate) {
        rateInput.value = rate.toFixed(2);
        fetchRateBtn.textContent = 'Live Rate ✓';
        setTimeout(() => {
            fetchRateBtn.textContent = 'Get Live Rate';
            fetchRateBtn.disabled = false;
        }, 1100);
    } else {
        fetchRateBtn.textContent = 'Try Again';
        fetchRateBtn.disabled = false;
    }
});

// Conversion handler
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const euro = parseFloat(euroInput.value);
    const rate = parseFloat(rateInput.value);

    if (isNaN(euro) || euro < 0) {
        resultText.innerHTML = `<span style="color:#c4001a">Please enter a valid Euro amount.</span>`;
        return;
    }
    if (isNaN(rate) || rate <= 0) {
        resultText.innerHTML = `<span style="color:#c4001a">Please enter a valid conversion rate.</span>`;
        return;
    }
    const rupees = euro * rate;
    resultText.innerHTML = `
        <span style="font-size:1.4rem; color:#20742a;">
            <b>€${euro.toLocaleString('en-IN')} = ₹${rupees.toLocaleString('en-IN', {minimumFractionDigits: 2})}</b>
        </span>
        <br>
        <span style="font-size:1.05rem; color:#2a5298;">
            (Rate: 1 EUR = ₹${rate.toLocaleString('en-IN', {minimumFractionDigits: 2})})
        </span>
    `;
});

// Optional: Pre-fill live rate on page load
window.addEventListener('DOMContentLoaded', async () => {
    fetchRateBtn.textContent = 'Getting...';
    fetchRateBtn.disabled = true;
    const rate = await fetchEuroToInrRate();
    if (rate) {
        rateInput.value = rate.toFixed(2);
    }
    fetchRateBtn.textContent = 'Get Live Rate';
    fetchRateBtn.disabled = false;
});
