// import jsPDF from "jspdf";
// import "jspdf-autotable";

// import logo from "../assets/images/logo1.PNG"; // Import the company logo
// import logo1 from "../assets/images/logo.png"; // Import the company logo

//   const generateSelectedRecordPDF = () => {
//     if (!selectedRentId) {
//       setSnackbar({ open: true, message: 'No record selected for PDF generation', severity: 'error' });
//       return;
//     }

//     const selectedRent = rents.find(rent => rent.rentId === selectedRentId);
//     if (!selectedRent) {
//       setSnackbar({ open: true, message: 'Selected record not found', severity: 'error' });
//       return;
//     }

//     const email = localStorage.getItem('email') || 'Unknown';
//     const fname = localStorage.getItem('fname') || 'Unknown';
//     const lname = localStorage.getItem('lname') || 'Uploader';
//     const role = localStorage.getItem('position') || 'Uploader';
//     const uploaderName = `${email}`;

//     const doc = new jsPDF();

//     // Left and right logos
//     doc.addImage(logo1, 'png', 10, 10, 20, 20); // Left logo
//     doc.addImage(logo, 'PNG', doc.internal.pageSize.width - 60, 10, 50, 20); // Right logo

//     // Centered text between the logos
//     doc.setFontSize(12);
//     doc.text('UR-CST ACEIoT', doc.internal.pageSize.width / 2, 20, null, null, 'center');
//     doc.setFontSize(10);
//     doc.text('Selected Borrowed Item Report', doc.internal.pageSize.width / 2, 27, null, null, 'center');

//     // Horizontal blue line (20px height) under the logos and centered text
//     doc.setFillColor(0, 0, 255); // Blue color
//     doc.rect(10, 35, doc.internal.pageSize.width - 20, 20, 'F'); // Blue line under the logos and centered text

//     // Section Title: User Information (centered)
//     doc.setTextColor(255, 255, 255); // White text for visibility on blue background
//     doc.text(`Generated by: ${uploaderName}`, doc.internal.pageSize.width / 2, 47, null, null, 'center');

//     // Reset text color to black
//     doc.setTextColor(0, 0, 0);

//     // Section Title: User Information (centered) with horizontal line
//     doc.setFontSize(14);
//     doc.text('User Information', doc.internal.pageSize.width / 2, 80, null, null, 'center');
//     doc.line(10, 82, doc.internal.pageSize.width - 10, 82); // Horizontal line

//     // User Information Content (aligned in two columns)
//     doc.setFontSize(10);
//     const leftColumnX = 14; // X position for left column
//     const rightColumnX = 80; // X position for right column

//     doc.text('Name:', leftColumnX, 90);
//     doc.text(`${selectedRent.user.lname} ${selectedRent.user.fname}`, rightColumnX, 90);

//     doc.text('Level of Education:', leftColumnX, 100);
//     doc.text(`${programmes.find(prog => prog.programmeId === selectedRent.course.programmeId)?.programmeTitle || 'N/A'}`, rightColumnX, 100);

//     doc.text('Course:', leftColumnX, 110);
//     doc.text(`${selectedRent.course.courseTitle}`, rightColumnX, 110);

//     // Section Title: Item Information (centered)
//     doc.setFontSize(14);
//     doc.text('Item Information', doc.internal.pageSize.width / 2, 130, null, null, 'center');
//     doc.line(10, 132, doc.internal.pageSize.width - 10, 132); // Horizontal line

//     // Item Information Content (similarly aligned in two columns)
//     doc.setFontSize(10);
//     doc.text('Item Category:', leftColumnX, 140);
//     doc.text(`${itemTypes.find(type => type.itemTypeId === selectedRent.item.itemTypeId)?.title || 'N/A'}`, rightColumnX, 140);

//     doc.text('Description:', leftColumnX, 150);
//     doc.text(`${selectedRent.item.name}`, rightColumnX, 150);

//     doc.text('Serial Number:', leftColumnX, 160);
//     doc.text(`${selectedRent.item.serialNumber}`, rightColumnX, 160);

//     doc.text('Lab Code:', leftColumnX, 170);
//     doc.text(`${selectedRent.item.labCode}`, rightColumnX, 170);

//     doc.text('Expected Return Date:', leftColumnX, 180);
//     doc.text(new Date(selectedRent.expectedReturnDate).toLocaleDateString(), rightColumnX, 180);

//     doc.text('Condition:', leftColumnX, 190);
//     doc.text(`${selectedRent.rentCondition}`, rightColumnX, 190);

//     doc.text('Status:', leftColumnX, 200);
//     doc.text(`${selectedRent.rentStatus}`, rightColumnX, 200);

//     // Footer Section (centered) with blue background line
//     const footerY = doc.internal.pageSize.height - 20;
//     doc.setFillColor(0, 0, 255); // Blue color
//     doc.rect(10, footerY, doc.internal.pageSize.width - 20, 20, 'F'); // Footer blue line (20px height)

//     // Footer text (white for visibility on blue background)
//     doc.setFontSize(10);
//     doc.setTextColor(255, 255, 255); // White text
//     const currentDate = new Date().toLocaleDateString();
//     const footerText = `Report generated on: ${currentDate} | printed by: ${uploaderName} | Platform: ur.ac.rw`;
//     doc.text(footerText, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, null, null, 'center');

//     // Save the PDF
//     doc.save(`rent-report-${selectedRentId}.pdf`);
//   };



{/* <Button
className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
variant="contained"
color="primary"
style={{ marginTop: "20px" }}
onClick={generateSelectedRecordPDF}
>
<i className="fas fa-download fa-sm text-white-50"></i>{" "}
Generate Report
</Button> */}