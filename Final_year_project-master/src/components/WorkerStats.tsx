import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import CountUp from "react-countup";

const WorkerStats: React.FC = () => {
    const { analytics, analyticsLoading, error } = useSelector((state: any) => state.inspection);

    if (analyticsLoading) {
        return <div className="text-white text-center">Loading...</div>
    }

    return (
        <>
            <div className="bg-gray-900 flex flex-col gap-5">
                <h2 className="text-white text-lg font-semibold p-2 bg-gray-800 rounded-md">Inspection Analytics</h2>

                {error ? (
                    <div className="text-red-500 text-center">Error: {error}</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Total Meters */}
                        <div className="bg-gray-800 p-6 shadow-lg rounded-md flex flex-col items-center justify-center cursor-pointer">
                            <p className="text-white">Total Meters</p>
                            <h2 className="text-4xl font-semibold">
                                <CountUp end={analytics?.total || 0} duration={2} />
                            </h2>
                        </div>

                        {/* Correct Meters */}
                        <div className="bg-gray-800 p-6 shadow-lg rounded-md flex flex-col items-center justify-center cursor-pointer">
                            <p className="text-white">Correct Meters</p>
                            <h2 className="text-4xl font-semibold text-green-500">
                                <CountUp end={analytics?.correct || 0} duration={2} />
                            </h2>
                        </div>

                        {/* Incorrect Meters */}
                        <div className="bg-gray-800 p-6 shadow-lg rounded-md flex flex-col items-center justify-center cursor-pointer">
                            <p className="text-white">Incorrect Meters</p>
                            <h2 className="text-4xl font-semibold text-red-500">
                                <CountUp end={analytics?.incorrect || 0} duration={2} />
                            </h2>
                        </div>

                        <div className="bg-gray-800 p-6 shadow-lg rounded-md flex flex-col items-center justify-center cursor-pointer">
                            <p className="text-white">Today's Total Meters</p>
                            <h2 className="text-4xl font-semibold">
                                <CountUp end={analytics?.today_total || 0} duration={2} />
                            </h2>
                        </div>

                        {/* Correct Meters */}
                        <div className="bg-gray-800 p-6 shadow-lg rounded-md flex flex-col items-center justify-center cursor-pointer">
                            <p className="text-white">Today's Correct Meters</p>
                            <h2 className="text-4xl font-semibold text-green-500">
                                <CountUp end={analytics?.today_correct || 0} duration={2} />
                            </h2>
                        </div>

                        {/* Incorrect Meters */}
                        <div className="bg-gray-800 p-6 shadow-lg rounded-md flex flex-col items-center justify-center cursor-pointer">
                            <p className="text-white">Today's Incorrect Meters</p>
                            <h2 className="text-4xl font-semibold text-red-500">
                                <CountUp end={analytics?.today_incorrect || 0} duration={2} />
                            </h2>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default WorkerStats;