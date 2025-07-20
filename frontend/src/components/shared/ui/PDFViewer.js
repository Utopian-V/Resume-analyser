import React, { useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styled from "styled-components";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const PDFContainer = styled.div`
  background: linear-gradient(120deg, #fff 60%, #f5f7ff 100%);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  padding: 1.5rem;
  margin: 0 auto;
  max-width: 100%;
  overflow-x: auto;
`;

const Highlight = styled.span`
  background: linear-gradient(90deg, #ffe066 60%, #fffbe6 100%);
  border-radius: 0.3em;
  padding: 0.1em 0.3em;
  box-shadow: 0 1px 4px #ffe06644;
`;

function highlightText(text, highlights) {
  if (!highlights || highlights.length === 0) return text;
  let parts = [text];
  highlights.forEach(h => {
    const newParts = [];
    parts.forEach(part => {
      if (typeof part === "string" && part.toLowerCase().includes(h.toLowerCase())) {
        const idx = part.toLowerCase().indexOf(h.toLowerCase());
        if (idx !== -1) {
          newParts.push(part.slice(0, idx));
          newParts.push(<Highlight key={h + idx}>{part.slice(idx, idx + h.length)}</Highlight>);
          newParts.push(part.slice(idx + h.length));
        } else {
          newParts.push(part);
        }
      } else {
        newParts.push(part);
      }
    });
    parts = newParts;
  });
  return parts;
}

const PDFViewer = ({ file, highlights, pageNumber = 1 }) => {
  const viewerRef = useRef();

  useEffect(() => {
    if (viewerRef.current && highlights && highlights.length > 0) {
      // Optionally scroll to highlight
      const el = viewerRef.current.querySelector("span[style*='background']");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [highlights]);

  return (
    <PDFContainer ref={viewerRef}>
      <Document file={file} loading={<div>Loading PDF...</div>}>
        <Page
          pageNumber={pageNumber}
          width={420}
          renderTextLayer={true}
          customTextRenderer={({ str }) => highlightText(str, highlights)}
        />
      </Document>
    </PDFContainer>
  );
};

export default PDFViewer; 