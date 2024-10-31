document.addEventListener('DOMContentLoaded', function() {
    const scenarios = [
        { credit: 1440000, entry: 334080, percentEntry: 27.84 },
        { credit: 1530000, entry: 250560, percentEntry: 20.88 },
        { credit: 1620000, entry: 167040, percentEntry: 13.92 },
        { credit: 1710000, entry: 83520, percentEntry: 6.96 },
        { credit: 1800000, entry: 0, percentEntry: 0 }
    ];

    const financiamentoTradicional = {
        valorImovel: 1200000,
        entrada: 240000,
        valorFinanciado: 960000,
        prazo: 200,
        taxaJuros: 0.1049,
        parcelaInicial: 13052.90,
        parcelaFinal: 4865.07
    };

    const retornoAlvo = 470400;
    const valorImovel = 1200000;

    function calcularTotalPago(scenario) {
        return scenario.credit + scenario.entry;
    }

    function calcularRetornoAdenir(scenario) {
        const parcelasPagas12Meses = scenario.credit * 0.072; // 7.2% em 12 meses
        return scenario.credit + scenario.entry - valorImovel - parcelasPagas12Meses;
    }

    function calcularTotalPagoFinanciamento() {
        const parcelaMedia = (financiamentoTradicional.parcelaInicial + financiamentoTradicional.parcelaFinal) / 2;
        return financiamentoTradicional.entrada + (parcelaMedia * financiamentoTradicional.prazo);
    }

    function renderMainChart() {
        const chartData = scenarios.map((scenario, index) => ({
            x: `Crédito ${formatCurrency(scenario.credit)}`,
            y: calcularTotalPago(scenario)
        }));
        chartData.push({
            x: 'Financiamento Tradicional',
            y: calcularTotalPagoFinanciamento()
        });

        const options = {
            series: [{
                name: 'Total Pago',
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
            colors: ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6', '#34495e'],
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
            <p>Esta análise compara diferentes cenários de consórcio com o financiamento tradicional, mantendo um retorno constante de ${formatCurrency(retornoAlvo)} para Adenir em todos os casos.</p>
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
                    <th>Total Pago</th>
                    <th>Retorno Adenir</th>
                </tr>
        `;

        scenarios.forEach((scenario, index) => {
            html += `
                <tr>
                    <td>Cenário ${index + 1}</td>
                    <td>${formatCurrency(scenario.credit)}</td>
                    <td>${formatCurrency(scenario.entry)}</td>
                    <td>${scenario.percentEntry.toFixed(2)}%</td>
                    <td>${formatCurrency(calcularTotalPago(scenario))}</td>
                    <td>${formatCurrency(calcularRetornoAdenir(scenario))}</td>
                </tr>
            `;
        });

        html += '</table>';
        document.getElementById('scenariosDetails').innerHTML = html;
    }

    function renderFinancingDetails() {
        const totalPago = calcularTotalPagoFinanciamento();
        const html = `
            <table>
                <tr><th>Parâmetro</th><th>Valor</th></tr>
                <tr><td>Valor do Imóvel</td><td>${formatCurrency(financiamentoTradicional.valorImovel)}</td></tr>
                <tr><td>Entrada</td><td>${formatCurrency(financiamentoTradicional.entrada)}</td></tr>
                <tr><td>Valor Financiado</td><td>${formatCurrency(financiamentoTradicional.valorFinanciado)}</td></tr>
                <tr><td>Taxa de Juros</td><td>${(financiamentoTradicional.taxaJuros * 100).toFixed(2)}% a.a.</td></tr>
                <tr><td>Prazo</td><td>${financiamentoTradicional.prazo} meses</td></tr>
                <tr><td>Parcela Inicial</td><td>${formatCurrency(financiamentoTradicional.parcelaInicial)}</td></tr>
                <tr><td>Parcela Final</td><td>${formatCurrency(financiamentoTradicional.parcelaFinal)}</td></tr>
                <tr><td>Total Pago (estimativa)</td><td>${formatCurrency(totalPago)}</td></tr>
            </table>
        `;
        document.getElementById('financingDetails').innerHTML = html;
    }

    function renderComparisonChart() {
        const data = scenarios.map((scenario, index) => ({
            scenario: `Crédito ${formatCurrency(scenario.credit)}`,
            consorcio: calcularTotalPago(scenario),
            financiamento: calcularTotalPagoFinanciamento()
        }));

        const options = {
            series: [{
                name: 'Consórcio',
                data: data.map(d => d.consorcio)
            }, {
                name: 'Financiamento Tradicional',
                data: data.map(d => d.financiamento)
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
                categories: data.map(d => d.scenario),
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

        const chart = new ApexCharts(document.querySelector("#comparisonChart"), options);
        chart.render();
    }

    function renderComparisonTable() {
        let html = `
            <table>
                <tr>
                    <th>Cenário</th>
                    <th>Consórcio</th>
                    <th>Financiamento</th>
                    <th>Diferença</th>
                    <th>Economia (%)</th>
                    <th>Retorno Adenir</th>
                </tr>
        `;

        const totalPagoFinanciamento = calcularTotalPagoFinanciamento();

        scenarios.forEach((scenario, index) => {
            const totalPagoConsorcio = calcularTotalPago(scenario);
            const diferenca = totalPagoFinanciamento - totalPagoConsorcio;
            const percentualEconomia = (diferenca / totalPagoFinanciamento) * 100;
            const retornoAdenir = calcularRetornoAdenir(scenario);

            html += `
                <tr>
                    <td>Crédito ${formatCurrency(scenario.credit)}</td>
                    <td>${formatCurrency(totalPagoConsorcio)}</td>
                    <td>${formatCurrency(totalPagoFinanciamento)}</td>
                    <td>${formatCurrency(diferenca)}</td>
                    <td>${percentualEconomia.toFixed(2)}%</td>
                    <td>${formatCurrency(retornoAdenir)}</td>
                </tr>
            `;
        });

        html += '</table>';
        document.getElementById('comparisonTable').innerHTML = html;
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    // Initialize the page
    renderMainChart();
    renderOverviewSummary();
    renderScenariosDetails();
    renderFinancingDetails();
    renderComparisonChart();
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
