
import React from 'react'

interface TableHeaderProps {
  title: string;
}

const TableHeader: React.FC<TableHeaderProps> = ({ title }) => (
  <h4 style={{ fontWeight: 'bold', marginTop: 15 }}>{title}</h4>
)

export default TableHeader
