const { createPdf } = require('pdfmake');

const generatePDF = async (data) => {
  // Create the PDFMake document
  const documentDefinition = {
    content: [
      {
        text: data.title,
        style: 'header'
      },
      {
        columns: [
          {
            width: '*',
            text: `Name: ${data.name}`
          },
          {
            width: '*',
            text: `Age: ${data.age}`
          },
          {
            width: '*',
            text: `Gender: ${data.gender}`
          }
        ]
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true
      }
    }
  };

  // Create the PDF
  const pdfDocGenerator = createPdf(documentDefinition);
  const pdfDoc = await pdfDocGenerator.getDocument();

  // Stream the PDF to a file
}