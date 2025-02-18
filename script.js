function formatCurrency(input) {
    let value = input.value.replace(/\D/g, "");
    value = (parseFloat(value) / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    input.value = "R$ " + value;
}

function calcularAliquotas() {
    let select = document.getElementById("codigoServico");
    let selectedOption = select.options[select.selectedIndex];
    if (!selectedOption.value) return;

    let aliquotaFederal = parseFloat(selectedOption.dataset.federal);
    let aliquotaMunicipal = parseFloat(selectedOption.dataset.municipal);

    let valorBruto = document.getElementById("valorBruto").value.replace(/[^0-9,]/g, "").replace(",", ".");
    valorBruto = parseFloat(valorBruto);

    if (isNaN(valorBruto)) {
        document.getElementById("resultado").innerHTML = "";
        return;
    }

    let valorFederal = (valorBruto * (aliquotaFederal / 100)).toFixed(2).replace(".", ",");
    let valorMunicipal = (valorBruto * (aliquotaMunicipal / 100)).toFixed(2).replace(".", ",");

    let retencao = document.getElementById("retencao").value;
    let resultadoTexto = "O texto deverá ser colado no campo discriminação, na última linha (clique no botão 'Copiar' e cole na nfs-e)";
    let tributoTexto = `Trib aprox R$ ${valorFederal} Federal e R$ ${valorMunicipal} Municipal (Fonte: Versão IBPT: 25.1.B)`;

    if (retencao === "irrf" || retencao === "completo") {
        tributoTexto += `<br><br>Retenções na Fonte`;
        let irrf = (valorBruto * 0.015).toFixed(2).replace(".", ",");
        tributoTexto += `<br>IRRF - R$ ${irrf}`;
    }

    if (retencao === "completo") {
        let pis = (valorBruto * 0.0065).toFixed(2).replace(".", ",");
        let cofins = (valorBruto * 0.03).toFixed(2).replace(".", ",");
        let csll = (valorBruto * 0.01).toFixed(2).replace(".", ",");
        tributoTexto += `<br>Pis - R$ ${pis}`;
        tributoTexto += `<br>Cofins - R$ ${cofins}`;
        tributoTexto += `<br>CSLL - R$ ${csll}`;
    }

    resultadoTexto += `<br>${tributoTexto}`;
    document.getElementById("resultado").innerHTML = resultadoTexto;
}

function copiarTexto() {
    let resultadoElement = document.getElementById("resultado").innerHTML;
    let linhas = resultadoElement.split("<br>");
    let textoCopiar = linhas[1].replace(/<[^>]+>/g, "").trim();

    navigator.clipboard.writeText(textoCopiar).then(() => {
        alert("Texto copiado para a área de transferência!");
    });
}
