import React, { useState, useEffect, useRef, useCallback } from 'react'
import { CCard, CCol, CFormLabel, CRow } from '@coreui/react' // Updated CLabel to CFormLabel
import SignaturePad from 'signature_pad'

const ESignature = ({ onReady, svg, onChange = () => {}, disableEdit }) => {
  const ref = useRef(null)
  const [signaturePad, setSignaturePad] = useState(null)
  const [hideImage, setHideImage] = useState(!svg)

  const resizeCanvas = useCallback(
    (signaturePadInstance) => {
      if (ref.current && (signaturePad || signaturePadInstance)) {
        const ratio = Math.max(window.devicePixelRatio || 1, 1)
        ref.current.width = ref.current.offsetWidth * ratio
        ref.current.height = ref.current.offsetHeight * ratio
        ref.current.getContext('2d').scale(ratio, ratio)
      }
    },
    [signaturePad],
  )

  useEffect(() => {
    const signaturePadInstance = new SignaturePad(ref.current, {
      onEnd: () => {
        setHideImage(true)
        onChange(signaturePadInstance.toDataURL())
      },
    })

    if (disableEdit) signaturePadInstance.off()

    onReady?.(signaturePadInstance)
    setSignaturePad(signaturePadInstance)
    resizeCanvas(signaturePadInstance)

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && signaturePadInstance.isEmpty()) {
        resizeCanvas(signaturePadInstance)
      }
    })

    observer.observe(ref.current)
    window.addEventListener('resize', resizeCanvas)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [resizeCanvas, onReady, onChange, disableEdit])

  useEffect(() => {
    if (signaturePad) {
      disableEdit ? signaturePad.off() : signaturePad.on()
    }
  }, [disableEdit, signaturePad])

  return (
    <CRow>
      <CCol xs="12" sm="6" lg="4">
        <CCard className="esignature-canvas">
          <canvas style={{ display: 'block' }} ref={ref} />
          {!hideImage && <img alt="Signature" src={svg} />}
        </CCard>
        {!disableEdit && (
          <CFormLabel
            style={{ cursor: 'pointer' }}
            onClick={() => {
              signaturePad.clear()
              setHideImage(true)
              resizeCanvas()
            }}
          >
            Clear
          </CFormLabel>
        )}
      </CCol>
    </CRow>
  )
}

export default ESignature
