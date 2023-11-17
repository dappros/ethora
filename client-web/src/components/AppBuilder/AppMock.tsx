import defaultLogo from "../../assets/images/logo.png"
import { TCustomDetails } from "../../pages/AppBuilder/AppBuilder"
import defaultLoginBackground from "../../assets/images/login_background.png"
import defaultCoinPath from "../../assets/images/coin.png"
import profilePic from "../../assets/images/profilepic.png"
import { isValidHexCode } from "../../utils"
import { Box } from "@mui/material"

export default function AppMock(properties: TCustomDetails) {
  const {
    primaryColor,
    secondaryColor,
    currentScreenIndex,
    coinLogo,
    logo,
    loginScreenBackground,
    changeScreen,
  } = properties
  const isLoginBgColor =
    loginScreenBackground && isValidHexCode(loginScreenBackground)
  const backgroundImage = loginScreenBackground || defaultLoginBackground

  //Component to display social button
  function SocialButton(properties: { color: string }) {
    const { color } = properties
    return (
      <div style={{ backgroundColor: color }} className="socialButton">
        <style>
          {`
                    .socialButton{
                        height: 40px;
                        width: 90%;
                        border-radius: 3px;
                        margin:5px;
                    }
                    `}
        </style>
      </div>
    )
  }

  //Component to display Title or Logo if provided else will show default
  const LogoTitle = () => {
    const appTitleColor = primaryColor ? primaryColor : "#003E9C"
    const appLogo = logo || defaultLogo

    return (
      <div style={{ border: logo ? "none" : "1px solid black" }}>
        <img src={appLogo} alt="Logo" width={200} height={100} />
      </div>
    )
  }

  //Component to show form in 1st screen
  const screen0 = () => {
    return (
      <div
        className="loginScreen"
        style={{
          width: "250px",
          height: "500px",
          padding: "20px",
          backgroundColor: "#fff",
          borderBottomLeftRadius: "20px",
          borderBottomRightRadius: "20px",
          background: isLoginBgColor
            ? loginScreenBackground
            : `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => changeScreen(0)}
      >
        <LogoTitle />
        <SocialButton color="#4D6DA4" />
        <SocialButton color="#FFFF" />
        <SocialButton color="#000000" />
        <SocialButton color="#cc6228" />
      </div>
    )
  }

  //Component for balance button
  const BalanceButton = () => {
    const coinPath = coinLogo || defaultCoinPath
    return (
      <div className="balance">
        <img
          src={coinPath}
          style={{ objectFit: "cover" }}
          alt="coin logo"
          width={15}
          height={15}
        />
        <p
          style={{ margin: 0, fontWeight: "bold" }}
          className="text-bold text-black text-sm"
        >
          187
        </p>
        <style>
          {`
                    .balance{
                        width:40px;
                        height:40px;
                        background-color: #fff;
                        border-radius: 10%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                    }
                    `}
        </style>
      </div>
    )
  }

  //Component to show form in 2nd screen
  const screen1 = () => {
    return (
      <div className="profileScreen" onClick={() => changeScreen(1)}>
        <div className="primaryHeader">
          <BalanceButton />
        </div>
        <div className="secondaryHeader"></div>
        <div className="avatarContainer">
          <div className="avatar"></div>
        </div>
        <div className="profileBody"></div>
        <style>
          {`
            .profileScreen {
              width: 250px;
              height: 500px;
              border-bottom-left-radius: 20px;
              border-bottom-right-radius: 20px;
              display: flex;
              flex-direction: column;
              cursor: pointer;
              background-color: ${secondaryColor ? secondaryColor : "#2775EA"};
            }
            .primaryHeader {
              width: 250px;
              height: 60px;
              background-color: ${primaryColor ? primaryColor : "#003E9C"};
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 15px;
            }
            .secondaryHeader {
              width: 250px;
              height: 100px;
              background-color: ${secondaryColor ? secondaryColor : "#2775EA"};
            }
            .avatarContainer {
              z-index: +1;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .avatar {
              height: 70px;
              width: 70px;
              border-radius: 50%;
              background-color: ${primaryColor ? primaryColor : "#003E9C"};
              position: absolute;
              display: flex;
              justify-content: center;
              align-items: center;
              background-image: url(${profilePic});
              background-size: cover;
              background-position: center;
            }
            .profileBody {
              width: 250px;
              height: 100%;
              background-color: #fff;
              border-radius: 20px;
              margin-top: 5px;
            }
          `}
        </style>
      </div>
    )
  }

  //Component to display mock mobile outline
  const MobileOutline = (properties: { screenIndex: number }) => {
    const { screenIndex } = properties
    const scaleValue = currentScreenIndex === screenIndex ? 1 : 0.9
    const isRightScreen = currentScreenIndex === 1
    return (
      <div
        className={"mobileOutline"}
        style={{
          transition: "scale .5s ease",
          transform: `scale(${scaleValue})`,
        }}
      >
        <div
          style={{
            height: "30px",
            width: "250px",
            borderTopRightRadius: "20px",
            borderTopLeftRadius: "20px",
            backgroundColor: "#000",
            display: "flex",
            flexDirection: "row",
            color: "white",
            alignItems: "center",
            boxSizing: "border-box",
            padding: "15px",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <h5>2:20</h5>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {/* <FontAwesomeIcon className={styles.batteryIcon} icon={faBatteryHalf} /> */}
          </div>
        </div>
        {screenIndex === 0 ? screen0() : null}
        {screenIndex === 1 ? screen1() : null}
        <style>
          {`
            .mobileOutline {
           
              border: 1px solid #d9d9d9;
              width: 250px;
              height: 500px;
              border-radius: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              box-shadow: 0 0 20px #d9d9d9, -0 -0 20px #ffffff;
              background-color: #fff;
            }

           
          `}
        </style>
      </div>
    )
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        transform: "translateX(60px)",
      }}
    >
      <div
        style={{
          zIndex: currentScreenIndex === 0 ? 10 : 0,
          display: "flex",
          alignItems: "flex-start",
          height: "100%",
          marginLeft: "auto",
        }}
      >
        <MobileOutline screenIndex={0} />
      </div>
      <div
        style={{
          transform: "translateX(-100px)",
          zIndex: currentScreenIndex === 1 ? 10 : 0,
        }}
      >
        <MobileOutline screenIndex={1} />
      </div>
    </Box>
  )
}
