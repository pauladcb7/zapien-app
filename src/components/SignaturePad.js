import React, { useRef, useEffect } from 'react';
import SignaturePad from 'signature_pad';

const ESignature = ({ onReady }) => {
  const canvasRef = useRef(null);
  const signaturePadRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && !signaturePadRef.current) {
      signaturePadRef.current = new SignaturePad(canvasRef.current);
      if (onReady) {
        onReady(signaturePadRef.current);
      }
    }
    // Only run once on mount
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={400}
        height={150}
        style={{ border: '1px solid #ccc', width: '100%', maxWidth: 400 }}
      />
    </div>
  );
};

export default ESignature;