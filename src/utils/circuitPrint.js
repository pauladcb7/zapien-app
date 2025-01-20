import moment from 'moment'
import { logo } from './logo'
import {getPDfInstance} from './pdf'

export function circuitHPrint ({
  date,
  voltage,
  rows
}) {
  
  var dd = {
    content: [
        {
            columns: [
              {
                  // auto-sized columns have their widths based on their content
                  width: '*',
                  stack: [
                    {
                          table: {
                          // headers are automatically repeated if the table spans over multiple pages
                          // you can declare how many rows should be treated as headers
                          //headerRows: 1,
                          widths: [ 'auto', 100],
                  
                          body: [
                              [
                                  {
                                      stack: [
                                          { text: 'CIRCUIT DIRECTORY', fontSize: 20,bold:true ,alignment:'center'},
                                          { text: 'Call us for service!', fontSize: 16,alignment:'center' },
                                          {
                                              image: 'logo',
                                              fit: [220, 100],alignment:'center'
                                          },
                                          {
                                              columns: [
                                                  { text: 'Date: ', fontSize: 11,bold:true },
                                                  { text: moment(date).format('DD MM YYYY'), width:80 ,fontSize: 11,bold:true ,decoration:'underline'},
                                                  { text: 'Voltage: ', fontSize: 11,bold:true },
                                                  { text: voltage, fontSize: 11,bold:true ,decoration:'underline' }
                                              ],
                                              alignment:'center'
                                          },
                                      ],
                                      colSpan:2
                                  } ,''
                              ], 
                              [ {
                                text:'Ckt',
                                fillColor: '#000000',
                                color: '#ffffff',
                                fontSize: 12,bold:true 
                              }, {
                                text:'Load',
                                fillColor: '#000000',
                                color: '#ffffff',
                                fontSize: 12,bold:true 
                              }]
                              ,
                              ...rows.map((row)=> {
                                return [
                                  String(row.ckt),
                                  String(row.load)
                                ]
                              })
                          ]
                        }
                      }
                  ],
                
              },
              {
                // star-sized columns fill the remaining space
                // if there's more than one star-column, available width is divided equally
                width: '*',
                text: ''
              }
              ]
        },
          
    ],
      images: {
          logo: logo,
      }
  }
  getPDfInstance().then((pdfMake) => {
    pdfMake.createPdf(dd).download();
  })
}
export function circuitPrint ({
  date,
  voltage,
  rows
}){
  
  var dd = {
    content: [
        {
            columns: [
              {
                  // auto-sized columns have their widths based on their content
                  width: '*',
                  stack: [
              
                    {
                          table: {
                          // headers are automatically repeated if the table spans over multiple pages
                          // you can declare how many rows should be treated as headers
                          //headerRows: 1,
                          widths: [ 'auto', 100, 'auto', 100 ],
                  
                          body: [
                              [
                                  {
                                      stack: [
                                          { text: 'CIRCUIT DIRECTORY', fontSize: 20,bold:true ,alignment:'center'},
                                          { text: 'Call us for service!', fontSize: 16,alignment:'center' },
                                          {
                                              image: 'logo',
                                              fit: [220, 100],alignment:'center'
                                          },
                                          {
                                              columns: [
                                                  { text: 'Date: ', fontSize: 11,bold:true },
                                                  { text: moment(date).format('DD MM YYYY'), fontSize: 11,bold:true ,decoration:'underline'},
                                                  { text: 'Voltage: ' , fontSize: 11,bold:true },
                                                  { text: voltage, fontSize: 11,bold:true ,decoration:'underline' }
                                              ],
                                              alignment:'center'
                                          },
                                      ],
                                      colSpan:4
                                  } ,'','',''
                              ], 
                              [ {
                                text:'Ckt',
                                fillColor: '#000000',
                                color: '#ffffff',
                                fontSize: 12,bold:true 
                              }, {
                                text:'Load',
                                fillColor: '#000000',
                                color: '#ffffff',
                                fontSize: 12,bold:true 
                              }, {
                                text:'Ckt',
                                fillColor: '#000000',
                                color: '#ffffff',
                                fontSize: 12,bold:true 
                              },{
                                text:'Load',
                                fillColor: '#000000',
                                color: '#ffffff',
                                fontSize: 12,bold:true 
                              } ]
                              ,
                              ...rows.map((row)=> {
                                return [
                                  String(row.ckt),
                                  String(row.load),
                                  String(row.ckt1),
                                  String(row.load1)
                                ]
                              })
                          ]
                        }
                      }
                  ],
                
              },
              {
                // star-sized columns fill the remaining space
                // if there's more than one star-column, available width is divided equally
                width: '*',
                text: ''
              }
              ]
        },
          
    ],
      images: {
          logo,
      }
  }
  getPDfInstance().then((pdfMake) => {
    pdfMake.createPdf(dd).download();
  })

}

