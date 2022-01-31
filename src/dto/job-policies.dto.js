const moment = require('moment');

class JobPolicyDto {
  async encodePolicy(policyObj) {
    let resPolicyObj = {
      "Policy number": policyObj.TXT_POLICY_NO,
      "Expiry date": policyObj.DAT_RENEWAL_EXPIRY_DATE ? moment(policyObj.DAT_RENEWAL_EXPIRY_DATE).format('YYYY-MM-DD') : null,
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

    if(policyObj && policyObj.IPDS_RESULT) {
      const ipdsResult = JSON.parse(policyObj.IPDS_RESULT);
      
      resPolicyObj["UGST/SGST"] = ipdsResult.TotalPremium.ugstsgst; // "you will get it from GST service";
      resPolicyObj["CGST"] = ipdsResult.TotalPremium.cgst; // "you will get it from GST service";
      resPolicyObj["IGST"] = ipdsResult.TotalPremium.igst; // "you will get it from GST service";
      resPolicyObj["Kerala Cess"] = ipdsResult.TotalPremium.keralaCess; // "you will get it from GST service";
    }

    return resPolicyObj;
  }

  async encodeMedicarePolicy(policyObj, member_max_length, othergrid_max_length, ld_max_length) {
    let resPolicyObj = {};

    //proposal columns data
    resPolicyObj["Date of Birth"] = policyObj["DAT_BIRTH_DT"];
    resPolicyObj["Is employee of an organization"] = policyObj["TXT_IS_COMPANY_EMPLOYEE"];
    resPolicyObj["Business type"] = policyObj["TXT_BUSINESS_TYPE"];
    resPolicyObj["Producer Id"] = policyObj["TXT_INTERMEDIARY_CODE"];
    resPolicyObj["Policy Number"] = policyObj["TXT_POLICY_NO_CHAR"];
    resPolicyObj["Variant"] = policyObj["VARIANT"];
    resPolicyObj["Tenure"] = policyObj["TERM"];
    resPolicyObj["Plan type"] = policyObj["PLAN_TYPE"];
    resPolicyObj["Room category"] = policyObj["ROOM_CATEGORY"];
    resPolicyObj["Accidental death rider"] = policyObj["ACCIDENTALDEATHRIDER"];
    resPolicyObj["Is policyholder an insured?"] = policyObj["ISPOLICYHOLDER_INS"];
    resPolicyObj["Total No of Lives"] = policyObj["NUM_NO_OF_LIVES"];
    resPolicyObj["Insured date of Birth"] = policyObj["DAT_BIRTH_DT"];

    let memberColumns = [{
        label: "Insured relationship with proposer",
        value: "RISK_TYPE"
      },
      {
        label: "Cumulative Bonus earned",
        value: "CUMULATIVE_BONUS_EARNED"
      },
      {
        label: "Sum Insured_Member",
        value: "APPLICABLE_SI"
      },
    ];

    let otherGridColumns = [{
      label: "claim status",
      value: "CLAIMSTATUS"
    }];

    let ldColumns = [{
      label: "Risk Level LD/Discount Rate(%)",
      value: "LD_RATE"
    }, ]

    //adding member data
    for (let i = 1; i <= member_max_length; i++) {
      if (i <= policyObj.member_related.length) {
        memberColumns.forEach(obj => {
          if (obj.label == "Sum Insured_Member") {
            if (policyObj["PLAN_TYPE"] == "Individual Basis") {
              resPolicyObj[obj.label + "_" + i] = policyObj["FLOATER_SI"];
            } else {
              resPolicyObj[obj.label + "_" + i] = policyObj.member_related[i - 1][obj.value];
            }
          } else {
            resPolicyObj[obj.label + "_" + i] = policyObj.member_related[i - 1][obj.value];
          }

        })
      } else {
        resPolicyObj[obj.label + "_" + i] = "-";
      }
    }

    //adding othergrid data
    for (let i = 1; i <= othergrid_max_length; i++) {
      if (i <= policyObj.member_related.length) {
        otherGridColumns.forEach(obj => {
          resPolicyObj[obj.label + "_" + i] = policyObj.othergrid_related[i - 1][obj.value];
        })
      } else {
        resPolicyObj[obj.label + "_" + i] = "-";
      }
    }

    //adding ld data
    for (let i = 1; i <= ld_max_length; i++) {
      if (i <= policyObj.member_related.length) {
        ldColumns.forEach(obj => {
          resPolicyObj[obj.label + "_" + i] = policyObj.ld_related[i - 1][obj.value];
        })
      } else {
        resPolicyObj[obj.label + "_" + i] = "-";
      }
    }
    return resPolicyObj;

  }

  async medicareColumnList(member_max_length, othergrid_max_length, ld_max_length) {
    let memberColumns = [{
        label: "Insured relationship with proposer",
        value: "Insured relationship with proposer"
      },
      {
        label: "Cumulative Bonus earned",
        value: "Cumulative Bonus earned"
      },
    ];

    let otherGridColumns = [{
      label: "claim status",
      value: "claim status"
    }];

    let ldColumns = [{
      label: "Risk Level LD/Discount Rate(%)",
      value: "Risk Level LD/Discount Rate(%)"
    }, ]

    let columnsList = [
      //proposal related columns
      {
        label: "Date of Birth",
        value: "Date of Birth"
      },
      {
        label: "Is employee of an organization",
        value: "Is employee of an organization"
      },
      {
        label: "Business type",
        value: "Business type"
      },
      {
        label: "Producer Id",
        value: "Producer Id"
      },
      {
        label: "Policy Number",
        value: "Policy Number"
      },
      {
        label: "Variant",
        value: "Variant"
      },
      {
        label: "Tenure",
        value: "Tenure"
      },
      {
        label: "Plan type",
        value: "Plan type"
      },
      {
        label: "Room category",
        value: "Room category"
      },
      {
        label: "Accidental death rider",
        value: "Accidental death rider"
      },
      {
        label: "Is policyholder an insured?",
        value: "Is policyholder an insured?"
      },
      {
        label: "Total No of Lives",
        value: "Total No of Lives"
      },
      {
        label: "Insured date of Birth",
        value: "Insured date of Birth"
      },
      // {label:"Insured date of Birth_2",value:"Insured date of Birth_2"},
      // {label:"Insured date of Birth_3",value:"Insured date of Birth_3"},
      // {label:"Insured date of Birth_4",value:"Insured date of Birth_4"},
      // {label:"Insured date of Birth_5",value:"Insured date of Birth_5"},
      // {label:"Insured date of Birth_6",value:"Insured date of Birth_6"},
      // {label:"Insured date of Birth_7",value:"Insured date of Birth_7"},
    ]

    for (let i = 1; i <= member_max_length; i++) {
      memberColumns.forEach(obj => {
        obj.label = obj.label + "_" + i;
        obj.value = obj.value + "_" + i;
        columnsList.push(obj);
      })
    }

    for (let i = 1; i <= othergrid_max_length; i++) {
      otherGridColumns.forEach(obj => {
        obj.label = obj.label + "_" + i;
        obj.value = obj.value + "_" + i;
        columnsList.push(obj);
      })
    }

    for (let i = 1; i <= ld_max_length; i++) {
      ldColumns.forEach(obj => {
        obj.label = obj.label + "_" + i;
        obj.value = obj.value + "_" + i;
        columnsList.push(obj);
      })
    }

    return columnsList;
  }

  columnList() {
    return [
      { label: "Policy number", value: "Policy number" },
      { label: "Expiry date", value: "Expiry date" },
      { label: "Fleet code", value: "Fleet code" },
      { label: "Fleet Name", value: "Fleet Name" },
      { label: "Producer Code", value: "Producer Code" },
      { label: "Producer Name", value: "Producer Name" },
      { label: "Sub Producer Name", value: "Sub Producer Name" },
      { label: "Sub Producer Code", value: "Sub Producer Code" },
      { label: "Producer Type", value: "Producer Type" },
      { label: "Dealer code", value: "Dealer code" },
      { label: "office location name", value: "office location name" },
      { label: "Office location code", value: "Office location code" },
      { label: "Manufacturer Name", value: "Manufacturer Name" },
      { label: "Manufacture Code", value: "Manufacture Code" },
      { label: "Model Name", value: "Model Name" },
      { label: "Model Code", value: "Model Code" },
      { label: "Variant name", value: "Variant name" },
      { label: "Variant code", value: "Variant code" },
      { label: "Manufacturing year", value: "Manufacturing year" },
      { label: "Segment", value: "Segment" },
      { label: "Segment code", value: "Segment code" },
      { label: "Body type", value: "Body type" },
      { label: "Fuel type", value: "Fuel type" },
      { label: "Fuel type code", value: "Fuel type code" },
      { label: "Vehicle Usage", value: "Vehicle Usage" },
      { label: "GVW", value: "GVW" },
      { label: "Type Of bus", value: "Type Of bus" },
      { label: "Cubic capacity / KW", value: "Cubic capacity / KW" },
      { label: "Seating Capacity", value: "Seating Capacity" },
      { label: "RTO location", value: "RTO location" },
      { label: "RTO Code", value: "RTO Code" },
      { label: "Tariff zone", value: "Tariff zone" },
      { label: "UW Zone", value: "UW Zone" },
      { label: "RTO Cluster code", value: "RTO Cluster code" },
      { label: "RTO Cluster Name", value: "RTO Cluster Name" },
      { label: "Renewal vehicle IDV year", value: "Renewal vehicle IDV year" },
      { label: "CNG/LPG Kit IDV", value: "CNG/LPG Kit IDV" },
      { label: "Renewal NCB", value: "Renewal NCB" },
      { label: "Dep No of claims", value: "Dep No of claims" },
      { label: "Depreciation reimbursement premium", value: "Depreciation reimbursement premium" },
      { label: "Engine secure option", value: "Engine secure option" },
      { label: "Tyre secure option", value: "Tyre secure option" },
      { label: "Renewal Underwriting loading", value: "Renewal Underwriting loading" },
      { label: "Renewal Underwriting discount", value: "Renewal Underwriting discount" },
      { label: "Renewal loading / Discount", value: "Renewal loading / Discount" },
      { label: "TPPD Liability", value: "TPPD Liability" },
      { label: "Basic TP Premium", value: "Basic TP Premium" },
      { label: "TPPD Premium", value: "TPPD Premium" },
      { label: "CNG Kit TP", value: "CNG Kit TP" },
      { label: "Renewal Status", value: "Renewal Status" },
      { label: "Decline Reason", value: "Decline Reason" },
      { label: "RN Override", value: "RN Override" },
      { label: "Renewal Flag", value: "Renewal Flag" },
      { label: "Campaign Rate code", value: "Campaign Rate code" },
      { label: "Tagic Rate code", value: "Tagic Rate code" },
      { label: "Decline rule code", value: "Decline rule code" },
      { label: "Reference Number", value: "Reference Number" },
      { label: "Policy Number", value: "Policy Number" },
      { label: "Alternate policy number", value: "Alternate policy number" },
      { label: "Renewal inception date", value: "Renewal inception date" },
      { label: "Renewal expiry date", value: "Renewal expiry date" },
      { label: "Policy Start Time", value: "Policy Start Time" },
      { label: "Policy Expiry Time", value: "Policy Expiry Time" },
      { label: "Previous policy period in days", value: "Previous policy period in days" },
      { label: "Certificate Number", value: "Certificate Number" },
      { label: "Renewal certificate number", value: "Renewal certificate number" },
      { label: "renewal count", value: "renewal count" },
      { label: "Financier Name", value: "Financier Name" },
      { label: "Agreement Type", value: "Agreement Type" },
      { label: "Customer ID", value: "Customer ID" },
      { label: "Customer type", value: "Customer type" },
      { label: "Customer name", value: "Customer name" },
      { label: "Salutation", value: "Salutation" },
      { label: "Date of Birth", value: "Date of Birth" },
      { label: "Gender", value: "Gender" },
      { label: "Email ID", value: "Email ID" },
      { label: "Is office address same as mailing address", value: "Is office address same as mailing address" },
      { label: "Home/ Office Address Line 1", value: "Home/ Office Address Line 1" },
      { label: "Home/ Office Address Line 2", value: "Home/ Office Address Line 2" },
      { label: "Home/ Office Address Line 3", value: "Home/ Office Address Line 3" },
      { label: "Home/ Office Address Pin Code", value: "Home/ Office Address Pin Code" },
      { label: "Home/ Office Address District", value: "Home/ Office Address District" },
      { label: "Home/ Office Address State", value: "Home/ Office Address State" },
      { label: "Home/ Office Mobile", value: "Home/ Office Mobile" },
      { label: "Home/ Office STD Landline No", value: "Home/ Office STD Landline No" },
      { label: "Home/ Office Fax No", value: "Home/ Office Fax No" },
      { label: "Office Location/Code", value: "Office Location/Code" },
      { label: "Mailing Addr Line 1", value: "Mailing Addr Line 1" },
      { label: "Mailing Addr Line 2", value: "Mailing Addr Line 2" },
      { label: "Mailing Addr Line 3", value: "Mailing Addr Line 3" },
      { label: "Mailing Pincode", value: "Mailing Pincode" },
      { label: "Mailing District", value: "Mailing District" },
      { label: "Mailing State", value: "Mailing State" },
      { label: "Mailing Telephone", value: "Mailing Telephone" },
      { label: "Service Tax Exepmtion category", value: "Service Tax Exepmtion category" },
      { label: "Product Code", value: "Product Code" },
      { label: "Product Name", value: "Product Name" },
      { label: "Policy Plan", value: "Policy Plan" },
      { label: "OD Tenure", value: "OD Tenure" },
      { label: "TP Tenure", value: "TP Tenure" },
      { label: "Date of Purchase / Registration", value: "Date of Purchase / Registration" },
      { label: "Date of first registration", value: "Date of first registration" },
      { label: "Vehicle Age", value: "Vehicle Age" },
      { label: "Registration Number", value: "Registration Number" },
      { label: "Engine Number", value: "Engine Number" },
      { label: "Chassis number", value: "Chassis number" },
      { label: "Ex Showroom Price", value: "Ex Showroom Price" },
      { label: "Previous year vehicle IDV", value: "Previous year vehicle IDV" },
      { label: "Non Electrical Accessories IDV", value: "Non Electrical Accessories IDV" },
      { label: "Electrical Accessories IDV", value: "Electrical Accessories IDV" },
      { label: "Bangladesh", value: "Bangladesh" },
      { label: "Bhutan", value: "Bhutan" },
      { label: "Maldives", value: "Maldives" },
      { label: "Nepal", value: "Nepal" },
      { label: "Pakistan", value: "Pakistan" },
      { label: "Srilanka", value: "Srilanka" },
      { label: "Theft and Conversion by Hirer-IMT 43", value: "Theft and Conversion by Hirer-IMT 43" },
      { label: "Cover Lamp, Tyre ,Tubes-IMT 23", value: "Cover Lamp, Tyre ,Tubes-IMT 23" },
      { label: "Commercial & Private purpose_OD  IMT-34", value: "Commercial & Private purpose_OD  IMT-34" },
      { label: "Overturning loading _OD IMT-47", value: "Overturning loading _OD IMT-47" },
      { label: "PA Unnamed Hirer IMT-18", value: "PA Unnamed Hirer IMT-18" },
      { label: "LL to FPP IMT-38", value: "LL to FPP IMT-38" },
      { label: "LL to NFPP EMP IMT-37", value: "LL to NFPP EMP IMT-37" },
      { label: "LL to NFPP NOT EMP IMT-37 A", value: "LL to NFPP NOT EMP IMT-37 A" },
      { label: "Hired Vehicle DRN by Hirer  IMT-35", value: "Hired Vehicle DRN by Hirer  IMT-35" },
      { label: "Indemnity to Hirer , Neg of Insrd IMT-36", value: "Indemnity to Hirer , Neg of Insrd IMT-36" },
      { label: "Indemnity to Hirer Neg of Own IMT-44", value: "Indemnity to Hirer Neg of Own IMT-44" },
      { label: "LL to Pasngr excld employee IMT-46", value: "LL to Pasngr excld employee IMT-46" },
      { label: "Commercial & Private purpose_TP  34", value: "Commercial & Private purpose_TP  34" },
      { label: "LL to person empld in connection IMT-39", value: "LL to person empld in connection IMT-39" },
      { label: "Indemnity to hirer IMT-45", value: "Indemnity to hirer IMT-45" },
      { label: "LL to more than 6 emp in GCV IMT-39 A", value: "LL to more than 6 emp in GCV IMT-39 A" },
      { label: "Own Premises Discount_OD IMT-13", value: "Own Premises Discount_OD IMT-13" },
      { label: "Own Site Discount_OD IMT-14", value: "Own Site Discount_OD IMT-14" },
      { label: "CWP", value: "CWP" },
      { label: "Previous year Claim count OD", value: "Previous year Claim count OD" },
      { label: "Previous year Claim count TP", value: "Previous year Claim count TP" },
      { label: "Previous year Claim count addon", value: "Previous year Claim count addon" },
      { label: "Previous year Claim Amount OD", value: "Previous year Claim Amount OD" },
      { label: "Trailer Registration Number", value: "Trailer Registration Number" },
      { label: "Trailer Chasis Number", value: "Trailer Chasis Number" },
      { label: "Is RN Generated", value: "Is RN Generated" },
      { label: "Dep no of claims incurred in previous year", value: "Dep no of claims incurred in previous year" },
      { label: "NUM_PREVIOUSYEAR_PREM", value: "NUM_PREVIOUSYEAR_PREM" },
      { label: "TXT_PREVIOUS_POLICY_PLAN", value: "TXT_PREVIOUS_POLICY_PLAN" },
      { label: "TXT_PREVIOUSPOLICYTYPE", value: "TXT_PREVIOUSPOLICYTYPE" },
      { label: "NUM_PREVIOUS_TOTAL_IDV", value: "NUM_PREVIOUS_TOTAL_IDV" },
      { label: "NUM_PREVIOUSYEARNCB", value: "NUM_PREVIOUSYEARNCB" },
      { label: "Fleet Policy reference no", value: "Fleet Policy reference no" },
      { label: "Fleet Policy Rate", value: "Fleet Policy Rate" },
      { label: "Fleet COA %", value: "Fleet COA %" },
      { label: "Policy Cover variant", value: "Policy Cover variant" },
      { label: "Categorization of age", value: "Categorization of age" },
      { label: "Difference in IDV %", value: "Difference in IDV %" },
      { label: "Trailer IDV", value: "Trailer IDV" },
      { label: "Total IDV", value: "Total IDV" },
      { label: "Tariff Rate", value: "Tariff Rate" },
      { label: "GLM Rate", value: "GLM Rate" },
      { label: "Applied Rate", value: "Applied Rate" },
      { label: "Previous year basis of rating", value: "Previous year basis of rating" },
      { label: "Renewal basis of rating", value: "Renewal basis of rating" },
      { label: "Basic OD premium", value: "Basic OD premium" },
      { label: "OD premium after loading/discount", value: "OD premium after loading/discount" },
      { label: "Non electrical accessories OD premium", value: "Non electrical accessories OD premium" },
      { label: "Electrical Acessories OD premium", value: "Electrical Acessories OD premium" },
      { label: "CNG/LPG Kit OD Premium", value: "CNG/LPG Kit OD Premium" },
      { label: "GVW Premium ", value: "GVW Premium " },
      { label: "GVW Premium after discount ", value: "GVW Premium after discount " },
      { label: "Surcharge ", value: "Surcharge " },
      { label: "Surcharge-OD Premium after Discount", value: "Surcharge-OD Premium after Discount" },
      { label: "Own damage cover for Trailers", value: "Own damage cover for Trailers" },
      { label: "Additional Towing Charges", value: "Additional Towing Charges" },
      { label: "OD cover Fiber Glass Tank", value: "OD cover Fiber Glass Tank" },
      { label: "Geographical Extension OD", value: "Geographical Extension OD" },
      { label: "Anti Theft Device discount", value: "Anti Theft Device discount" },
      { label: "Automobile Association Discount", value: "Automobile Association Discount" },
      { label: "Previous Year NCB", value: "Previous Year NCB" },
      { label: "Previous Year Protected NCB", value: "Previous Year Protected NCB" },
      { label: "Renewal protected NCB", value: "Renewal protected NCB" },
      { label: "Previous year NCB Amount", value: "Previous year NCB Amount" },
      { label: "Renewal NCB amount", value: "Renewal NCB amount" },
      { label: "Renewal NCB amount", value: "Renewal NCB amount" },
      { label: "Engine Secure Premium", value: "Engine Secure Premium" },
      { label: "Tyre Secure Premium", value: "Tyre Secure Premium" },
      { label: "Consumable expenses Premium", value: "Consumable expenses Premium" },
      { label: "Return to Invoice premium", value: "Return to Invoice premium" },
      { label: "NCB protection Opted last year", value: "NCB protection Opted last year" },
      { label: "NCB Protection No. Of claims", value: "NCB Protection No. Of claims" },
      { label: "NCB Protection Premium", value: "NCB Protection Premium" },
      { label: "Daily Allowance Premium", value: "Daily Allowance Premium" },
      { label: "Daily Allowance limit", value: "Daily Allowance limit" },
      { label: "Courtesy Hire", value: "Courtesy Hire" },
      { label: "Key replacement SI", value: "Key replacement SI" },
      { label: "Key Replacement Premium", value: "Key Replacement Premium" },
      { label: "Loss of personal belongings SI", value: "Loss of personal belongings SI" },
      { label: "Loss of Personal belonging Premium", value: "Loss of Personal belonging Premium" },
      { label: "Emergency Transport SI", value: "Emergency Transport SI" },
      { label: "Emergency Transport Hotel Premium", value: "Emergency Transport Hotel Premium" },
      { label: "RSA Premium", value: "RSA Premium" },
      { label: "Prem_EMI Protector ", value: "Prem_EMI Protector " },
      { label: "CSI_Emergency Medical expenses", value: "CSI_Emergency Medical expenses" },
      { label: "Prem_Emergency Medical exp", value: "Prem_Emergency Medical exp" },
      { label: "CSI_RIM Guard", value: "CSI_RIM Guard" },
      { label: "Prem_Rim Guard", value: "Prem_Rim Guard" },
      { label: "CSI_Addtnl Transport Cost", value: "CSI_Addtnl Transport Cost" },
      { label: "Prem_Addtnl Transport Cost", value: "Prem_Addtnl Transport Cost" },
      { label: "CSI_Loss of Equipments", value: "CSI_Loss of Equipments" },
      { label: "Prem_Loss of Equipments", value: "Prem_Loss of Equipments" },
      { label: "Prem_Loss of Income", value: "Prem_Loss of Income" },
      { label: "CSI_Addtional PA Own Drvr", value: "CSI_Addtional PA Own Drvr" },
      { label: "Prem_Addtional PA Own Drvr", value: "Prem_Addtional PA Own Drvr" },
      { label: "CSI_Additional PA for employee", value: "CSI_Additional PA for employee" },
      { label: "Prem_Additional PA for employee", value: "Prem_Additional PA for employee" },
      { label: "CSI_Additional TPPD", value: "CSI_Additional TPPD" },
      { label: "Prem_Additional TPPD", value: "Prem_Additional TPPD" },
      { label: "Previous year loading/ discount", value: "Previous year loading/ discount" },
      { label: "Agri and tractors with Trailers-Extended Cover IMT-48", value: "Agri and tractors with Trailers-Extended Cover IMT-48" },
      { label: "Own Premises Discount_TP", value: "Own Premises Discount_TP" },
      { label: "Own Site Discount_TP", value: "Own Site Discount_TP" },
      { label: "Third Party cover for trailers", value: "Third Party cover for trailers" },
      { label: "PA to Owner Driver", value: "PA to Owner Driver" },
      { label: "PA cover term", value: "PA cover term" },
      { label: "PA to unnamed passanger", value: "PA to unnamed passanger" },
      { label: "SI for Unnamed Passengers", value: "SI for Unnamed Passengers" },
      { label: "Number of Unnamed passengers", value: "Number of Unnamed passengers" },
      { label: "PA to named passanger", value: "PA to named passanger" },
      { label: "SI PA Cover Named Persons", value: "SI PA Cover Named Persons" },
      { label: "Number of Named Persons", value: "Number of Named Persons" },
      { label: "PA to Paid Driver", value: "PA to Paid Driver" },
      { label: "SI for driver/cleaner/conductor", value: "SI for driver/cleaner/conductor" },
      { label: "Number driver/cleaner/conductor", value: "Number driver/cleaner/conductor" },
      { label: "LL to Paid Driver", value: "LL to Paid Driver" },
      { label: "LL to employees", value: "LL to employees" },
      { label: "LL to soldier / sailor / airman", value: "LL to soldier / sailor / airman" },
      { label: "Geographical Extension TP", value: "Geographical Extension TP" },
      { label: "TP Premium Per passeneger", value: "TP Premium Per passeneger" },
      { label: "Effective TP Premium", value: "Effective TP Premium" },
      { label: "Total Premium before tax", value: "Total Premium before tax" },
      { label: "Total Renewal Premium without Add-on", value: "Total Renewal Premium without Add-on" },
      { label: "Total Renewal Premium with Add-on", value: "Total Renewal Premium with Add-on" },
      { label: "Any transfer of insurance in previous policy", value: "Any transfer of insurance in previous policy" },
      { label: "Any endorsement pending under previous policy", value: "Any endorsement pending under previous policy" },
      { label: "Previous year claim count", value: "Previous year claim count" },
      { label: "Previous year claim amount", value: "Previous year claim amount" },
      { label: "Loss description", value: "Loss description" },
      { label: "Previous year Claim Amount TP", value: "Previous year Claim Amount TP" },
      { label: "Previous year Claim Amount Addon", value: "Previous year Claim Amount Addon" },
      { label: "key replacement count", value: "key replacement count" },
      { label: "historical claim count", value: "historical claim count" },
      { label: "incurred historical claim amount", value: "incurred historical claim amount" },
      { label: "PA Nominee Name", value: "PA Nominee Name" },
      { label: "PA Relationship", value: "PA Relationship" },
      { label: "Imposed Excess amount", value: "Imposed Excess amount" },
      { label: "Renewal Generation Date", value: "Renewal Generation Date" },
      { label: "RN Print Required", value: "RN Print Required" },
      { label: "Moratorium code", value: "Moratorium code" },
      { label: "Addon eligibility code", value: "Addon eligibility code" },
      { label: "Add on exception code", value: "Add on exception code" },
      { label: "Renewal UW rule code", value: "Renewal UW rule code" },
      { label: "Moratorium Exception code", value: "Moratorium Exception code" },
      { label: "Rating Exception code", value: "Rating Exception code" },
      { label: "Renewal Rule Exception code", value: "Renewal Rule Exception code" },
      { label: "Decline Exception code", value: "Decline Exception code" },
      { label: "Vehicle Laid Up Adjustment", value: "Vehicle Laid Up Adjustment" },
      { label: "Updated By", value: "Updated By" },
      { label: "Update Date", value: "Update Date" },
      { label: "Process Name", value: "Process Name" },
      { label: "RN Modification Date", value: "RN Modification Date" },
      { label: "CAQ Date", value: "CAQ Date" },
      { label: "EAQ Date", value: "EAQ Date" },
      { label: "Inbuilt CNG/LPG kit OD Premium", value: "Inbuilt CNG/LPG kit OD Premium" },
      { label: "Renewal extract Status Flag", value: "Renewal extract Status Flag" },
      { label: "Flag Description_Error", value: "Flag Description_Error" },
    ];
  }
}

module.exports = JobPolicyDto;