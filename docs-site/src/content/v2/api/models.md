---
title: "İstek ve yanıt modelleri"
description: "Seçilmiş operasyonların transitif OpenAPI model referansı."
group: "API referansı"
---

## Şema alanlarını okuma

Aşağıdaki tablolar indirilen OpenAPI’den üretilmiştir. Required=Hayır, uygulamanın alanı boş göndermesi gerektiği anlamına gelmez; yerel iş kuralı daha sıkı olabilir. Nullable ve required farklıdır. Örneklerdeki UUID ve statüler gerçek sağlayıcı kaydı değildir.

## AuthenticationStandardLogonParameters

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `UserName` | string / nullable | Hayır | — |
| `Password` | string / nullable | Hayır | — |

## ObjectApiResult

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | belirtilmemiş / nullable | Hayır | — |

## RefundRequest

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `AccessToken` | string | Evet | minLength=1 |
| `GalaksipayTransactionId` | string / uuid | Evet | — |

## SubMerchantDto

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `Id` | string / uuid | Hayır | — |
| `Name` | string / nullable | Hayır | — |
| `Code` | string / nullable | Hayır | — |
| `Description` | string / nullable | Hayır | — |
| `IsActive` | boolean | Hayır | — |
| `HasMasterpassSetting` | boolean | Hayır | — |

## SubMerchantDtoListApiResult

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | array[SubMerchantDto] / nullable | Hayır | — |

## TransactionAddRequest

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `TransactionNo` | integer / int64 | Hayır | — |
| `OrderNo` | string / nullable | Hayır | — |
| `Amount` | number / double | Hayır | — |
| `CustomerFirstName` | string | Evet | minLength=1 |
| `CustomerLastName` | string | Evet | minLength=1 |
| `CustomerPhone` | string | Evet | minLength=1 |
| `SubMerchantId` | string / uuid / nullable | Hayır | — |
| `CallbackUrl` | string / nullable | Hayır | — |
| `TransactionDetails` | array[TransactionDetailDto] / nullable | Hayır | — |

## TransactionApplyInstallmentRequest

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `TransactionId` | string / uuid | Hayır | — |
| `InstallmentCount` | integer / int32 / nullable | Hayır | — |
| `Bin` | string / nullable | Hayır | — |

## TransactionDetailDto

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `Key` | string / nullable | Hayır | — |
| `Value` | string / nullable | Hayır | — |

## TransactionDto

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `Id` | string / uuid | Hayır | — |
| `TransactionNo` | integer / int64 | Hayır | — |
| `TransactionDate` | string / date-time | Hayır | — |
| `MerchantId` | string / uuid | Hayır | — |
| `MerchantName` | string / nullable | Hayır | — |
| `ApplicationUserId` | string / uuid | Hayır | — |
| `ApplicationUserName` | string / nullable | Hayır | — |
| `IsPaid` | boolean | Hayır | — |
| `TransactionStatusId` | string / uuid | Hayır | — |
| `TransactionStatusName` | string / nullable | Hayır | — |
| `OrderNo` | string / nullable | Hayır | — |
| `MpOrderNo` | string / nullable | Hayır | — |
| `Amount` | number / double | Hayır | — |
| `NetAmount` | number / double | Hayır | — |
| `InstallmentCount` | integer / int32 / nullable | Hayır | — |
| `CommissionRate` | number / double | Hayır | — |
| `CustomerFirstName` | string / nullable | Hayır | — |
| `CustomerLastName` | string / nullable | Hayır | — |
| `CustomerPhone` | string / nullable | Hayır | — |
| `StartDate` | string / date-time / nullable | Hayır | — |
| `CompleteDate` | string / date-time / nullable | Hayır | — |
| `PaymentDate` | string / date-time / nullable | Hayır | — |
| `CanceledDate` | string / date-time / nullable | Hayır | — |
| `CancelType` | string / nullable | Hayır | — |
| `CancelMasterpassResponseCode` | string / nullable | Hayır | — |
| `CancelMasterpassResponseMessage` | string / nullable | Hayır | — |
| `CancelMasterpassResponseRawJson` | string / nullable | Hayır | — |
| `CancelMasterpassErrorMessage` | string / nullable | Hayır | — |
| `GalaksipayPaymentToken` | string / nullable | Hayır | — |
| `GalaksipayPaymentTokenVoid` | string / nullable | Hayır | — |
| `Description` | string / nullable | Hayır | — |
| `RrnNo` | string / nullable | Hayır | — |
| `SlipNo` | string / nullable | Hayır | — |
| `SmsTraceId` | string / nullable | Hayır | — |
| `MasterpassResponseCode` | string / nullable | Hayır | — |
| `MasterpassResponseMessage` | string / nullable | Hayır | — |
| `MasterpassResponseRawJson` | string / nullable | Hayır | — |
| `MasterpassErrorMessage` | string / nullable | Hayır | — |
| `SubMerchantId` | string / uuid / nullable | Hayır | — |
| `SubMerchantName` | string / nullable | Hayır | — |
| `EffectiveMerchantId` | string / uuid | Hayır | — |
| `EffectiveMerchantName` | string / nullable | Hayır | — |
| `PaymentUrl` | string / nullable | Hayır | — |
| `TransactionDetailDtos` | array[TransactionDetailDto] / nullable | Hayır | — |

## TransactionDtoApiResult

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | TransactionDto | Hayır | — |

## TransactionDtoListApiResult

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `IsSuccess` | boolean | Hayır | — |
| `Message` | string / nullable | Hayır | — |
| `MessageJson` | string / nullable | Hayır | — |
| `Code` | integer / int32 | Hayır | — |
| `ErrorCode` | string / nullable | Hayır | — |
| `StackTrace` | string / nullable | Hayır | — |
| `Data` | array[TransactionDto] / nullable | Hayır | — |

## VoidRequest

| Alan | Tür | Required | Kısıt / not |
|---|---|---|---|
| `AccessToken` | string | Evet | minLength=1 |
| `GalaksipayTransactionId` | string / uuid | Evet | — |

