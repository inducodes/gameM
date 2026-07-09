import React from 'react';
import './VirtualKeyboard.css';

const KEYBOARD_ROWS = [
  [
    { key: '`', label: '`', type: 'pinky-left' },
    { key: '1', label: '1', type: 'pinky-left' },
    { key: '2', label: '2', type: 'ring-left' },
    { key: '3', label: '3', type: 'middle-left' },
    { key: '4', label: '4', type: 'index-left' },
    { key: '5', label: '5', type: 'index-left' },
    { key: '6', label: '6', type: 'index-right' },
    { key: '7', label: '7', type: 'index-right' },
    { key: '8', label: '8', type: 'middle-right' },
    { key: '9', label: '9', type: 'ring-right' },
    { key: '0', label: '0', type: 'pinky-right' },
    { key: '-', label: '-', type: 'pinky-right' },
    { key: '=', label: '=', type: 'pinky-right' },
    { key: 'Backspace', label: 'Backspace', type: 'pinky-right', size: 'large' },
  ],
  [
    { key: 'Tab', label: 'Tab', type: 'pinky-left', size: 'medium' },
    { key: 'q', label: 'Q', type: 'pinky-left' },
    { key: 'w', label: 'W', type: 'ring-left' },
    { key: 'e', label: 'E', type: 'middle-left' },
    { key: 'r', label: 'R', type: 'index-left' },
    { key: 't', label: 'T', type: 'index-left' },
    { key: 'y', label: 'Y', type: 'index-right' },
    { key: 'u', label: 'U', type: 'index-right' },
    { key: 'i', label: 'I', type: 'middle-right' },
    { key: 'o', label: 'O', type: 'ring-right' },
    { key: 'p', label: 'P', type: 'pinky-right' },
    { key: '[', label: '[', type: 'pinky-right' },
    { key: ']', label: ']', type: 'pinky-right' },
    { key: '\\', label: '\\', type: 'pinky-right', size: 'medium' },
  ],
  [
    { key: 'CapsLock', label: 'Caps Lock', type: 'pinky-left', size: 'large' },
    { key: 'a', label: 'A', type: 'pinky-left' },
    { key: 's', label: 'S', type: 'ring-left' },
    { key: 'd', label: 'D', type: 'middle-left' },
    { key: 'f', label: 'F', type: 'index-left', hasBump: true },
    { key: 'g', label: 'G', type: 'index-left' },
    { key: 'h', label: 'H', type: 'index-right' },
    { key: 'j', label: 'J', type: 'index-right', hasBump: true },
    { key: 'k', label: 'K', type: 'middle-right' },
    { key: 'l', label: 'L', type: 'ring-right' },
    { key: ';', label: ';', type: 'pinky-right' },
    { key: "'", label: "'", type: 'pinky-right' },
    { key: 'Enter', label: 'Enter', type: 'pinky-right', size: 'xlarge' },
  ],
  [
    { key: 'ShiftLeft', label: 'Shift', type: 'pinky-left', size: 'xlarge' },
    { key: 'z', label: 'Z', type: 'pinky-left' },
    { key: 'x', label: 'X', type: 'ring-left' },
    { key: 'c', label: 'C', type: 'middle-left' },
    { key: 'v', label: 'V', type: 'index-left' },
    { key: 'b', label: 'B', type: 'index-left' },
    { key: 'n', label: 'N', type: 'index-right' },
    { key: 'm', label: 'M', type: 'index-right' },
    { key: ',', label: ',', type: 'middle-right' },
    { key: '.', label: '.', type: 'ring-right' },
    { key: '/', label: '/', type: 'pinky-right' },
    { key: 'ShiftRight', label: 'Shift', type: 'pinky-right', size: 'xlarge' },
  ],
  [
    { key: 'ControlLeft', label: 'Ctrl', type: 'pinky-left', size: 'medium' },
    { key: 'AltLeft', label: 'Alt', type: 'pinky-left', size: 'medium' },
    { key: ' ', label: '', type: 'thumb', size: 'space' },
    { key: 'AltRight', label: 'Alt', type: 'pinky-right', size: 'medium' },
    { key: 'ControlRight', label: 'Ctrl', type: 'pinky-right', size: 'medium' },
  ]
];

export default function VirtualKeyboard({ nextKey }) {
  return (
    <div className="virtual-keyboard-container">
      <div className="virtual-keyboard">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="keyboard-row">
            {row.map((keyDef, colIndex) => {
              const isNext = nextKey && nextKey.toLowerCase() === keyDef.key.toLowerCase();
              return (
                <div 
                  key={colIndex} 
                  className={`keyboard-key ${keyDef.type} ${keyDef.size || ''} ${isNext ? 'highlight' : ''}`}
                >
                  <span className="key-label">{keyDef.label}</span>
                  {keyDef.hasBump && <span className="key-bump"></span>}
                  {isNext && <span className="highlight-circle"></span>}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
