/* import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs; */
import CalibriRegular from 'src/assets/fonts/Calibri Regular.ttf'
import CalibriBold from 'src/assets/fonts/Calibri Bold.TTF'
import CalibriItalic from 'src/assets/fonts/Calibri Italic.ttf'
import CalibriBoldItalic from 'src/assets/fonts/Calibri Bold Italic.ttf'
import BookOS from 'src/assets/fonts/BOOKOS.TTF'
import BookOSB from 'src/assets/fonts/BOOKOSB.TTF'
import BookOSBI from 'src/assets/fonts/BOOKOSBI.TTF'

let pdfInstance
export async function getPDfInstance() {
  let pdfMake = (await import('pdfmake/build/pdfmake')).default
  let pdfFonts = (await import('pdfmake/build/vfs_fonts')).default

  /* pdfFonts[]
  this.pdfMake = this.pdfMake || {}; this.pdfMake.vfs = {
    "Roboto-Italic.ttf": */
  const path = window.location.protocol + '//' + window.location.host
  pdfMake.fonts = {
    ['Calibri']: {
      normal: path + CalibriRegular,
      bold: path + CalibriBold,
      italics: path + CalibriItalic,
      bolditalics: path + CalibriBoldItalic,
    },
    ['Bookos']: {
      normal: path + BookOS,
      bold: path + BookOSB,
      bolditalics: path + BookOSBI,
    },

    Roboto: {
      normal:
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
      bold: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Medium.ttf',
      italics:
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Italic.ttf',
      bolditalics:
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-MediumItalic.ttf',
    },
  }
  pdfMake.vfs = pdfFonts.pdfMake.vfs

  return pdfMake
}
