/* 
    UPC-A Barcode.

    Barcode-type: 
        0 = Normal UPC Code. 
        1 = Reserved. 
        2 = articles where the price varies by the weight
        3 = National Drug Code (NDC) and National Health Related Items Code (HRI).
        4 = UPC Code which can be used without format limits
        5 = Coupon
        6 = normal UPC code
        7 = normal UPC code 
        8 = reserved
        9 = reserved 
    generateBarcode(Barcode type (0,2,3,5)(enter as number)), 'Manufacturer code(enter as string) 5 digits', 'Product code (enter as string)') 5 digits
    generateBarcode(0, '51000', '01251')
*/
// Barcode number list 0,1,2,3,4,5,6,7,8,9 https://www.cut-the-knot.org/do_you_know/BarcodeEncoding.shtml
let barcodeLeft = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011'];
let barcodeRight = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100'];
let leftGuard = '101';
let rightGuard = '101';
let centerGurad = '01010';

function generateBarcodeArrayL(number) {
    let returnNumber;
    switch (number) {
        case 0: returnNumber = barcodeLeft[0]; break;
        case 1: returnNumber = barcodeLeft[1]; break;
        case 2: returnNumber = barcodeLeft[2]; break;
        case 3: returnNumber = barcodeLeft[3]; break;
        case 4: returnNumber = barcodeLeft[4]; break;
        case 5: returnNumber = barcodeLeft[5]; break;
        case 6: returnNumber = barcodeLeft[6]; break;
        case 7: returnNumber = barcodeLeft[7]; break;
        case 8: returnNumber = barcodeLeft[8]; break;
        case 9: returnNumber = barcodeLeft[9]; break;
    }
    return returnNumber;
}
function generateBarcodeArrayR(number) {
    let returnNumber;
    switch (number) {
        case 0: returnNumber = barcodeRight[0]; break;
        case 1: returnNumber = barcodeRight[1]; break;
        case 2: returnNumber = barcodeRight[2]; break;
        case 3: returnNumber = barcodeRight[3]; break;
        case 4: returnNumber = barcodeRight[4]; break;
        case 5: returnNumber = barcodeRight[5]; break;
        case 6: returnNumber = barcodeRight[6]; break;
        case 7: returnNumber = barcodeRight[7]; break;
        case 8: returnNumber = barcodeRight[8]; break;
        case 9: returnNumber = barcodeRight[9]; break;
    }
    return returnNumber;
}
// Type = barcode-type, manufacturerID = Manufacturer Code, productID = Product Code.
function generateBarcode(type, manufacturerID, productID) {
    let mid = manufacturerID
    let pid = productID;
    let tid = type;
    // Barcode Check Digit generator. i.e: https://azaleabarcodes.com/white-papers/upc-barcode-check-digit/
    //checkDigit = (type + manufacturerID.toString() + productID.toString()).toString();
    checkDigit = (type.toString() + manufacturerID.toString() + productID.toString()).toString();
    checkDigit = checkDigit.split('');
    for (let i = 0; i < checkDigit.length; i++) {
        if ((i % 2) === 0) { checkDigit[i] = checkDigit[i] * 3 }
        else { checkDigit[i] = Number(checkDigit[i]) }
    }
    checkDigit = checkDigit.reduce((e, i) => e + i, 0);
    // Alternative 
    // let cdm = 10 - (checkDigit % 10);
    // console.log('cdm', cdm);
    let checkDigitModolu = Math.ceil(checkDigit / 10) * 10;
    let checkDigitSum = checkDigitModolu - checkDigit;


    // manufacturerID -> toString, split into Array, mapped to Barcode numbers, joined.
    manufacturerID = manufacturerID.toString().split('').map((e, i) => generateBarcodeArrayL(Number(e))).join('');

    // productID -> toString, split into Array, mapped to Barcode numbers, joined.
    productID = productID.toString().split('').map((e, i) => generateBarcodeArrayR(Number(e))).join('');

    drawBarcode(leftGuard + barcodeLeft[type] + manufacturerID + centerGurad + productID + generateBarcodeArrayR(checkDigitSum) + rightGuard, mid, pid, tid, checkDigitSum);
    return leftGuard + barcodeLeft[type] + manufacturerID + centerGurad + productID + generateBarcodeArrayR(checkDigitSum) + rightGuard;
    //console.log(outputBarcode);
}

function drawBarcode(inputBarcode, manID, prodID, type, check) {
    // Create SVG
    console.log(type, manID, prodID, check);
    svgBarcode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgBarcode.setAttribute('height', '110px');
    svgBarcode.setAttribute('width', '1000px');
    let code = inputBarcode.split('');
    let lineSpace = 20;
    for (let i = 0; i < code.length; i++) {
        svgLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        svgLine.setAttribute('x1', lineSpace);
        svgLine.setAttribute('y1', '0');
        svgLine.setAttribute('x2', lineSpace);
        //svgLine.setAttribute('y2', '160');
        svgLine.setAttribute('y2', '60');
        if ((i <= 10) || (i >= (code.length - 10)) || (i > 45 && i < 50)) {
            svgLine.setAttribute('y2', '70');
        }
        svgLine.style = (code[i] == 1) ? `stroke:rgb(0,0,0);stroke-width:2` : `stroke:rgb(255,255,255);stroke-width:2`;
        svgBarcode.appendChild(svgLine);
        lineSpace += 2;

    }
    svgText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    svgText.setAttribute('x', '2');
    svgText.setAttribute('y', '82');
    svgText.setAttribute('font-size', '1.65em');
    //svgText.innerHTML = type.toString() + manID.toString() + prodID.toString() + check.toString();
    svgText.innerHTML = `${type.toString()}&nbsp&nbsp&nbsp&nbsp${manID.toString()}&nbsp&nbsp${prodID.toString()}&nbsp&nbsp&nbsp&nbsp&nbsp${check.toString()}`;
    svgBarcode.appendChild(svgText);
    document.body.appendChild(svgBarcode);
}
console.log('Bin-Output: ', generateBarcode('1', '23601', '05707'));
console.log('Bin-Output: ', generateBarcode('0', '51000', '01251'));
console.log('Bin-Output: ', generateBarcode('6', '14141', '00003'));
console.log('Bin-Output: ', generateBarcode('0', '13409', '51519'));
console.log('Bin-Output: ', generateBarcode('3', '11111', '11111'));