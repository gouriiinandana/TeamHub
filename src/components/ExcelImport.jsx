import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, FileUp, CheckCircle, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';

const ExcelImport = () => {
    const { importEmployees } = useData();
    const fileInputRef = useRef(null);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [message, setMessage] = useState('');

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setStatus('processing');
        const reader = new FileReader();

        reader.onload = (evt) => {
            try {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws);

                // Validation: Check if columns exist
                // Expected columns: Name, EmployeeID, Designation
                // Flexible map:
                const formattedData = data.map(row => ({
                    name: row['Name'] || row['name'],
                    empId: row['EmployeeID'] || row['Employee ID'] || row['empId'] || row['id'],
                    designation: row['Designation'] || row['designation'] || row['Role']
                })).filter(item => item.name && item.empId);

                if (formattedData.length === 0) {
                    throw new Error("No valid data found. Ensure headers are Name, EmployeeID, Designation.");
                }

                importEmployees(formattedData);
                setStatus('success');
                setMessage(`Successfully imported ${formattedData.length} employees!`);
                setTimeout(() => setStatus('idle'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.message || "Failed to parse Excel file.");
            }
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileUp className="text-indigo-500" />
                Bulk Import
            </h3>

            <div
                className="border-2 border-dashed border-indigo-200 rounded-lg p-8 text-center hover:bg-indigo-50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current.click()}
            >
                <input
                    type="file"
                    accept=".xlsx, .xls"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                />

                {status === 'idle' && (
                    <div className="flex flex-col items-center gap-2 text-slate-500">
                        <Upload size={32} />
                        <p>Click to upload Excel file (.xlsx)</p>
                        <p className="text-xs text-slate-400">Headers: Name, EmployeeID, Designation</p>
                    </div>
                )}

                {status === 'processing' && <p className="text-indigo-500 animate-pulse">Processing...</p>}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-2 text-green-500">
                        <CheckCircle size={32} />
                        <p>{message}</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-2 text-red-500">
                        <AlertCircle size={32} />
                        <p>{message}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExcelImport;
