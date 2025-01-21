import { logo } from "./logo";
import { getPDfInstance } from "./pdf";
import moment from "moment";
import { api } from "../helpers/api";
import { SEND_WORK_ORDER } from "../helpers/urls/index";

export function workOrderPrint({
  date,
  workType,
  employeeName,
  startTime,
  endTime,
  jobLocation,
  jobDetails,
  customerInformation,
  totalCost,
  customerSignature,
  employeeSignature,
}) {
  var dd = {
    content: [
      {
        layout: "noBorders",

        table: {
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          //headerRows: 1,
          widths: ["auto", "*"],

          body: [
            [
              {
                stack: [
                  {
                    text: moment(date).format("dddd, MMMM DD, YYYY"),
                    fontSize: 11,
                    bold: true,
                    alignment: "right",
                    color: "#060B33",
                  },
                  {
                    columns: [
                      {
                        image: "logo",
                        fit: [200, 100],
                        alignment: "center",
                        marginBottom: 16,
                      },
                      {
                        text: "WORK ORDER",
                        fontSize: 18,
                        marginTop: 25,
                        marginLeft: 15,
                        color: "#060B33",
                      },
                    ],
                  },
                ],
                colSpan: 2,
                fillColor: "#eaecf9",
              },
              "",
            ],
            [
              {
                text: "Date",
                style: "cell",
              },
              {
                text: moment(date).format("dddd, MMMM DD, YYYY"),
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Type of work",
                style: "cell",
              },
              {
                text: workType,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Employee Name",
                style: "cell",
              },
              {
                text: employeeName,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Start Time",
                style: "cell",
              },
              {
                text: startTime,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "End Time",
                style: "cell",
              },
              {
                text: endTime,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Job Location",
                style: "cell",
              },
              {
                text: jobLocation,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Job Details",
                style: "cell",
              },
              {
                text: jobDetails,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Customer Information",
                style: "cell",
              },
              {
                text: customerInformation,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Total Cost",
                style: "cell",
              },
              {
                text: totalCost,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Customer Signature",
                style: "cell",
              },
              {
                image: "customerSignature",
                fit: [200, 100],
              },
            ],
            [
              {
                text: "Employee Signature",
                style: "cell",
              },
              {
                image: "employeeSignature",
                fit: [200, 100],
              },
            ],

            [
              {
                marginTop: 30,
                stack: [
                  {
                    text: "© Copyright J.S. POWER ELECTRIC, INC., All Rights Reserved.",
                    fontSize: 15,
                    alignment: "center",
                    color: "#060B33",
                  },
                  {
                    text: "Industrial - Commercial - Residential",
                    fontSize: 15,
                    bold: true,
                    alignment: "center",
                    color: "#060B33",
                  },
                  {
                    text: "3012 Dale Ct Ste E, Ceres, CA, 95307",
                    fontSize: 15,
                    alignment: "center",
                    color: "#060B33",
                  },
                  {
                    text: "Office: 209 248 5518",
                    fontSize: 15,
                    alignment: "center",
                    color: "#060B33",
                  },
                  {
                    text: "Office: 209 872 1192",
                    fontSize: 15,
                    alignment: "center",
                    color: "#060B33",
                  },
                ],
                colSpan: 2,
              },
              "",
            ],
          ],
        },
      },
    ],
    pageMargins: [0, 0, 0, 0],
    images: {
      logo: logo,
      customerSignature: customerSignature,
      employeeSignature: employeeSignature,
    },
    styles: {
      cell: {
        color: "#060B33",
        margin: [15, 5, 15, 5],
      },
      cellResponse: {
        color: "#606575",
        margin: [15, 5, 15, 5],
      },
    },
  };

  getPDfInstance().then((pdfMake) => {
    pdfMake.createPdf(dd).download();
  });
}
