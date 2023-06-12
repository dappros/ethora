import {useState} from "react";
import {SubmitHandler, useForm} from "react-hook-form";

type IUserData = {
    firstName: string,
    lastName: string
};

export default function Profile() {

    const {register, handleSubmit, watch, formState: {errors}} = useForm<IUserData>();
    const onSubmit: SubmitHandler<IUserData> = (data) => {
        console.log(data);
    }

    const [userData, setUserData] = useState<IUserData>({firstName: 'Test', lastName: 'User'});

    const [firstName, setFirstName] = useState<string>('Test');
    const [lastName, setLastName] = useState<string>('User');

    const saveUserData = () => {
        const currentData: IUserData = {
            firstName: firstName,
            lastName: lastName
        }

        setUserData(currentData);
        setShowModal(false);
    }

    const [showModal, setShowModal] = useState(false);

    return (
        <div className={"my-5 w-full h-full"}>
            <div className={"flex justify-center"}>
                <div
                    className="block flex flex-col max-h-[400px] max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className={"flex justify-center"}>
                        <div
                            className={"flex justify-center items-center uppercase font-semibold bg-[#1976D2] w-[100px] h-[100px] rounded-2 text-white text-5xl rounded-md"}>
                            {userData.firstName[0]}
                        </div>
                    </div>

                    <div className={"my-0.5"}>
                        <p className="font-semibold text-center text-gray-700 dark:text-white">
                            {userData.firstName} {userData.lastName}
                        </p>
                    </div>

                    <div className={"my-0.5 text-center"}>
                        <button type="button"
                                onClick={() => setShowModal(true)}
                                className="text-white w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-1.5 text-center ">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
            {showModal && (
                <div
                    onClick={e => (e.currentTarget === e.target) && setShowModal(false)}
                    className="absolute bg-[#0000007a] backdrop-blur-sm justify-center items-center flex overflow-x-hidden overflow-y-auto inset-0 z-50 outline-none focus:outline-none">
                    <div className="relative w-full h-full max-w-md md:h-auto">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button type="button"
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white">
                                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    ></path>
                                </svg>
                            </button>
                            <div className="px-6 py-6 lg:px-8">
                                <h3 className="mb-4 text-md text-center font-medium text-gray-900 dark:text-white">Edit
                                    your personal data</h3>

                                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First
                                            Name</label>
                                        {!firstName &&
                                            <span className="text-red-500 -mt-6">This field is required</span>}
                                        <input type="text" name="firstName" id="firstName"
                                               value={firstName}
                                               onChange={(e) => setFirstName(e.target.value)}
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                               placeholder="First Name" required/>
                                    </div>

                                    <div>
                                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last
                                            Name</label>
                                        {!lastName &&
                                            <span className="text-red-500 -mt-6">This field is required</span>}
                                        <input type="text" name="lastName" id="lastName"
                                               value={lastName}
                                               onChange={(e) => setLastName(e.target.value)}
                                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                               placeholder="Last Name" required/>
                                    </div>
                                    <button disabled={!firstName || !lastName} onClick={saveUserData}
                                            className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Save
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

Profile.requireAuth = true