document.addEventListener('DOMContentLoaded', function() {
    const scenarios = [
        { credit: 1440000, entry: 334080 },
        { credit: 1530000, entry: 250560 },
        { credit: 1620000, entry: 167040 },
        { credit: 1710000, entry: 83520 },
        { credit: 1800000, entry: 0 }
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

    function calcularTotalPago(scenario) {
        return scenario.credit + scenario.entry;
    }

    function calcularTotalPagoFinanciamento() {
        const parcelaMedia = (financiamentoTradicional.parcelaInicial + financiamentoTradicional.parcelaFinal) / 2;
        return financiamentoTradicional.entrada + (parcelaMedia * financiamentoTradicional.prazo);
    }

    // Dados para o gráfico
    const chartData = scenarios.map((scenario, index) => ({
        x: `Cenário ${index + 1}`,
        y: calcularTotalPago(scenario)
    }));
    chartData.push({
        x: 'Financiamento Tradicional',
        y: calcularTotalPagoFinanciamento()
    });

    // Configuração do gráfico
    const options = {
        series: [{
            name: 'Total Pago',
            data: chartData
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
        xaxis: {
            categories: chartData.map(item => item.x),
        },
        yaxis: {
            title: {
                text: 'R$ (milhões)'
            },
            labels: {
                formatter: function (value) {
                    return (value / 1000000).toFixed(2);
                }
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "R$ " + val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
                }
            }
        }
    };

    const chart = new ApexCharts(document.querySelector("#comparisonChart"), options);
    chart.render();

    // Adicionar detalhes da análise
    let detailsHtml = `
        <h3>Cenários de Consórcio</h3>
        <table>
            <tr>
                <th>Cenário</th>
                <th>Crédito</th>
                <th>Entrada</th>
                <th>Total</th>
            </tr>
    `;

    scenarios.forEach((scenario, index) => {
        detailsHtml += `
            <tr>
                <td>Cenário ${index + 1}</td>
                <td>R$ ${scenario.credit.toLocaleString('pt-BR')}</td>
                <td>R$ ${scenario.entry.toLocaleString('pt-BR')}</td>
                <td>R$ ${calcularTotalPago(scenario).toLocaleString('pt-BR')}</td>
            </tr>
        `;
    });

    detailsHtml += `
        </table>

        <h3>Financiamento Tradicional</h3>
        <p>Valor do Imóvel: R$ ${financiamentoTradicional.valorImovel.toLocaleString('pt-BR')}</p>
        <p>Entrada: R$ ${financiamentoTradicional.entrada.toLocaleString('pt-BR')}</p>
        <p>Valor Financiado: R$ ${financiamentoTradicional.valorFinanciado.toLocaleString('pt-BR')}</p>
        <p>Taxa de Juros: ${(financiamentoTradicional.taxaJuros * 100).toFixed(2)}% a.a.</p>
        <p>Prazo: ${financiamentoTradicional.prazo} meses</p>
        <p>Parcela Inicial: R$ ${financiamentoTradicional.parcelaInicial.toLocaleString('pt-BR')}</p>
        <p>Parcela Final: R$ ${financiamentoTradicional.parcelaFinal.toLocaleString('pt-BR')}</p>
        <p>Total Pago (estimativa): R$ ${calcularTotalPagoFinanciamento().toLocaleString('pt-BR')}</p>

        <h3>Comparação</h3>
        <table>
            <tr>
                <th>Opção</th>
                <th>Total Pago</th>
                <th>Diferença vs. Financiamento</th>
            </tr>
    `;

    const totalPagoFinanciamento = calcularTotalPagoFinanciamento();
    scenarios.forEach((scenario, index) => {
        const totalPago = calcularTotalPago(scenario);
        const diferenca = totalPagoFinanciamento - totalPago;
        detailsHtml += `
            <tr>
                <td>Cenário ${index + 1}</td>
                <td>R$ ${totalPago.toLocaleString('pt-BR')}</td>
                <td>R$ ${diferenca.toLocaleString('pt-BR')}</td>
            </tr>
        `;
    });

    detailsHtml += `
            <tr>
                <td>Financiamento Tradicional</td>
                <td>R$ ${totalPagoFinanciamento.toLocaleString('pt-BR')}</td>
                <td>-</td>
            </tr>
        </table>
    `;

    document.getElementById('analysisDetails').innerHTML = detailsHtml;
});
