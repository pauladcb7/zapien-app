import React, { useRef, useState } from 'react'
import { CCard, CCol, CFormLabel, CRow, CButton, CFormFeedback } from '@coreui/react' // CoreUI 5 components
import htmlToPdfmake from 'html-to-pdfmake'
import { getPDfInstance } from '../utils/pdf'
import { Editor as ReactEditor } from '@tinymce/tinymce-react'
import CRegular from 'src/assets/fonts/Calibri Regular.ttf'
import Book from 'src/assets/fonts/BOOKOS.TTF'
import BookBold from 'src/assets/fonts/BOOKOSB.TTF'
import CBold from 'src/assets/fonts/Calibri Bold.TTF'
import { getBase64ImageFromURL } from 'src/utils'

export function Editor() {
  const editorRef = useRef(null)
  const [b64, setB64] = useState('')
  const [json, setContentJson] = useState('')
  const [isInvalid, setIsInvalid] = useState(false)

  const log = async () => {
    if (editorRef.current) {
      const html = editorRef.current.getContent()
      if (!html) {
        setIsInvalid(true)
        return
      }
      setIsInvalid(false)

      const documentData = htmlToPdfmake(html, {
        imagesByReference: true,
        defaultStyles: {
          p: { marginTop: 0, marginBottom: 0, margin: [0, 0, 0, 0] },
        },
      })

      setContentJson(JSON.stringify({ ...documentData, customHtml: html }))
      documentData.pageMargins = [25, 22, 25, 5]
      documentData.styles = {
        'html-p': { margin: [0, 0, 0, 0] },
        'html-strong': { margin: [0, 0, 0, 0] },
        'html-span': { margin: [0, 0, 0, 0] },
        'html-ul': { margin: [0, 0, 0, 0] },
      }

      const logo = await getBase64ImageFromURL((await import('../assets/logopdf.png')).default)
      const logo2 = await getBase64ImageFromURL((await import('../assets/logoBg.png')).default)
      documentData.images = { logo, logo2 }

      documentData.content.unshift(
        {
          image: 'logo',
          fit: [80, 80],
          absolutePosition: { x: 15, y: 65 },
        },
        {
          table: {
            headerRows: 0,
            widths: ['*'],
            body: [
              [
                {
                  text: 'Company Name:_________________        Job Location: _____________________       Date: ___________',
                  font: 'Calibri',
                },
              ],
              [
                {
                  text: 'Time Started: __:__ Time Finished: __:__ Foreman/Supervisor:_______',
                  font: 'Calibri',
                },
              ],
            ],
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length ? 1 : 0),
            vLineWidth: (i, node) => (i === 0 || i === node.table.widths.length ? 1 : 0),
            hLineColor: () => 'black',
            vLineColor: () => 'black',
          },
        },
      )

      documentData.content.push(
        {
          text: 'Work-Site Hazards and Safety Suggestions: ______________________________________________________.',
          font: 'Calibri',
        },
        {
          text: 'Personnel Safety Violations: __________________________________________________________________.',
          font: 'Calibri',
        },
        {
          text: 'Employee Signatures:                  (My signature attests and verifies my understanding of and agreement to comply with company safety regulations).',
          font: 'Calibri',
        },
        {
          columns: [
            {
              width: '*',
              columns: [
                { width: 12, text: '1. ', font: 'Calibri' },
                { image: 'logo', fit: [150, 40] },
              ],
            },
            {
              width: '*',
              columns: [
                { width: 12, text: '1. ', font: 'Calibri' },
                { image: 'logo', fit: [150, 40] },
              ],
            },
            {
              width: '*',
              columns: [
                { width: 12, text: '1. ', font: 'Calibri' },
                { image: 'logo', fit: [150, 40] },
              ],
            },
          ],
          width: '100%',
        },
        {
          columns: [
            {
              width: '*',
              alignment: 'right',
              text: 'Foreman/Supervisor’s Signature:',
              font: 'Calibri',
            },
            { width: 150, image: 'logo', fit: [150, 150] },
          ],
        },
      )

      documentData.background = [
        { image: 'logo2', width: 420, fit: [420, 420], marginTop: 120, alignment: 'center' },
      ]

      getPDfInstance().then((pdfMake) => {
        pdfMake.createPdf(documentData).getBase64(setB64)
      })
    }
  }

  return (
    <>
      <ReactEditor
        apiKey="your-api-key"
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          menubar: false,
          file_picker_callback: (cb, value, meta) => {
            const input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'image/*')
            input.onchange = function () {
              const file = this.files[0]
              const reader = new FileReader()
              reader.onload = function () {
                const id = 'blobid' + new Date().getTime()
                const blobCache = editorRef.current.editorUpload.blobCache
                const base64 = reader.result.split(',')[1]
                const blobInfo = blobCache.create(id, file, base64)
                blobCache.add(blobInfo)
                cb(blobInfo.blobUri(), { title: file.name })
              }
              reader.readAsDataURL(file)
            }
            input.click()
          },
          fontsize_formats: '10pt 12pt 16pt 14pt 18pt 24pt 36pt',
          font_formats: 'Calibri=Calibri; Book Style=BookOS',
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help imagetools wordcount',
          ],
          toolbar:
            'undo redo | formatselect | fontsizeselect | fontselect | bold italic underline backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image | removeformat | help',
          content_style: `
            body { font-family: Calibri; font-size: 10px; }
            p { margin: 0; }
            ul { margin: 0; }
            @font-face { font-family: 'Calibri'; src: url(${CRegular}) format('truetype'); }
            @font-face { font-family: 'BookOS'; src: url(${Book}) format('truetype'); }
            @font-face { font-family: 'BookOS'; src: url(${BookBold}) format('truetype'); font-weight: bold; }
          `,
        }}
      />
      <CButton onClick={log}>Generate PDF</CButton>
      {isInvalid && (
        <CFormFeedback style={{ display: 'block' }}>Content cannot be empty</CFormFeedback>
      )}
      <object
        className="pdf-viewer"
        data={'data:application/pdf;base64,' + b64}
        type="application/pdf"
        style={{ width: '100%', height: '500px' }}
      >
        <embed src={'data:application/pdf;base64,' + b64} type="application/pdf" />
      </object>
      <textarea style={{ width: '100%', minHeight: '520px' }} value={json} readOnly />
    </>
  )
}
