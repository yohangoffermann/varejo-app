document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcular');
    calcularBtn.addEventListener('click', realizarCalculos);

    function realizarCalculos() {
        const valorImovel = parseFloat(document.getElementById('valorImovel').value);
        const valorFinanciamento = parseFloat(document.getElementById('valorFinanciamento').value);
        const prazoMeses = parseInt(document.getElementById('prazoMeses').value);

        const taxasFinanciamento = {
            santander: 0.0099, // 0.99% ao mês
            itau: 0.0095,      // 0.95% ao mês
            bradesco: 0.0090,  // 0.90% ao mês
            inter: 0.0093      // 0.93% ao mês
        };

        const parcelasFinanciamento = calcularParcelasFinanciamento(valorFinanciamento, taxasFinanciamento, prazoMeses);
        const cenarioConsorcio = calcularCenariosConsorcio(valorImovel, prazoMeses);

        exibirTabelaComparativa(parcelasFinanciamento, cenarioConsorcio, valorImovel, valorFinanciamento, prazoMeses);
        exibirGraficoComparativo(parcelasFinanciamento, cenarioConsorcio);
        exibirFluxogramaConsorcio(cenarioConsorcio);
        exibirVantagens();
    }

    function calcularParcelasFinanciamento(valor, taxas, meses) {
        let resultado = {};
        for (let banco in taxas) {
            const taxaMensal = taxas[banco];
            resultado[banco] = valor * (taxaMensal * Math.pow(1 + taxaMensal, meses)) / (Math.pow(1 + taxaMensal, meses) - 1);
        }
        return resultado;
    }

    function calcularCenariosConsorcio(valorImovel, prazoMeses) {
        const taxaAdmAnual = 0.12; // 12% ao ano
        const taxaAdmMensal = taxaAdmAnual / 12;

        let cenarios = [];
        for (let razaoCredito = 1.2; razaoCredito <= 1.5; razaoCredito += 0.1) {
            const credito = valorImovel * razaoCredito;
            const parcelaMensal = (credito * (1 + taxaAdmAnual)) / prazoMeses;
            const entrada = credito - valorImovel;
            
            cenarios.push({
                razaoCredito: razaoCredito,
                credito: credito,
                parcelaMensal: parcelaMensal,
                entrada: entrada,
                prazo: prazoMeses
            });
        }
        return cenarios;
    }

    function exibirTabelaComparativa(parcelasFinanciamento, cenarioConsorcio, valorImovel, valorFinanciamento, prazoMeses) {
        let html = '<table><tr><th>Opção</th><th>Parcela Inicial</th><th>Entrada</th><th>Prazo (meses)</th></tr>';
        
        for (let banco in parcelasFinanciamento) {
            html += `<tr>
                <td>${banco.charAt(0).toUpperCase() + banco.slice(1)}</td>
                <td>R$ ${parcelasFinanciamento[banco].toFixed(2)}</td>
                <td>R$ ${(valorImovel - valorFinanciamento).toFixed(2)}</td>
                <td>${prazoMeses}</td>
            </tr>`;
        }

        cenarioConsorcio.forEach(cenario => {
            html += `<tr>
                <td>Consórcio (${(cenario.razaoCredito * 100).toFixed(0)}%)</td>
                <td>R$ ${cenario.parcelaMensal.toFixed(2)}</td>
                <td>R$ ${cenario.entrada.toFixed(2)}</td>
                <td>${cenario.prazo}</td>
            </tr>`;
        });

        html += '</table>';
        document.getElementById('tabelaComparativa').innerHTML = html;
    }

    function exibirGraficoComparativo(parcelasFinanciamento, cenarioConsorcio) {
        const options = {
            series: [
                ...Object.entries(parcelasFinanciamento).map(([banco, parcela]) => ({
                    name: banco.charAt(0).toUpperCase() + banco.slice(1),
                    data: [parcela]
                })),
                ...cenarioConsorcio.map(cenario => ({
                    name: `Consórcio ${(cenario.razaoCredito * 100).toFixed(0)}%`,
                    data: [cenario.parcelaMensal]
                }))
            ],
            chart: {
                type: 'bar',
                height: 350
            },
            plotOptions: {
                bar: {
                    horizontal: true,
                }
            },
            dataLabels: {
                enabled: false
            },
            xaxis: {
                categories: ['Parcela Mensal'],
                title: {
                    text: 'Valor da Parcela (R$)'
                }
            },
            yaxis: {
                title: {
                    text: 'Opções de Financiamento'
                }
            },
            title: {
                text: 'Comparativo de Parcelas Mensais',
                align: 'center'
            }
        };

        const chart = new ApexCharts(document.querySelector("#graficoComparativo"), options);
        chart.render();
    }

    function exibirFluxogramaConsorcio(cenarioConsorcio) {
        // Implementação do fluxograma (pode ser expandido posteriormente)
        let html = '<h3>Fluxo de Caixa Simplificado:</h3>';
        html += '<ul>';
        cenarioConsorcio.forEach(cenario => {
            html += `<li>Crédito ${(cenario.razaoCredito * 100).toFixed(0)}%:`;
            html += `<ul>`;
            html += `<li>Entrada: R$ ${cenario.entrada.toFixed(2)}</li>`;
            html += `<li>Parcelas Mensais: R$ ${cenario.parcelaMensal.toFixed(2)} por ${cenario.prazo} meses</li>`;
            html += `</ul>`;
            html += `</li>`;
        });
        html += '</ul>';
        document.getElementById('fluxogramaConsorcio').innerHTML = html;
    }

    function exibirVantagens() {
        const vantagens = [
            "Flexibilidade na escolha do valor de crédito",
            "Possibilidade de crédito superior ao valor do imóvel",
            "Taxas geralmente mais baixas que financiamento tradicional",
            "Não há incidência de juros, apenas taxa de administração",
            "Possibilidade de usar o FGTS para pagamento de parcelas ou lance"
        ];

        let html = '';
        vantagens.forEach(vantagem => {
            html += `<li>${vantagem}</li>`;
        });

        document.getElementById('listaVantagens').innerHTML = html;
    }

    // Inicializar a página com os cálculos
    realizarCalculos();
});
