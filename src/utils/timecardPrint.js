import moment from "moment";
import { logo } from "./logo";
import { blank } from "./blank";
import { getPDfInstance } from "./pdf";
import { getBase64ImageFromURL } from "src/utils";
const nullValue = "";
// const blankImg = (
//   import("../assets/blank.png")
// ).default;

// const blank = getBase64ImageFromURL(
//  blankImg
// );
export function timecardPrint({
  todayDate,
  employeeName,
  jobName,
  jobDescription,
  jobLocations,
  employeeSignature,
  timeEntries,
}) {
  var days = Array.apply(null, Array(7)).map(function (_, i) {
    var day = moment(i, "e")
      .startOf("week")
      .isoWeekday(i + 1);
    return [
      [
        {
          text: day.format("ddd"),
          style: "cell",
        },
        {
          text: "",
          style: "",
        },
      ],
      [
        {
          text: "Date",
          style: "cell",
          bold: true,
        },
        {
          text: day.format("MM-DD-YYYY"),
          style: "",
          bold: true,
        },
      ],
      [
        {
          text: "Clock in/Clock out",
          style: "cell",
        },
        {
          text: "6:00 AM - 2:30 PM",
          style: "cellResponse",
        },
      ],
      [
        {
          text: "Lunch in/Lunch out",
          style: "cell",
        },
        {
          text: "6:00 AM - 2:30 PM",
          style: "cellResponse",
        },
      ],
      [
        {
          text: "Type of work in progress",
          style: "cell",
        },
        {
          text: "shop",
          style: "cellResponse",
        },
      ],
    ];
  });

  const mergedTimeEntries = timeEntries.map((timeEntry) => {
    let lunchHrs = 0;
    let lunchMins = 0;
    if (
      moment(timeEntry.lunchIn, "HH:mm").isValid() &&
      moment(timeEntry.lunchOut, "HH:mm").isValid()
    ) {
      var startTime = moment(timeEntry.lunchIn, "HH:mm");
      var endTime = moment(timeEntry.lunchOut, "HH:mm");
      var duration = moment.duration(endTime.diff(startTime));
      var hours = parseInt(duration.asHours());
      var minutes = parseInt(duration.asMinutes()) - hours * 60;
      lunchHrs = hours;
      lunchMins = minutes;
    }

    timeEntry.lunchIn = moment(timeEntry.lunchIn, "HH:mm").isValid()
      ? moment(timeEntry.lunchIn, "HH:mm").format("hh:mm A")
      : nullValue;
    timeEntry.lunchOut = moment(timeEntry.lunchOut, "HH:mm").isValid()
      ? moment(timeEntry.lunchOut, "HH:mm").format("hh:mm A")
      : nullValue;

    employeeSignature = employeeSignature || null;

    let totalHrs = 0;
    let totalMins = 0;
    let totalTime = 0;
    timeEntry.timecard.map((timeCard) => {
      let locations = "";
      let clockHrs = 0;
      let clockMins = 0;
      if (
        moment(timeCard.clockIn, "HH:mm").isValid() &&
        moment(timeCard.clockOut, "HH:mm").isValid()
      ) {
        var startTime = moment(timeCard.clockIn, "HH:mm");
        var endTime = moment(timeCard.clockOut, "HH:mm");
        var duration = moment.duration(endTime.diff(startTime));
        var hours = parseInt(duration.asHours());
        var minutes = parseInt(duration.asMinutes()) - hours * 60;
        clockHrs = hours;
        clockMins = minutes;
        totalTime += duration;
        totalMins += clockMins;
        totalHrs += clockHrs;
      }
    });

    return [
      [
        {
          text: "Total Hours",
          style: "cell",
          bold: true,
        },
        {
          text: `${totalHrs}h${totalMins != 0 ? " " + totalMins + "m" : ""}`,
          style: "cellResponse",
        },
      ],
      [
        {
          text: moment(timeEntry.entryDate).format("ddd"),
          style: "cell",
          bold: true,
        },
        {
          text: "",
          style: "",
        },
      ],
      [
        {
          text: "Date",
          style: "cell",
        },
        {
          text: moment(timeEntry.entryDate).format("MM-DD-YYYY"),
          style: "",
          bold: true,
        },
      ],
      [
        {
          text: "Lunch in/Lunch out",
          style: "cell",
        },
        {
          text: `${timeEntry.lunchIn || nullValue}   - ${
            timeEntry.lunchOut || nullValue
          } (${lunchHrs}h${lunchMins != 0 ? " " + lunchMins + "m" : ""})`,
          style: "cellResponse",
        },
      ],
      ...[].concat.apply(
        [],
        timeEntry.timecard.map((timeCard) => {
          let locations = "";
          let clockHrs = 0;
          let clockMins = 0;
          if (
            moment(timeCard.clockIn, "HH:mm").isValid() &&
            moment(timeCard.clockOut, "HH:mm").isValid()
          ) {
            var startTime = moment(timeCard.clockIn, "HH:mm");
            var endTime = moment(timeCard.clockOut, "HH:mm");
            var duration = moment.duration(endTime.diff(startTime));
            var hours = parseInt(duration.asHours());
            var minutes = parseInt(duration.asMinutes()) - hours * 60;
            clockHrs = hours;
            clockMins = minutes;
          }

          timeCard.location.forEach((loc) => {
            locations += loc.location;
          });
          timeCard.clockIn = moment(timeCard.clockIn, "HH:mm").isValid()
            ? moment(timeCard.clockIn, "HH:mm").format("hh:mm A")
            : nullValue;
          timeCard.clockOut = moment(timeCard.clockOut, "HH:mm").isValid()
            ? moment(timeCard.clockOut, "HH:mm").format("hh:mm A")
            : nullValue;
          return [
            [
              {
                text: "Clock in/Clock out",
                style: "cell",
              },
              {
                text: `${timeCard.clockIn || nullValue} - ${
                  timeCard.clockOut || nullValue
                } (${clockHrs}h${clockMins != 0 ? " " + clockMins + "m" : ""})`,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Job Name",
                style: "cell",
                decoration: "underline",
              },

              {
                text: timeCard.jobName || nullValue,
                style: "cellResponse",
                italics: true,
              },
            ],
            [
              {
                text: "Job Location",
                style: "cell",
              },
              {
                text: timeCard.otherLocation
                  ? timeCard.otherLocation
                  : locations,
                style: "cellResponse",
              },
            ],
            [
              {
                text: "Job Description",
                style: "cell",
              },

              {
                text: timeCard.jobDescription || nullValue,
                style: "cellResponse",
              },
            ],
          ];
        })
      ),
    ];
  });
  var merged = [].concat.apply([], mergedTimeEntries);
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
                    text: moment(todayDate).format("dddd, MMMM DD, YYYY"),
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
                        text: "Weekly Time Card",
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
                text: "Employee Name",
                style: "cell",
              },
              {
                text: employeeName,
                style: "cellResponse",
              },
            ],
            ...merged,
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
          ],
        },
      },
    ],
    pageMargins: [0, 20, 0, 26],
    images: {
      logo: logo,
      //customerSignature:customerSignature,
      employeeSignature: employeeSignature || blank,
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
