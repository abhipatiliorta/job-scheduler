const moment = require('moment');

class JobPolicyDto {
  encodePolicy(policyObj) {
    const ipdsResult = JSON.parse(policyObj.IPDS_RESULT);
    let resPolicyObj = {
      "Policy number": policyObj.TXT_POLICY_NO,
      "Expiry date": moment(policyObj.DAT_RENEWAL_EXPIRY_DATE).format('YYYY-MM-DD'),
      "Fleet code": policyObj.TXT_FLEET_CD,
      "Fleet Name": policyObj.TXT_FLEET_NAME,
      "Producer Code": policyObj.TXT_PRODUCER_CD,
      "Producer Name": policyObj.TXT_PRODUCT_NAME,
      "Sub Producer Name": null,
      "Sub Producer Code": policyObj.TXT_SUB_PRODUCER_CD,
      "Producer Type": policyObj.TXT_PRODUCER_TYPE,
      "Dealer code": policyObj.TXT_DEALER_CODE,
      "office location name": policyObj.TXT_OFFICEBRANCHLOCATIONNAME,
      "Office location code": policyObj.TXT_OFFICEBRANCHLOCATIONCODE,
      "Manufacturer Name": policyObj.TXT_VEICHLE_MAKE_NAME,
      "Manufacture Code": policyObj.TXT_MANUFACTURECODE,
      "Model Name": policyObj.TXT_VEICHLE_MOD_NAME,
      "Model Code": policyObj.TXT_MODEL_CODE,
      "Variant name": policyObj.TXT_VARIANT,
      "Variant code": policyObj.TXT_VARIANT_CODE,
      "Manufacturing year": policyObj.NUM_VEICHLE_MAKE_YR,
      "Segment": policyObj.TXT_SEGMENT,
      "Segment code": policyObj.TXT_SEGMENTCODE,
      "Body type": policyObj.TXT_BODY_TYPE,
      "Fuel type": policyObj.TXT_FUEL_TYPE,
      "Fuel type code": policyObj.TXT_FUELTYPECODE,
      "Vehicle Usage": policyObj.TXT_VEHICLE_USAGE,
      "GVW": policyObj.NUM_GVW,
      "Type Of bus": null,
      "Cubic capacity / KW": policyObj.NUM_CUBIC_CAPACITY,
      "Seating Capacity": policyObj.NUM_SEATINGCAPACITY,
      "RTO location": policyObj.TXT_RTO_LOC,
      "RTO Code": policyObj.TXT_RTO_LOC_CODE,
      "Tariff zone": null,
      "UW Zone": policyObj.TXT_UW_ZONE_NAME,
      "RTO Cluster code": null,
      "RTO Cluster Name": null,
      "Renewal vehicle IDV year": null,
      "CNG/LPG Kit IDV": policyObj.NUM_CNGORLPGKITIDV,
      "Renewal NCB": null,
      "Dep No of claims": null,
      "Depreciation reimbursement premium": null,
      "Engine secure option": null,
      "Tyre secure option": null,
      "Renewal Underwriting loading": null,
      "Renewal Underwriting discount": null,
      "Renewal loading / Discount": null,
      "TPPD Liability": null,
      "Basic TP Premium": null,
      "TPPD Premium": null,
      "CNG Kit TP": null,
      "Renewal Status": null,
      "Decline Reason": null,
      "RN Override": null,
      "Renewal Flag": null,
      "Campaign Rate code": null,
      "Tagic Rate code": null,
      "Decline rule code": null,

      "Reference Number": policyObj.NUM_REFERENCE_NUMBER,
      "Policy Number": policyObj.TXT_POLICY_NO,
      "Alternate policy number": policyObj.NUM_ALTERNATEPOLICY_NUMBER,
      "Renewal inception date": policyObj.DAT_RENEWAL_INCEPTION_DATE,
      "Renewal expiry date": policyObj.DAT_RENEWAL_EXPIRY_DATE,
      "Policy Start Time": policyObj.TXT_POLICYSTARTTIME,
      "Policy Expiry Time": policyObj.TXT_POLICYEXPIRYTIME,
      "Previous policy period in days": policyObj.NUM_PREV_POL_PRD_IN_DAYS,
      "Certificate Number": policyObj.TXT_CERTIFICATE_NO,
      "Renewal certificate number": policyObj.TXT_RENL_CERT_NO,
      "renewal count": policyObj.TXT_RENEWAL_COUNT,
      "Financier Name": policyObj.TXT_FIN_INSTITUTION,
      "Agreement Type": policyObj.TXT_AGREEMENT_TYPE,
      "Customer ID": policyObj.TXT_CUSTOMER_ID,
      "Customer type": policyObj.TXT_CUSTOMERTYPE,
      "Customer name": policyObj.TXT_CLIENT_NAME,
      "Salutation": policyObj.TXT_SALUTATION,
      "Date of Birth": policyObj.DAT_DATE_OF_BIRTH,
      "Gender": policyObj.TXT_GENDER,
      "Email ID": policyObj.TXT_EMAIL_ID,
      "Is office address same as mailing address": policyObj.TXT_IS_OFFICE_ADDRESS_SAME,
      "Home/ Office Address Line 1": policyObj.TXT_HOME_OFFICE_ADDRESS_LINE_1,
      "Home/ Office Address Line 2": policyObj.TXT_HOME_OFFICE_ADDRESS_LINE_2,
      "Home/ Office Address Line 3": policyObj.TXT_HOME_OFFICE_ADDRESS_LINE_3,
      "Home/ Office Address Pin Code": policyObj.TXT_HOME_OFFICE_ADDRE_PIN_CODE,
      "Home/ Office Address District": policyObj.TXT_HOME_OFFICE_ADDRE_DISTRICT,
      "Home/ Office Address State": policyObj.TXT_HOME_OFFICE_ADDRESS_STATE,
      "Home/ Office Mobile": policyObj.TXT_HOME_OFFICE_MOBILE,
      "Home/ Office STD Landline No": policyObj.TXT_HOME_OFFICE_STD_LANDLIN_NO,
      "Home/ Office Fax No": policyObj.TXT_HOME_OFFICE_FAX_NO,
      "Office Location/Code": policyObj.TXT_OFFICE_LOCATION_CODE,
      "Mailing Addr Line 1": policyObj.TXT_MAILING_ADDR_LINE_1,
      "Mailing Addr Line 2": policyObj.TXT_MAILING_ADDR_LINE_2,
      "Mailing Addr Line 3": policyObj.TXT_MAILING_ADDR_LINE_3,
      "Mailing Pincode": policyObj.TXT_MAILING_PINCODE,
      "Mailing District": policyObj.TXT_MAILING_DISTRICT,
      "Mailing State": policyObj.TXT_MAILING_STATE,
      "Mailing Telephone": policyObj.TXT_MAILING_TELEPHONE,
      "Service Tax Exepmtion category": policyObj.TXT_SRVC_TAX_EXEMT_CTGRY,
      "Product Code": policyObj.NUM_PRODUCT_CODE,
      "Product Name": policyObj.TXT_PRODUCT_NAME,
      "Policy Plan": policyObj.TXT_POLICY_PLAN,
      "OD Tenure": policyObj.NUM_ODTENURE,
      "TP Tenure": policyObj.NUM_TPTENURE,
      "Date of Purchase / Registration": policyObj.DAT_DATEOFREGISTRATION,
      "Date of first registration": policyObj.DAT_DATEOFFIRSTREGISTRATION,
      "Vehicle Age": policyObj.VEHICLE_AGE,
      "Registration Number": policyObj.TXT_REGISTRATIONNUMBER,
      "Engine Number": policyObj.TXT_ENGINE_NO,
      "Chassis number": policyObj.TXT_CHAIS_NO,
      "Ex Showroom Price": policyObj.NUM_EXSHOWROOMPRICE,
      "Previous year vehicle IDV": policyObj.NUM_PREV_IDV,
      "Non Electrical Accessories IDV": policyObj.NUM_NON_ELE_ACCESSORIES,
      "Electrical Accessories IDV": policyObj.NUM_ELE_ACCESSORIES,
      "Bangladesh": policyObj.BANGLADESH,
      "Bhutan": policyObj.BHUTAN,
      "Maldives": policyObj.MALDIVES,
      "Nepal": policyObj.NEPAL,
      "Pakistan": policyObj.PAKISTAN,
      "Srilanka": policyObj.SRI_LANKA,
      "Theft and Conversion by Hirer-IMT 43": policyObj.TXT_HASTHFT_CNVRSN_HIRERIMT43,
      "Cover Lamp, Tyre ,Tubes-IMT 23": policyObj.TXT_HASCVRLAMP_TYRTUBESIMT_23,
      "Commercial & Private purpose_OD  IMT-34": policyObj.TXT_HASCOMMERCIALPRVT_ODIMT_34,
      "Overturning loading _OD IMT-47": policyObj.TXT_HAS_OVRTRNING_LDG_ODIMT_47,
      "PA Unnamed Hirer IMT-18": policyObj.TXT_HASPACOVERFORUNNAMEDPASS,
      "LL to FPP IMT-38": policyObj.TXT_HAS_LL_TO_FPP_IMT_38,
      "LL to NFPP EMP IMT-37": policyObj.TXT_HAS_LL_TO_NFPP_EMP_IMT_37,
      "LL to NFPP NOT EMP IMT-37 A": policyObj.TXT_HASLLTONFPPNOTEMPIMT37A,
      "Hired Vehicle DRN by Hirer  IMT-35": policyObj.TXT_HASHIREVEHDRIVHIREIMT35,
      "Indemnity to Hirer , Neg of Insrd IMT-36": policyObj.TXT_HAS_INDM_TO_HIREIMT_36,
      "Indemnity to Hirer Neg of Own IMT-44": policyObj.TXT_HAS_IDMN_HIRER_IMT_44,
      "LL to Pasngr excld employee IMT-46": policyObj.TXT_HASLEGALLIABTOEMPLOYEES,
      "Commercial & Private purpose_TP  34": policyObj.TXT_HASCOMMERCIALPRVT_ODIMT_34,
      "LL to person empld in connection IMT-39": policyObj.TXT_LL_TO_PRSN_EMPLDIMT_39,
      "Indemnity to hirer IMT-45": policyObj.TXT_HAS_IDMN_HIRER_IMT_45,
      "LL to more than 6 emp in GCV IMT-39 A": policyObj.TXT_LL_UNDER_IMT_39A,
      "Own Premises Discount_OD IMT-13": policyObj.TXT_LMTEDTOOWNPREMDISOPTPREVYR,
      "Own Site Discount_OD IMT-14": policyObj.TXT_HASOWNSITEDISC_OD_IMT_14,
      "CWP": policyObj.TXT_ISCWP,
      "Previous year Claim count OD": policyObj.NUM_PREV_YEARTOTALODCLAIMCOUNT,
      "Previous year Claim count TP": policyObj.NUM_PREVYEARTOTALTPCLAIMCOUNT,
      "Previous year Claim count addon": policyObj.NUM_TOTALADDONCLAIMCOUNT,
      "Previous year Claim Amount OD": policyObj.NUM_PREVIOUSYEARCLAIMAMOUNTOD,
      "Trailer Registration Number": policyObj.REGISTRATION_NO,
      "Trailer Chasis Number": policyObj.CHASSIS_NO,
      "Is RN Generated": policyObj.TXT_ISRNGENERATED,
      "Dep no of claims incurred in previous year": policyObj.NUM_DEPNOOFCLAIMSOPTEDPREVYEAR,
      "NUM_PREVIOUSYEAR_PREM": policyObj.NUM_PREVIOUSYEAR_PREM,
      "TXT_PREVIOUS_POLICY_PLAN": policyObj.TXT_PREVIOUS_POLICY_PLAN,
      "TXT_PREVIOUSPOLICYTYPE": policyObj.TXT_PREVIOUSPOLICYTYPE,
      "NUM_PREVIOUS_TOTAL_IDV": policyObj.NUM_PREVIOUS_TOTAL_IDV,
      "NUM_PREVIOUSYEARNCB": policyObj.NUM_PREVIOUSYEARNCB,

      "UGST/SGST": ipdsResult.TotalPremium.ugstsgst, // "you will get it from GST service",
      "CGST": ipdsResult.TotalPremium.cgst, // "you will get it from GST service",
      "IGST": ipdsResult.TotalPremium.igst, // "you will get it from GST service",
      "Kerala Cess": ipdsResult.TotalPremium.keralaCess, // "you will get it from GST service",

      "Fleet Policy reference no": null,
      "Fleet Policy Rate": null,
      "Fleet COA %": null,
      "Policy Cover variant": null,
      "Categorization of age": null,
      "Difference in IDV %": null,
      "Trailer IDV": null,
      "Total IDV": null,
      "Tariff Rate": null,
      "GLM Rate": null,
      "Applied Rate": null,
      "Previous year basis of rating": null,
      "Renewal basis of rating": null,
      "Basic OD premium": null,
      "OD premium after loading/discount": null,
      "Non electrical accessories OD premium": null,
      "Electrical Acessories OD premium": null,
      "CNG/LPG Kit OD Premium": null,
      "GVW Premium ": null,
      "GVW Premium after discount ": null,
      "Surcharge ": null,
      "Surcharge-OD Premium after Discount": null,
      "Own damage cover for Trailers": null,
      "Additional Towing Charges": null,
      "OD cover Fiber Glass Tank": null,
      "Geographical Extension OD": null,
      "Anti Theft Device discount": null,
      "Automobile Association Discount": null,
      "Previous Year NCB": null,
      "Previous Year Protected NCB": null,
      "Renewal protected NCB": null,
      "Previous year NCB Amount": null,
      "Renewal NCB amount": null,
      "Renewal NCB amount": null,
      "Engine Secure Premium": null,
      "Tyre Secure Premium": null,
      "Consumable expenses Premium": null,
      "Return to Invoice premium": null,
      "NCB protection Opted last year": null,
      "NCB Protection No. Of claims": null,
      "NCB Protection Premium": null,
      "Daily Allowance Premium": null,
      "Daily Allowance limit": null,
      "Courtesy Hire": null,
      "Key replacement SI": null,
      "Key Replacement Premium": null,
      "Loss of personal belongings SI": null,
      "Loss of Personal belonging Premium": null,
      "Emergency Transport SI": null,
      "Emergency Transport Hotel Premium": null,
      "RSA Premium": null,
      "Prem_EMI Protector ": null,
      "CSI_Emergency Medical expenses": null,
      "Prem_Emergency Medical exp": null,
      "CSI_RIM Guard": null,
      "Prem_Rim Guard": null,
      "CSI_Addtnl Transport Cost": null,
      "Prem_Addtnl Transport Cost": null,
      "CSI_Loss of Equipments": null,
      "Prem_Loss of Equipments": null,
      "Prem_Loss of Income": null,
      "CSI_Addtional PA Own Drvr": null,
      "Prem_Addtional PA Own Drvr": null,
      "CSI_Additional PA for employee": null,
      "Prem_Additional PA for employee": null,
      "CSI_Additional TPPD": null,
      "Prem_Additional TPPD": null,
      "Previous year loading/ discount": null,
      "Agri and tractors with Trailers-Extended Cover IMT-48": null,
      "Own Premises Discount_TP": null,
      "Own Site Discount_TP": null,
      "Third Party cover for trailers": null,
      "PA to Owner Driver": null,
      "PA cover term": null,
      "PA to unnamed passanger": null,
      "SI for Unnamed Passengers": null,
      "Number of Unnamed passengers": null,
      "PA to named passanger": null,
      "SI PA Cover Named Persons": null,
      "Number of Named Persons": null,
      "PA to Paid Driver": null,
      "SI for driver/cleaner/conductor": null,
      "Number driver/cleaner/conductor": null,
      "LL to Paid Driver": null,
      "LL to employees": null,
      "LL to soldier / sailor / airman": null,
      "Geographical Extension TP": null,
      "TP Premium Per passeneger": null,
      "Effective TP Premium": null,
      "Total Premium before tax": null,
      "Total Renewal Premium without Add-on": null,
      "Total Renewal Premium with Add-on": null,
      "Any transfer of insurance in previous policy": null,
      "Any endorsement pending under previous policy": null,
      "Previous year claim count": null,
      "Previous year claim amount": null,
      "Loss description": null,
      "Previous year Claim Amount TP": null,
      "Previous year Claim Amount Addon": null,
      "key replacement count": null,
      "historical claim count": null,
      "incurred historical claim amount": null,
      "PA Nominee Name": null,
      "PA Relationship": null,
      "Imposed Excess amount": null,
      "Renewal Generation Date": null,
      "RN Print Required": null,
      "Moratorium code": null,
      "Addon eligibility code": null,
      "Add on exception code": null,
      "Renewal UW rule code": null,
      "Moratorium Exception code": null,
      "Rating Exception code": null,
      "Renewal Rule Exception code": null,
      "Decline Exception code": null,
      "Vehicle Laid Up Adjustment": null,
      "Updated By": null,
      "Update Date": null,
      "Process Name": null,
      "RN Modification Date": null,
      "CAQ Date": null,
      "EAQ Date": null,
      "Inbuilt CNG/LPG kit OD Premium": null,
      "Renewal extract Status Flag": null,
      "Flag Description_Error": null,
    };

    return resPolicyObj;
  }
}

module.exports = JobPolicyDto;