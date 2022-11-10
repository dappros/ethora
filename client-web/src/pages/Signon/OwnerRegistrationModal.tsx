import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useHistory } from "react-router-dom";
import { useStoreState } from "../../store";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import Tnc from "./Tnc";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import * as http from "../../http";

type TProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const validate = (values: Record<string, string>) => {
  const errors: Record<string, string> = {};

  if (!values.firstName) {
    errors.firstName = "Required";
  }

  if (!values.lastName) {
    errors.lastName = "Required";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  return errors;
};

function getTnc(
  company: string,
  fname: string,
  lname: string,
  email: string,
  date: string
) {
  let customer: string;

  if (company) {
    customer =
      company +
      ", a company, represented by " +
      fname +
      " " +
      lname +
      ", an individual, available at e-mail address: " +
      email;
  } else {
    customer =
      fname +
      " " +
      lname +
      ", an individual, available at e-mail address: " +
      email;
  }
  return `
  SaaS terms and conditions

  Services Order Form
  1.	Customer details
  The Customer is ${customer}
  2.	Set Up Services
  No additional set up services required.
  3.	Specification of Hosted Services
  Hosted Services shall mean computer software, cloud and on-premise hosting infrastructure, documentation, client-side, server-side and blockchain code, relevant set up and maintenance operations that enable blockchain and distributed ledger functionality including, without limitation:
  Token issuance system: including web interface, backend and frontend logic, smart contracts that allow to issue blockchain cryptographic tokens and configure relevant parameters such as set total funding goal, number of tokens issued, type or standard of tokens issued, metadata, master and linked wallets, controls, smart contract parameters etc.
  Wallet system: including web interface, backend and frontend logic, smart contracts and APIs that allow to (1) generate and access hot and cold crypto wallets, display and manage one or multiple blockchain wallets within one admin panel / user interface; (2) display and manage / transfer tokens or coins belonging to the user; (3) view balances in custom tokens, existing crypto currencies, conventional money (fiat); (4) view exchange rates or equivalent value of current balances in other crypto coins / tokens / fiat; (5) view recent transactions carried out via specific wallets; (6) transfer, receive transfer and otherwise manipulate tokens and coins controlled by user wallets; (7) master interface allowing to manipulate wallets at organisational level including viewing and managing all users, wallets, transactions, balances, issuing tokens or mass transferring funds into users wallets etc; (8) graphical and analytical representations for the above such as diagrams, CSV exports etc.
  Explorer system: including web interface, backend and frontend logic, smart contracts and APIs that allow to (1) view network wide blockchain transactions including hash, block, age, from, to, value, fee, timestamp, mined / confirmed status and other relevant data, (2) view blocks and related statistics, (3) view tokens and smart contracts data, (4) filter, sort and otherwise manipulate the above data, (5) view historical diagrams and other graphical representations for the above data, (6) view and export statistics for the above data, (7) display information related to specific transaction, token or smart contract if requested via API call or through system user interface.
  Asset tracking system (“TracyChain”): system allowing to put any business asset onto blockchain including its web interface, backend and frontend logic, smart contracts and APIs and  features including: create asset record on blockchain, create trace of asset on blockchain, sign asset or trace with one or multiple blockchain keys, retrieve asset and trace records, track metadata such as GPS location, timestamp, temperature etc, link external IPFS or S3 files (such as photo images) with blockchain assets and traces via hash and checksum connectivity, dashboard providing web interface for tracking assets, API documentation etc
  Monitoring and analytics system for API, server and blockchain parameters (“CryptoSLA”) allowing to monitor and visualize centralized parts of the system such as uptime and latency of APIs as well as decentalized parts such as number of transactions, transactions speed, blockchain network health, transactions difficulty, number of blocks, latest block, pending transactions, latest gas, peer count, wallets and tokens statistics, including uptime widget, detailed monitoring dashboard, master dashboard and alerts via e-mail, SMS, phone calls, chat messages and push notifications.
  Underlying architecture, storage systems and server-side logic: (MongoDB, MySQL, IPFS), APIs, backend (server-side) code and documentation. This includes logic allowing to create and manipulate user accounts tied with wallets, multi-signature management, secure and compliant offchain-blockchain connectivity system etc.
  4.	Customer Systems
  Latest Chrome or Mozilla compatible web browser for web interface access. Any REST JSON compatible client-side software for API access.
  5.	Financial provisions
  There are following important variations to these Terms depending on licence type and pricing plan the Customer has selected.
  Pricing plan selected by the Customer: "Free".
  Subscription fee, per calendar month: 0 USD.
  Uptime guarantee: N/A
  Backups frequency: N/A
  Backups retention: N/A
  Concurrent users: 10
  Support Services requests reaction times (business hours): Critical: N/A, Serious: N/A, Moderate: N/A, Minor: N/A.
  Support Services issue resolution times (business hours): Critical: N/A, Serious: N/A, Moderate: N/A, Minor: N/A.
  Liability cap (singular event or series of related events): £5,000
  Liability cap (aggregate liability): £10,000
  The Service Fee is payable monthly in advance starting from the Effective Date. Depending on billing method the Customer will be
  (a) charged automatically upon monthly anniversary of the Effective Date
  (b) invoiced 10 days prior to monthly anniversary of the Effective Date, payable within 14 days.

  6.	Representatives
  The Provider Representatives are: Taras Filatov.
  The Customer Representatives are: ${fname}${" "}${lname}.
  7.	Contractual notices
  The Provider addresses for contractual notices are: legal@dappros.com and: Dappros Ltd, 38 Munden Grove, Watford, WD24 7EE, United Kingdom.
  The Customer address for contractual notices is: ${email}.
  The parties have indicated their acceptance of the Agreement by signing below or accepting the terms electronically on the dates provided below.
  SIGNED OR ACCEPTED BY Taras Filatov on ${date}, the Provider.
  SIGNED OR ACCEPTED BY ${fname}${" "}${lname} on ${date}, the Customer.

  Terms and Conditions
  Please read these Terms and Conditions carefully. All contracts that the Provider may enter into from time to time for the provision of the Hosted Services and related services shall be governed by these Terms and Conditions, and the Provider will ask the Customer for the Customer's express written acceptance of these Terms and Conditions before providing any such services to the Customer.
  1.	Definitions
  1.1	Except to the extent expressly provided otherwise, in these Terms and Conditions:
  "Acceptance Criteria" means:
  (a)	the Platform and Hosted Services conforming in all material respects with the Hosted Services Specification; and
  (b)	the Hosted Services being free from Hosted Services Defects;
  "Acceptance Period" means a period of 10 Business Days following the making available of the Hosted Services to the Customer for the purposes of testing in accordance with Clause 4 or any repeated making available of the Hosted Services to the Customer for the purposes of testing in accordance with Clause 4, or such other period or periods as the parties may agree in writing;
  "Acceptance Tests" means a set of tests designed to establish whether the Hosted Services meet the Acceptance Criteria, providing that the exact form of the tests shall be determined and documented by the Customer acting reasonably, and communicated to the Provider in advance of the first Acceptance Period;
  "Account" means an account enabling a person to access and use the Hosted Services;
  "Affiliate" means an entity that Controls, is Controlled by, or is under common Control with the relevant entity;
  "Agreement" means a contract between the parties incorporating these Terms and Conditions, and any amendments to that contract from time to time;
  "Business Day" means any weekday other than a bank or public holiday in England;
  "Business Hours" means the hours of 09:00 to 17:00 GMT/BST on a Business Day;
  "CCN" means a change control notice issued in accordance with Clause 17;
  "CCN Consideration Period" means the period of 14 Business Days following the receipt by a party of the relevant CCN from the other party;
  "Change" means any change to the scope of the Services;
  "Charges" means the following amounts:
  such amounts as may be agreed in writing by the parties from time to time;
  "Confidential Information" means the Provider Confidential Information and the Customer Confidential Information;
  "Control" means the legal power to control (directly or indirectly) the management of an entity (and "Controlled" should be construed accordingly);
  "Customer" means the person or entity identified as such in Section 1 of the Services Order Form;
  "Customer Confidential Information" means:
  (a)	any information disclosed by the Customer to the Provider at any time before the termination of the Agreement (whether disclosed in writing, orally or otherwise) that at the time of disclosure:
  (i)	was marked or described as "confidential"; or
  (ii)	should have been reasonably understood by the Provider to be confidential; and
  (b)	the terms of the Agreement;
  "Customer Data" means all data, works and materials: uploaded to or stored on the Platform by the Customer; transmitted by the Platform at the instigation of the Customer; supplied by the Customer to the Provider for uploading to, transmission by or storage on the Platform; or generated by the Platform as a result of the use of the Hosted Services by the Customer (but excluding analytics data relating to the use of the Platform and server log files);
  "Customer Indemnity Event" has the meaning given to it in Clause 27.3;
  "Customer Personal Data" means any Personal Data that is processed by the Provider on behalf of the Customer in relation to the Agreement, but excluding personal data with respect to which the Provider is a data controller;
  "Customer Representatives" means the person or persons identified as such in Section 6 of the Services Order Form, and any additional or replacement persons that may be appointed by the Customer giving to the Provider written notice of the appointment;
  "Customer Systems" means the hardware and software systems of the Customer that interact with, or may reasonably be expected to interact with, the Hosted Services;
  "Customisation" means a customisation of the Hosted Services, whether made through the development, configuration or integration of software, or otherwise;
  "Data Protection Laws" means all applicable laws relating to the processing of Personal Data including, while it is in force and applicable to Customer Personal Data, the General Data Protection Regulation (Regulation (EU) 2016/679);
  "Documentation" means the documentation for the Hosted Services produced by the Provider and delivered or made available by the Provider to the Customer;
  "Effective Date" means the date upon which the parties execute a hard-copy Services Order Form; or, following the Customer completing and submitting the online Services Order Form published by the Provider on the Provider's website, the date upon which the Provider sends to the Customer an order confirmation;
  "Expenses" means the travel, accommodation and subsistence expenses that are reasonably necessary for, and incurred by the Provider exclusively in connection with, the performance of the Provider's obligations under the Agreement;
  "Force Majeure Event" means an event, or a series of related events, that is outside the reasonable control of the party affected (including failures of the internet or any public telecommunications network, hacker attacks, denial of service attacks, virus or other malicious software attacks or infections, power failures, industrial disputes affecting any third party, changes to the law, disasters, explosions, fires, floods, riots, terrorist attacks and wars);
  "Hosted Services" means Dappros Platform, which will be made available by the Provider to the Customer as a service via the internet in accordance with these Terms and Conditions;
  "Hosted Services Defect" means a defect, error or bug in the Platform having a material adverse effect on operation, functionality or performance of the Hosted Services, but excluding any defect, error or bug caused by or arising as a result of:
  (a)	any act or omission of the Customer or any person authorised by the Customer to use the Platform or Hosted Services;
  (b)	any use of the Platform or Hosted Services contrary to the Documentation, whether by the Customer or by any person authorised by the Customer;
  (c)	a failure of the Customer to perform or observe any of its obligations in the Agreement; and/or
  (d)	an incompatibility between the Platform or Hosted Services and any other system, network, application, program, hardware or software not specified as compatible in the Hosted Services Specification;
  "Hosted Services Specification" means the specification for the Platform and Hosted Services set out in Section 3 of the Services Order Form and in the Documentation;
  "Intellectual Property Rights" means all intellectual property rights wherever in the world, whether registrable or unregistrable, registered or unregistered, including any application or right of application for such rights (and these "intellectual property rights" include copyright and related rights, database rights, confidential information, trade secrets, know-how, business names, trade names, trade marks, service marks, passing off rights, unfair competition rights, patents, petty patents, utility models, semi-conductor topography rights and rights in designs);
  "Maintenance Services" means the general maintenance of the Platform and Hosted Services, and the application of Updates and Upgrades;
  "Minimum Term" means, in respect of the Agreement, the period of 12 months beginning on the Effective Date;
  "Personal Data" has the meaning given to it in the Data Protection Laws applicable in the United Kingdom from time to time;
  "Platform" means the platform managed by the Provider and used by the Provider to provide the Hosted Services, including the application and database software for the Hosted Services, the system and server software used to provide the Hosted Services, and the computer hardware on which that application, database, system and server software is installed;
  "Provider" means Dappros Ltd, a company incorporated in England and Wales registration number 11455432 having its registered office at 38 Munden Grove, Watford, WD24 7EE, United Kingdom;
  "Provider Confidential Information" means:
  (a)	any information disclosed by the Provider to the Customer at any time before the termination of the Agreement (whether disclosed in writing, orally or otherwise) that at the time of disclosure was marked or described as "confidential" or should have been understood by the Customer (acting reasonably) to be confidential; and
  (b)	the terms of the Agreement;
  "Provider Indemnity Event" has the meaning given to it in Clause 27.1;
  "Provider Representatives" means the person or persons identified as such in Section 6 of the Services Order Form, and any additional or replacement persons that may be appointed by the Provider giving to the Customer written notice of the appointment;
  "Remedy Period" means a period of 20 Business Days following the Customer giving to the Provider a notice that the Hosted Services have failed the Acceptance Tests, or such other period as the parties may agree in writing;
  "Services" means any services that the Provider provides to the Customer, or has an obligation to provide to the Customer, under these Terms and Conditions;
  "Services Order Form" means an online order form published by the Provider and completed and submitted by the Customer, or a hard-copy order form signed or otherwise agreed by or on behalf of each party, in each case incorporating these Terms and Conditions by reference;
  "Set Up Services" means the configuration, implementation and integration of the Hosted Services in accordance with Section 2 of the Services Order Form;
  "Support Services" means support in relation to the use of, and the identification and resolution of errors in, the Hosted Services, but shall not include the provision of training services;
  "Supported Web Browser" means the current release from time to time of Microsoft Edge, Mozilla Firefox, Google Chrome or Apple Safari, or any other web browser that the Provider agrees in writing shall be supported;
  "Term" means the term of the Agreement, commencing in accordance with Clause 2.1 and ending in accordance with Clause 2.2;
  "Terms and Conditions" means all the documentation containing the provisions of the Agreement, namely the Services Order Form, the main body of these Terms and Conditions and the Schedules, including any amendments to that documentation from time to time;
  "Third Party Services" means any hosted or cloud services provided by any third party that may transmit data to and/or from the Hosted Services;
  "Update" means a hotfix, patch or minor version update to any Platform software; and
  "Upgrade" means a major version upgrade of any Platform software.
  2.	Term
  2.1	The Agreement shall come into force upon the Effective Date.
  2.2	The Agreement shall continue in force indefinitely, subject to termination in accordance with Clause 30.
  2.3	Unless the parties expressly agree otherwise in writing, each Services Order Form shall create a distinct contract under these Terms and Conditions.
  3.	Set Up Services
  3.1	The Provider shall provide the Set Up Services to the Customer.
  3.2	The Provider shall use all reasonable endeavours to ensure that the Set Up Services are provided promptly following the Effective Date.
  3.3	The Customer acknowledges that a delay in the Customer performing its obligations in the Agreement may result in a delay in the performance of the Set Up Services; and subject to Clause 28.1 the Provider will not be liable to the Customer in respect of any failure to meet the Set Up Services timetable to the extent that that failure arises out of a delay in the Customer performing its obligations under these Terms and Conditions.
  3.4	Subject to any written agreement of the parties to the contrary, any Intellectual Property Rights that may arise out of the performance of the Set Up Services by the Provider shall be the exclusive property of the Provider.
  4.	Acceptance procedure
  4.1	During each Acceptance Period, the Customer shall carry out the Acceptance Tests.
  4.2	The Provider shall provide to the Customer at the Customer's cost and expense all such assistance and co-operation in relation to the carrying out of the Acceptance Tests as the Customer may reasonably request.
  4.3	Before the end of each Acceptance Period, the Customer shall give to the Provider a written notice specifying whether the Hosted Services have passed or failed the Acceptance Tests.
  4.4	If the Customer fails to give to the Provider a written notice in accordance with Clause 4.3, then the Hosted Services shall be deemed to have passed the Acceptance Tests.
  4.5	If the Customer notifies the Provider that the Hosted Services have failed the Acceptance Tests, then the Customer must provide to the Provider, at the same time as the giving of the notice, written details of the results of the Acceptance Tests including full details of the identified failure.
  4.6	If the Customer notifies the Provider that the Hosted Services have failed the Acceptance Tests:
  (a)	if the Provider acting reasonably agrees with the Customer that the Hosted Services do not comply with the Acceptance Criteria, then the Provider must correct the issue and make available the corrected Hosted Services to the Customer before the end of the Remedy Period for a further round of Acceptance Tests; or
  (b)	otherwise, then the parties must meet as soon as practicable and in any case before the expiry of the Remedy Period and use their best endeavours to agree whether the Hosted Services do not comply with the Acceptance Criteria, and if appropriate a plan of action reasonably satisfactory to both parties, and they must record any agreement reached in writing.
  4.7	Notwithstanding the other provisions of this Clause 4, but subject to any written agreement of the parties to the contrary, the maximum number of rounds of Acceptance Tests under this Clause 4 shall be 3, and if the Acceptance Criteria have not been met by the end of the final round of Acceptance Tests, the Provider shall be deemed to be in material breach of the Agreement.
  4.8	If the Customer notifies the Provider that the Hosted Services have passed, or are deemed to have passed, the Acceptance Tests under this Clause 4, then subject to Clause 28.1 the Customer will have no right to make any claim under or otherwise rely upon any warranty given by the Provider to the Customer in the Agreement in relation to the specification and performance of the Hosted Services, unless the Customer could not reasonably have been expected to have identified the breach of that warranty during the testing process.
  5.	Hosted Services
  5.1	The Provider shall ensure that the Platform will generate an Account for the Customer and provide to the Customer login details for that Account upon the completion of the Set Up Services.
  5.2	The Provider hereby grants to the Customer a worldwide, non-exclusive licence to use the Hosted Services by means of a Supported Web Browser for the internal business purposes of the Customer in accordance with the Documentation during the Term.
  5.3	The licence granted by the Provider to the Customer under Clause 5.2 is subject to the following limitations:
  (a)	the Hosted Services may only be used by the officers, employees, agents, subcontractors and end users of either the Customer or an Affiliate of the Customer;
  (b)	the Hosted Services must not be used at any point in time by more than the number of concurrent users specified in the Services Order Form, providing that the Customer may add or remove concurrent user licences by agreeing in written with the Provider the updated number of licences and respective changes to Financial Provisions.
  5.4	Except to the extent expressly permitted in these Terms and Conditions or required by law on a non-excludable basis, the licence granted by the Provider to the Customer under Clause 5.2 is subject to the following prohibitions:
  (a)	the Customer must not sub-license its right to access and use the Hosted Services;
  (b)	the Customer must not permit any unauthorised person to access or use the Hosted Services;
  (c)	the Customer must not republish or redistribute any content or material from the Hosted Services;
  (d)	the Customer must not make any alteration to the Platform, except as permitted by the Documentation; and
  (e)	the Customer must not conduct or request that any other person conduct any load testing or penetration testing on the Platform or Hosted Services without the prior written consent of the Provider.
  (f) 	the Customer must not use the Hosted Services to provide platform services to third parties in competition with Provider.
  5.5	The Customer shall use reasonable endeavours, including reasonable security measures relating to Account access details, to ensure that no unauthorised person may gain access to the Hosted Services using an Account.
  5.6	The parties acknowledge and agree that Schedule 2 (Availability SLA) shall govern the availability of the Hosted Services.
  5.7	The Customer must comply with Schedule 1 (Acceptable Use Policy), and must ensure that all persons using the Hosted Services with the authority of the Customer or by means of an Account comply with Schedule 1 (Acceptable Use Policy).
  5.8	The Customer must not use the Hosted Services in any way that causes, or may cause, damage to the Hosted Services or Platform or impairment of the availability or accessibility of the Hosted Services.
  5.9	The Customer must not use the Hosted Services:
  (a)	in any way that is unlawful, illegal, fraudulent or harmful; or
  (b)	in connection with any unlawful, illegal, fraudulent or harmful purpose or activity;
  (c)    in violation of international sanctions imposed by United States government, United Kingdom government, European Union or United Nations directives.
  5.10	For the avoidance of doubt, the Customer has no right to access the software code (including object code, intermediate code and source code) of the Platform, either during or after the Term (unless the parties agree otherwise in writing).
  6.	Customisations
  6.1	The Provider and the Customer may agree that the Provider shall design, develop and implement a Customisation or Customisations in accordance with a specification and project plan agreed in writing by the parties.
  6.2	All Intellectual Property Rights in the Customisations shall, as between the parties, be the exclusive property of the Provider (unless the parties agree otherwise in writing).
  6.3	From the time and date when a Customisation is first delivered or made available by the Provider to the Customer, the Customisation shall form part of the Platform, and accordingly from that time and date the Customer's rights to use the Customisation shall be governed by Clause 5.
  6.4	The Customer acknowledges that the Provider may make any Customisation available to any of its other customers or any other third party.
  7.	Maintenance Services
  7.1	The Provider shall provide the Maintenance Services to the Customer during the Term.
  7.2	The Provider shall provide the Maintenance Services with reasonable skill and care.
  7.3	The Provider shall provide the Maintenance Services in accordance with Schedule 3 (Maintenance SLA).
  7.4	The Provider may suspend the provision of the Maintenance Services if any amount due to be paid by the Customer to the Provider under the Agreement is overdue, and the Provider has given to the Customer at least 14 days' written notice, following the amount becoming overdue, of its intention to suspend the Maintenance Services on this basis.
  8.	Support Services
  8.1	The Provider shall provide the Support Services to the Customer during the Term.
  8.2	The Provider shall provide the Support Services with reasonable skill and care.
  8.3	The Provider shall provide the Support Services in accordance with Schedule 4 (Support SLA).
  8.4	The Provider may suspend the provision of the Support Services if any amount due to be paid by the Customer to the Provider under the Agreement is overdue, and the Provider has given to the Customer at least 7 days' written notice, following the amount becoming overdue, of its intention to suspend the Support Services on this basis.
  9.	Customer obligations
  9.1	Save to the extent that the parties have agreed otherwise in writing, the Customer must provide to the Provider, or procure for the Provider, such:
  (a)	co-operation, support and advice;
  (b)	information and documentation; and
  (c)	governmental, legal and regulatory licences, consents and permits,
  as are reasonably necessary to enable the Provider to perform its obligations under the Agreement.
  9.2	The Customer must provide to the Provider, or procure for the Provider, such access to the Customer's computer hardware, software, networks and systems as may be reasonably required by the Provider to enable the Provider to perform its obligations under the Agreement.
  10.	Customer Systems
  10.1	The Customer shall ensure that the Customer Systems comply, and continue to comply during the Term, with the requirements of Section 4 of the Services Order Form in all material respects, subject to any changes agreed in writing by the Provider.
  11.	Customer Data
  11.1	The Customer hereby grants to the Provider a non-exclusive licence to copy, reproduce, store, distribute, publish, export, adapt, edit and translate the Customer Data to the extent reasonably required for the performance of the Provider's obligations and the exercise of the Provider's rights under the Agreement. The Customer also grants to the Provider the right to sub-license these rights to its hosting, connectivity and telecommunications service providers, subject to any express restrictions elsewhere in the Agreement.
  11.2	The Customer warrants to the Provider that the Customer Data will not infringe the Intellectual Property Rights or other legal rights of any person, and will not breach the provisions of any law, statute or regulation, in any jurisdiction and under any applicable law.
  12.	Integrations with Third Party Services
  12.1	The Hosted Services are integrated with certain Third Party Services such as Amazon Web Services as at the Effective Date. The Provider may integrate any Third Party Services with the Hosted Services at any time.
  12.2	The Provider may remove, suspend or limit any Third Party Services integration at any time in its sole discretion.
  12.3	The supply of Third Party Services shall be under a separate contract or arrangement between the Customer and the relevant third party. The Provider does not contract to supply the Third Party Services and is not a party to any contract for, or otherwise responsible in respect of, the provision of any Third Party Services. Fees may be payable by the Customer to the relevant third party in respect of the use of Third Party Services.
  12.4	The Customer acknowledges that:
  (a)	the integration of Third Party Services may entail the transfer of Customer Data from the Hosted Services to the relevant Third Party Services; and
  (b)	the Provider has no control over, or responsibility in respect of, any disclosure, modification, deletion or other use of Customer Data resulting from any integration with any Third Party Services.
  12.5	Without prejudice to its other obligations under this Clause 12, the Customer must ensure that it has in place the necessary contractual safeguards to ensure that both:
  (a)	the transfer of relevant Customer Personal Data to a provider of Third Party Services is lawful; and
  (b)	the use of relevant Customer Personal Data by a provider of Third Party Services is lawful.
  12.6	The Customer shall have the opportunity to consent to transfers of Customer Data to any Third Party Services operator. The Provider must ensure that such transfers shall not take place without the consent of the Customer.
  12.7	The Customer hereby consents to the transfer of the Customer Data to the Third Party Services.
  12.8	The use of some features of the Hosted Services may depend upon the Customer enabling and agreeing to integrations between the Hosted Services and Third Party Services.
  12.9	The Customer warrants to the Provider that the transfer of Customer Data by the Provider to a provider of Third Party Services in accordance with this Clause 12 will not infringe any person's legal or contractual rights and will not put the Provider in breach of any applicable laws.
  12.10	Additional Charges may be payable by the Customer to the Provider in respect of a Third Party Services integration.
  12.11	Save to the extent that the parties expressly agree otherwise in writing and subject to Clause 28.1:
  (a)	the Provider gives no warranties or representations in respect of any Third Party Services; and
  (b)	the Provider shall not be liable to the Customer in respect of any loss or damage that may be caused by any Third Party Services or any provider of Third Party Services.
  13.	Mobile App
  13.1	The parties acknowledge and agree that the use of the Mobile App, the parties' respective rights and obligations in relation to the Mobile App and any liabilities of either party arising out of the use of the Mobile App shall be subject to separate terms and conditions, and accordingly these Terms and Conditions shall not govern any such use, rights, obligations or liabilities.
  14.	No assignment of Intellectual Property Rights
  14.1	Nothing in these Terms and Conditions shall operate to assign or transfer any Intellectual Property Rights from the Provider to the Customer, or from the Customer to the Provider.
  15.	Representatives
  15.1	The Provider shall ensure that all instructions given by the Provider in relation to the matters contemplated in the Agreement will be given by a Provider Representative to a Customer Representative, and the Customer:
  (a)	may treat all such instructions as the fully authorised instructions of the Provider; and
  (b)	must not comply with any other instructions in relation to that subject matter.
  15.2	The Customer shall ensure that all instructions given by the Customer in relation to the matters contemplated in the Agreement will be given by a Customer Representative to a Provider Representative, and the Provider:
  (a)	may treat all such instructions as the fully authorised instructions of the Customer; and
  (b)	must not comply with any other instructions in relation to that subject matter.
  16.	Management
  16.1	The parties shall hold management meetings at each party's offices, by telephone conference or using internet-based conferencing facilities:
  (a)	at the reasonable request of either party.
  16.2	A party requesting a management meeting shall give to the other party at least 10 Business Days' written notice of the meeting.
  16.3	Wherever necessary to enable the efficient conduct of business, the Provider shall be represented at management meetings by at least 1 Provider Representative and the Customer shall be represented at management meetings by at least 1 Customer Representative.
  17.	Change control
  17.1	The provisions of this Clause 17 apply to each Change requested by a party.
  17.2	Either party may request a Change at any time.
  17.3	A party requesting a Change shall provide to the other party a completed CCN in the form specified in Schedule 5 (Form of CCN).
  17.4	A party in receipt of a CCN may:
  (a)	accept the CCN, in which case that party must countersign the CCN and return it to the other party before the end of the CCN Consideration Period;
  (b)	reject the CCN, in which case that party must inform the other party of this rejection before the end of the CCN Consideration Period; or
  (c)	issue an amended CCN to the other party before the end of the CCN Consideration Period, in which case this Clause 17 will reapply with respect to the amended CCN.
  17.5	A proposed Change will not take effect until such time as a CCN recording the Change has been signed by or on behalf of each party.
  18.	Charges
  18.1	The Customer shall pay the Charges to the Provider in accordance with these Terms and Conditions.
  18.2	If the Charges are based in whole or part upon the time spent by the Provider performing the Services, the Provider must obtain the Customer's written consent before performing Services that result in any estimate of time-based Charges given to the Customer being exceeded or any budget for time-based Charges agreed by the parties being exceeded; and unless the Customer agrees otherwise in writing, the Customer shall not be liable to pay to the Provider any Charges in respect of Services performed in breach of this Clause 18.2.
  18.3	All amounts stated in or in relation to these Terms and Conditions are, unless the context requires otherwise, stated exclusive of any applicable value added taxes, which will be added to those amounts and payable by the Customer to the Provider.
  18.4	The Provider may elect to vary any element of the Charges by giving to the Customer not less than 30 days' written notice of the variation, providing that no such variation shall constitute a percentage increase in the relevant element of the Charges that exceeds 10% over the percentage increase, since the date of the most recent variation of the relevant element of the Charges or, if no such variation has occurred, since the date of execution of the Agreement, in the Retail Prices Index (all items) published by the UK Office for National Statistics.
  19.	Expenses
  19.1	The Customer shall reimburse the Provider in respect of any Expenses, providing that the Provider must obtain the prior written authorisation of the Customer before incurring any Expenses exceeding such limitations as may be agreed in writing by the parties from time to time.
  19.2	The Provider must collect and collate evidence of all Expenses, and must retain such evidence during the Term and for a period of 90 days following the end of the Term.
  19.3	Within 10 Business Days following receipt of a written request from the Customer to do so, the Provider must supply to the Customer such copies of the evidence for the Expenses in the possession or control of the Provider as the Customer may specify in that written request.
  20.	Timesheets
  20.1	The Provider must:
  (a)	ensure that the personnel providing Services, the Charges for which will be based in whole or part upon the time spent in the performance of those Services, complete reasonably detailed records of their time spent providing those Services; and
  (b)	retain such records during the Term, and for a period of at least 12 months following the end of the Term.
  20.2	Within 10 Business Days following receipt of a written request, the Provider shall supply to the Customer copies of such of the timesheets referred to in Clause 20.1 and in the Provider's possession or control as the Customer may specify in that written request.
  21.	Payments
  21.1	The Provider shall issue invoices for the Charges to the Customer from time to time during the Term
  21.2	The Customer must pay the Charges to the Provider within the period of 14 days following the issue of an invoice in accordance with this Clause 21.
  21.3	The Customer must pay the Charges by debit card, credit card, direct debit or bank transfer (using such payment details as are notified by the Provider to the Customer from time to time).
  21.4	If the Customer does not pay any amount properly due to the Provider under these Terms and Conditions, the Provider may:
  (a)	charge the Customer interest on the overdue amount at the rate of 8% per annum above the Bank of England base rate from time to time (which interest will accrue daily until the date of actual payment and be compounded at the end of each calendar month); or
  (b)	claim interest and statutory compensation from the Customer pursuant to the Late Payment of Commercial Debts (Interest) Act 1998.
  22.	Confidentiality obligations
  22.1	The Provider must:
  (a)	keep the Customer Confidential Information strictly confidential;
  (b)	not disclose the Customer Confidential Information to any person without the Customer's prior written consent;
  (c)	use the same degree of care to protect the confidentiality of the Customer Confidential Information as the Provider uses to protect the Provider's own confidential information of a similar nature, being at least a reasonable degree of care;
  (d)	act in good faith at all times in relation to the Customer Confidential Information.
  22.2	The Customer must:
  (a)	keep the Provider Confidential Information strictly confidential;
  (b)	not disclose the Provider Confidential Information to any person without the Provider's prior written consent
  (c)	use the same degree of care to protect the confidentiality of the Provider Confidential Information as the Customer uses to protect the Customer's own confidential information of a similar nature, being at least a reasonable degree of care;
  (d)	act in good faith at all times in relation to the Provider Confidential Information.
  22.3	Notwithstanding Clauses 22.1 and 22.2, a party's Confidential Information may be disclosed by the other party to that other party's officers, employees, professional advisers, insurers, agents and subcontractors who have a need to access the Confidential Information that is disclosed for the performance of their work with respect to the Agreement and who are bound by a written agreement or professional obligation to protect the confidentiality of the Confidential Information that is disclosed.
  22.4	No obligations are imposed by this Clause 22 with respect to a party's Confidential Information if that Confidential Information:
  (a)	is known to the other party before disclosure under these Terms and Conditions and is not subject to any other obligation of confidentiality;
  (b)	is or becomes publicly known through no act or default of the other party; or
  (c)	is obtained by the other party from a third party in circumstances where the other party has no reason to believe that there has been a breach of an obligation of confidentiality.
  22.5	The restrictions in this Clause 22 do not apply to the extent that any Confidential Information is required to be disclosed by any law or regulation, by any judicial or governmental order or request, or pursuant to disclosure requirements relating to the listing of the stock of either party on any recognised stock exchange.
  22.6	Upon the termination of the Agreement, each party must immediately cease to use the other party's Confidential Information.
  22.7	Following the termination of the Agreement, and within 5 Business Days following the date of receipt of a written request from the other party, the relevant party must destroy or return to the other party (at the other party's option) all media containing the other party's Confidential Information, and must irrevocably delete the other party's Confidential Information from its computer systems.
  22.8	The provisions of this Clause 22 shall continue in force for a period of 5 years following the termination of the Agreement, at the end of which period they will cease to have effect.
  23.	Publicity
  23.1	Neither party may make any public disclosures relating to the Agreement or the subject matter of the Agreement including disclosures in press releases, public announcements and marketing materials without the prior written consent of the other party, such consent not to be unreasonably withheld or delayed, and providing that the following public disclosures may be made without consent:
  a) Customer may display Provider’s logo, name and brief company information in order to demonstrate to its users and other parties the fact of using the Hosting Services and the Platform (example: “Powered by Dappros Platform”);
  b) Provider may display Customer’s logo, name and brief company information in order to demonstrate the fact that Customer is using Provider’s services (example: “used by ${fname}${" "}${lname}”).
  23.2	Nothing in this Clause 23 shall be construed as limiting the obligations of the parties under Clause 22.
  24.	Data protection
  24.1	Each party shall comply with the Data Protection Laws with respect to the processing of the Customer Personal Data.
  24.2	The Customer warrants to the Provider that it has the legal right to disclose all Personal Data that it does in fact disclose to the Provider under or in connection with the Agreement.
  24.3	The Customer shall only supply to the Provider, and the Provider shall only process, in each case under or in relation to the Agreement:
  (a)	the Personal Data of data subjects falling within the categories specified in Part 1 of Schedule 6 (Data processing information) (or such other categories as may be agreed by the parties in writing); and
  (b)	Personal Data of the types specified in Part 2 of Schedule 6 (Data processing information) (or such other types as may be agreed by the parties in writing).
  24.4	The Provider shall only process the Customer Personal Data for the purposes specified in Part 3 of Schedule 6 (Data processing information).
  24.5	The Provider shall only process the Customer Personal Data during the Term and for not more than 30 days following the end of the Term, subject to the other provisions of this Clause 24.
  24.6	The Provider shall only process the Customer Personal Data on the documented instructions of the Customer (including with regard to transfers of the Customer Personal Data to any place outside the European Economic Area), as set out in these Terms and Conditions or any other document agreed by the parties in writing.
  24.7	The Customer hereby authorises the Provider to make the following transfers of Customer Personal Data:
  (a)	the Provider may transfer the Customer Personal Data internally to its own employees, contractors, offices and facilities worldwide, providing that such transfers must be protected by appropriate safeguards;
  (b)	the Provider may transfer the Customer Personal Data to its sub-processors in the jurisdictions identified in Part 5 of Schedule 6 (Data processing information), providing that such transfers must be protected by any appropriate safeguards identified therein; and
  (c)	the Provider may transfer the Customer Personal Data to a country, a territory or sector to the extent that the European Commission has decided that the country, territory or sector ensures an adequate level of protection for Personal Data.
  24.8	The Provider shall promptly inform the Customer if, in the opinion of the Provider, an instruction of the Customer relating to the processing of the Customer Personal Data infringes the Data Protection Laws.
  24.9	Notwithstanding any other provision of the Agreement, the Provider may process the Customer Personal Data if and to the extent that the Provider is required to do so by applicable law.
  24.10	The Provider shall ensure that persons authorised to process the Customer Personal Data have committed themselves to confidentiality or are under an appropriate statutory obligation of confidentiality.
  24.11	The Provider and the Customer shall each implement appropriate technical and organisational measures to ensure an appropriate level of security for the Customer Personal Data, including those measures specified in Part 4 of Schedule 6 (Data processing information).
  24.12	As at the Effective Date, the Provider is hereby authorised by the Customer to engage, as sub-processors with respect to Customer Personal Data, the third parties, and third parties within the categories, identified in Part 5 of Schedule 6 (Data processing information).
  24.13	The Provider shall, insofar as possible and taking into account the nature of the processing, take appropriate technical and organisational measures to assist the Customer with the fulfilment of the Customer's obligation to respond to requests exercising a data subject's rights under the Data Protection Laws.
  24.14	The Provider shall assist the Customer in ensuring compliance with the obligations relating to the security of processing of personal data, the notification of personal data breaches to the supervisory authority, the communication of personal data breaches to the data subject, data protection impact assessments and prior consultation in relation to high-risk processing under the Data Protection Laws. The Provider may charge the Customer for any work performed by the Provider at the request of the Customer pursuant to this Clause 24.15.
  24.15	The Provider must notify the Customer of any Personal Data breach affecting the Customer Personal Data without undue delay.
  24.16	The Provider shall make available to the Customer all information necessary to demonstrate the compliance of the Provider with its obligations under this Clause 24. The Provider may charge the Customer for any work performed by the Provider at the request of the Customer pursuant to this Clause 24.17.
  24.17	The Provider shall, at the choice of the Customer, delete or return all of the Customer Personal Data to the Customer after the provision of services relating to the processing, and shall delete existing copies save to the extent that applicable law requires storage of the relevant Personal Data.
  24.18	The Provider shall allow for and contribute to audits, including inspections, conducted by the Customer or another auditor mandated by the Customer in respect of the compliance of the Provider's processing of Customer Personal Data with the Data Protection Laws and this Clause 24. The Provider may charge the Customer for any work performed by the Provider at the request of the Customer pursuant to this Clause 24.19.
  24.19	If any changes or prospective changes to the Data Protection Laws result or will result in one or both parties not complying with the Data Protection Laws in relation to processing of Personal Data carried out under the Agreement, then the parties shall use their best endeavours promptly to agree such variations to the Agreement as may be necessary to remedy such non-compliance.
  25.	Warranties
  25.1	The Provider warrants to the Customer that:
  (a)	the Provider has the legal right and authority to enter into the Agreement and to perform its obligations under these Terms and Conditions;
  (b)	the Provider will comply with all applicable legal and regulatory requirements applying to the exercise of the Provider's rights and the fulfilment of the Provider's obligations under these Terms and Conditions; and
  (c)	the Provider has or has access to all necessary know-how, expertise and experience to perform its obligations under these Terms and Conditions.
  25.2 The Provider warrants to the Customer that:
  (a) the Platform and Hosted Services will conform in all material respects with the Hosted Services Specification;
  (b) the Hosted Services will be free from Hosted Services Defects;
  (c) the application of Updates and Upgrades to the Platform by the Provider will not introduce any Hosted Services Defects into the Hosted Services;
  (d) the Platform will be free from viruses, worms, Trojan horses, ransomware, spyware, adware and other malicious software programs.
  25.3	The Provider warrants to the Customer that the Hosted Services, when used by the Customer in accordance with these Terms and Conditions, will not infringe the Intellectual Property Rights of any person.
  25.4	If the Provider reasonably determines, or any third party alleges, that the use of the Hosted Services by the Customer in accordance with these Terms and Conditions infringes any person's Intellectual Property Rights, the Provider may at its own cost and expense:
  (a)	modify the Hosted Services in such a way that they no longer infringe the relevant Intellectual Property Rights; or
  (b)	procure for the Customer the right to use the Hosted Services in accordance with these Terms and Conditions.
  25.5	The Customer warrants to the Provider that it has the legal right and authority to enter into the Agreement and to perform its obligations under these Terms and Conditions.
  25.6	All of the parties' warranties and representations in respect of the subject matter of the Agreement are expressly set out in these Terms and Conditions. To the maximum extent permitted by applicable law, no other warranties or representations concerning the subject matter of the Agreement will be implied into the Agreement or any related contract.
  26.	Acknowledgements and warranty limitations
  26.1	The Customer acknowledges that complex software is never wholly free from defects, errors and bugs; and subject to the other provisions of these Terms and Conditions, the Provider gives no warranty or representation that the Hosted Services will be wholly free from defects, errors and bugs.
  26.2	The Customer acknowledges that complex software is never entirely free from security vulnerabilities; and subject to the other provisions of these Terms and Conditions, the Provider gives no warranty or representation that the Hosted Services will be entirely secure.
  26.3	The Customer acknowledges that the Hosted Services are designed to be compatible only with that software and those systems specified as compatible in the Hosted Services Specification; and the Provider does not warrant or represent that the Hosted Services will be compatible with any other software or systems.
  26.4	The Customer acknowledges that the Provider will not provide any legal, financial, accountancy or taxation advice under these Terms and Conditions or in relation to the Hosted Services; and, except to the extent expressly provided otherwise in these Terms and Conditions, the Provider does not warrant or represent that the Hosted Services or the use of the Hosted Services by the Customer will not give rise to any legal liability on the part of the Customer or any other person.
  27.	Indemnities
  27.1	The Provider shall indemnify and shall keep indemnified the Customer against any and all liabilities, damages, losses, costs and expenses (including legal expenses and amounts reasonably paid in settlement of legal claims) suffered or incurred by the Customer and arising directly or indirectly as a result of any breach by the Provider of these Terms and Conditions (a "Provider Indemnity Event").
  27.2	The Customer must:
  (a)	upon becoming aware of an actual or potential Provider Indemnity Event, notify the Provider;
  (b)	provide to the Provider all such assistance as may be reasonably requested by the Provider in relation to the Provider Indemnity Event;
  (c)	allow the Provider the exclusive conduct of all disputes, proceedings, negotiations and settlements with third parties relating to the Provider Indemnity Event; and
  (d)	not admit liability to any third party in connection with the Provider Indemnity Event or settle any disputes or proceedings involving a third party and relating to the Provider Indemnity Event without the prior written consent of the Provider,
  and the Provider's obligation to indemnify the Customer under Clause 27.1 shall not apply unless the Customer complies with the requirements of this Clause 27.2.
  27.3	The Customer shall indemnify and shall keep indemnified the Provider against any and all liabilities, damages, losses, costs and expenses (including legal expenses and amounts reasonably paid in settlement of legal claims) suffered or incurred by the Provider and arising directly or indirectly as a result of any breach by the Customer of these Terms and Conditions (a "Customer Indemnity Event").
  27.4	The Provider must:
  (a)	upon becoming aware of an actual or potential Customer Indemnity Event, notify the Customer;
  (b)	provide to the Customer all such assistance as may be reasonably requested by the Customer in relation to the Customer Indemnity Event;
  (c)	allow the Customer the exclusive conduct of all disputes, proceedings, negotiations and settlements with third parties relating to the Customer Indemnity Event; and
  (d)	not admit liability to any third party in connection with the Customer Indemnity Event or settle any disputes or proceedings involving a third party and relating to the Customer Indemnity Event without the prior written consent of the Customer,
  and the Customer's obligation to indemnify the Provider under Clause 27.3 shall not apply unless the Provider complies with the requirements of this Clause 27.4.
  27.5	The indemnity protection set out in this Clause 27 shall be subject to the limitations and exclusions of liability set out in the Agreement.
  28.	Limitations and exclusions of liability
  28.1	Nothing in these Terms and Conditions will:
  (a)	limit or exclude any liability for death or personal injury resulting from negligence;
  (b)	limit or exclude any liability for fraud or fraudulent misrepresentation;
  (c)	limit any liabilities in any way that is not permitted under applicable law; or
  (d)	exclude any liabilities that may not be excluded under applicable law.
  28.2	The limitations and exclusions of liability set out in this Clause 28 and elsewhere in these Terms and Conditions:
  (a)	are subject to Clause 28.1; and
  (b)	govern all liabilities arising under these Terms and Conditions or relating to the subject matter of these Terms and Conditions, including liabilities arising in contract, in tort (including negligence) and for breach of statutory duty, except to the extent expressly provided otherwise in these Terms and Conditions.
  28.3	Neither party shall be liable to the other party in respect of any losses arising out of a Force Majeure Event.
  28.4	Neither party shall be liable to the other party in respect of any loss of profits or anticipated savings.
  28.5	Neither party shall be liable to the other party in respect of any loss of revenue or income.
  28.6	Neither party shall be liable to the other party in respect of any loss of use or production.
  28.7	Neither party shall be liable to the other party in respect of any loss of business, contracts or opportunities.
  28.8	Neither party shall be liable to the other party in respect of any loss or corruption of any data, database or software
  28.9	Neither party shall be liable to the other party in respect of any special, indirect or consequential loss or damage.
  28.10	The liability of each party to the other party of any event or series of related events shall not exceed the greater of:
  (a)	£150,000 British Pounds; and
  (b)	the total amount paid and payable by the Customer to the Provider under the Agreement in the 12 month period preceding the commencement of the event or events.
  28.11	The aggregate liability of each party to the other party under the Agreement shall not exceed the greater of:
  (a)	£250,000 British Pounds; and
  (b)	the total amount paid and payable by the Customer to the Provider under the Agreement.
  29.	Force Majeure Event
  29.1	If a Force Majeure Event gives rise to a failure or delay in either party performing any obligation under the Agreement (other than any obligation to make a payment), that obligation will be suspended for the duration of the Force Majeure Event.
  29.2	A party that becomes aware of a Force Majeure Event which gives rise to, or which is likely to give rise to, any failure or delay in that party performing any obligation under the Agreement, must:
  (a)	promptly notify the other; and
  (b)	inform the other of the period for which it is estimated that such failure or delay will continue.
  29.3	A party whose performance of its obligations under the Agreement is affected by a Force Majeure Event must take reasonable steps to mitigate the effects of the Force Majeure Event.
  30.	Termination
  30.1	The Provider may terminate the Agreement by giving to the Customer not less than 30 days' written notice of termination, expiring after the end of the Minimum Term. The Customer may terminate the Agreement by giving to the Provider not less than 30 days' written notice of termination, expiring after the end of the Minimum Term.
  30.2	Either party may terminate the Agreement immediately by giving written notice of termination to the other party if:
  (a)	the other party commits any material breach of the Agreement, and the breach is not remediable;
  (b)	the other party commits a material breach of the Agreement, and the breach is remediable but the other party fails to remedy the breach within the period of 30 days following the giving of a written notice to the other party requiring the breach to be remedied; or
  (c)	the other party persistently breaches the Agreement (irrespective of whether such breaches collectively constitute a material breach).
  30.3	Either party may terminate the Agreement immediately by giving written notice of termination to the other party if:
  (a)	the other party:
  (i)	is dissolved;
  (ii)	ceases to conduct all (or substantially all) of its business;
  (iii)	is or becomes unable to pay its debts as they fall due;
  (iv)	is or becomes insolvent or is declared insolvent; or
  (v)	convenes a meeting or makes or proposes to make any arrangement or composition with its creditors;
  (b)	an administrator, administrative receiver, liquidator, receiver, trustee, manager or similar is appointed over any of the assets of the other party;
  (c)	an order is made for the winding up of the other party, or the other party passes a resolution for its winding up (other than for the purpose of a solvent company reorganisation where the resulting entity will assume all the obligations of the other party under the Agreement); or
  (d)	if that other party is an individual:
  (i)	that other party dies;
  (ii)	as a result of illness or incapacity, that other party becomes incapable of managing his or her own affairs; or
  (iii)	that other party is the subject of a bankruptcy petition or order.
  30.4	The Provider may terminate the Agreement immediately by giving written notice to the Customer if:
  (a)	any amount due to be paid by the Customer to the Provider under the Agreement is unpaid by the due date and remains unpaid upon the date that that written notice of termination is given; and
  (b)	the Provider has given to the Customer at least 30 days' written notice, following the failure to pay, of its intention to terminate the Agreement in accordance with this Clause 30.4.
  30.5	The rights of termination set out in the Agreement shall not exclude any rights of termination available at law.
  31.	Effects of termination
  31.1	Upon the termination of the Agreement, all of the provisions of these Terms and Conditions shall cease to have effect, save that the following provisions of these Terms and Conditions shall survive and continue to have effect (in accordance with their express terms or otherwise indefinitely): Clauses 1, 4.8, 5.10, 12.11, 13, 19.2, 19.3, 20, 21.2, 21.4, 22, 23, 24.1, 24.3, 24.4, 24.5, 24.6, 24.7, 24.8, 24.9, 24.10, 24.11, 24.12, 24.13, 24.14, 24.15, 24.16, 24.17, 24.18, 24.19, 24.20, 27, 28, 31, 32, 35, 36, 37, 38, 39, 40, 41 and 42.
  31.2	Except to the extent that these Terms and Conditions expressly provides otherwise, the termination of the Agreement shall not affect the accrued rights of either party.
  31.3	Within 30 days following the termination of the Agreement for any reason:
  (a)	the Customer must pay to the Provider any Charges in respect of Services provided to the Customer before the termination of the Agreement; and
  (b)	the Provider must refund to the Customer any Charges paid by the Customer to the Provider in respect of Services that were to be provided to the Customer after the termination of the Agreement,
  without prejudice to the parties' other legal rights.
  32.	Non-solicitation of personnel
  32.1	The Customer must not, without the prior written consent of the Provider, either during the Term or within the period of 6 months following the end of the Term, engage, employ or solicit for engagement or employment any employee or subcontractor of the Provider who has been involved in any way in the negotiation or performance of the Agreement.
  32.2	The Provider must not, without the prior written consent of the Customer, either during the Term or within the period of 6 months following the end of the Term, engage, employ or solicit for engagement or employment any employee or subcontractor of the Customer who has been involved in any way in the negotiation or performance of the Agreement.
  33.	Notices
  33.1	Any notice given under these Terms and Conditions must be in writing, whether or not described as "written notice" in these Terms and Conditions.
  33.2	Any notice given by the Customer to the Provider under these Terms and Conditions must be:
  (a)	delivered personally;
  (b)	sent by courier;
  (c)	sent by recorded signed-for post;
  (d)	sent by fax;
  (e)	sent by email; or
  (f)	submitted using the Provider's online contractual notification facility,
  using the relevant contact details set out in Section 7 of the Services Order Form.
  33.3	Any notice given by the Provider to the Customer under these Terms and Conditions must be:
  (a)	delivered personally;
  (b)	sent by courier;
  (c)	sent by recorded signed-for post;
  (d)	sent by fax;
  (e)	sent by email; or
  (f)	submitted using the Customer's online contractual notification facility,
  using the relevant contact details set out in Section 7 of the Services Order Form.
  33.4	The addressee and contact details set out in Section 7 of the Services Order Form may be updated from time to time by a party giving written notice of the update to the other party in accordance with this Clause 33.
  33.5	A party receiving from the other party a notice by email must acknowledge receipt by email promptly, and in any event within 2 Business Days following receipt of the notice.
  33.6	A notice will be deemed to have been received at the relevant time set out below or, where such time is not within Business Hours, when Business Hours next begin after the relevant time set out below:
  (a)	in the case of notices delivered personally, upon delivery;
  (b)	in the case of notices sent by courier, upon delivery;
  (c)	in the case of notices sent by post, 48 hours after posting;
  (d)	in the case of notices sent by fax, at the time of the transmission of the fax (providing the sending party retains written evidence of the transmission);
  (e)	in the case of notices sent by email, at the time of the sending of the email (providing that the sending party retains written evidence that the email has been sent); and
  (f)	in the case of notices submitted using an online contractual notification facility, upon the submission of the notice form.
  34.	Subcontracting
  34.1	Subject to any express restrictions elsewhere in these Terms and Conditions, the Provider may subcontract any of its obligations under the Agreement.
  34.2	The Provider shall remain responsible to the Customer for the performance of any subcontracted obligations.
  34.3	Notwithstanding the provisions of this Clause 34 but subject to any other provision of these Terms and Conditions, the Customer acknowledges and agrees that the Provider may subcontract to any reputable third party hosting business the hosting of the Platform and the provision of services in relation to the support and maintenance of elements of the Platform.
  35.	Assignment
  35.1	The Provider must not assign, transfer or otherwise deal with the Provider's contractual rights and/or obligations under these Terms and Conditions without the prior written consent of the Customer, such consent not to be unreasonably withheld or delayed.
  35.2	The Customer must not assign, transfer or otherwise deal with the Customer's contractual rights and/or obligations under these Terms and Conditions without the prior written consent of the Provider, such consent not to be unreasonably withheld or delayed.
  36.	No waivers
  36.1	No breach of any provision of the Agreement will be waived except with the express written consent of the party not in breach.
  36.2	No waiver of any breach of any provision of the Agreement shall be construed as a further or continuing waiver of any other breach of that provision or any breach of any other provision of the Agreement.
  37.	Severability
  37.1	If a provision of these Terms and Conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect.
  37.2	If any unlawful and/or unenforceable provision of these Terms and Conditions would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.
  38.	Third party rights
  38.1	The Agreement is for the benefit of the parties, and is not intended to benefit or be enforceable by any third party.
  38.2	The exercise of the parties' rights under the Agreement is not subject to the consent of any third party.
  39.	Variation
  39.1	The Agreement may not be varied except by means of a written document signed by or on behalf of each party, without prejudice to the requirements of Clause 17.
  40.	Entire agreement
  40.1	The Services Order Form, the main body of these Terms and Conditions and the Schedules shall constitute the entire agreement between the parties in relation to the subject matter of the Agreement, and shall supersede all previous agreements, arrangements and understandings between the parties in respect of that subject matter.
  40.2	Neither party will have any remedy in respect of any misrepresentation (whether written or oral) made to it upon which it relied in entering into the Agreement.
  40.3	The provisions of this Clause 40 are subject to Clause 28.1.
  41.	Law and jurisdiction
  41.1	These Terms and Conditions shall be governed by and construed in accordance with English law.
  41.2	Any disputes relating to the Agreement shall be subject to the non-exclusive jurisdiction of the courts of England.
  42.	Interpretation
  42.1	In these Terms and Conditions, a reference to a statute or statutory provision includes a reference to:
  (a)	that statute or statutory provision as modified, consolidated and/or re-enacted from time to time; and
  (b)	any subordinate legislation made under that statute or statutory provision.
  42.2	The Clause headings do not affect the interpretation of these Terms and Conditions.
  42.3	References in these Terms and Conditions to "calendar months" are to the 12 named periods (January, February and so on) into which a year is divided.
  42.4	In these Terms and Conditions, general words shall not be given a restrictive interpretation by reason of being preceded or followed by words indicating a particular class of acts, matters or things.

  Schedule 1 (Acceptable Use Policy)
  1.	Introduction
  1.1	This acceptable use policy (the "Policy") sets out the rules governing:
  (a)	the use of the website, API and web services at www.dappros.com and app.dappros.com, any successor website, and the services available on that website or any successor website (the "Services"); and
  (b)	the transmission, storage and processing of content by you, or by any person on your behalf, using the Services ("Content").
  1.2	References in this Policy to "you" are to any customer for the Services and any individual user of the Services (and "your" should be construed accordingly); and references in this Policy to "us" are to Dappros Ltd (and "we" and "our" should be construed accordingly).
  1.3	By using the Services, you agree to the rules set out in this Policy.
  1.4	We will ask for your express agreement to the terms of this Policy before you upload or submit any Content or otherwise use the Services.
  1.5	You must be at least 18 years of age to use the Services; and by using the Services, you warrant and represent to us that you are at least 18 years of age.
  2.	General usage rules
  2.1	You must not use the Services in any way that causes, or may cause, damage to the Services or impairment of the availability or accessibility of the Services.
  2.2	You must not use the Services:
  (a)	in any way that is unlawful, illegal, fraudulent, deceptive or harmful; or
  (b)	in connection with any unlawful, illegal, fraudulent, deceptive or harmful purpose or activity.
  2.3	You must ensure that all Content complies with the provisions of this Policy.
  3.	Unlawful Content
  3.1	Content must not be illegal or unlawful, must not infringe any person's legal rights, and must not be capable of giving rise to legal action against any person (in each case in any jurisdiction and under any applicable law).
  3.2	Content, and the use of Content by us in any manner licensed or otherwise authorised by you,] must not:
  (a)	be libellous or maliciously false;
  (b)	be obscene or indecent;
  (c)	infringe any copyright, moral right, database right, trade mark right, design right, right in passing off, or other intellectual property right;
  (d)	infringe any right of confidence, right of privacy or right under data protection legislation;
  (e)	constitute negligent advice or contain any negligent statement;
  (f)	constitute an incitement to commit a crime, instructions for the commission of a crime or the promotion of criminal activity;
  (g)	be in contempt of any court, or in breach of any court order;
  (h)	constitute a breach of racial or religious hatred or discrimination legislation;
  (i)	be blasphemous;
  (j)	constitute a breach of official secrets legislation; or
  (k)	constitute a breach of any contractual obligation owed to any person.
  3.3	You must ensure that Content is not and has never been the subject of any threatened or actual legal proceedings or other similar complaint.
  4.	Graphic material
  4.1	Content must be appropriate for all persons who have access to or are likely to access the Content in question, and in particular for children over 12 years of age.
  4.2	Content must not depict violence in an explicit, graphic or gratuitous manner.
  4.3	Content must not be pornographic or sexually explicit.
  5.	Factual accuracy
  5.1	Content must not be untrue, false, inaccurate or misleading.
  5.2	Statements of fact contained in Content and relating to persons (legal or natural) must be true; and statements of opinion contained in Content and relating to persons (legal or natural) must be reasonable, be honestly held and indicate the basis of the opinion.
  6.	Negligent advice
  6.1	Content must not consist of or contain any legal, financial, investment, taxation, accountancy, medical or other professional advice, and you must not use the Services to provide any legal, financial, investment, taxation, accountancy, medical or other professional advisory services.
  6.2	Content must not consist of or contain any advice, instructions or other information that may be acted upon and could, if acted upon, cause death, illness or personal injury, damage to property, or any other loss or damage.
  7.	Etiquette
  7.1	Content must be appropriate, civil and tasteful, and accord with generally accepted standards of etiquette and behaviour on the internet.
  7.2	Content must not be offensive, deceptive, threatening, abusive, harassing, menacing, hateful, discriminatory or inflammatory.
  7.3	Content must not be liable to cause annoyance, inconvenience or needless anxiety.
  7.4	You must not use the Services to send any hostile communication or any communication intended to insult, including such communications directed at a particular person or group of people.
  7.5	You must not use the Services for the purpose of deliberately upsetting or offending others.
  7.6	You must not unnecessarily flood the Services with material relating to a particular subject or subject area, whether alone or in conjunction with others.
  7.7	You must ensure that Content does not duplicate other content available through the Services.
  7.8	You must ensure that Content is appropriately categorised.
  7.9	You should use appropriate and informative titles for all Content.
  7.10	You must at all times be courteous and polite to other users of the Services.
  8.	Marketing and spam
  8.1	You must not without our written permission use the Services for any purpose relating to the marketing, advertising, promotion, sale or supply of any product, service or commercial offering.
  8.2	Content must not constitute or contain spam, and you must not use the Services to store or transmit spam - which for these purposes shall include all unlawful marketing communications and unsolicited commercial communications.
  8.3	You must not send any spam or other marketing communications to any person using any email address or other contact details made available through the Services or that you find using the Services.
  8.4	You must not use the Services to promote, host or operate any chain letters, Ponzi schemes, pyramid schemes, matrix programs, multi-level marketing schemes, "get rich quick" schemes or similar letters, schemes or programs.
  8.5	You must not use the Services in any way which is liable to result in the blacklisting of any of our IP addresses.
  9.	Regulated businesses
  9.1	You must not use the Services for any purpose relating to gambling, gaming, betting, lotteries, sweepstakes, prize competitions or any gambling-related activity.
  9.2	You must not use the Services for any purpose relating to the offering for sale, sale or distribution of drugs or pharmaceuticals.
  9.3	You must not use the Services for any purpose relating to the offering for sale, sale or distribution of knives, guns or other weapons.
  10.	Monitoring
  10.1	You acknowledge that we do not actively monitor the Content or the use of the Services.
  11.	Data mining
  11.1	You must not conduct any systematic or automated data scraping, data mining, data extraction or data harvesting, or other systematic or automated data collection activity, by means of or in relation to the Services.
  12.	Hyperlinks
  12.1	You must not link to any material using or by means of the Services that would, if it were made available through the Services, breach the provisions of this Policy.
  13.	Harmful software
  13.1	The Content must not contain or consist of, and you must not promote, distribute or execute by means of the Services, any viruses, worms, spyware, adware or other harmful or malicious software, programs, routines, applications or technologies.
  13.2	The Content must not contain or consist of, and you must not promote, distribute or execute by means of the Services, any software, programs, routines, applications or technologies that will or may have a material negative effect upon the performance of a computer or introduce material security risks to a computer.
  `;
}

export function OwnerRegistration({ open, setOpen }: TProps) {
  const setOwner = useStoreState((state) => state.setOwner);
  const history = useHistory();
  const [termsOpen, setTermsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      companyName: "",
    },
    validate,
    onSubmit: ({ firstName, lastName, email, companyName }) => {
      setLoading(true);
      http
        .registerOwner(
          firstName,
          lastName,
          email,
          companyName,
          getTnc(
            companyName,
            firstName,
            lastName,
            email,
            new Date().toDateString()
          )
        )
        .then((result) => {
          const data = result.data;
          const owner = {
            token: data.token,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            _id: data.user._id,
            walletAddress: data.user.defaultWallet.walletAddress,
          };

          setOwner(owner);
          history.push("/owner");
          setOpen(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            setError(error.response.data);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  return (
    <Dialog onClose={() => {}} maxWidth={false} open={open}>
      <Box style={{ width: "400px" }}>
        <DialogTitle
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          Owner Registration
          <IconButton disabled={loading} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Box sx={{ width: "100%", typography: "body1", padding: 1 }}>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              margin="dense"
              inputProps={{
                autoComplete: "off",
              }}
              label="First Name*"
              name="firstName"
              type="text"
              fullWidth
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={
                formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : ""
              }
            />
            <TextField
              margin="dense"
              label="Last Name*"
              name="lastName"
              type="text"
              fullWidth
              inputProps={{
                autoComplete: "off",
              }}
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={
                formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : ""
              }
            />
            <TextField
              margin="dense"
              label="Email*"
              name="email"
              type="text"
              fullWidth
              inputProps={{
                autoComplete: "off",
              }}
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ""
              }
            />
            <TextField
              margin="dense"
              label="Company Name"
              name="companyName"
              type="text"
              fullWidth
              inputProps={{
                autoComplete: "off",
              }}
              variant="standard"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.companyName && Boolean(formik.errors.companyName)
              }
              helperText={
                formik.touched.companyName && formik.errors.companyName
                  ? formik.errors.companyName
                  : ""
              }
            />
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setTermsOpen(true);
              }}
            >
              Terms and Conditions
            </a>
            <FormGroup>
              <FormControlLabel
                value="I agree to the above terms and conditions"
                checked={true}
                control={<Checkbox />}
                label="I agree to the above terms and conditions"
                labelPlacement="end"
              />
            </FormGroup>
            {!!error && <Alert severity="error">{error}</Alert>}
            <Box sx={{ margin: 2, display: "flex", justifyContent: "center" }}>
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                disabled={loading}
              >
                Register
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Box>
      <Dialog onClose={() => {}} maxWidth={false} open={termsOpen}>
        <Box sx={{ width: 800 }}>
          <Tnc
            setTermsOpen={(isOpen: boolean) => setTermsOpen(isOpen)}
            firstName={formik.values.firstName}
            lastName={formik.values.lastName}
            email={formik.values.email}
            company="company"
          ></Tnc>
        </Box>
      </Dialog>
    </Dialog>
  );
}
