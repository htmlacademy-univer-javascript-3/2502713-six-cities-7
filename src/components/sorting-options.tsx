import { useRef, useState } from 'react';
import { SortType } from '../sorting';
import './sorting-options.css';

type SortingOptionsProps = {
  value: SortType;
  onChange: (sortType: SortType) => void;
};

function SortingOptions({ value, onChange }: SortingOptionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  function closeOptions() {
    setIsOpen(false);
    toggleRef.current?.focus();
  }

  return (
    <div
      className='places__sorting'
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (isOpen && event.key === 'Escape') {
          closeOptions();
        }
      }}
    >
      <span className='places__sorting-caption'>Sort by</span>{' '}
      <button
        className='button places__sorting-type'
        type='button'
        ref={toggleRef}
        aria-label={`Sort by ${value}`}
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
      >
        {value}
        <svg className='places__sorting-arrow' width='7' height='4' aria-hidden='true'><use xlinkHref='#icon-arrow-select' /></svg>
      </button>
      {isOpen && (
        <ul className='places__options places__options--custom places__options--opened'>
          {Object.values(SortType).map((option) => (
            <li key={option}>
              <button
                className={`button places__option${option === value ? ' places__option--active' : ''}`}
                type='button'
                aria-pressed={option === value}
                onClick={() => {
                  onChange(option);
                  closeOptions();
                }}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SortingOptions;
