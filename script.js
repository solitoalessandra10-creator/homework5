let chart;

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btnGenera").onclick = simula;
    document.getElementById("btnReset").onclick = reset;
});

// Generatore normale standard (Box-Muller)
function gaussianRandom() {
    let u1 = Math.random();
    let u2 = Math.random();

    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function simula() {
    const n = parseInt(document.getElementById("passi").value);
    const T = parseFloat(document.getElementById("tempo").value);
    const S0 = parseFloat(document.getElementById("S0").value);
    const mu = parseFloat(document.getElementById("mu").value);
    const sigma = parseFloat(document.getElementById("sigma").value);

    if (isNaN(n) || isNaN(T) || isNaN(S0) || isNaN(mu) || isNaN(sigma)) {
        alert("Inserisci numeri validi");
        return;
    }

    const dt = T / n;

    let tempi = [0];
    let valori = [S0];

    let S = S0;

    for (let i = 1; i <= n; i++) {
        let Z = gaussianRandom();

        // Evoluzione GBM (forma discreta)
        S = S * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * Z);

        tempi.push(Number((i * dt).toFixed(4)));
        valori.push(S);
    }

    disegnaGrafico(tempi, valori);
    aggiornaStats(n, T, S);
}

function disegnaGrafico(tempi, valori) {
    const ctx = document.getElementById("grafico").getContext("2d");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: tempi,
            datasets: [{
                label: 'GBM',
                data: valori,
                borderColor: '#0066cc',
                borderWidth: 1.5,
                pointRadius: 0,
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: { display: true, text: 'Tempo (t)' },
                    ticks: { maxTicksLimit: 10 }
                },
                y: {
                    title: { display: true, text: 'S(t)' }
                }
            }
        }
    });
}

function aggiornaStats(n, T, finale) {
    document.getElementById("stats").innerHTML = `
        <p><b>n:</b> ${n}</p>
        <p><b>T:</b> ${T.toFixed(2)}</p>
        <p><b>Valore finale S(T):</b> ${finale.toFixed(4)}</p>
    `;
}

function reset() {
    if (chart) chart.destroy();

    document.getElementById("stats").innerHTML = "";

    document.getElementById("passi").value = 1000;
    document.getElementById("tempo").value = 1;
    document.getElementById("S0").value = 100;
    document.getElementById("mu").value = 0.1;
    document.getElementById("sigma").value = 0.2;
}
