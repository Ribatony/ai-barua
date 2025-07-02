import jsPDF from 'jspdf';

function LetterOutput({ letter }) {
  const handleCopy = () => {
    if (!letter) return;
    navigator.clipboard.writeText(letter);
    alert('Letter copied to clipboard!');
  };

  const handleDownload = () => {
    if (!letter) return;
    const doc = new jsPDF();
    // Split long text into lines for PDF
    const lines = doc.splitTextToSize(letter, 180);
    doc.text(lines, 10, 10);
    doc.save('letter.pdf');
  };

  if (!letter) {
    return (
      <div style={{ background: "#fff", padding: 16, borderRadius: 8, minHeight: 120 }}>
        <em>Your generated letter will appear here.</em>
      </div>
    );
  }

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8 }}>
      <textarea
        value={letter}
        readOnly
        rows={12}
        style={{ width: '100%', fontFamily: 'inherit', fontSize: '1rem', marginBottom: 8 }}
      />
      <div>
        <button onClick={handleCopy}>Copy Letter</button>
        <button onClick={handleDownload} style={{ marginLeft: '0.5rem' }}>Download as PDF</button>
      </div>
    </div>
  );
}

export default LetterOutput;