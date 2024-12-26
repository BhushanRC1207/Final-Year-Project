import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import Tooltip from '@mui/material/Tooltip';
import { addMeter, deleteMeter, getMeters, updateExistMeter } from '../slices/adminSlice';


const theme = createTheme({
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-cell': {
            color: 'white',
            backgroundColor: '#1F2937',
            borderColor: "white",
            borderWidth: 0.5,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#111828',
            color: 'black',
          },
          '& .MuiDataGrid-footerContainer': {
            backgroundColor: '#1F2937',
            color: 'white',
          },
        },
      },
    },
  },
});

interface MeterCrudProps {
  tab: string;
}

interface createMeter {
  model: string;
  description: string;
  photo: File | null;
}

interface updateMeter {
  model?: string;
  description?: string;
  photo?: File | null;
}

const MeterCrud: React.FC<MeterCrudProps> = ({ tab }) => {
  const dispatch = useDispatch();
  const { meters, loading, meta } = useSelector((state: any) => state.admin);
  const [paginationModel, setPaginationModel] = useState({
    page: 0, pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>(tab);
  const [createMeter, setCreateMeter] = useState<createMeter>({
    model: '',
    description: '',
    photo: null,
  });
  const [selectedMeter, setSelectedMeter] = useState<any>(null);
  const [updateMeter, setUpdateMeter] = useState<updateMeter>({
    model: '',
    description: '',
    photo: null,
  });
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);


  const handlePagination = (params) => {
    setPaginationModel({
      page: params.page,
      pageSize: params.pageSize
    });
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    if (name === 'photo' && files) {
      setCreateMeter({
        ...createMeter,
        photo: files[0]
      });
    } else {
      setCreateMeter({
        ...createMeter,
        [name]: value
      });
    }
  };

  const handleUpdate = (event) => {
    const { name, value, files } = event.target;
    if (name === 'photo' && files) {
      setUpdateMeter({
        ...updateMeter,
        photo: files[0]
      });
    } else {
      setUpdateMeter({
        ...updateMeter,
        [name]: value
      });
    }
  }

  const confirmDelete = () => {
    dispatch(deleteMeter(selectedMeter.id));
    setIsDeleteConfirmOpen(false);
    setSelectedMeter(null)
    setActiveTab('get')
  };

  const cancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setSelectedMeter(null)
  };

  const resetform = () => {
    if (activeTab == 'add') {
      setCreateMeter({
        model: '',
        description: '',
        photo: null,
      });
    }
    else {
      setUpdateMeter({
        model: '',
        description: '',
        photo: null,
      });
    };
  };

  useEffect(() => {
    dispatch(getMeters({
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
      model: searchQuery
    }));
  }, [dispatch, paginationModel, searchQuery]);

  const columns: GridColDef[] = [
    { field: 'model', headerName: 'Model', width: 100, headerAlign: 'center', align: 'center' },
    {
      field: 'photo',
      headerName: 'Photo',
      width: 150,
      headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <div className='flex justify-center items-center flex-1'>
          <img src={params.value} alt={params.row.model} />
        </div>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      headerAlign: 'center',
      flex: 1,
      align: 'center',
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {params.value}
          </div>
        </Tooltip>
      ),
    },

    {
      field: 'actions',
      headerName: '',
      width: 200,
      headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <div className="flex space-x-2 justify-between items-center h-full">
          <button
            className="bg-blue-600 text-white text-sm my-4 py-1 px-3 rounded hover:bg-blue-700 transition duration-300 ease-in-out h-7 w-1/2"
            onClick={() => {
              setActiveTab('update');
              setUpdateMeter({
                model: params.row.model,
                description: params.row.description,
                photo: params.row.photo,
              });
              setSelectedMeter(params.row);
            }}
          > Update
          </button>
          <button
            className="bg-red-600 text-white text-sm my-4 py-1 px-3 rounded hover:bg-red-700 transition duration-300 ease-in-out h-7 w-1/2"
            onClick={() => {
              setIsDeleteConfirmOpen(true)
              setSelectedMeter(params.row);
            }}
          > Delete
          </button>

        </div>
      ),
    },

  ];

  return (
    <div className="container">
      <h1 className="text-2xl font-bold text-center mb-6">Meter Management</h1>
      <div className="flex justify-between mb-4 items-center gap-10">
        <input
          type="text"
          placeholder="Search by model"
          value={searchQuery}
          onChange={handleSearchChange}
          className="p-2 border border-gray-300 rounded flex-1"
        />
        <button
          className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-500"
          onClick={() => setActiveTab(prevTab => (prevTab === 'add' ? 'get' : 'add'))}
        >
          {activeTab === 'add' ? 'Show All' : 'Add'}
        </button>

      </div>
      <div className="grid grid-cols-1 gap-4">
        {activeTab === 'add' && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg relative w-1/3">
              <button
                className="absolute bg-white top-2 right-2 text-gray-700 hover:text-gray-500"
                onClick={() => setActiveTab('get')}
              >
                ✕
              </button>
              <h2 className="text-xl text-gray-700 font-semibold mb-4">Add Meter</h2>
              {Object.entries(createMeter).map(([key, value]) => {
                return (
                  <div key={key}>
                    {(key === 'screen_photos' || key === 'photo') && (
                      <label className="flex justify-start text-md font-semibold text-gray-800" htmlFor={key}>
                        Meter Photos
                      </label>
                    )}
                    <input
                      style={{ backgroundColor: '#1F2937', color: 'white' }}
                      className="border border-gray-300 rounded p-2 mb-2 w-full"
                      name={key}
                      type={key === 'photo' || key === 'screen_photos' ? 'file' : 'text'}
                      placeholder={`Meter ${key}`}
                      defaultValue={key === 'screen_photos' ? undefined : value}
                      onChange={handleInputChange}
                      multiple={key === 'screen_photos'}
                      accept={
                        (key === 'screen_photos' || key === 'photo') ? 'image/*' : undefined
                      }
                    />
                  </div>
                );
              })}
              <button className="bg-teal-600 text-white py-2 rounded hover:bg-teal-500" onClick={() => {
                const formData = new FormData();
                Object.entries(createMeter).forEach(([key, value]) => {
                  if (key === 'photo') {
                    formData.append(key, value);
                  } else {
                    formData.append(key, value);
                  }
                });
                dispatch(addMeter(formData));
                setActiveTab('get');
                resetform();
              }} >Add Meter</button>
            </div>
          </div>
        )}
        {
          activeTab == 'update' && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg relative w-2/3">
                <button
                  className="absolute bg-white top-2 right-2 text-gray-700 hover:text-gray-500"
                  onClick={() => setActiveTab('get')}
                >
                  ✕
                </button>
                <h2 className="text-xl text-gray-700 font-semibold mb-4">Update Meter</h2>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(updateMeter).map(([key, value]) => {
                    return (
                      <div key={key}>
                        {(key === 'photo') && (
                          <>
                            <label className="flex justify-start text-md font-semibold text-gray-800" htmlFor={key}>
                              Meter Photos
                            </label>
                            {key === 'photo' && (
                              <img src={value} alt={updateMeter.model} className="w-1/2" />
                            )}
                          </>
                        )}
                        <input
                          style={{ backgroundColor: '#1F2937', color: 'white' }}
                          className="border border-gray-300 rounded p-2 mb-2 w-full"
                          name={key}
                          type={key === 'photo' ? 'file' : 'text'}
                          placeholder={`Meter ${key}`}
                          defaultValue={key === 'photo' ? undefined : value}
                          accept={(key === 'photo') ? 'image/*' : undefined}
                          onChange={handleUpdate}
                        />
                      </div>
                    );
                  })}
                </div>


                <button className="bg-teal-600 text-white py-2 rounded hover:bg-teal-500"
                  onClick={() => {
                    const formData = new FormData();
                    Object.entries(updateMeter).forEach(([key, value]) => {
                      if (value === null || value === '') return;
                      if (value !== selectedMeter[key]) {
                        if (key === 'photo') {
                          formData.append(key, value);
                        } else {
                          formData.append(key, value);
                        }
                      }
                    })
                    dispatch(updateExistMeter({ id: selectedMeter.id, meter: formData }));
                    setActiveTab('get');
                    resetform();
                  }}>Update Meter</button>
              </div>
            </div>)
        }
        {
          activeTab == 'get' && (
            <div>
              <ThemeProvider theme={theme}>
                <DataGrid
                  loading={loading}
                  rows={meters}
                  columns={columns}
                  paginationModel={paginationModel}
                  pageSizeOptions={[2, 5, 10, 20]}
                  paginationMode="server"
                  rowCount={meta.total}
                  onPaginationModelChange={(params) => handlePagination(params)}
                  rowHeight={150}
                  getRowId={(row) => row.id}
                  onRowClick={(row) => setSelectedMeter(row.row)}
                />
              </ThemeProvider>
            </div>
          )
        }
        {isDeleteConfirmOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-gray-500  text-lg mb-4">Are you sure you want to delete this Meter ?</h2>
              <div className="flex justify-end">
                <button onClick={confirmDelete} className="mr-2 px-4 py-2 bg-red-500 text-white rounded">
                  Yes
                </button>
                <button onClick={cancelDelete} className=" px-4 py-2 bg-gray-300 rounded">
                  No
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MeterCrud;