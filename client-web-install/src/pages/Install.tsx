import React from "react";
import { Input } from "../components/Input";
import { useForm } from "react-hook-form";

type FormData = {
  webAddress: string;
  apiAddress: string;
  databaseName: string;
  chatServer: string;
  ipfsUrl?: string;
  adminEmail: string;
  adminPassword: string;
};
export const Install = () => {
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({defaultValues: {
    webAddress: 'ethora.com',
    apiAddress: 'api.ethora.com',
    databaseName: 'dappros_platform',
    chatServer: 'chat.ethora.com',
    ipfsUrl: 'ipfs.ethora.com',

  }});
  
  const onSubmit = handleSubmit(async (data) => {
    const url = new URL(window.location.href)
    const origin = url.origin

    let response = await fetch(`${origin}/setup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(data)
    })

    let result = await response.json();
    
    console.log(result)
  });

  return (
    <form onSubmit={onSubmit}>
      <div className="container mx-auto px-4 my-3">
        <div className="text-center">
          <h1 className="font-bold text-lg">
            Welcome to Dappros Platform (DP) dedicated server (v23.06)
            installation!
          </h1>
        </div>
        <div className="my-2">
          <p>
            Please specify the following parameters to initialize your DP
            server.
          </p>
          <p>You will be able to modify most of these later.</p>
        </div>
        <div className="my-2">
          <p className="font-bold">Root domain</p>
          <Input
            {...register("webAddress", {required: true})}
            label=''
          />
        </div>
        {/* <div className="my-2">
          <p className="font-bold">Web app address</p>
          <Input
            {...register("webAddress", {required: true})}
            label='Your URL / domain name for Web application, e.g. "app. ethora.com"'
          />
        </div>
        <div className="my-2">
          <p className="font-bold">API address</p>
          <Input
            {...register("apiAddress", {required: true})}
            label='your URL / domain name for API endpoints, e.g. "api.ethora.com"'
          /> */}
        {/* </div> */}
        <div className="my-2">
          <p className="font-bold">Database name</p>
          <Input
            {...register("databaseName", {required: true})}
            label='database that will be used for DP set up - simply keep "dappros _platform" here if unsure'
          />
        </div>
        <div className="my-2">
          <p className="font-bold">Chat server</p>
          <Input
            disabled
            {...register("chatServer", {required: true})}
            label='XMPP server address, this is used for messaging. Example: "chat.ethora.com". Replace "ethora.com" with your domain name.'
          />
        </div>
        <div className="my-2">
          <p className="font-bold">IPFS url</p>
          <Input
            disabled
            {...register("ipfsUrl", {required: true})}
            label='IPFS gateway address, used for files storage (e.g. "etofs.com")'
          />
        </div>
        <div className="my-2">
          <p className="font-bold">SuperAdmin e-mail</p>
          <Input
            {...register("adminEmail", {required: true})}
            label="your e-mail (also used as login) as a super user"
          />
        </div>
        <div className="my-2">
          <p className="font-bold">SuperAdmin password</p>
          <Input
            {...register("adminPassword", {required: true})}
            label="your password as a super user"
          />
        </div>
        <div className="my-2">
          <p className="text-xs">
            Next step: if everything is specified correctly here, you will see
            the login screen after pressing the button below. Use your
            superadmin e-mail and password you specified above to sign in. You
            will be able to configure the rest of your DP Server settings in the
            Admin section there.
          </p>
        </div>
        <div className="my-2">
          <p className="text-xs">
            It may be a good idea to take a note of the above parameters before
            you proceed. In case you experience any errors you can contact
            support@dappros.com specifying what you have entered (except
            password).
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={onSubmit}
            type="button"
            className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-500 dark:focus:ring-blue-800"
          >
            Proceed & Initialize this DP Server
          </button>
        </div>
      </div>
    </form>
  );
};
