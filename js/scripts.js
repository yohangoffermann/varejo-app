document.addEventListener('DOMContentLoaded', function() {
    const consorcioData = {
        creditoContratado: 2400000,
        lanceEmbutido: 600000,
        lanceRecursoProprio: 600000,
        creditoLiquido: 1800000,
        dinheiroNovo: 1200000,
        prazo: 240,
        parcela: 7500
    };

    const financiamentoData = {
        valorImovel: 1200000,
        entrada: 240000,
        valorFinanciado: 960000,
        prazo: 200,
        taxaJuros: 0.1049,
        parcelaInicial: 13052.90,
        parcelaFinal: 4865.07
    };

    // Cálculo do total pago no consórcio
    const totalPagoConsorcio = consorcioData.parcela * consorcioData.prazo;

    // Cálculo aproximado do total pago no financiamento (média das parcelas * prazo)
    const parcelaMediaFinanciamento = (financiamentoData.parcelaInicial + financiamentoData.parcelaFinal) / 2;
    const totalPagoFinanciamento = financiamentoData.entrada + (parcelaMediaFinanciamento * financiamentoData.prazo);

    // Configuração do gráfico
    const options = {
        series: [{
            name: 'Consórcio',
            data: [totalPagoConsorcio]
        }, {
            name: 'Financiamento Tradicional',
            data: [totalPagoFinanciamento]
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
            categories: ['Total Pago'],
        },
        yaxis: {
            title: {
                text: 'R$ (milhões)'
            }
        },
        fill: {
            opacity: 1
        },
        tooltip: {
            y: {
                formatter: function (val) {
                    return "R$ " + val.toFixed(2)
                }
            }
        }
    };

    const chart = new ApexCharts(document.querySelector("#comparisonChart"), options);
    chart.render();

    // Adicionar detalhes da análise
    const detailsHtml = `
        <h3>Consórcio</h3>
        <p>Crédito Contratado: R$ ${consorcioData.creditoContratado.toLocaleString('pt-BR')}</p>
        <p>Crédito Líquido: R$ ${consorcioData.creditoLiquido.toLocaleString('pt-BR')}</p>
        <p>Parcela: R$ ${consorcioData.parcela.toLocaleString('pt-BR')}</p>
        <p>Prazo: ${consorcioData.prazo} meses</p>
        <p>Total Pago: R$ ${totalPagoConsorcio.toLocaleString('pt-BR')}</p>

        <h3>Financiamento Tradicional</h3>
        <p>Valor do Imóvel: R$ ${financiamentoData.valorImovel.toLocaleString('pt-BR')}</p>
        <p>Entrada: R$ ${financiamentoData.entrada.toLocaleString('pt-BR')}</p>
        <p>Valor Financiado: R$ ${financiamentoData.valorFinanciado.toLocaleString('pt-BR')}</p>
        <p>Taxa de Juros: ${(financiamentoData.taxaJuros * 100).toFixed(2)}% a.a.</p>
        <p>Prazo: ${financiamentoData.prazo} meses</p>
        <p>Total Pago (estimativa): R$ ${totalPagoFinanciamento.toLocaleString('pt-BR')}</p>
    `;

    document.getElementById('analysisDetails').innerHTML = detailsHtml;
});
