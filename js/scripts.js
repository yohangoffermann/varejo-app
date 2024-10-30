document.addEventListener('DOMContentLoaded', function() {
    const scenarios = [
        {
            credit: 1440000,
            entry: 334080,
            balance: 1624320,
            monthlyPayment: 8640
        },
        {
            credit: 1530000,
            entry: 250560,
            balance: 1725840,
            monthlyPayment: 9180
        },
        {
            credit: 1620000,
            entry: 167040,
            balance: 1827360,
            monthlyPayment: 9720
        },
        {
            credit: 1710000,
            entry: 83520,
            balance: 1928880,
            monthlyPayment: 10260
        },
        {
            credit: 1800000,
            entry: 0,
            balance: 2030400,
            monthlyPayment: 10800
        }
    ];

    const traditionalFinancing = {
        entry: 240000,
        balance: 960000,
        initialPayment: 13052,
        finalPayment: 4865.07,
        term: 200
    };

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function createFlowDiagram() {
        const flowDiagram = document.querySelector('.flow-diagram');
        flowDiagram.innerHTML = `
            <div class="flow-item">
                <h3>Adenir</h3>
                <p>Imóvel: ${formatCurrency(1200000)}</p>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-item">
                <h3>Consórcio</h3>
                <p>Crédito: ${formatCurrency(scenarios[4].credit)}</p>
            </div>
            <div class="flow-arrow">→</div>
            <div class="flow-item">
                <h3>Comprador</h3>
                <p>Assume: ${formatCurrency(scenarios[4].balance)}</p>
            </div>
        `;
    }

    function createScenarioContent(scenario) {
        return `
            <div class="card">
                <h3>Detalhes do Cenário</h3>
                <p>Crédito: ${formatCurrency(scenario.credit)}</p>
                <p>Entrada: ${formatCurrency(scenario.entry)}</p>
                <p>Saldo Assumido: ${formatCurrency(scenario.balance)}</p>
                <p>Parcela Mensal: ${formatCurrency(scenario.monthlyPayment)}</p>
            </div>
        `;
    }

    function updateScenarioContent(scenarioIndex) {
        const scenarioContent = document.querySelector('.scenario-content');
        scenarioContent.innerHTML = createScenarioContent(scenarios[scenarioIndex]);
    }

    function createComparisonChart() {
        const ctx = document.getElementById('comparisonChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Cenário 1', 'Cenário 2', 'Cenário 3', 'Cenário 4', 'Cenário 5', 'Financiamento Tradicional'],
                datasets: [{
                    label: 'Valor Total Pago',
                    data: [
                        scenarios[0].balance,
                        scenarios[1].balance,
                        scenarios[2].balance,
                        scenarios[3].balance,
                        scenarios[4].balance,
                        traditionalFinancing.balance + traditionalFinancing.entry
                    ],
                    backgroundColor: [
                        'rgba(75, 192, 192, 0.6)',
                        'rgba(54, 162, 235, 0.6)',
                        'rgba(255, 206, 86, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(153, 102, 255, 0.6)',
                        'rgba(255, 159, 64, 0.6)'
                    ],
                    borderColor: [
                        'rgba(75, 192, 192, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(255, 99, 132, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Valor Total (R$)'
                        }
                    }
                }
            }
        });
    }

    function createComparisonTable() {
        const comparisonTable = document.querySelector('.comparison-table');
        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Cenário</th>
                        <th>Entrada</th>
                        <th>Saldo Assumido</th>
                        <th>Parcela Mensal</th>
                        <th>Prazo (meses)</th>
                        <th>Total Pago</th>
                    </tr>
                </thead>
                <tbody>
        `;

        scenarios.forEach((scenario, index) => {
            tableHTML += `
                <tr>
                    <td>Cenário ${index + 1}</td>
                    <td>${formatCurrency(scenario.entry)}</td>
                    <td>${formatCurrency(scenario.balance)}</td>
                    <td>${formatCurrency(scenario.monthlyPayment)}</td>
                    <td>188</td>
                    <td>${formatCurrency(scenario.balance)}</td>
                </tr>
            `;
        });

        tableHTML += `
                <tr>
                    <td>Financiamento Tradicional</td>
                    <td>${formatCurrency(traditionalFinancing.entry)}</td>
                    <td>${formatCurrency(traditionalFinancing.balance)}</td>
                    <td>${formatCurrency(traditionalFinancing.initialPayment)} (inicial)</td>
                    <td>${traditionalFinancing.term}</td>
                    <td>${formatCurrency(traditionalFinancing.balance + traditionalFinancing.entry)}</td>
                </tr>
            </tbody>
        </table>
        `;

        comparisonTable.innerHTML = tableHTML;
    }

    // Initialize page content
    createFlowDiagram();
    updateScenarioContent(0);
    createComparisonChart();
    createComparisonTable();

    // Setup tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            updateScenarioContent(index);
        });
    });
});
