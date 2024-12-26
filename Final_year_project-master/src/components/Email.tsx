import React, { useEffect, useState } from 'react';
import { DataGrid, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button, TextField, Chip, Stack } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWorkers } from '../slices/adminSlice';
import { sendEmail } from '../slices/adminSlice';
import useErrorNotifier from '../hooks/useErrorNotifier';

const theme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-cell': {
                        color: 'white', // Customize cell text color
                        backgroundColor: '#1F2937', // Customize cell background color
                        borderColor: "white",
                        borderWidth: 0.5,
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#111828', // Customize column header background color
                        color: 'black', // Customize column header text color
                    },
                    '& .MuiDataGrid-footerContainer': {
                        backgroundColor: '#1F2937', // Customize footer background color
                        color: 'white', // Customize footer text color
                    },
                    '& .MuiCheckbox-root': {
                        color: 'white !important', // Customize checkbox color
                    },
                },
            },
        },
    },
});

const Email = () => {
    const dispatch = useDispatch();
    const { workers, loading, meta, error } = useSelector((state: any) => state.admin)
    const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
        page: 0,
        pageSize: 10,
    });
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
    const [customEmail, setCustomEmail] = useState<string>('');
    const [customEmails, setCustomEmails] = useState<string[]>([]);

    const handleSelectionChange = (selectionModel: GridRowSelectionModel) => {
        const selectedRows = workers.filter((row: any) =>
            selectionModel.includes(row.id)
        );
        setSelectedEmails(selectedRows.map((row: any) => row.email));
    };

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleAddCustomEmail = () => {
        if (!isValidEmail(customEmail)) {
            return;
        }
        if (!customEmails.includes(customEmail)) {
            setCustomEmails([...customEmails, customEmail]);
            setSelectedEmails([...selectedEmails, customEmail]);
        }
        setCustomEmail('');
    };

    const handleRemoveCustomEmail = (emailToRemove: string) => {
        setCustomEmails(customEmails.filter(email => email !== emailToRemove));
        setSelectedEmails(selectedEmails.filter(email => email !== emailToRemove));
    };

    const handleSendEmail = async () => {
        const allEmails = [...selectedEmails, ...customEmails];
        const uniqueEmails = [...new Set(allEmails)];
        dispatch(sendEmail(uniqueEmails));
        setSelectedEmails([]);
    };
    useEffect(() => {
        dispatch(fetchWorkers({
            page: paginationModel.page + 1,
            limit: paginationModel.pageSize,
            user_role: 'admin'
        }));
    }, [dispatch, paginationModel]);
    const columns = [
        { field: 'name', headerName: 'Admin Name', flex: 1 },
        { field: 'email', headerName: 'Email', flex: 2 },
    ];
    return (
        <div className="p-4">
            <div className="flex flex-col gap-4 mb-4">
                <div className="flex gap-2 items-center">
                    <TextField
                        variant="outlined"
                        size="small"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        placeholder="Add external email"
                        className="bg-gray-700 rounded text-white"
                        InputProps={{
                            style: { color: 'white' },
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddCustomEmail()}
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddCustomEmail}
                        disabled={!customEmail}
                    >
                        Add Email
                    </Button>
                </div>

                {customEmails.length > 0 && (
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                        {customEmails.map((email) => (
                            <Chip
                                key={email}
                                label={email}
                                onDelete={() => handleRemoveCustomEmail(email)}
                                color="primary"
                                className="m-1"
                            />
                        ))}
                    </Stack>
                )}

                <div className="flex justify-between">
                    <span className="text-white">
                        Selected: {selectedEmails.length + customEmails.length}
                    </span>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendEmail}
                        disabled={selectedEmails.length + customEmails.length === 0}
                    >
                        Send
                    </Button>
                </div>
            </div>
            <div style={{ width: '100%' }}>
                <ThemeProvider theme={theme}>
                    <DataGrid
                        loading={loading}
                        rows={workers}
                        getRowId={(row) => row.id}
                        columns={columns}
                        rowCount={meta.total}
                        pagination
                        paginationMode='server'
                        pageSizeOptions={[2, 5, 10, 20, 50, 100]}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        checkboxSelection
                        onRowSelectionModelChange={handleSelectionChange}
                        disableRowSelectionOnClick
                    />
                </ThemeProvider>
            </div>
        </div>
    );
};

export default Email;