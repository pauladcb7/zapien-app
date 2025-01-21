/* eslint-disable react/prop-types */
import React, { useState, useEffect, useRef } from 'react'
import {
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
  CListGroup,
  CListGroupItem,
  CBadge,
} from '@coreui/react'

const MultiSelect = ({ options, label, selectedValues, setSelectedValues, onChange }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev)

  const closeDropdown = () => setIsDropdownOpen(false)

  const handleOptionClick = (value) => {
    let updatedValues

    if (selectedValues.includes(value)) {
      updatedValues = selectedValues.filter((item) => item !== value)
    } else {
      updatedValues = [...selectedValues, value]
    }

    setSelectedValues(updatedValues)

    // Trigger the onChange event if provided
    if (onChange) {
      onChange(updatedValues)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])

  // Get labels for selected values
  const selectedLabels = options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)

  return (
    <div className="mb-3 position-relative" ref={dropdownRef}>
      {label && <CFormLabel>{label}</CFormLabel>}
      <CInputGroup onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
        <CInputGroupText>
          <span>Selected: {selectedValues.length}</span>
        </CInputGroupText>
        <CFormInput
          readOnly
          value={selectedLabels.join(', ') || 'Select options'}
          style={{ backgroundColor: 'white', cursor: 'pointer' }}
        />
        <CButton color="outline-secondary">{isDropdownOpen ? '▲' : '▼'}</CButton>
      </CInputGroup>

      {isDropdownOpen && (
        <div
          className="border rounded p-2 position-absolute"
          style={{ backgroundColor: 'white', zIndex: 1000, width: '100%' }}
        >
          <CListGroup>
            {options.map((option) => (
              <CListGroupItem
                key={option.value}
                active={selectedValues.includes(option.value)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
                onClick={() => handleOptionClick(option.value)}
              >
                {option.label}
                {selectedValues.includes(option.value) && (
                  <CBadge color="primary" className="ms-2">
                    ✓
                  </CBadge>
                )}
              </CListGroupItem>
            ))}
          </CListGroup>
        </div>
      )}
    </div>
  )
}

export default MultiSelect
