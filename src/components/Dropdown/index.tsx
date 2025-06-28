import React from 'react'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material'
import useStyles from './styles'

const Dropdown = props => {
  const {
    id,
    name,
    value,
    label,
    onChange,
    options,
    error,
    helperText,
    required
  } = props
  const classes = useStyles()
  return (
    <>
      <p className={classes.labelText}>
        {label}
        {required ? <span style={{ color: 'red' }}>*</span> : null}
      </p>
      <FormControl
        variant="outlined"
        style={{ width: '92%', marginLeft: '4%' }}
        error={!!error}
      >
        <InputLabel id={`${id}-label`}>{label}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          label={label}
        >
          {options.map(option => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </>
  )
}

export default Dropdown
