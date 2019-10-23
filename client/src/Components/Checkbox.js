import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({ value, type = 'checkbox', name, checked = false, onChange, id }) => {
  return <input value={value} id={id }type={type} name={name} checked={checked} onChange={onChange} />
};

Checkbox.propTypes = {
  value: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
}

export default Checkbox;
