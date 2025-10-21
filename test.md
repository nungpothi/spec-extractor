URL: /leasing-service/api/v1/car-history
METHOD: GET
Relate Table: VEH_LEASING_CAR_HISTORY

### Header
| parameter | dataType | required | possibleValues | description (TH/EN) | dataFormat | example | errorCode |
|------------|----------|-----------|----------------|----------------------|-------------|----------|------------|
| Authorization | String | ✅ Yes | - | การตรวจสอบสิทธิ์ / Basic Authentication | Bearer + token (Token ที่ได้จากเส้น /api/auth) | | SGP_ERR_90000 |
| Transaction Id | String | ✅ Yes | - | รหัสอ้างอิงการเรียกใช้งานระบบ / Transaction Id | TyyyymmddHHMMsssss+Running Unique ID | T20190130123001000001 | SGP_ERR_90001 |
| Date & Time of Request | String | ✅ Yes | - | วันที่และเวลาที่เรียกใช้งาน / Date and Time of Request | yyyy-mm-ddTHH:MM:ss.sss | 2019-01-30T11:09:35.001 | SGP_ERR_90002 |
| Source | String | ✅ Yes | WEB, MOBILE | แหล่งที่มาของการเรียกใช้งาน / Source | - | WEB | SGP_ERR_90003 |
| Language | String | ✅ Yes | TH, EN | ภาษาที่ใช้ในการเรียก / Language | - | TH | SGP_ERR_90004 |
| System ID | String | ✅ Yes | - | รหัสระบบ / System ID | - | M00000 | SGP_ERR_90005 |

### Query String
| parameter | dataType | required | possibleValues | description (TH/EN) | dataFormat | example | errorCode |
|------------|----------|-----------|----------------|----------------------|-------------|----------|------------|
| profileId | String | ✅ Yes | - | รหัสโปรไฟล์ผู้ใช้ / User Profile ID | - | xxx | |
| pageNo | int | ✅ Yes | - | เลขหน้าที่ต้องการข้อมูล / Page number | - | 2 | |
| pageSize | int | ✅ Yes | - | จำนวนข้อมูลต่อ 1 หน้า / Number of items per page | - | 10 | |
| sort | String | ✅ Yes | asc, desc | รูปแบบการเรียงข้อมูล / Sort order | - | desc | |
| orderBy | String | ✅ Yes | - | ฟิลด์ที่ต้องการเรียงลำดับ / Order by field | - | id | |

### Response
| parameter | dataType | required | possibleValues | description (TH/EN) | dataFormat | example | errorCode |
|------------|----------|-----------|----------------|----------------------|-------------|----------|------------|
| status | String | ✅ Yes | true/false | สถานะการดำเนินการ / Operation status | - | true | |
| message | String | ✅ Yes | - | ข้อความสถานะ / Status message | - | Success | |
| id | int | ✅ Yes | - | รหัสรายการ / Record ID | - | 2 | |
| vehicleProfileId | String | ✅ Yes | - | รหัสโปรไฟล์ยานพาหนะ / Vehicle Profile ID | - | VF2509000000002469 | |
| licensePlate | String | ✅ Yes | - | หมายเลขทะเบียน / License Plate | - | 1701 | |
| provinceCode | String | ✅ Yes | - | รหัสจังหวัด / Province Code | - | TH-10 | |
| carTypeCode | String | ✅ Yes | - | รหัสประเภทรถยนต์ / Car Type Code | - | VTSPC0001 | |
| leasingCompanyName | String | ✅ Yes | - | ชื่อบริษัทลิสซิ่ง / Leasing Company Name | - | บริษัท ทรู ลิสซิ่ง จำกัด | |
| startDate | String | ✅ Yes | - | วันที่เช่ารถเริ่มต้น / Rental Start Date | yyyy-mm-ddTHH:MM:ss.sss | 2025-01-03T00:00:00.000 | |
| endDate | String | ✅ Yes | - | วันที่เช่ารถสิ้นสุด / Rental End Date | yyyy-mm-ddTHH:MM:ss.sss | 2025-01-30T00:00:00.000 | |
| renterName | String | ✅ Yes | - | ชื่อผู้เช่ารถ / Renter Name | - | บริิษัท ไอยรินรถเข่า จำกัด | |
| idCard | String | ✅ Yes | - | หมายเลขบัตรประชาชน / ID Card Number | - | 3100788465123 | |
| phoneNumber | String | ✅ Yes | - | เบอร์โทรศัพท์ / Phone Number | - | 0827417425 | |
| address | String | ✅ Yes | - | ที่อยู่ / Address | - | 120 หมู่2 ตำบงเขาสามยอด อ.เมือง จ.ลพบุรี 15000 | |
| channel | String | ✅ Yes | - | ช่องทางการใช้งาน / Channel | - | Leasing | |
| createdAt | String | ✅ Yes | - | วันที่สร้างข้อมูล / Created Date | yyyy-mm-ddTHH:MM:ss.sss | 2019-01-30T11:09:35.001 | |
| createdBy | String | ✅ Yes | - | ผู้สร้างข้อมูล / Created By | - | SYSTEM | |
| updatedAt | String | ✅ Yes | - | วันที่ปรับปรุงข้อมูล / Updated Date | yyyy-mm-ddTHH:MM:ss.sss | 2019-01-30T11:09:35.001 | |
| updatedBy | String | ✅ Yes | - | ผู้ปรับปรุงข้อมูล / Updated By | - | SYSTEM | |
| importStatus | String | ✅ Yes | - | สถานะการนำเข้าข้อมูล / Import Status | - | FAILED | |
| leasingCompanyCode | String | ✅ Yes | - | รหัสบริษัทลิสซิ่ง / Leasing company code | - | L0000000000000001 | |
| errorCode | String | ✅ Yes | - | รหัสผิดพลาด / Error Code | - | MAS_ERR_00001 | |
| errorMessage | String | ✅ Yes | - | ข้อความผิดพลาด / Error Message | - | กรุณาระบุข้อมูลให้ครบถ้วน | |
---
