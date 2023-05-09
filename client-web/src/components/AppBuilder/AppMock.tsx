import defaultLogo from "../../assets/images/logo.png";
import { TCustomDetails } from "../../pages/AppBuilder/AppBuilder";
import defaultLoginBackground from "../../assets/images/login_background.png";
import defaultCoinPath from "../../assets/images/coin.png";
import profilePic from "../../assets/images/profilepic.png";

export default function AppMock(props: TCustomDetails) {
  const {
    appTitle,
    primaryColor,
    secondaryColor,
    currentScreenIndex,
    coinLogo,
    logo,
    loginScreenBackground,
  } = props;

  const backgroundImage = loginScreenBackground
    ? URL.createObjectURL(loginScreenBackground)
    : defaultLoginBackground;

  //Component to display social button
  function SocialButton(props: { color: string }) {
    const { color } = props;
    return (
      <div style={{ backgroundColor: color }} className="socialButton">
        <style>
          {`
                    .socialButton{
                        height: 40px;
                        width: 250px;
                        border-radius: 3px;
                        margin:5px;
                    }
                    `}
        </style>
      </div>
    );
  }

  //Component to display Title or Logo if provided else will show default
  const LogoTitle = () => {
    const appTitleColor = primaryColor ? primaryColor : "#003E9C";
    if (appTitle || logo) {
      if (appTitle) {
        return (
          <div>
            <h1 className={`h1 text-5xl  uppercase lg:text-[${appTitleColor}]`}>
              {appTitle}
            </h1>
            <style>
              {`
                                .h1{
                                    font-size:48px;
                                    text-transform: uppercase;
                                    color:${appTitleColor}
                                }
                                `}
            </style>
          </div>
        );
      } else {
        return (
          <img
            src={URL.createObjectURL(logo as Blob)}
            alt="Logo"
            width={200}
            height={100}
          />
        );
      }
    } else {
      return <img src={defaultLogo} alt="Logo" width={200} height={100} />;
    }
  };

  //Component to show form in 1st screen
  const screen0 = () => {
    return (
      <div className="loginScreen">
        <LogoTitle />
        <SocialButton color="#4D6DA4" />
        <SocialButton color="#FFFF" />
        <SocialButton color="#000000" />
        <SocialButton color="#cc6228" />

        <style>
          {`
            .loginScreen {
              width: 300px;
              height: 600px;
              padding: 20px;
              backgroun-color: #fff;
              border-bottom-left-radius: 20px;
              border-bottom-right-radius: 20px;
              background-image: url(${backgroundImage});
              background-size: cover;
              background-position: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            @media (max-width: 768px) {
              .loginScreen {
                width: 150px;
                height: 300px;
              }
            }
          `}
        </style>
      </div>
    );
  };

  //Component for balance button
  const BalanceButton = () => {
    const coinPath = coinLogo ? URL.createObjectURL(coinLogo) : defaultCoinPath;
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
    );
  };

  //Component to show form in 2nd screen
  const screen1 = () => {
    return (
      <div className="profileScreen">
        <div className="primaryHeader">
          {/* <FontAwesomeIcon className={styles.batteryIcon} icon={faBars} />
                    <FontAwesomeIcon className={styles.batteryIcon} icon={faStar} />
                    <FontAwesomeIcon className={styles.batteryIcon} icon={faUserGroup} />
                    <FontAwesomeIcon className={styles.batteryIcon} icon={faCompass} /> */}
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
              width: 300px;
              height: 600px;
              border-bottom-left-radius: 20px;
              border-bottom-right-radius: 20px;
              display: flex;
              flex-direction: column;
              background-color: ${secondaryColor ? secondaryColor : "#2775EA"};
            }
            .primaryHeader {
              width: 300px;
              height: 60px;
              background-color: ${primaryColor ? primaryColor : "#003E9C"};
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 15px;
            }
            .secondaryHeader {
              width: 300px;
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
              width: 300px;
              height: 100%;
              background-color: #fff;
              border-radius: 20px;
              margin-top: 5px;
            }
          `}
        </style>
      </div>
    );
  };

  //Component to display mock mobile outline
  const MobileOutline = (props: { screenIndex: number }) => {
    const { screenIndex } = props;
    const scaleValue = currentScreenIndex === screenIndex ?1 : 0.8;
    const isRightScreen = currentScreenIndex == 1;
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
            width: "300px",
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
              width: 301px;
              height: 600px;
              border-radius: 20px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              box-shadow: 0 0 20px #d9d9d9, -0 -0 20px #ffffff;
              background-color: #fff;
            }

            @media (max-width: 768px) {
              width: 201px;
              height: 400px;
            }
          `}
        </style>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "50%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        backgroundColor: "#EDEDED",
        background: "linear-gradient(45deg, #ffffff, #e6e6e6)",
      }}
    >
      <div style={{ zIndex: currentScreenIndex === 0 ? 10 : 0}}>
        <MobileOutline screenIndex={0} />
      </div>
      <div style={{transform: 'translateX(-100px)', zIndex: currentScreenIndex === 1 ? 10 : 0}}>
        <MobileOutline screenIndex={1} />
      </div>
    </div>
  );
}
