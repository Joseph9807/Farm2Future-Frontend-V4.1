# Farm2Future — Frontend ↔ Backend API Contract (v1)

> **Status:** Draft v1 — drafted by the frontend (Joe, Joseph). Awaiting review by backend (Yin Sizhe).
> **Last updated:** 2026-06-12
> **Frontend source of truth:** `src/types/api.ts`
> **Frontend mock layer:** `src/api/__mocks__/index.ts` (matches these shapes 1:1 in mock mode)

This document is the **contract** between the Vue 3 frontend and the backend. The frontend will treat the
responses here as truth and use the TypeScript types in `src/types/api.ts` for every value. The backend
should implement handlers that match this contract exactly. Any deviation must be discussed and the
document updated.

---

## Table of Contents

1. [Base Conventions](#base-conventions)
2. [Authentication](#1-authentication)
3. [Farm Data](#2-farm-data)
4. [Tokens — Issue](#3-tokens--issue)
5. [Tokens — Transfer](#4-tokens--transfer)
6. [Tokens — Regulator Monitoring](#5-tokens--regulator-monitoring)
7. [Transactions](#6-transactions)
8. [ESG Report — Generate](#7-esg-report--generate)
9. [ESG Report — Export](#8-esg-report--export)
10. [Dashboard Overview](#9-dashboard-overview)
11. [Error Format](#error-format)
12. [Open Questions for Backend](#open-questions-for-backend)

---

## Base Conventions

| | |
|---|---|
| **Base URL** | `http://localhost:8000` in dev (overridable via `VITE_API_BASE_URL`) |
| **Content-Type** | `application/json; charset=utf-8` for all request/response bodies |
| **Auth header** | `Authorization: Bearer <jwt>` on all endpoints except `POST /api/auth/login` |
| **Date format** | All dates are ISO-8601 strings: `YYYY-MM-DD` (date only) or `YYYY-MM-DDTHH:MM:SSZ` (datetime, always UTC) |
| **ID format** | All IDs are strings, even when they look numeric (`"u1"`, `"TKN-2024-001"`, `"TXN-2024-101"`). Blockchain tx hashes are 64-char hex prefixed with `0x`. |
| **Pagination** | List endpoints accept `?page=1&size=20` and return `{ items, total, page, size }` |

---

## 1. Authentication

### `POST /api/auth/login`

Authenticates a user and returns a JWT plus the user profile.

**Request body**
```json
{
  "email":    "demo@farmer.com",
  "password": "••••••••",
  "role":     "farmer"
}
```

**Response `200 OK`**
```json
{
  "user": {
    "id":         "u1",
    "name":       "Joseph",
    "role":       "farmer",
    "entityName": "Green Valley Farm"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors** — see [Error Format](#error-format)

---

## 2. Farm Data

### `POST /api/farms/{farmId}/data`

Submits a manual farm batch (crop, water, fertiliser) plus a snapshot of the IoT sensor readings.
Triggers a blockchain transaction to anchor the data on-chain.

**URL params**
| name | type | description |
|---|---|---|
| `farmId` | string | e.g. `"farm_001"` (the user has only one farm for now) |

**Request body**
```json
{
  "farm_id": "farm_001",
  "batch": {
    "crop_type":            "Wheat",
    "date":                 "2026-06-12",
    "yield_kg":             2500,
    "water_usage_l":        15000,
    "fertiliser_type":      "Organic Compost",
    "fertiliser_usage_kg":  120
  },
  "iot_snapshot": {
    "soil_moisture_pct": 42,
    "temperature_c":     24,
    "humidity_pct":      68,
    "ph_level":          6.5
  }
}
```

**Response `200 OK`**
```json
{
  "batch_id":     "BCH-2024-8921",
  "tx_hash":      "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
  "submitted_at": "2026-06-12T08:30:00Z"
}
```

---

## 3. Tokens — Issue

### `POST /api/tokens`

Mints a new on-chain token representing a batch of produce.

**Request body**
```json
{
  "crop_type":   "Wheat",
  "batch_id":    "BCH-2024-8921",
  "quantity_kg": 5000
}
```

**Response `200 OK`**
```json
{
  "token_id": "TKN-2024-009",
  "tx_hash":  "0x..."
}
```

---

## 4. Tokens — Transfer

### `POST /api/tokens/{tokenId}/transfer`

Transfers ownership of a token to a new address.

**URL params**
| name | type | description |
|---|---|---|
| `tokenId` | string | e.g. `"TKN-2024-001"` |

**Request body**
```json
{
  "token_id":          "TKN-2024-001",
  "new_owner_address": "0xNewOwner..."
}
```

**Response `200 OK`**
```json
{
  "tx_hash":         "0x...",
  "transferred_at":  "2026-06-12T08:35:00Z"
}
```

---

## 5. Tokens — Regulator Monitoring

### `GET /api/tokens`

Lists all tokens in the system for regulator oversight. Supports filtering and search.

**Query parameters**
| name | type | default | description |
|---|---|---|---|
| `status` | `'all' \| 'normal' \| 'flagged' \| 'at-risk'` | `all` | Filter by ESG status |
| `search` | string | — | Case-insensitive search on `id` and `owner` |
| `page`   | number | `1` | Page number |
| `size`   | number | `20` | Page size |

**Response `200 OK`**
```json
{
  "items": [
    {
      "id":     "TKN-2024-001",
      "asset":  "Wheat Batch A",
      "owner":  "Green Valley Farm",
      "status": "normal",
      "date":   "2024-10-12T09:30:00Z"
    }
  ],
  "total": 8,
  "page":  1,
  "size":  20
}
```

---

## 6. Transactions

### `GET /api/transactions`

Lists all blockchain transactions (issuance, transfer, etc.) for auditing.

**Query parameters**
| name | type | default | description |
|---|---|---|---|
| `search` | string | — | Case-insensitive search on `id`, `token`, `from`, `to` |
| `date`   | string | — | ISO date filter (e.g. `2024-10-12`) |
| `page`   | number | `1` | Page number |
| `size`   | number | `20` | Page size |

**Response `200 OK`**
```json
{
  "items": [
    {
      "id":     "TXN-2024-101",
      "token":  "TKN-2024-001",
      "from":   "System",
      "to":     "Green Valley Farm",
      "date":   "2024-10-12T09:30:00Z",
      "status": "completed"
    }
  ],
  "total": 8,
  "page":  1,
  "size":  20
}
```

---

## 7. ESG Report — Generate

### `POST /api/reports/esg/generate`

Generates (or regenerates) an AI ESG report for the given period and entity.
**This may take 5–15 seconds** — the frontend shows a loading spinner for the duration.

**Request body**
```json
{
  "from":   "2024-01-01",
  "to":     "2024-12-31",
  "entity": "All Entities"
}
```
> `entity` is either the literal string `"All Entities"` (regulator view) or a specific
> entityName like `"Green Valley Farm"` (farmer view, one farm only).

**Response `200 OK`**
```json
{
  "period":       { "from": "2024-01-01", "to": "2024-12-31" },
  "entity":       "All Entities",
  "scores": [
    { "label": "Environmental (E)", "score": 82, "note": "Carbon footprint reduced by 12% YoY." },
    { "label": "Social (S)",        "score": 91, "note": "Fair labor practices verified across 100% of supply chain." },
    { "label": "Governance (G)",    "score": 88, "note": "All compliance audits passed successfully." }
  ],
  "risk_flags": [
    { "type": "success", "title": "Water Usage Optimization", "desc": "..." },
    { "type": "warning", "title": "Fertilizer Data Gap",      "desc": "..." },
    { "type": "danger",  "title": "Carbon Offset Expiry",     "desc": "..." }
  ],
  "generated_at": "2024-12-31T23:59:59Z"
}
```

---

## 8. ESG Report — Export

### `GET /api/reports/esg/export?format=csv|pdf`

Exports the most recently generated report (or a new one) in the requested format.
Returns a **presigned download URL** (S3, etc.) that the frontend opens in a new tab.

**Query parameters**
| name | type | description |
|---|---|---|
| `format` | `'csv' \| 'pdf'` | Required |

The frontend also sends the period/entity in the request body (POST-style):
```json
{
  "from":   "2024-01-01",
  "to":     "2024-12-31",
  "entity": "All Entities"
}
```

**Response `200 OK`**
```json
{
  "download_url": "https://s3.../report-f2f-2024.pdf?X-Amz-Signature=...",
  "expires_at":   "2026-06-12T09:30:00Z"
}
```

> **Open question for backend:** is this a GET or POST? If GET, period/entity go in the query string.

---

## 9. Dashboard Overview

### `GET /api/dashboard/overview`

Aggregated data for the main dashboard view.

**Query parameters**
| name | type | default | description |
|---|---|---|---|
| `farm` | string | `"All Farms"` | `"All Farms"` or a specific entityName |

**Response `200 OK`**
```json
{
  "tier": "Excellent",
  "stats": {
    "overall":       87,
    "environmental": 82,
    "social":        91,
    "governance":    88,
    "changes": {
      "overall":       4.2,
      "environmental": 2.1,
      "social":        1.5,
      "governance":   -0.5
    }
  },
  "chart": {
    "labels": ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
    "values": [72, 75, 74, 78, 80, 82, 81, 84, 85, 86, 87, 87]
  },
  "alerts": [
    { "id": 1, "title": "Unusual water usage detected", "entity": "Green Valley Farm", "time": "2 hours ago", "severity": "at-risk" }
  ],
  "farms": ["All Farms", "Green Valley Farm", "Sunrise Organics", "Highland Pastures"]
}
```

---

## Error Format

All non-2xx responses use the same shape. The frontend's `ApiClientError` will surface `code` and `message`
to the user; `details` is for developer debugging.

**Response `4xx` / `5xx`**
```json
{
  "error": {
    "code":    "INVALID_FARM_ID",
    "message": "No farm exists with id 'farm_999'.",
    "details": { "farmId": "farm_999" }
  }
}
```

**Common codes the frontend will handle explicitly**
| code | HTTP | meaning |
|---|---|---|
| `INVALID_CREDENTIALS`   | 401 | Login failed (wrong email/password) |
| `UNAUTHORIZED`          | 401 | Missing or invalid JWT |
| `FORBIDDEN`             | 403 | User role not allowed for this action |
| `NOT_FOUND`             | 404 | Resource doesn't exist (farm, token, etc.) |
| `VALIDATION_ERROR`      | 422 | Request body failed validation |
| `BLOCKCHAIN_TX_FAILED`  | 502 | Underlying chain rejected the transaction |
| `INTERNAL_ERROR`        | 500 | Generic 500 |

---

## Open Questions for Backend

Please review and reply with your answers (or push back) before you start implementing:

1. **Auth** — JWT or session? If JWT, what library / secret? Where do we store it on the frontend (already
   using `localStorage` in `src/api/client.ts`)?
2. **CORS** — frontend dev server is `http://localhost:5173`, backend will be `http://localhost:8000`.
   Please allow this origin with credentials if using cookies.
3. **`POST /api/reports/esg/export`** — should this be a GET with query params, or POST with body?
   GET is more RESTful for a download, but the payload is large.
4. **Blockchain confirmation time** — how long does a typical tx take to confirm? Frontend currently shows
   a 1.5-second spinner; we'll need to know the real upper bound for UX planning.
5. **Pagination defaults** — agreed on `size=20`? Should `size` be capped?
6. **Search semantics** — exact substring (current proposal) or fuzzy/prefix? Prefix is faster to index.
7. **Date filter on transactions** — exact day match, or range? Current proposal is exact day.

---

**Reviewers:** please leave comments inline or message Joe. Once v1 is agreed, this document becomes the
reference — any new endpoint or field change must update this file *and* `src/types/api.ts` together.
