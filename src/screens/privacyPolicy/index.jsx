import React from "react";
import Style from "./privacyPolicy.module.css"
import { Col, Row } from "antd";
import loginLayoutLogo from '../../assets/images/loginLayoutLogo.png'
import { MdArrowBackIosNew } from "react-icons/md";
import { useNavigate } from "react-router";

const PrivacyPolicy = () => {
    const navigate = useNavigate()

    return (
        <>
            <div style={{paddingBottom:30}}>
                <Row justify="center">
                    <Col xxl={12} xl={12}>
                        <div className={Style.container}>
                            <div className={Style.backBtn} onClick={()=>navigate(-1)}>
                                <MdArrowBackIosNew/>
                            </div>
                            <img className={Style.LayoutLogo} src={loginLayoutLogo} />
                            <div></div>
                        </div>
                        <h1 className={Style.Title}>PRIVACY POLICY</h1>
                        <p>LAST UPDATED: 4/12/2025</p>
                        <p className={Style.SpaceT}>Your privacy is important to us. This Privacy Policy (“Policy") applies to products and/or Product provided by WorkSafe Mapping, LLC. ("we”, “us”, or “Company") and our website, mobile app, or other platform (collectively, the "Product") explains what information we collect from users of our Product (a "user", "you", or "your"), including information that may be used to personally identify you (“Personal Information") and how we use it. We encourage you to read the details below. This Policy applies to any user or visitor to or user of our Product. We will be the controller of your personal data provided to, or collected by or for, or processed in connection with, our Product.</p>
                        <p className={Style.SpaceT}>We reserve the right to change this Policy at any time. We will notify you of any changes to this Policy by sending notice to the primary email address specified in your account or by a general notice on our website. Significant changes will go into effect thirty (30) days following such notification. Non-material changes or clarifications will take effect immediately. You should periodically check our website, including this privacy page, for updates. You acknowledge that your continued use of our Product after we publish or send a notice about our changes to this Policy means that the collection, use and sharing of your Personal Information is subject to the updated Policy.</p>
                        <h1 className={Style.Title}>What Information Do We Collect?</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>We will only collect and process Personal Information about you where we have lawful bases. Lawful bases include consent (where you have given consent), contract (where processing is necessary for the performance of a contract with you (e.g., to deliver the Product you have requested) and "legitimate interests."We collect information that you give us when you create an account, contact us, or otherwise access or use our Product, any information you voluntarily submit to us, and information regarding how you use the Product. Specifically, the foregoing includes:</p>


                        <ul style={{ paddingLeft: 20 }} className={Style.SpaceT}>
                            <li className={Style.SpaceT}>Your internet protocol address (i.e., IP address) and, if you access the Product from a mobile application, your unique mobile device ID number and non-email authentication.</li>
                            <li className={Style.SpaceT}>Your name, email address, postal address, telephone number, profession, profile picture, credit card information and your responses to surveys that we may ask you to complete for research purposes or to help direct Company activities, the contact information of your representative, your social media account information.</li>
                            <li className={Style.SpaceT}>Details of any financial transactions you participate in on the Product, including the amount, currency, and method of payment.</li>
                            <li className={Style.SpaceT}>Browser and device information and information collected through technologies such as cookies.</li>
                        </ul>


                        <h1 className={Style.Title}>How Do We Use the Information We Collect?</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>We use the information we collect to:</p>
                        <ul style={{ paddingLeft: 20 }} className={Style.SpaceT}>
                            <li className={Style.SpaceT}>Deliver and improve the Product and your overall user experience.</li>
                            <li className={Style.SpaceT}>To protect, investigate, and deter against fraudulent, unauthorized, or illegal activity.</li>
                            <li className={Style.SpaceT}>To link or combine user information with other Personal Information.</li>
                            <li className={Style.SpaceT}>To compare and verify information for accuracy and update our records.</li>
                            <li className={Style.SpaceT}>Email, text, message, or otherwise contact you with information and updates about us and the Product.</li>
                            <li className={Style.SpaceT}>To respond to your comments and questions and provide customer service.</li>
                            <li className={Style.SpaceT}>To send you information including confirmations, billing and invoices, technical notices, updates, security alerts, and support and administrative messages.</li>
                            <li className={Style.SpaceT}>Analyze how you use the Product with tools such as Google Analytics and other tools to help us understand traffic patterns and know if there are problems with the Product.</li>
                            <li className={Style.SpaceT}>Create targeted advertising to promote the Product and engage our users.</li>
                        </ul>

                        <h1 className={Style.Title}>Do We Share Your Personal Information?</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>We do not rent, sell, or share your Personal Information with other people or non-affiliated third parties except with your consent or as necessary to complete any transaction or provide any service you have requested or authorized. To help us do our work, we may provide limited access to a portion of your Personal Information to the following third parties:</p>
                        <ul style={{ paddingLeft: 20 }} className={Style.SpaceT}>
                            <li className={Style.SpaceT}><b style={{ color: 'black' }}>Partners:</b> Sometimes we collaborate with other organizations to deliver the Product. In these cases, we may share your name, contact information and other details you provided when making an account with our partners.</li>
                            <li className={Style.SpaceT}><b style={{ color: 'black' }}>Service Providers:</b> We work with a wide range of third-party providers, notably our database administrators, cloud computing services, advertising services, data analysts, application service providers, bulk SMS services, and other non-governmental organizations.</li>
                            <li className={Style.SpaceT}><b style={{ color: 'black' }}>Payment processors:</b> We work with payment processors such as Stripe to help process credit card transactions and other payment methods made through the Product. These payment processors will store certain information about you. Please refer to their privacy policies to learn more about how they use your Personal Information.</li>
                        </ul>
                        <p className={Style.SpaceT}>We may store information such as survey responses and contact information which are necessary to enable us to operate effectively and deliver our Product to you. We may also transfer your Personal Information to a third party as a result of a merger, acquisition, reorganization or similar transaction; when required by law or to respond to legal process; to protect our customers; to protect lives; to maintain the security of the Product; and to protect the rights or property of Company. In such an event, and to the extent legally permitted, we will notify you and, if there are material changes in relation to the processing of your Personal Information, give you an opportunity to consent to such changes.</p>

                        <h1 className={Style.Title}>Protection of Company and Others</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>We will also share Personal Information with companies, organizations or individuals outside of Company if we have a good-faith belief that access, use, preservation, or disclosure of your Personal Information is reasonably necessary to detect or protect against fraud or security issues, enforce our terms of use, meet any enforceable government request, defend against legal claims, or protect against harm our legal rights or safety.</p>






                        <h1 className={Style.Title}>How Do We Use Tracking Technologies?</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>A "cookie" is a small file placed on your hard drive by some of our web pages. We, or third- parties we do business with, may use cookies to help us analyze our web page flow, customize our Product, content, and advertising, measure promotional effectiveness, and promote trust and safety. Cookies are commonly used at most major transactional websites in much the same way we use them in our Product.</p>
                        <p className={Style.SpaceT}>You may delete and block all cookies from our Product, but parts of the Product may not work. We want to be open about our cookie use.</p>
                        <p className={Style.SpaceT}>Even if you are only browsing the Product, certain information (including computer and connection information, browser type and version, operating system and platform details, and the time of accessing the Product) is automatically collected about you. This information will be collected every time you access the Product, and it will be used for the purposes outlined in this Privacy Policy.
                            You can reduce the information cookies collected from your device. An uncomplicated way of doing this is often to change the settings in your browser. If you do that you should know that (a) your use of the Product may be adversely affected (and possibly entirely prevented), (b) your experience of this and other sites that use cookies to enhance or personalize your experience may be adversely affected, and (c) you may not be presented with advertising that reflects the way that you use our and other sites. You find out how to make these changes to your browser at this site: www.allaboutcookies.org/manage-cookies/. Unless you have adjusted your browser settings so that it will refuse cookies, our system will send cookies as soon as you access our Product. By using the Product, you consent to this unless you change your browser settings.
                        </p>

                        <h1 className={Style.Title}>How Do We Secure Your Personal Information?</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>We take reasonable steps to protect your Personal Information against unauthorized access, alteration, disclosure, misuse, or destruction. Unfortunately, no data transmission or storage system can be guaranteed to be 100% secure. The safety and security of your Personal Information also depends on you. If you have an account with us, you are responsible for keeping your membership details confidential. Your account is protected by your account password, and we urge you to take steps to keep your Personal Information safe by not disclosing your password and by logging out of your account after each use. We further protect your Personal Information from potential security breaches by implementing certain technological security measures including encryption, firewalls, and secure socket layer technology. However, these measures do not guarantee that your Personal Information will not be accessed, disclosed, altered, or destroyed by breach of such firewalls and secure server software. By using the Product, you acknowledge that you understand and agree to assume these risks.</p>
                        <p className={Style.SpaceT}>We retain your personal data while your account is in existence or as needed to provide you Product. This includes data you or others provided to us and data generated or inferred from your use of the Product.</p>
                        <h1 className={Style.Title}>Your Choices Regarding Information</h1>

                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>
                            You have several choices regarding the use of Personal Information on the Product:
                        </p>
                        <p className={Style.SpaceT}>
                            <b>Changing or Deleting Your Personal Data.</b> All users may review, update, correct or delete the Personal Information furnished by a user in their user account (including any imported contacts) by contacting us at support@lawinsider.com or by accessing your user account. For your protection, we may only share and update the Personal Information associated with the specific email address that you use to send us your request, and we may need to verify your identity before doing so. We will try to comply with such requests in a reasonably timely manner. If you completely and permanently delete all your Personal Information, then your user account may become deactivated. If you wish to cancel your account, you may do so through your account page, and any personally identifiable information associated with your account will be deleted as soon as is practical or as required by applicable law. Please note that we may retain information that is otherwise deleted in anonymized and aggregated form, in archived or backup copies as required pursuant to records retention obligations, or otherwise as required by law. We may retain an archived copy of your records as required by law or for legitimate business purposes.
                        </p>


                        <p className={Style.SpaceT}>
                            <b>Download or Access Personal Information.</b>  You can ask us for a copy of your Personal Information and can ask for a copy of Personal Information you provided in machine readable form by emailing us at support@worksafemaps.com.
                        </p>

                        <p className={Style.SpaceT}>
                            <b>Opting Out of Email Communications.</b> We may use a portion of the information we collect for marketing purposes, including to send you promotional communications about new Company features, products, events, or other opportunities. If you wish to stop receiving these communications or to opt out of use of your information for these purposes, please follow the opt-out instructions, such as clicking "Unsubscribe" (or similar opt-out language) in those communications. You can also contact us at support@worksafemaps.com to opt out. Despite your indicated e-mail preferences, we may send you service-related communications, including notices of any updates to our terms of service or privacy policy.
                        </p>

                        <h1 className={Style.Title}>
                            Links to Third Party Websites
                        </h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>We may provide links to other websites. We have no control over these websites, and they are subject to their own terms of use and privacy policies. As such, we do not endorse and are not responsible for the availability of, or for any content, advertising, products, or other materials on or available from, these third-party websites.</p>
                        <p className={Style.SpaceT}>By using the Product, you agree that we will not be liable for any damage or loss caused by your use of or reliance on any content, advertising, products, or other materials available from these third-party websites.</p>


                        <h1 className={Style.Title}>How We Respond to Do Not Track Signals</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>
                            Your browser settings may allow you to automatically transmit a Do Not Track signal to websites and other online Product you visit. We do not alter our practices when we receive a Do Not Track signal from a visitor's browser because we do not track our visitors to provide targeted advertising. To find out more about Do Not Track, please visit <a href="https://www.allaboutdnt.com" target="_blank">https://www.allaboutdnt.com</a>
                        </p>

                        <h1 className={Style.Title}>Children Under 16</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>The Product is not directed to individuals who are under the age of sixteen (16) and we do not solicit nor knowingly collect Personal Information from children under the age of sixteen (16). If you believe that we have unknowingly collected any Personal Information from someone under the age of sixteen (16), please contact us immediately at support@worksafemaps.com and the information will be deleted.</p>


                        <h1 className={Style.Title}>Third-Party Direct Marketing</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>We currently do not share personal data with third parties for their direct marketing purposes without your consent.</p>



                        <h1 className={Style.Title}>A Note to Users Outside the United States</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>Our Company is based in the United States. The Product is controlled and operated by us from the United States and not intended to subject us to the laws or jurisdiction of any state, country, or territory other than that of the United States. Your Personal Information may be stored and processed in any country where we have facilities or in which we engage service providers, and by using the Product you consent to the transfer of information to countries outside of your country of residence, including the United States, which may have data protection rules that are different from those of your country. In certain circumstances, courts, law enforcement agencies, regulatory agencies or security authorities in those other countries may be entitled to access your Personal Information.</p>



                        <h1 className={Style.Title}>Contact Us</h1>
                        <p className={Style.SpaceT} style={{ marginTop: '0.2rem' }}>If you have any questions about this Policy, your Personal Information, or the Product, you can contact support@worksafemaps.com.</p>

                    </Col>
                </Row>
            </div>
        </>
    )
}

export default PrivacyPolicy;