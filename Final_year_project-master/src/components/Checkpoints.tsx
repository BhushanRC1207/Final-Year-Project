import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkMeter, createInspection, getMeters, resetInspectionStatus, changeCapture, changeMasterImage, changeDiff, resetod } from '../slices/inspectionSlice';
import useErrorNotifier from '../hooks/useErrorNotifier';
import { set } from 'react-datepicker/dist/date_utils';

enum InspectionStatus {
    pass = 'pass',
    fail = 'fail'
}

interface Inspection {
    serial_no: string;
    status: InspectionStatus | string;
    meter_id: string;
    client: string;
}

const Checkpoints: React.FC = () => {
    const dispatch = useDispatch();
    const { meters, loading, checkLoading, inspectionStatus, capturedImage, masterImage, diffImage, od } = useSelector((state) => state.inspection);
    const [operatorInput, setOperatorInput] = useState('');
    const [inspectionForm, setInspectionForm] = useState<Inspection>({
        serial_no: '',
        status: '',
        meter_id: '',
        client: ''
    });
    const masterRef = useRef<HTMLImageElement>(null);
    const captureRef = useRef<HTMLButtonElement>(null);
    const capture = () => {
        const model_type = meters.find((meter: any) => meter.id === inspectionForm.meter_id).model;
        const captured_data = {
            serial_no: inspectionForm.serial_no,
            model_type: model_type,
            master: masterImage,
        }
        console.log(captured_data)
        dispatch(checkMeter(captured_data));
    };


    const retry = () => {
        dispatch(changeCapture())
        dispatch(changeDiff())
        dispatch(resetod())
        setInspectionForm({
            serial_no: inspectionForm.serial_no,
            status: '',
            meter_id: inspectionForm.meter_id,
            client: inspectionForm.client
        });
        dispatch(resetInspectionStatus());
    };

    const handleCaptureRetry = () => {
        if (capturedImage) {
            retry();
        } else {
            capture();
        }
    };

    const handleContinue = () => {
        dispatch(changeCapture());
        dispatch(changeDiff())
        dispatch(resetod())
        setInspectionForm(prev => ({
            ...prev,
            serial_no: '',
            status: '',
        }));
        dispatch(resetInspectionStatus());
    };

    const handleSubmit = () => {
        dispatch(changeCapture());
        dispatch(changeDiff())
        dispatch(resetod())
        setInspectionForm({
            serial_no: '',
            status: '',
            meter_id: '',
            client: ''
        });
        dispatch(changeMasterImage());
        dispatch(resetInspectionStatus());
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        if (name === 'meter_id') {
            const selectedMeter = meters.find((meter: any) => meter.id === value);
            if (selectedMeter) {
                dispatch(changeMasterImage(selectedMeter.image))
            }
        }
        setInspectionForm({
            ...inspectionForm,
            [name]: value,
        });
    };

    const handleOperatorInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOperatorInput(e.target.value);
        if (od && inspectionStatus) {
            dispatch(createInspection({
                ...inspectionForm,
                status: e.target.value === 'pass' ? InspectionStatus.pass : InspectionStatus.fail,
            }));
        }
    };

    useEffect(() => {
        dispatch(getMeters());
    }, [dispatch]);
    useEffect(() => {
        if (inspectionStatus === 'pass' || inspectionStatus === 'fail') {
            setInspectionForm(prev => ({
                ...prev,
                status: inspectionStatus === 'pass' ? InspectionStatus.pass : InspectionStatus.fail
            }));
            setOperatorInput(inspectionStatus);
            if (!od) {
                dispatch(createInspection({
                    ...inspectionForm,
                    status: inspectionStatus === 'pass' ? InspectionStatus.pass : InspectionStatus.fail,
                }));
            }
        }
    }, [inspectionStatus, od]);
    console.log(inspectionForm)

    useErrorNotifier({ stateName: 'inspection' });

    return (
        <div className="p-4 text-center flex flex-col flex-1 w-full mt-20">
            <div className='flex items-center justify-between w-full'>
                <div className="flex gap-5 w-5/2 p-5 bg-gray-800 rounded-md justify-between">
                    <div className="flex flex-col items-center w-1/2">
                        <h4 className="text-lg mb-2">Master Image</h4>
                        <img ref={masterRef} src={masterImage} alt="Master Image" className="h-96 w-96 mb-4 border border-gray-300 rounded-lg" />
                    </div>
                    <div className="flex flex-col items-center w-1/2">
                        <h4 className="text-lg mb-2">Captured Image</h4>
                        {capturedImage ? (
                            <img src={capturedImage} alt="Captured Image" className="h-96 w-96 mb-4 border border-gray-300 rounded-lg" />
                        ) : (
                            <img
                                ref={captureRef}
                                src='http://localhost:3000/video_feed'
                                alt="Live Feed"
                                crossOrigin='anonymous'
                                className="h-96 w-96 mb-4 border border-gray-300 rounded-lg"
                            />
                        )}
                    </div>
                    {
                        diffImage && (
                            <div className="flex flex-col items-center w-1/2">
                                <h4 className="text-lg mb-2">Faults</h4>
                                <img src={diffImage} alt="Master Image" className="h-96 w-96 mb-4 border border-gray-300 rounded-lg" />
                            </div>
                        )
                    }
                </div>
                <div className='flex flex-col gap-20 pt-3 pb-3 flex-1'>
                    <div className="flex flex-col gap-10 mx-5">
                        <div className='flex flex-col bg-gray-800 p-2 rounded-md gap-2'>
                            {inspectionStatus ? (
                                <div className={`flex justify-center rounded-md ${inspectionStatus === 'pass' ? 'bg-gradient-to-r from-green-400 to-green-600' : 'bg-gradient-to-r from-red-400 to-red-600'}`}>
                                    <p className={`text-semibold text-xl`}>{inspectionStatus.toUpperCase()}</p>
                                </div>
                            ) : checkLoading ? (<p>Loading...</p>) : null}

                            <label htmlFor="meterType" className="flex justify-start text-white text-md">Meter</label>
                            <select
                                id="meterType"
                                name="meter_id"
                                className="p-2 rounded-md text-white"
                                onChange={handleInputChange}
                                disabled={loading}
                                value={inspectionForm.meter_id}
                            >
                                <option value="" disabled>Select Meter Type</option>
                                {meters.map((meter) => (
                                    <option key={meter.id} value={meter.id}>{meter.model}</option>
                                ))}
                            </select>
                            <label htmlFor="serialNumber" className="flex justify-start text-white text-md">Serial Number</label>
                            <input
                                id="serialNumber"
                                type="text"
                                name="serial_no"
                                value={inspectionForm.serial_no}
                                onChange={handleInputChange}
                                className="p-2 rounded-md text-white"
                                placeholder="Enter Serial Number"
                                required
                            />
                            <label htmlFor="client" className="flex justify-start text-white text-md">Client</label>
                            <input
                                id="client"
                                type="text"
                                name="client"
                                value={inspectionForm.client}
                                onChange={handleInputChange}
                                className="p-2 rounded-md text-white"
                                placeholder="Enter Client Name"
                                required
                            />
                            {
                                od === true && (
                                    <>
                                        <label htmlFor="od" className="flex justify-start text-white text-md">Operator</label>
                                        <select
                                            id="od"
                                            name="operatorInput"
                                            value={operatorInput}
                                            onChange={handleOperatorInput}
                                            className="p-2 rounded-md text-white"
                                            required
                                        >
                                            <option value="" disabled>Select Status</option>
                                            <option value="pass" selected={inspectionStatus === 'pass'}>Pass</option>
                                            <option value="fail" selected={inspectionStatus === 'fail'}>Fail</option>
                                        </select>
                                    </>
                                )
                            }
                        </div>
                        <div className='flex justify-between'>
                            <button
                                type='submit'
                                onClick={handleCaptureRetry}
                                disabled={checkLoading}
                                className={`text-white py-2 px-4 rounded transition duration-300 w-full 
                                    ${checkLoading
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : !capturedImage
                                            ? 'bg-blue-500 hover:bg-blue-600'
                                            : 'bg-red-500 hover:bg-red-600'
                                    }`}

                            >
                                {capturedImage ? 'Retry' : checkLoading ? 'Processing...' : 'Capture'}
                            </button>
                        </div>
                        <div className='flex justify-between gap-10'>
                            <button
                                onClick={handleContinue}
                                disabled={!capturedImage || !inspectionStatus}
                                className={`bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition duration-300 w-full ${!capturedImage || !inspectionStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Continue
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!capturedImage || !inspectionStatus}
                                className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-300 w-full ${!capturedImage || !inspectionStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkpoints;