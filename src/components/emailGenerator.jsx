function EmailGenerator({ form }) {
  if (!form || (!form.name && !form.recipient && !form.customMessage && !form.letter)) {
    return (
      <div style={{ background: "#fff", padding: 16, borderRadius: 8, minHeight: 120 }}>
        <em>Fill out the letter form to generate an email version here.</em>
      </div>
    );
  }

  const subject = form.subject || "Your Subject Here";
  const body = form.customMessage || form.letter || "Your message here.";
  const recipientEmail = form.recipientEmail || "recipient@email.com";
  const senderName = form.name || "Your Name";

  return (
    <div style={{ background: "#fff", padding: 16, borderRadius: 8, minHeight: 120 }}>
      <div>
        <strong>To:</strong> {recipientEmail}
      </div>
      <div>
        <strong>Subject:</strong> {subject}
      </div>
      <div style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
        {body}
        <br />
        <br />
        <strong>Best regards,</strong>
        <br />
        {senderName}
      </div>
    </div>
  );
}

export default EmailGenerator;