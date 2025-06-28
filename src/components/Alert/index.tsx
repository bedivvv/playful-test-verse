
import React from 'react'
import { Alert } from '@mui/material'

const styles = {
  alert: {
    left: '0',
    pointerEvents: 'none' as const,
    position: 'fixed' as const,
    top: 0,
    width: '100%',
    zIndex: '1500'
  }
}

interface AlertMessageProps {
  severity: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

const AlertMessage: React.FC<AlertMessageProps> = props => {
  return (
    <Alert style={styles.alert} severity={props.severity}>
      {props.message}
    </Alert>
  )
}

export default AlertMessage
