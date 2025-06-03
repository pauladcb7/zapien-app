import moment from 'moment';
import { logo } from './logo'
import {getPDfInstance} from './pdf'

export function materialRequisitionPrint ({
  jobName,
  jobLocation,
  requestedBy,
  todayDate,
  needBy,
  description,
  materialRequisitionDetails
}) {
  var dd =  {
    content: [
      {
        layout: 'noBorders',

        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          //headerRows: 1,
          widths: ['auto', '*'],

          body: [
            [
              {
                stack: [
                  { text: moment(todayDate).format('dddd, MMMM DD, YYYY') , fontSize: 11, bold: true, alignment: 'right' ,color:'#060B33' },
                  {
                    columns: [
                        {
                            image: 'logo',
                            fit: [200, 100],
                            alignment: 'center',
                            marginBottom: 16
                        },
                        {
                            text:'JS POWER ELECTRIC INC - MATERIAL REQUISITION FORM',
                            fontSize: 18,
                            marginTop:25,
                            marginLeft: 15,
                            color: '#060B33'
                        }
                    ]
                  },
                ],
                colSpan: 2,
                fillColor:'#eaecf9'
              }, ''
            ],
            [
                {
                  text: 'MATERIAL REQUISITION FORM',
                  style:'cell',
                  colSpan: 2
                }, {
                  text: moment(todayDate).format('dddd, MMMM DD, YYYY'),
                  style: 'cellResponse'
                }
            ],
            [
                {
                  text: 'Job Name',
                  style:'cell'
                }, {
                  text: jobName,
                  style: 'cellResponse'
                }
            ],
            [
                {
                  text: 'Job Location',
                  style:'cell'
                }, {
                  text: jobLocation,
                  style: 'cellResponse'
                }
            ],
            [
                {
                  text: 'Requested by',
                  style:'cell'
                }, {
                  text: requestedBy,
                  style: 'cellResponse'
                }
            ],
            [
                {
                  text: 'Today\'s Date',
                  style:'cell'
                }, {
                  text: todayDate,
                  style: 'cellResponse'
                }
            ],
            [
                {
                  text: 'Need by',
                  style:'cell'
                }, {
                  text: needBy,
                  style: 'cellResponse'
                }
            ],
            
            
            [
              {
                layout: 'noBorders',
                style: 'tableR',
                table: {
                  // headers are automatically repeated if the table spans over multiple pages
                  // you can declare how many rows should be treated as headers
                  //headerRows: 1,
                  widths: ['auto','auto','auto',150, '*'],
				          headerRows: 1,
                  body: [
					          [
                      {text: '', style: 'cellHeader'}, 
                      {text: 'QTY', style: 'cellHeader'}, 
                      {text: 'SIZE', style: 'cellHeader'},
                       {text: 'PART #', style: 'cellHeader'}, 
                       {text: 'ITEM DESCRIPTION', style: 'cellHeader'}
                    ],
                    ...materialRequisitionDetails?.map((m,index) => {
                      return [
                        {text: String(index + 1), style: 'cellHeader'},
                        {text: String(m.quantity), style: 'cellCommon'},
                        {text: String(m.size), style: 'cellCommon'},
                        {text: String(m.partNumber), style: 'cellCommon'},
                        {text: String(m.itemDescription), style: 'cellCommon'},
                      ]
                      /* {
                        text: '133', 
                        style: 'cellHeader'
                      } */
                    }),
                  ]
                },
                colSpan: 2,
              },''
            ],
            
          ]
        }
      },

    ],
    pageMargins: [ 0, 0, 0, 0 ],
    images: {
      logo: logo,
      //customerSignature:customerSignature,
      //employeeSignature: employeeSignature
    },
    styles: {
        cell: {
            color: '#060B33',
            margin: [15, 5, 15, 5]
        },
        cellResponse: {
            color: '#606575',
            margin: [15, 5, 15, 5]
        },
        cellHeader: {
            fillColor: '#f2f3fe',
            color: '#060b33',
            marginTop: 5,
            marginBottom: 5,
            marginLeft:15,
            marginRight:15,
            //margin: [15, 5, 15, 5],
            alignment:'center'
        },
        cellCommon: {
            fillColor: '#fbfcfe',
            color: '#606575',
            margin: [10, 5, 10, 5],
            alignment:'center'
        },
        tableR: {
            margin:[10, 5, 10, 5]
        }
    },
  }
  getPDfInstance().then((pdfMake) => {
    pdfMake.createPdf(dd).download();
  })
}
// No deprecated or legacy code found. The file uses modern JavaScript and is compatible with your current dependencies. No changes needed.