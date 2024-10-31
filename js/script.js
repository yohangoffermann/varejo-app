document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcular');
    calcularBtn.addEventListener('click', realizarCalculos);

    function realizarCalculos() {
        const valorImovel = parseFloat(document.getElementById('valorImovel').value);
        const valorFinanciamento = parseFloat(document.getElementById('valorFinanciamento').value);
        const prazoMeses = parseInt(document.getElementById('prazoMeses').value);

        const taxasFinanciamento = {
            santander: 0.1229 / 12,
            itau: 0.1159 / 12,
            bradesco: 0.1049 / 12,
            inter: 0.1149 / 12
        };

        const parcelasFinanciamento = calcularParcelasFinanciamento(valorFinanciamento, taxasFinanciamento, prazoMeses);
        const cenarioConsorcio = calcularCenariosConsorcio(valorImovel);

        exibirTabelaComparativa(parcelasFinanciamento, cenarioConsorcio);
        exibirGraficoComparativo(parcelasFinanciamento, cenarioConsorcio);
        exibirFluxogramaConsorcio(cenarioConsorcio);
        exibirVantagens(cenarioConsorcio, parcelasFinanciamento);
    }

    function calcularParcelasFinanciamento(valor, taxas, meses) {
        let resultado = {};
        for (let banco in taxas) {
            resultado[banco] = (valor * taxas[banco]) / (1 - Math.pow(1 + taxas[banco], -meses));
        }
        return resultado;
    }

    function calcularCenariosConsorcio(valorImovel) {
        const taxaAnualConsorcio = 0.072;
        const taxaMensalConsorcio = taxaAnualConsorcio / 12;
        const prazoConsorcio = 202; // Mesmo prazo do financiamento tradicional

        let cenarios = [];
        for (let razaoCredito = 1.2; razaoCredito <= 1.5; razaoCredito += 0.1) {
            const credito = valorImovel * razaoCredito;
            const parcelaMensal = (credito * taxaMensalConsorcio) / (1 - Math.pow(1 + taxaMensalConsorcio, -prazoConsorcio));
            const entrada = credito - valorImovel;
            
            cenarios.push({
                razaoCredito: razaoCredito,
                credito: credito,
                parcelaMensal: parcelaMensal,
                entrada: entrada,
                prazo: prazoConsorcio
            });
        }
        return cenarios;
    }

    function exibirTabelaComparativa(parcelasFinanciamento, cenarioConsorcio) {
        let html = '<table><tr><th>Opção</th><th>Parcela Inicial</th><th>Entrada</th><th>Prazo (meses)</th></tr>';
        
        for (let banco in parcelasFinanciamento) {
            html += `<tr><td>${banco.charAt(0).toUpperCase() + banco.slice(1)}</td><td>R$ ${parcelasFinanciamento[banco].toFixed(2)}</td><td>R$ ${(valorImovel - valorFinanciamento).toFixed(2)}</td><td>${prazoMeses}</td></tr>`;
        }

        cenarioConsorcio.forEach(cenario => {
            html += `<tr><td>Consórcio (${(cenario.razaoCredito * 100).toFixed(0)}%)</td><td>R$ ${cenario.parcelaMensal.toFixed(2)}</td><td>R$ ${cenario.entrada.toFixed(2)}</td><td>${cenario.prazo}</td></tr>`;
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
        // Implementar visualização do fluxograma do consórcio
        // Pode ser um diagrama simples ou uma representação textual
    }

    function exibirVantagens(cenarioConsorcio, parcelasFinanciamento) {
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
