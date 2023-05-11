import React, { CSSProperties } from "react";
import styles from "../../styles/AppDetails.module.css";
import { TCustomDetails } from "../../pages/AppBuilder/AppBuilder";

const inputStyle = {
  height: "60px",
  marginLeft: "10px",
  marginBottom: "10px",
  border: "none",
  padding: "1rem",
  width: "200px",
  borderRadius: "1rem",
  background: "#e8e8e8",
  boxShadow: "4px 4px 12px #c5c5c5,\n        -4px -4px 12px #ffffff",
  transition: "all 0.3s",
} as CSSProperties;
const textInputStyle = {
  border: "none",
  marginLeft: "10px",
  padding: "1rem",
  borderRadius: "1rem",
  background: "#e8e8e8",
  boxShadow: "4px 4px 12px #c5c5c5,\n        -4px -4px 12px #ffffff",
  transition: "0.3s",
} as CSSProperties;
const label = { display: "flex", flexDirection: "column" }as CSSProperties;
//interfaces
interface TAppDetails {
  appName: string;
  appTitle: string;

  primaryColor: string;
  secondaryColor: string;
  coinSymbol: string;
  coinName: string;
  bundleId: string;
  currentScreenIndex: string | number;
  email: string;
  emailEmpty: boolean;
  emailInvalid: boolean;
  appNameEmpty: boolean;
  bundleIdEmpty: boolean;
  setAppName: (value: string) => void;
  setAppTitle: (value: string) => void;
  setBundleId: (value: string) => void;
  setEmail: (value: string) => void;
  handleLogoChange: (event: any) => void;
  handleLoginScreenBackgroundChange: (event: any) => void;
  setPrimaryColor: (value: string) => void;
  setSecondaryColor: (value: string) => void;
  handleCoinLogoChange: (event: any) => void;
  setCoinSymbol: (value: string) => void;
  setCoinName: (value: string) => void;
  handleClear: (screenIndex: number) => void;
  logo: File;
  loginScreenBackground: File;
  coinLogo?:File
}

export default function AppDetails(props: TAppDetails) {
  const {
    appName,
    appTitle,
    bundleId,
    email,
    primaryColor,
    secondaryColor,
    coinSymbol,
    coinName,
    currentScreenIndex,
    emailEmpty,
    emailInvalid,
    appNameEmpty,
    bundleIdEmpty,
    setAppName,
    setAppTitle,
    setBundleId,
    setEmail,
    handleLogoChange,
    handleLoginScreenBackgroundChange,
    setPrimaryColor,
    setSecondaryColor,
    handleCoinLogoChange,
    setCoinSymbol,
    setCoinName,
    handleClear,
  } = props;

  //handle to clear form data for a given screen
  

  //Component for displaying form in the first screen
  const screen0 = () => {
    return (
      <div>
        <div className="rowAppName">
          <label style={label}>
            App Name
            <input
              style={textInputStyle}
              placeholder="My App"
              type="text"
              value={appName}
              onChange={(event) => setAppName(event.target.value)}
            />
            {appNameEmpty && (
              <div className="error-message">App name is required.</div>
            )}
          </label>
          <label style={label}>
            Bundle ID
            <input
              style={textInputStyle}
              placeholder="com.myapp"
              type="text"
              value={bundleId}
              onChange={(event) => setBundleId(event.target.value)}
            />
            {bundleIdEmpty && (
              <div className="error-message">BundleId is required.</div>
            )}
          </label>
        </div>
        <br />
        <label style={label}>
          Email
          <input
            className={"emailTextInput"}
            placeholder="abc@xyz.com"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          {emailEmpty && (
            <div className="error-message">Email is a required field.</div>
          )}
          {emailInvalid && <div className="error-message">Invalid email</div>}
        </label>
        <br />
        <label style={label}>
          App Title
          <input
            style={textInputStyle}
            placeholder="My App"
            type="text"
            value={appTitle}
            onChange={(event) => setAppTitle(event.target.value)}
          />
        </label>
        <br />
        <div className="rowAppName">
          <label style={label}>
            Logo
            <input
              accept=".jpg"
              style={inputStyle}
              type="file"
              onChange={handleLogoChange}
            />
          </label>
          <br />
          <label style={label}>
            Login Screen Background
            <input
              accept=".jpg"
              style={inputStyle}
              type="file"
              onChange={handleLoginScreenBackgroundChange}
            />
          </label>
        </div>
        <br />
        <style>
          {`
            .rowAppName{
              display: flex;
              flex-direction: row;
            }
            
            .emailTextInput {
              border: none;
              width:370px;
              margin-left: 10px;
              padding: 1rem;
              border-radius: 1rem;
              background: #e8e8e8;
              box-shadow: 4px 4px 12px #c5c5c5,
                  -4px -4px 12px #ffffff;
              transition: 0.3s;
            }

            .emailTextInput:focus {
                outline-color: #2775EA;
                background: #e8e8e8;
                box-shadow: inset 20px 20px 60px #c5c5c5,
                    inset -20px -20px 60px #ffffff;
                transition: 0.3s;
            }

            .emailTextInput:invalid{
              outline-color: #cc0033;
            }
            
            .error-message {
              color: #cc0033;
              display: inline-block;
              font-size: 12px;
              line-height: 15px;
              margin: 5px 0 0;
              margin-left: 10px;
            }
            `}
        </style>
      </div>
    );
  };

  //Component for displaying form in the second screen
  const screen1 = () => {
    return (
      <>
        <div className="dualSet">
          <label style={label}>
            Primary Color
            <input
              style={textInputStyle}
              type="text"
              placeholder="#003E9C"
              value={primaryColor}
              onChange={(event) => setPrimaryColor(event.target.value)}
            />
          </label>
          <br />
          <label style={label}>
            Secondary Color
            <input
              style={textInputStyle}
              type="text"
              placeholder="#2775EA"
              value={secondaryColor}
              onChange={(event) => setSecondaryColor(event.target.value)}
            />
          </label>
        </div>
        <br />
        <div className="dualSet">
          <label style={label}>
            Coin Symbol
            <input
              style={textInputStyle}
              type="text"
              placeholder="ETO"
              value={coinSymbol}
              onChange={(event) => setCoinSymbol(event.target.value)}
            />
          </label>
          <br />
          <label style={label}>
            Coin Name
            <input
              style={textInputStyle}
              type="text"
              placeholder="Ethora Coin"
              value={coinName}
              onChange={(event) => setCoinName(event.target.value)}
            />
          </label>
        </div>
        <br />
        <div className="dualSet">
          <label style={label}>
            Coin logo
            <input
              accept=".png"
              style={inputStyle}
              type="file"
              onChange={handleCoinLogoChange}
            />
          </label>
          <div></div>
        </div>
        <style>
          {`
            .dualSet{
              width:100%;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
            }
            `}
        </style>
        <br />
      </>
    );
  };

  return (
    <div className={"leftSection"}>
      {/* <h1 className="h1">Customize Your App</h1> */}
      <div className="detailsSection">
        {currentScreenIndex === 0 ? screen0() : null}
        {currentScreenIndex === 1 ? screen1() : null}
      </div>
      <style>
        {`
          .h1{
            flex-basis:30%;
            font-size:48px;
            display: flex;
            align-items:flex-end;
            color: #2775EA;
          }
          .leftSection {
            width: 50%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            // background-color: #EDEDED;
            // background: linear-gradient(315deg, #ffffff, #e6e6e6);
            color: #000;
            padding:20px;
            // padding-left:50px;
          }
          .detailsSection{
            // flex-basis: 70%;
            display:flex;
            flex-direction: column;
            align-items: flex-start;
          }
          @media (max-width: 768px) {

            .leftSection {
                width: 100%;
            }
          }
          `}
      </style>
    </div>
  );
}
