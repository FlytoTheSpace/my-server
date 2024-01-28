import PDFMerger from 'pdf-merger-js';
import path from 'path';

export const publicDir = "./client/static/public"
export const mergePDFs = async (pdf1, pdf2) => {
    const merger = new PDFMerger();
    const mergedPDFFileName = Date.now(); // Generate a new name at the time of merging
    try{

        await merger.add(pdf1);
        await merger.add(pdf2);

        await merger.save(path.join(publicDir, mergedPDFFileName)); // Save under the generated name and reset the internal document
    } catch (error){
        console.log("[Merge.mjs]", error)
    }
    return mergedPDFFileName; // Return the generated name if needed
};

