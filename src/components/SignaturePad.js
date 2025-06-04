import React, { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';

const ESignature = ({ value, onChange }) => {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current);
      signaturePadRef.current.onEnd = () => {
        const data = signaturePadRef.current.isEmpty()
          ? ''
          : signaturePadRef.current.toDataURL();
        // Logging for debugging
        console.log('SignaturePad onEnd, data:', data);
        if (onChange) onChange(data);
      };
    }
    // Sync pad with value
    if (signaturePadRef.current) {
      if (!value) {
        signaturePadRef.current.clear();
      } else if (signaturePadRef.current.isEmpty()) {
        const img = new window.Image();
        img.src = value;
        img.onload = () => {
          signaturePadRef.current.clear();
          signaturePadRef.current._ctx.drawImage(
            img,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
        };
      }
    }
  }, [onChange, value]);

  const handleClear = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      if (onChange) onChange('');
    }
  };

  // Optional: Button to manually set the signature (for debugging)
  const handleSetSignature = () => {
    if (signaturePadRef.current) {
      const data = signaturePadRef.current.isEmpty()
        ? ''
        : signaturePadRef.current.toDataURL();
      console.log('Set Signature button, data:', data);
      if (onChange) onChange(data);
    }
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ border: '1px solid #ccc', width: '100%', maxWidth: 400 }}
      />
      <button type="button" onClick={handleClear} style={{ marginTop: 8 }}>
        Clear
      </button>
      <button type="button" onClick={handleSetSignature} style={{ marginTop: 8, marginLeft: 8 }}>
        Set Signature
      </button>
    </div>
  );
};

export default ESignature;