import React, { useRef, useState } from "react";
import styled, { keyframes } from "styled-components";
import { FiUploadCloud } from "react-icons/fi";

const bounce = keyframes`
  0% { transform: scale(1); }
  60% { transform: scale(1.08); }
  100% { transform: scale(1); }
`;

const UploadBox = styled.div`
  border: 2.5px dashed #6366f1;
  background: linear-gradient(120deg, #f5f7ff 60%, #e0e7ff 100%);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: box-shadow 0.2s, background 0.2s;
  box-shadow: 0 4px 24px rgba(99,102,241,0.10);
  color: #6366f1;
  font-weight: 700;
  font-size: 1.15rem;
  margin-bottom: 0.7rem;
  &:hover {
    box-shadow: 0 8px 32px rgba(99,102,241,0.13);
    background: linear-gradient(120deg, #eef2ff 60%, #e0e7ff 100%);
    animation: ${bounce} 0.3s;
  }
`;

const UploadButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(90deg, #6366f1 60%, #3730a3 100%);
  color: #fff;
  border: none;
  border-radius: 1.2rem;
  padding: 0.9rem 1.7rem;
  font-size: 1.1rem;
  font-weight: 700;
  margin-top: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(99,102,241,0.13);
  transition: background 0.2s, transform 0.1s;
  &:hover {
    background: linear-gradient(90deg, #3730a3 60%, #6366f1 100%);
    transform: translateY(-2px) scale(1.05);
  }
`;

const FileName = styled.div`
  color: #3730a3;
  font-size: 1.05rem;
  margin-top: 0.9rem;
  word-break: break-all;
  font-weight: 600;
`;

const FileUpload = ({ onFileSelected }) => {
  const fileInput = useRef();
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      onFileSelected(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFileName(e.dataTransfer.files[0].name);
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  return (
    <>
      <UploadBox
        style={dragActive ? { background: "#e0e7ff", borderColor: "#3730a3" } : {}}
        onClick={() => fileInput.current.click()}
        onDragOver={e => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
        onDrop={handleDrop}
      >
        <FiUploadCloud size={38} style={{ marginBottom: 8 }} />
        <div>Drag & drop your PDF here, or click to select</div>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInput}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {fileName && <FileName>{fileName}</FileName>}
      </UploadBox>
      <UploadButton onClick={() => fileInput.current.click()} type="button">
        <FiUploadCloud size={20} /> Upload Resume (PDF)
      </UploadButton>
    </>
  );
};

export default FileUpload; 