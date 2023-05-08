import React from 'react';
import styles from '../../../styles/AppMock.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBatteryHalf, faBars, faStar, faUserGroup, faCompass } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { TCustomDetails } from '@/pages';
import defaultLoginBackground from '../../../assets/login_background.png';
import defaultLogo from '../../../assets/logo.png';
import defaultCoinPath from '../../../assets/coin.png';
import { motion } from "framer-motion"
import profilePic from '../../../assets/profilepic.png';

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


    const backgroundImage = loginScreenBackground ? URL.createObjectURL(loginScreenBackground) : defaultLoginBackground.src;

    //Component to display social button
    function SocialButton(props: { color: string }) {
        const {
            color
        } = props;
        return (
            <div className='socialButton'>

                <style jsx>
                    {
                        `
                    .socialButton{
                        background-color: ${color};
                        height: 40px;
                        width: 250px;
                        border-radius: 3px;
                        margin:5px;
                    }
                    `
                    }
                </style>
            </div>
        )
    }

    //Component to display Title or Logo if provided else will show default
    const LogoTitle = () => {
        const appTitleColor = primaryColor ? primaryColor : '#003E9C'
        if (appTitle || logo) {
            if (appTitle) {
                return (
                    <div>
                        <h1 className={`h1 text-5xl  uppercase lg:text-[${appTitleColor}]`}>{appTitle}</h1>
                        <style jsx>
                            {
                                `
                                .h1{
                                    font-size:48px;
                                    text-transform: uppercase;
                                    color:${appTitleColor}
                                }
                                `
                            }
                        </style>
                    </div>
                )
            } else {
                return <Image src={URL.createObjectURL(logo as Blob)} alt="Logo" width={200} height={100} />
            }
        } else {
            return <Image src={defaultLogo.src} alt="Logo" width={200} height={100} />
        }
    }

    //Component to show form in 1st screen
    const screen0 = () => {

        return (
            <div

                className="loginScreen">
                <LogoTitle />
                <SocialButton color="#4D6DA4" />
                <SocialButton color="#FFFF" />
                <SocialButton color="#000000" />
                <SocialButton color="#cc6228" />

                <style jsx>
                    {
                        `
                        .loginScreen {
                            width: 300px;
                            height: 600px;
                            padding: 20px;
                            backgroun-color:#fff;
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
                            .loginScreen{
                                width: 150px;
                                height: 300px;
                            }
                        }
                        `
                    }
                </style>
            </div>
        )
    }

    //Component for balance button
    const BalanceButton = () => {
        console.log(coinLogo)
        const coinPath = coinLogo ? URL.createObjectURL(coinLogo) : defaultCoinPath.src;
        return (
            <div className='balance'>
                <Image src={coinPath} alt="coin logo" width={15} height={15} />
                <h1 className='text-bold text-black text-sm'>187</h1>
                <style jsx>
                    {
                        `
                    .balance{
                        width:40px;
                        height:40px;
                        background-color: #fff;
                        border-radius: 10%;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex-direction: column;
                        padding:2px
                    }
                    `
                    }
                </style>
            </div>
        )
    }

    //Component to show form in 2nd screen
    const screen1 = () => {
        return (
            <div className='profileScreen'>
                <div className='primaryHeader'>
                    <FontAwesomeIcon className={styles.batteryIcon} icon={faBars} />
                    <FontAwesomeIcon className={styles.batteryIcon} icon={faStar} />
                    <FontAwesomeIcon className={styles.batteryIcon} icon={faUserGroup} />
                    <FontAwesomeIcon className={styles.batteryIcon} icon={faCompass} />
                    <BalanceButton />
                </div>
                <div className='secondaryHeader'>
                </div>
                <div className='avatarContainer'>
                    <div className='avatar'>
                    </div>
                </div>
                <div className='profileBody'>

                </div>
                <style jsx>
                    {
                        `
                        .profileScreen{
                            width: 300px;
                            height: 600px;
                            border-bottom-left-radius: 20px;
                            border-bottom-right-radius: 20px;
                            display: flex;
                            flex-direction: column;
                            background-color: ${secondaryColor ? secondaryColor : '#2775EA'};

                        }
                        .primaryHeader{
                            width: 300px;
                            height: 60px;
                            background-color: ${primaryColor ? primaryColor : '#003E9C'};
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            padding: 15px;
                        }
                        .secondaryHeader{
                            width: 300px;
                            height: 100px;
                            background-color: ${secondaryColor ? secondaryColor : '#2775EA'};
                        }
                        .avatarContainer{
                            z-index: +1;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                        }
                        .avatar{
                            height: 70px;
                            width: 70px;
                            border-radius: 50%;
                            background-color: ${primaryColor ? primaryColor : '#003E9C'};
                            position: absolute;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            background-image: url(${profilePic.src});
                            background-size: cover;
                            background-position: center;
                        }
                        .profileBody{
                            width: 300px;
                            height: 100%;
                            background-color:#fff;
                            border-radius: 20px;
                            margin-top: 5px;
                        }
                        `
                    }
                </style>
            </div>
        )
    }

    //Component to display mock mobile outline
    const MobileOutline = (props: { screenIndex: number }) => {
        const { screenIndex } = props;
        const scaleValue = currentScreenIndex === screenIndex ? 1 : 0.8;
        return (
            <div
                className={'mobileOutline'}>
                <div className={styles.statusBar}>
                    <div className={styles.statusbar__left}>
                        <h5>2:20</h5>
                    </div>
                    <div className={styles.statusbar__right}>
                        <FontAwesomeIcon className={styles.batteryIcon} icon={faBatteryHalf} />
                    </div>
                </div>
                {screenIndex === 0 ? screen0() : null}
                {screenIndex === 1 ? screen1() : null}
                <style jsx>
                    {
                        `
                        .mobileOutline {
                            transform: scale(${scaleValue});
                            border: 1px solid #d9d9d9;
                            width: 301px;
                            height: 600px;
                            border-radius: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: space-between;
                            box-shadow:  20px 20px 60px #d9d9d9,
                            -20px -20px 60px #ffffff;
                            background-color:#fff
               
                        }

                        @media (max-width: 768px) {
                            width: 201px;
                            height: 400px;
                        }
                        `
                    }
                </style>
            </div>
        )
    }

    return (
        <div className={styles.rightSection}>
            <motion.div
                // animate={{ x: currentScreenIndex === 0 ? 100 : 0 }}
                animate={{ x: currentScreenIndex === 0 ? 100 : 0, zIndex: currentScreenIndex === 0 ? +999 : +998, scale: currentScreenIndex === 0 ? [0.5, 1, 1.5, 2, 1] : [1, 1, 1, 1, 1] }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <MobileOutline screenIndex={0} />
            </motion.div>
            <motion.div
                animate={{ x: currentScreenIndex === 1 ? -100 : 0, zIndex: currentScreenIndex === 1 ? +999 : +998, scale: currentScreenIndex === 1 ? [0.5, 1, 1.5, 2, 1] : [1, 1, 1, 1, 1] }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <MobileOutline screenIndex={1} />
            </motion.div>
        </div>
    )
}