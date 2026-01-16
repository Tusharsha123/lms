export function generateCertificateHTML({ userName, courseName, completionDate, certificateCode, instructorName }) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Georgia', serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        .certificate {
          background: #fff;
          width: 800px;
          padding: 60px;
          border: 8px solid #1a365d;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
          position: relative;
        }
        .certificate::before {
          content: '';
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          bottom: 20px;
          border: 2px solid #c9a227;
        }
        .header { color: #1a365d; font-size: 14px; letter-spacing: 4px; margin-bottom: 20px; }
        .title { font-size: 48px; color: #c9a227; margin-bottom: 30px; font-weight: normal; }
        .subtitle { font-size: 18px; color: #4a5568; margin-bottom: 20px; }
        .name { font-size: 36px; color: #1a365d; margin: 30px 0; font-style: italic; }
        .course { font-size: 24px; color: #2d3748; margin: 20px 0; }
        .date { font-size: 14px; color: #718096; margin-top: 40px; }
        .code { font-size: 12px; color: #a0aec0; margin-top: 20px; }
        .signature { margin-top: 40px; }
        .signature-line { width: 200px; border-top: 1px solid #1a365d; margin: 0 auto 10px; }
        .signature-name { font-size: 14px; color: #4a5568; }
      </style>
    </head>
    <body>
      <div class="certificate">
        <p class="header">CERTIFICATE OF COMPLETION</p>
        <h1 class="title">Certificate</h1>
        <p class="subtitle">This is to certify that</p>
        <p class="name">${userName}</p>
        <p class="subtitle">has successfully completed the course</p>
        <p class="course">"${courseName}"</p>
        <p class="date">Completed on ${completionDate}</p>
        <div class="signature">
          <div class="signature-line"></div>
          <p class="signature-name">${instructorName}<br>Course Instructor</p>
        </div>
        <p class="code">Certificate ID: ${certificateCode}</p>
      </div>
    </body>
    </html>
  `;
}

export function generateCertificateCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'CERT-';
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-';
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
