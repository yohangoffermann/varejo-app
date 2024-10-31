document.addEventListener('DOMContentLoaded', function() {
    const scenarios = [
        { credit: 1440000, entry: 334080, percentEntry: 27.84 },
        { credit: 1530000, entry: 250560, percentEntry: 20.88 },
        { credit: 1620000, entry: 167040, percentEntry: 13.92 },
        { credit: 1710000, entry: 83520, percentEntry: 6.96 },
        { credit: 1800000, entry: 0, percentEntry: 0 }
    ];

    const valorImovel = 1200000;
    const retornoAdenir = 470400;

    function calcularParcelasMensais(credito) {
        return credito * 0.072 / 12; // 7.2% ao ano
    }

    function calcularSaldoDevedor(credito, parcelasMensais) {
        return credito - (parcelasMensais * 12);
    }

    scenarios.forEach(scenario => {
        scenario.parcelasMensais = calcularParcelasMensais(scenario.credit);
        scenario.saldoDevedor = calcularSaldoDevedor(scenario.credit, scenario.parcelasMensais);
    });

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function renderMainChart() {
        const chartData = scenarios.map(scenario => ({
            x: `Crédito ${formatCurrency(scenario.credit)}`,
            y: scenario.credit + scenario.entry
        }));

        const options = {
            series: [{
                name: 'Total (Crédito + Entrada)',
                data: chartData.map(item => item.y)
            }],
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    horizontal: false,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: chartData.map(item => item.x),
            },
            yaxis: {
                title: {
                    text: 'Valor Total (R$)'
                },
                labels: {
                    formatter: function (value) {
                        return formatCurrency(value);
                    }
                }
            },
            colors: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'],
            tooltip: {
                y: {
                    formatter: function (val) {
                        return formatCurrency(val);
                    }
                }
            }
        };

        const chart = new ApexCharts(document.querySelector("#mainChart"), options);
        chart.render();
    }

    function renderOverviewSummary() {
        const summary = `
            <p>Esta análise compara diferentes cenários de consórcio, mantendo um retorno constante de ${formatCurrency(retornoAdenir)} para Adenir em todos os casos.</p>
            <p>Principais pontos:</p>
            <ul>
                <li>O valor do imóvel é fixo em ${formatCurrency(valorImovel)}.</li>
                <li>A entrada varia de 0% a 27,84% do valor do imóvel, dependendo do crédito.</li>
                <li>O retorno para Adenir é consistente em todos os cenários de consórcio.</li>
                <li>Esta estratégia oferece flexibilidade para atender diferentes perfis de compradores.</li>
            </ul>
        `;

        document.getElementById('overviewSummary').innerHTML = summary;
    }

    function renderScenariosDetails() {
        let html = `
            <table>
                <tr>
                    <th>Cenário</th>
                    <th>Crédito</th>
                    <th>Entrada</th>
                    <th>% Entrada</th>
                    <th>Parcela Mensal</th>
                    <th>Saldo Devedor (12 meses)</th>
                </tr>
        `;

        scenarios.forEach((scenario, index) => {
            html += `
                <tr>
                    <td>Cenário ${index + 1}</td>
                    <td>${formatCurrency(scenario.credit)}</td>
                    <td>${formatCurrency(scenario.entry)}</td>
                    <td>${scenario.percentEntry.toFixed(2)}%</td>
                    <td>${formatCurrency(scenario.parcelasMensais)}</td>
                    <td>${formatCurrency(scenario.saldoDevedor)}</td>
                </tr>
            `;
        });

        html += '</table>';
        document.getElementById('scenariosDetails').innerHTML = html;
    }

    function renderEntradaSaldoChart() {
        const options = {
            series: [{
                name: 'Entrada',
                data: scenarios.map(s => s.entry)
            }, {
                name: 'Saldo Devedor',
                data: scenarios.map(s => s.saldoDevedor)
            }],
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '55%',
                    endingShape: 'rounded'
                },
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['transparent']
            },
            xaxis: {
                categories: scenarios.map(s => `Crédito ${formatCurrency(s.credit)}`),
            },
            yaxis: {
                title: {
                    text: 'Valor (R$)'
                },
                labels: {
                    formatter: function (value) {
                        return formatCurrency(value);
                    }
                }
            },
            fill: {
                opacity: 1
            },
            tooltip: {
                y: {
                    formatter: function (val) {
                        return formatCurrency(val);
                    }
                }
            },
            colors: ['#3498db', '#e74c3c']
        };

        const chart = new ApexCharts(document.querySelector("#entradaSaldoChart"), options);
        chart.render();
    }

    function renderComparisonTable() {
        let html = `
            <table>
                <tr>
                    <th>Cenário</th>
                    <th>Crédito</th>
                    <th>Entrada</th>
                    <th>Saldo Devedor (12 meses)</th>
                    <th>Retorno Adenir</th>
                </tr>
        `;

        scenarios.forEach((scenario, index) => {
            html += `
                <tr>
                    <td>Cenário ${index + 1}</td>
                    <td>${formatCurrency(scenario.credit)}</td>
                    <td>${formatCurrency(scenario.entry)}</td>
                    <td>${formatCurrency(scenario.saldoDevedor)}</td>
                    <td>${formatCurrency(retornoAdenir)}</td>
                </tr>
            `;
        });

        html += '</table>';
        document.getElementById('comparisonTable').innerHTML = html;
    }

    // Initialize the page
    renderMainChart();
    renderOverviewSummary();
    renderScenariosDetails();
    renderEntradaSaldoChart();
    renderComparisonTable();

    // Navigation
    const navButtons = document.querySelectorAll('nav button');
    const sections = document.querySelectorAll('main section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.id.replace('Btn', '');
            sections.forEach(section => section.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
});
