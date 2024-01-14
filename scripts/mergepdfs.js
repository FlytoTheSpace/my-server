const { random } = require('mathjs');
const PDFMerger = require('pdf-merger-js');

var merger = new PDFMerger();

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwyxz";
const generateName = () => {
    let pdfname = "";
    for (let i = 0; i <= 11; i++) {
        let randomChar = Math.floor(
            Math.random() * characters.length
        );
        pdfname += characters[randomChar];
    }
    return pdfname;
};

const mergePDFs = async (pdf1, pdf2) => {
    const PDFname = generateName(); // Generate a new name at the time of merging

    await merger.add(pdf1);
    await merger.add(pdf2);

    await merger.save(`static/public/${PDFname}.pdf`); // Save under the generated name and reset the internal document

    // Export the merged PDF as a nodejs Buffer
    // const mergedPdfBuffer = await merger.saveAsBuffer();
    // fs.writeSync('merged.pdf', mergedPdfBuffer);

    return PDFname; // Return the generated name if needed
};

module.exports = { mergePDFs };
