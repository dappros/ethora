import React from 'react';
import styles from '../../styles/AppDetails.module.css';
import { TCustomDetails } from '@/pages';

//interfaces
interface TAppDetails extends TCustomDetails {
  appName: string
  bundleId: string
  email: string
  emailEmpty: boolean
  emailInvalid: boolean
  appNameEmpty: boolean
  bundleIdEmpty: boolean
  setAppName: (value: string) => void
  setAppTitle: (value: string) => void
  setBundleId: (value: string) => void
  setEmail: (value: string) => void
  handleLogoChange: (event: any) => void
  handleLoginScreenBackgroundChange: (event: any) => void
  setPrimaryColor: (value: string) => void
  setSecondaryColor: (value: string) => void
  handleCoinLogoChange: (event: any) => void
  setCoinSymbol: (value: string) => void
  setCoinName: (value: string) => void
  handleClear: (screenIndex: number) => void
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
    handleClear
  } = props;


  //handle to clear form data for a given screen
  const ClearButton = (props: { screenIndex: number }) => {
    return (
      <>
        <button onClick={() => handleClear(props.screenIndex)} className='clearButton'>Clear</button>
        <style jsx>
          {
            `
            .clearButton {
              margin-left: 10px;
              color: #090909;
              padding: 0.7em 1.7em;
              font-size: 18px;
              border-radius: 0.5em;
              background: #e8e8e8;
              border: 1px solid #e8e8e8;
              transition: all .3s;
              box-shadow: 6px 6px 12px #c5c5c5,
                         -6px -6px 12px #ffffff;
            }
            
            .clearButton:hover {
              border: 1px solid #2775EA;
            }
            
            .clearButton:active {
              box-shadow: 4px 4px 12px #c5c5c5,
                         -4px -4px 12px #ffffff;
            }
            `
          }
        </style>
      </>
    )
  }

  //Component for displaying form in the first screen
  const screen0 = () => {
    return (
      <>
        <div className='rowAppName'>
          <label className={styles.label}>
            App Name
            <input className={styles.textInput} placeholder='My App' type="text" value={appName} onChange={(event) => setAppName(event.target.value)} />
            {appNameEmpty && <div className="error-message">App name is required.</div>}
          </label>
          <label className={styles.label}>
            Bundle ID
            <input className={styles.textInput} placeholder='com.myapp' type="text" value={bundleId} onChange={(event) => setBundleId(event.target.value)} />
            {bundleIdEmpty && <div className="error-message">BundleId is required.</div>}
          </label>
        </div>
        <br />
        <label className={styles.label}>
          Email
          <input className={"emailTextInput"} placeholder='abc@xyz.com' type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          {emailEmpty && <div className="error-message">Email is a required field.</div>}
          {emailInvalid && <div className='error-message'>Invalid email</div>}
        </label>
        <br />
        <label className={styles.label}>
          App Title
          <input className={styles.textInput} placeholder='My App' type="text" value={appTitle} onChange={(event) => setAppTitle(event.target.value)} />
        </label>
        <br />
        <div className='rowAppName'>
          <label className={styles.label}>
            Logo
            <input accept='.png' className={styles.input} type="file" onChange={handleLogoChange} />
          </label>
          <br />
          <label className={styles.label}>
            Login Screen Background
            <input accept='.png' className={styles.input} type="file" onChange={handleLoginScreenBackgroundChange} />
          </label>
        </div>
        <br />
        <ClearButton screenIndex={0} />
        <style jsx>
          {
            `
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
            `
          }
        </style>
      </>
    )
  }

  //Component for displaying form in the second screen
  const screen1 = () => {
    return (
      <>
        <div className='dualSet'>
          <label className={styles.label}>
            Primary Color
            <input className={styles.textInput} type="text" placeholder='#003E9C' value={primaryColor} onChange={(event) => setPrimaryColor(event.target.value)} />
          </label>
          <br />
          <label className={styles.label}>
            Secondary Color
            <input className={styles.textInput} type="text" placeholder='#2775EA' value={secondaryColor} onChange={(event) => setSecondaryColor(event.target.value)} />
          </label>
        </div>
        <br />
        <div className='dualSet'>
          <label className={styles.label}>
            Coin Symbol
            <input className={styles.textInput} type="text" placeholder='ETO' value={coinSymbol} onChange={(event) => setCoinSymbol(event.target.value)} />
          </label>
          <br />
          <label className={styles.label}>
            Coin Name
            <input className={styles.textInput} type="text" placeholder='Ethora Coin' value={coinName} onChange={(event) => setCoinName(event.target.value)} />
          </label>
        </div>
        <br />
        <div className='dualSet'>
          <label className={styles.label}>
            Coin logo
            <input accept='.png' className={styles.input} type="file" onChange={handleCoinLogoChange} />
          </label>
          <div>

          </div>
        </div>
        <style jsx>
          {
            `
            .dualSet{
              width:100%;
              display: flex;
              flex-direction: row;
              justify-content: flex-start;
            }
            `
          }
        </style>
        <br />
        <ClearButton screenIndex={1} />
      </>
    )
  }

  return (
    <div className={"leftSection"}>
      <h1 className='h1'>Customize Your App</h1>
      <div className="detailsSection">
        {currentScreenIndex === 0 ? screen0() : null}
        {currentScreenIndex === 1 ? screen1() : null}
      </div>
      <style jsx>
        {
          `
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
            background-color: #EDEDED;
            background: linear-gradient(315deg, #ffffff, #e6e6e6);
            color: #000;
            padding:20px;
            padding-left:50px;
          }
          .detailsSection{
            flex-basis: 70%;
            display:flex;
            flex-direction: column;
            align-items: flex-start;
          }
          @media (max-width: 768px) {

            .leftSection {
                width: 100%;
            }
          }
          `
        }
      </style>
    </div>
  )
}