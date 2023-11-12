const PDFMerger = require('pdf-merger-js');

var merger = new PDFMerger();

const mergePDFs = async (pdf1, pdf2) => {
    await merger.add(pdf1);
    await merger.add(pdf2);

    await merger.save('server/public/merged.pdf'); //save under given name and reset the internal document

    // Export the merged PDF as a nodejs Buffer
    // const mergedPdfBuffer = await merger.saveAsBuffer();
    // fs.writeSync('merged.pdf', mergedPdfBuffer);
};

module.exports = {mergePDFs};