const { listarTransacoes, obterExtrato } = require('../controladores/transacoes');
const pdfMake = require('pdfmake');

const geradorDePdf = async (req, res) => {
    const { usuario } = req;

    try {
        const dataTransaction = await listarTransacoes(usuario, req);
        const dataExtract = await obterExtrato(usuario);

        const fonts = {
            Roboto: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique'
            }
        };

        const printer = new pdfMake(fonts);

        const imageBase64 = "data:image/png;base64,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"

        const docDefinition = {
            content: [
                { text: 'Relatório de Movimentação', style: 'title' },
                { text: '\n\n' },
                { text: 'Transações', style: 'header' },
                createTransactionTable(dataTransaction),
                { text: '\n\n' },
                { text: 'Extrato', style: 'header' },
                createExtractTable(dataExtract),
            ],
            footer: function (currentPage, pageCount) {
                return [
                    { text: 'Desenvolvido por Solutions D', style: 'footer', alignment: 'center', margin: [0, 0, 0, 10] },
                    { text: currentPage.toString() + ' / ' + pageCount, alignment: 'right', margin: [0, 0, 10, 0] }
                ];
            },
            background: [
                {
                    image: imageBase64,
                    width: 70,
                    height: 20,
                    margin: [30, 20, 0, 0],
                }
            ],
            styles: {
                title: {
                    bold: true,
                    fontSize: 18,
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                header: {
                    bold: true,
                    fontSize: 14,
                    margin: [0, 0, 0, 10]
                },
                description: {
                    fontSize: 10
                },
                value: {
                    fontSize: 10 // Font-size menor para os valores
                },
                date: {
                    fontSize: 10
                },
                categorie: {
                    fontSize: 10
                },
                type: {
                    fontSize: 10
                }
            }
        };

        const pdfDoc = printer.createPdfKitDocument(docDefinition);

        // Define os headers da resposta
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio.pdf');

        pdfDoc.pipe(res);
        pdfDoc.end();

    } catch (error) {
        console.log(error);
        res.status(500).send('Erro ao gerar relatório');
    }
}

function createTransactionTable(data) {
    const tableBody = [];
    const headerRow = [
        { text: 'Descrição', bold: true },
        { text: 'Valor', bold: true },
        { text: 'Data', bold: true },
        { text: 'Categoria', bold: true },
        { text: 'Tipo', bold: true } // Adiciona o header 'Tipo'
    ];

    tableBody.push(headerRow);

    data.forEach(transaction => {
        const row = [
            { text: transaction.descricao, style: 'description' },
            { text: formatCurrency(transaction.valor), style: 'value' }, // Aplica o estilo 'value' para os valores
            { text: formatDate(transaction.data), style: 'date' },
            { text: transaction.categoria_nome, style: 'categorie' },
            { text: transaction.tipo.charAt(0).toUpperCase() + transaction.tiop.slice(1), style: 'type' } // Adiciona o tipo de transação
        ];
        tableBody.push(row);
    });

    // Adiciona uma linha com o total dos valores de transação
    const totalValue = data.reduce((acc, curr) => acc + curr.valor, 0);
    const totalRow = [{ text: 'Total', bold: true }, { text: formatCurrency(totalValue), bold: true, style: 'value' }, '', '', ''];
    tableBody.push(totalRow);

    return {
        table: {
            widths: ['*', 'auto', 'auto', '*', 'auto'],
            body: tableBody
        }
    };
}

function createExtractTable(data) {
    const tableBody = [];
    const headerRow = [{ text: 'Entrada', bold: true }, { text: 'Saída', bold: true }, { text: 'Saldo', bold: true }];
    tableBody.push(headerRow);

    const row = [
        { text: formatCurrency(data.entrada), style: 'value' }, // Aplica o estilo 'value' para os valores
        { text: formatCurrency(data.saida), style: 'value' }, // Aplica o estilo 'value' para os valores
        { text: formatCurrency(data.saldo), style: 'value' } // Aplica o estilo 'value' para os valores
    ];
    tableBody.push(row);

    return {
        table: {
            widths: ['auto', 'auto', 'auto'],
            body: tableBody
        }
    };
}

function formatCurrency(value) {
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
    return formatter.format(value / 100);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

module.exports = {
    geradorDePdf
}
