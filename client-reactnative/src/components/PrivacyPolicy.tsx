/*
Copyright 2019-2022 (c) Dappros Ltd, registered in England & Wales, registration number 11455432. All rights reserved.
You may not use this file except in compliance with the License.
You may obtain a copy of the License at https://github.com/dappros/ethora/blob/main/LICENSE.
Note: linked open-source libraries and components may be subject to their own licenses.
*/

import React from "react"
import { Text, ScrollView, StyleSheet, FlatList, View } from "react-native"
import { heightPercentageToDP as hp } from "react-native-responsive-screen"
import { textStyles } from "../../docs/config"

const { mediumFont, boldFont } = textStyles

const heading1 = "Ethora and Dappros Platform Terms & Privacy Policy"
const body1 =
  "You are about to use a product based on the Ethora engine, Dappros Platform and Ethereum technologies. Our platform provides technology for ecosystems built on the principles of openness, transparency and decentralization. By design, certain information such as user profiles, rankings, and the transactions of digital assets will be available to the whole ecosystem or to the public. You should not attempt to use this product for secure or emergency communications. You should not share information or content here that you may not be comfortable or authorized to share with the public. Please carefully read our Terms of Service and Privacy Policy provided below and make sure you agree with them before proceeding to use this product."

const heading2 = "Terms of Service"
const body2 =
  "Dappros Ltd, Ethora foundation (developers and providers of the technology), Dappros Pvt Ltd (data processor), collectively called “Ethora” are responsible for the development, maintenance and data processing. You agree to our Terms of Service (“Terms”) by installing or using our apps, services, or website (together, “Services”)."

const heading3 = "About our services"
const body31 =
  "You must be at least 13 years old to use our Services. The minimum age to use our Services without parental approval may be higher in your home country"
const body32 =
  "To create an account you must register for our Services using your social networking profile, e-mail and / or phone number. You agree to receive e-mail, text messages and phone calls (from us or our third-party providers) with verification codes to register for our Services."
const body33 =
  "Ethora does not sell, rent or monetize your personal data or content. Please read our Privacy Policy below to understand how we safeguard the information you provide when using our Services. For the purpose of operating our Services, you agree to our data practices as described in our Privacy Policy, as well as the transfer of your encrypted information and metadata to the United States, United Kingdom, Republic of India, European Union and other countries where we have or use facilities, service providers or partners. Examples would be Third Party Providers sending you a verification code and processing your support tickets."
const body34 =
  "In order to enable new features and enhanced functionality, you consent to downloading and installing updates to our Services."
const body35 =
  "You are responsible for data and mobile carrier fees and taxes associated with the devices on which you use our Services"

const heading4 = "Using Ethora"
const body41 =
  "You must use our Services according to our Terms and posted policies. If we disable your account for a violation of our Terms, you will not create another account without our permission."
const body42 =
  "You agree to use our Services only for legal, authorized, and acceptable purposes. You will not use (or assist others in using) our Services in ways that: (a) violate or infringe the rights of Ethora, our users, or others, including privacy, publicity, intellectual property, or other proprietary rights; (b) involve sending illegal or impermissible communications such as bulk messaging, auto-messaging, and auto-dialing."
const body43 =
  "You must not (or assist others to) access, use, modify, distribute, transfer, or exploit our Services in unauthorized manners, or in ways that harm Ethora, our Services, or systems. For example you must not (a) gain or try to gain unauthorized access to our Services or systems; (b) disrupt the integrity or performance of our Services; (c) create accounts for our Services through unauthorized or automated means; (d) collect information about our users in any unauthorized manner; or (e) sell, rent, or charge for our Services."
const body44 =
  "The security of your account depends on both yourself and Ethora since data is stored both server-side and on the mobile device. Ethora is responsible to employ reasonable endeavours to support best security practices for your account information stored at the server. You are responsible to employ reasonable endeavours to keep your device and your account safe and secure."
const body45 =
  "Our Services do not provide access to emergency service providers like the police, fire department, hospitals, or other public safety organizations. Make sure you can contact emergency service providers through a mobile, fixed-line telephone, or other service. Similarly, you should not attempt to use the Services to contact other parties and individuals for any critical or emergency matters."
const body46 =
  "Our Services may allow you to access, use, or interact with third-party websites, apps, content, and other products and services. When you use third-party services, their terms and privacy policies govern your use of those services."

const heading5 = "Your Rights and License with Ethora"
const body51 =
  "You own the information you submit through our Services. You must have the rights to the e-mail, phone number and social profiles you use to sign up for your Ethora account."
const body52 =
  "We own all copyrights, trademarks, domains, logos, trade dress, trade secrets, patents, and other intellectual property rights associated with our Services. You may not use our copyrights, trademarks, domains, logos, trade dress, patents, and other intellectual property rights unless you have our written permission. To report copyright, trademark, or other intellectual property infringement, please contact abuse@dappros.com."
const body53 =
  "Ethora grants you a limited, revocable, non-exclusive, and non-transferable license to use our Services in accordance with these Terms."

const heading6 = "Disclaimers and Limitations"
const body61 =
  "YOU USE OUR SERVICES AT YOUR OWN RISK AND SUBJECT TO THE FOLLOWING DISCLAIMERS. WE PROVIDE OUR SERVICES ON AN “AS IS” BASIS WITHOUT ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND FREEDOM FROM COMPUTER VIRUS OR OTHER HARMFUL CODE. ETHORA DOES NOT WARRANT THAT ANY INFORMATION PROVIDED BY US IS ACCURATE, COMPLETE, OR USEFUL, THAT OUR SERVICES WILL BE OPERATIONAL, ERROR-FREE, SECURE, OR SAFE, OR THAT OUR SERVICES WILL FUNCTION WITHOUT DISRUPTIONS, DELAYS, OR IMPERFECTIONS. WE DO NOT CONTROL, AND ARE NOT RESPONSIBLE FOR, CONTROLLING HOW OR WHEN OUR USERS USE OUR SERVICES. WE ARE NOT RESPONSIBLE FOR THE ACTIONS OR INFORMATION (INCLUDING CONTENT) OF OUR USERS OR OTHER THIRD PARTIES. YOU RELEASE US, AFFILIATES, DIRECTORS, OFFICERS, EMPLOYEES, PARTNERS, AND AGENTS (TOGETHER, “ETHORA PARTIES”) FROM ANY CLAIM, COMPLAINT, CAUSE OF ACTION, CONTROVERSY, OR DISPUTE (TOGETHER, “CLAIM”) AND DAMAGES, KNOWN AND UNKNOWN, RELATING TO, ARISING OUT OF, OR IN ANY WAY CONNECTED WITH ANY SUCH CLAIM YOU HAVE AGAINST ANY THIRD PARTIES."
const body62 =
  "THE ETHORA PARTIES WILL NOT BE LIABLE TO YOU FOR ANY LOST PROFITS OR CONSEQUENTIAL, SPECIAL, PUNITIVE, INDIRECT, OR INCIDENTAL DAMAGES RELATING TO, ARISING OUT OF, OR IN ANY WAY IN CONNECTION WITH OUR TERMS, US, OR OUR SERVICES, EVEN IF THE ETHORA PARTIES HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. OUR AGGREGATE LIABILITY RELATING TO, ARISING OUT OF, OR IN ANY WAY IN CONNECTION WITH OUR TERMS, US, OR OUR SERVICES WILL NOT EXCEED ONE HUNDRED DOLLARS ($100). THE FOREGOING DISCLAIMER OF CERTAIN DAMAGES AND LIMITATION OF LIABILITY WILL APPLY TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW. THE LAWS OF SOME STATES OR JURISDICTIONS MAY NOT ALLOW THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES, SO SOME OR ALL OF THE EXCLUSIONS AND LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU. NOTWITHSTANDING ANYTHING TO THE CONTRARY IN OUR TERMS, IN SUCH CASES, THE LIABILITY OF THE ETHORA PARTIES WILL BE LIMITED TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW."
const body63 =
  "Our Services may be interrupted, including for maintenance, upgrades, or network or equipment failures. We may discontinue some or all of our Services, including certain features and the support for certain devices and platforms, at any time."

const heading7 = "Resolving Disputes and Ending Terms"
const body71 =
  "You agree to resolve any Claim you have with us relating to or arising out of our Terms, us, or our Services exclusively in the courts of England. You also agree to submit to the personal jurisdiction of such courts for the purpose of litigating all such disputes. The laws of England and Wales govern our Terms, as well as any disputes, whether in court or arbitration, which might arise between Ethora and you, without regard to conflict of law provisions."
const body72 =
  "You may end these Terms with Ethora at any time by deleting this product from your device and discontinuing use of our Services. We may modify, suspend, or terminate your access to or use of our Services anytime for any reason, such as if you violate the letter or spirit of our Terms or create harm, risk, or possible legal exposure for Ethora. The following provisions will survive termination of your relationship with Ethora: “Licenses,” “Disclaimers,” “Limitation of Liability,” “Resolving dispute,” “Availability” and “Ending these Terms,” and “General”."

const heading8 = "General"
const body81 =
  "Ethora may update the Terms from time to time. When we update our Terms, we will update the “Last Modified” date associated with the updated Terms. Your continued use of our Services confirms your acceptance of our updated Terms and supersedes any prior Terms. You will comply with all applicable export control and trade sanctions laws. Our Terms cover the entire agreement between you and Ethora regarding our Services. If you do not agree with our Terms, you should stop using our Services."
const body82 =
  "If we fail to enforce any of our Terms, that does not mean we waive the right to enforce them. If any provision of the Terms is deemed unlawful, void, or unenforceable, that provision shall be deemed severable from our Terms and shall not affect the enforceability of the remaining provisions. Our Services are not intended for distribution to or use in any country where such distribution or use would violate local law or would subject us to any regulations in another country. We reserve the right to limit our Services in any country. If you have specific questions about these Terms, please contact us at privacy@dappros.com."

const heading9 = "Privacy Policy"

const heading10 = "Information you provide"
const body101 =
  "You share with us your name, profile picture and your e-mail when you create an Ethora account. You may optionally add other information to your account."
const body102 =
  "Your message history is stored on your own devices. Additionally, messages history is stored on the servers maintained by Ethora and our partners. This information is not shared by Ethora with any third parties unless required by law. Ethora does not guarantee certain storage policy for your messages on the servers. Ethora may delete server-side information from time to time using automated maintenance software or manually."
const body103 =
  "Additional technical information is stored on our servers, including randomly generated authentication tokens, keys, push tokens, and other material that is necessary to provide the Services. Ethora limits this additional technical information to the minimum required to operate the Services."
const body104 =
  "Ethora can optionally discover which contacts in your address book are Ethora users, using a service designed to protect the privacy of your contacts. Information from the contacts on your device may be cryptographically hashed and transmitted to the server in order to determine which of your contacts are registered."
const body105 =
  "If you contact Ethora User Support, any personal data you may share with us is kept only for the purposes of researching the issue and contacting you about your case."
const body106 =
  "You can manage your personal information in Ethora’s application menu accessible via a three vertical dots menu in the top right. For example, you can update your profile information, add or remove e-mail addresses etc."

const heading11 = "Information we may share"
const body111 =
  "We work with third parties to provide some of our Services. For example, our Third-Party Providers may send a verification code to your phone number when you register for our Services. These providers are bound by their Privacy Policies to safeguard that information. If you use other Third-Party Services like YouTube, Giphy, Gyazo, Spotify, Reddit, Evernote, Dropbox etc. in connection with our Services, their Terms and Privacy Policies govern your use of those services."

const subheading1 = "Other instances where Ethora may need to share your data"
const listContent = [
  "To meet any applicable law, regulation, legal process or enforceable governmental request.",
  "To enforce applicable Terms, including investigation of potential violations.",
  "To detect, prevent, or otherwise address fraud, security, or technical issues.",
  "To protect against harm to the rights, property, or safety of Ethora, our users, or the public as required or permitted by law.",
]

const heading12 = "Updates"
const body12 =
  "We will update this privacy policy as needed so that it is current, accurate, and as clear as possible. Your continued use of our Services confirms your acceptance of our updated Privacy Policy."

const heading13 = "Terms"
const body13 =
  "Please also read our Terms of Service above which also governs the terms of this Privacy Policy."

const heading14 = "Contact Us"
const body14 =
  "If you have questions about our Privacy Policy please contact us at privacy@dappros.con. Attn: Dappros Ltd, 38 Munden Grove, Watford, WD24 7EE, United Kingdom."

const effectiveDate = "Effective as of June 21, 2021"

const renderItem = (item: { index: number | string; item: string }) => {
  return (
    <Text
      style={styles.bodyTextStyle}
      key={item.index}
    >{`\u2022 ${item.item}`}</Text>
  )
}

const PrivacyPolicy = () => (
  <ScrollView showsVerticalScrollIndicator style={styles.mainContainer}>
    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading1}</Text>
      <Text style={styles.bodyTextStyle}>{body1}</Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading2}</Text>
      <Text style={styles.bodyTextStyle}>{body2}</Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading3}</Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Minimum Age.</Text> {body31}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Account Registration.</Text>{" "}
        {body32}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Privacy of user data.</Text>{" "}
        {body33}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Software.</Text> {body34}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Fees and Taxes.</Text> {body35}
      </Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading4}</Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Our Terms and Policies.</Text>{" "}
        {body41}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Legal and Acceptable Use.</Text>{" "}
        {body42}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Harm to Ethora.</Text> {body43}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>
          Keeping Your Account Secure.
        </Text>{" "}
        {body44}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>
          No Access to Emergency Services.
        </Text>{" "}
        {body45}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Third-party services.</Text>{" "}
        {body46}
      </Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading5}</Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Your Rights.</Text> {body51}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Ethora’s Rights.</Text> {body52}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Ethora’s License to You.</Text>{" "}
        {body53}
      </Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading6}</Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Disclaimers.</Text> {body61}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Limitation of liability.</Text>{" "}
        {body62}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>
          Availability of Our Services.
        </Text>{" "}
        {body63}
      </Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading7}</Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Resolving disputes.</Text>{" "}
        {body71}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Ending these Terms.</Text>{" "}
        {body72}
      </Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading8}</Text>
      <Text style={styles.bodyTextStyle}>{body81}</Text>
      <Text style={styles.bodyTextStyle}>{body82}</Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading9}</Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading10}</Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Account Information.</Text>{" "}
        {body101}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Messages.</Text> {body102}
      </Text>
      <Text style={styles.bodyTextStyle}>{body103}</Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Contacts.</Text> {body104}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>User Support.</Text> {body105}
      </Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Managing your information.</Text>{" "}
        {body106}
      </Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading11}</Text>
      <Text style={styles.bodyTextStyle}>
        <Text style={{ fontFamily: boldFont }}>Third Parties.</Text> {body111}
      </Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{subheading1}</Text>
      <FlatList data={listContent} renderItem={renderItem} />
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading12}</Text>
      <Text style={styles.bodyTextStyle}>{body12}</Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading13}</Text>
      <Text style={styles.bodyTextStyle}>{body13}</Text>
    </View>

    <View style={styles.subBodyContainer}>
      <Text style={styles.headingTextStyle}>{heading14}</Text>
      <Text style={styles.bodyTextStyle}>{body14}</Text>
    </View>

    <Text style={styles.bodyTextStyle}>{effectiveDate}</Text>
  </ScrollView>
)

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    margin: hp("1%"),
  },
  subBodyContainer: {
    paddingBottom: hp("1%"),
  },
  headingTextStyle: {
    paddingBottom: hp("0.5%"),
    fontFamily: boldFont,
    fontSize: hp("1.5%"),
  },
  bodyTextStyle: {
    fontFamily: mediumFont,
    fontSize: hp("1.2%"),
  },
  subStringTextStyle: {
    fontFamily: boldFont,
    fontSize: hp("1.2%"),
  },
})

export default PrivacyPolicy
