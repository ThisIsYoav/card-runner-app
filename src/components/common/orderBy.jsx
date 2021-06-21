import React from 'react';

const OrderBy = ({ sortBy, sortOptions, sort }) => {
  return (
    <React.Fragment>
      <span>Sort By &nbsp;</span>
      <div className="dropdown d-inline-block">
        <button type="button" className="btn btn-sm btn-info btn-default dropdown-toggle text-wrap text-capitalize" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
          {sortBy}
          <span className="caret"></span>
        </button>
        <ul className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenu1">
          {sortOptions.map((option, index) => {
            return <a key={index} href='/'
              onClick={(e) => { e.preventDefault(); sort(option) }}
              className={`dropdown-item${option === sortBy ? ' active' : ''}`} >
              {option}
            </a>
          })}
        </ul>
      </div>
    </React.Fragment>
  );
}
 
export default OrderBy;