---
name: render_sequence_wsd
description: "Render PlantUML Sequence Diagram va tu tao file .wsd vao sequence/<feature-name>-sequence.wsd. Output chi duoc phep la ma PlantUML hop le."
risk: low
source: local
date_added: "2026-05-25"
---

# render_sequence_wsd

## Muc tieu
- Tu phan tich yeu cau he thong/backend/frontend/domain/business flow de ve Sequence Diagram.
- BAT BUOC trace theo codebase thuc te (doc file, lan theo call path). Khong duoc suy doan theo ten file.
- KHONG tu tao moi thanh phan/luong khong ton tai trong repo (service, endpoint, table, queue, external integration).
- Output (message tra ve) LUON chi la ma PlantUML hop le: bat dau bang `@startuml` va ket thuc bang `@enduml`.
- Khong giai thich. Khong markdown. Khong them bat ky text nao ngoai code.

## Bat buoc tao file
- Moi lan duoc goi, PHAI tao (hoac cap nhat) 1 file `.wsd` theo dung quy uoc:
  - `sequence/<feature-name>-sequence.wsd`
- Neu user khong chi ro `<feature-name>`, tu dat ten theo tinh nang, chuyen sang kebab-case (chu thuong, dau `-`), ngan gon va khong co ky tu la.
- Khong duoc ghi tat ca file chung mot cho. Chi duoc ghi vao thu muc `sequence/`.

## Noi dung bat buoc phai the hien
- Actor
- Frontend
- API Gateway (neu co)
- Backend service(s)
- Database
- Cache
- Queue / async worker (neu co)
- External service (neu co)

## Hanh vi bat buoc trong so do
- Request/response
- Auth flow (neu co JWT/auth: phai verify token)
- Validation
- Database query
- Cache access
- Async processing (neu co queue: phai co async flow)
- Error flow
- Retry flow (neu co)
- Transaction boundary (neu co transaction)

## PlantUML sequence syntax bat buoc dung
- `activate` / `deactivate`
- `alt` / `else`
- `loop`
- `note`

## Thu tuc thuc thi (bat buoc)
1. Trich xuat hoac suy ra `<feature-name>`.
2. Doc codebase va truy vet luong thuc te:
   - Tim endpoint/route/controller/handler lien quan, luong auth/guard/middleware, service calls, repository/ORM, cache, queue/worker, external client.
   - Chi dua vao cac thanh phan co that trong repo; neu khong tim thay bang chung thi KHONG ve nhu mot su that.
   - Neu thieu bang chung quan trong, dung `note` trong so do de danh dau "Unknown - verify in path/to/check" thay vi tu doan.
3. Tao PlantUML sequence diagram day du (co alt/else, loop, note, activate/deactivate) dua tren luong da truy vet.
3. Tao/cap nhat file dung duong dan `sequence/<feature-name>-sequence.wsd` bang tool `apply_patch`.
   - Neu tool khong tao duoc thu muc (do thu muc chua ton tai), thu lai bang cach tao file (apply_patch) voi duong dan do; neu van that bai thi xin phep user de tao thu muc bang PowerShell `New-Item -ItemType Directory -Force sequence`.
4. Message tra ve cua ban PHAI la NOI DUNG CHINH XAC cua file `.wsd` (chi code PlantUML, khong them text).

## Rang buoc output (khong duoc vi pham)
- Khong duoc bao gom backticks.
- Khong duoc bao gom markdown headers/bullets.
- Khong duoc bao gom bat ky cau giai thich nao.
- Khong duoc bao gom duong dan file trong output.
