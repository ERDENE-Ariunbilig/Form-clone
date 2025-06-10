import { useState, useEffect } from 'react';
import './MultipleChoiceGrid.css';

export default function MultipleChoiceGrid({ options = { rows: [], columns: [] }, onChange }) {
  const [rows, setRows] = useState(options.rows || []);
  const [columns, setColumns] = useState(options.columns || []);
  const [selection, setSelection] = useState({});

  
  useEffect(() => {
    if (JSON.stringify(options.rows) !== JSON.stringify(rows)) {
      setRows(options.rows || []);
    }
    if (JSON.stringify(options.columns) !== JSON.stringify(columns)) {
      setColumns(options.columns || []);
    }
    if (options.selection) {
      setSelection(options.selection);
    }
  }, [options]);
  
  const addRow = () => {
    const newRows = [...rows, { id: Date.now(), text: '' }];
    setRows(newRows);
    onChange({ rows: newRows, columns });
  };
  
  const addColumn = () => {
    const newColumns = [...columns, { id: Date.now(), text: '' }];
    setColumns(newColumns);
    onChange({ rows, columns: newColumns });
  };
  
  const updateRow = (id, text) => {
    const newRows = rows.map(row => row.id === id ? { ...row, text } : row);
    setRows(newRows);
    onChange({ rows: newRows, columns });
  };
  
  const updateColumn = (id, text) => {
    const newColumns = columns.map(col => col.id === id ? { ...col, text } : col);
    setColumns(newColumns);
    onChange({ rows, columns: newColumns });
  };
  
  const removeRow = (id) => {
    const newRows = rows.filter(row => row.id !== id);
    // selection-с тухайн row-ийн сонголтыг устгах
    const newSelection = { ...selection };
    delete newSelection[id];
    setRows(newRows);
    setSelection(newSelection);
    onChange({ rows: newRows, columns, selection: newSelection });
  };
  
  const removeColumn = (id) => {
    const newColumns = columns.filter(col => col.id !== id);
    // selection-с тухайн column сонголтыг устгах (тухайн column сонгогдсон row-үүдийг шалгах)
    const newSelection = { ...selection };
    for (const rowId in newSelection) {
      if (newSelection[rowId] === id) {
        delete newSelection[rowId];
      }
    }
    setColumns(newColumns);
    setSelection(newSelection);
    onChange({ rows, columns: newColumns, selection: newSelection });
  };
  const handleSelect = (rowId, columnId) => {
    const newSelection = { ...selection, [rowId]: columnId };
    setSelection(newSelection);
    onChange({ rows, columns, selection: newSelection }); // Шинэ утга дамжуулна
  };

  
  return (
    <div className="gridWrapper">
      <div className="gridSection">
        <h4>Rows</h4>
        {rows.map(row => (
          <div key={row.id} className="gridItem">
            <input
              type="text"
              value={row.text}
              onChange={(e) => updateRow(row.id, e.target.value)}
              placeholder="Row label"
              className="gridInput"
            />
            <button className="removeBtn" onClick={() => removeRow(row.id)}>✕</button>
          </div>
        ))}
        <button className="addBtn" onClick={addRow}>Add Row</button>
      </div>
      
      <div className="gridSection">
        <h4>Columns</h4>
        {columns.map(column => (
          <div key={column.id} className="gridItem">
            <input
              type="text"
              value={column.text}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              placeholder="Column label"
              className="gridInput"
            />
            <button className="removeBtn" onClick={() => removeColumn(column.id)}>✕</button>
          </div>
        ))}
        <button className="addBtn" onClick={addColumn}>Add Column</button>
      </div>
      
      {rows.length > 0 && columns.length > 0 && (
        <div className="gridPreview">
          <h4>Grid Preview</h4>
          <table className="gridTable">
            <thead>
              <tr>
                <th></th>
                {columns.map(col => (
                  <th key={col.id}>{col.text || 'Untitled'}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.id}>
                  <td>{row.text || 'Untitled'}</td>
                  {columns.map(col => (
                    <td key={col.id}>
                      <input
                        type="radio"
                        name={`row_${row.id}`}
                        checked={selection[row.id] === col.id}
                        onChange={() => handleSelect(row.id, col.id)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
